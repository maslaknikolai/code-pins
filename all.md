# Как работает Code Pins

Расширение VS Code: визуальная карта кода (`CodePinsFile`). Пользователь ставит курсор на `symbol`. TODO -затем при вызове команды commandname (Ctrl+Y) из `symbol` будет создана сущеность `Pin`. попадает в `CodePinsFile`. Пины одного файла живут в одном узле, между узлами рисуются `edge`.

`Symbol` — Термин из VS Code / language server. Именованная сущность кода: переменная, функция, метод, класс и подобное.

## Архитектура

Два процесса, общаются сообщениями через `postMessage`:

- **Extension host** (`src/extension/`) — Node backend. Команды, language server, хранение данных `CodePinsFile`, сохранение файлов.
- **Webview** (`src/webview/`) — Frontend, показ графа.


## Сквозной пример

Все объяснения ниже показаны на примере этих двух файлов. Числа слева — номера строк в файле; эти же числа дальше появляются в [ключах](#два-ключа-пина) и [`breadcrumbs`](#breadcrumbs-buildbreadcrumblines).

Файл 1 — `packages/campaigns-state-page/src/events.ts`:

```tsx
6    export const campaignsPageStateControlEvents = {
7        addTab: event<[tab: RemainingRecordsTab]>(),
```

Файл 2 — `packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx`:

```tsx
19   export const ListPopupMenu: FC<Props> = ({list, table}) => {
22       const {addTab} = useCampaignsPageStateMethods()
28       const menuOptions: MoreOption[] = useMemo(() => [
48               onSelect() {
51                   addTab({
```

В первом файле `addTab` объявлен, во втором — используется. Пиним все три:

- объявление — `packages/campaigns-state-page/src/events.ts:7`
- деструктуризация — `packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:22`
- вызов — `packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:51`

## Создание пина (`pin.ts`)

1. Берём `symbol` под курсором: `document.getWordRangeAtPosition(position)` → `range` слова, `getText` → `"addTab"`.
2. **Получаем `definition`** (см. ниже).
3. Собираем `breadcrumbs` — строки всех скоупов, внутри которых лежит `symbol`: компонент → `useMemo` → `onSelect` → строка с самим `symbol`'ом (см. ниже).

## Получение `definition`

То же самое, что `cmd+click`:

```ts
const results = await vscode.commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>(
    'vscode.executeDefinitionProvider',
    document.uri,
    position
);
```

VS Code спрашивает language server (для TS — `tsserver`). Ответ — массив, берём первый элемент. Он бывает двух форм:

Форма 1 — `Location`, два поля:

```jsonc
{
  // в каком файле лежит definition
  "uri": "file:///Users/me/project/packages/campaigns-state-page/src/events.ts",

  // где в этом файле: start/end как {line, character}
  // строка 7, колонка 4 — ровно где стоит symbol addTab
  "range": {
    "start": { "line": 7, "character": 4 },
    "end":   { "line": 7, "character": 10 }
  }
}
```

Форма 2 — `LocationLink` (TS обычно отдаёт её), полей больше:

```jsonc
{
  // в каком файле лежит definition (то же, что uri выше)
  "targetUri": "file:///Users/me/project/packages/campaigns-state-page/src/events.ts",

  // ВЕСЬ definition — от начала до конца выражения
  // здесь: вся строка `addTab: event<[tab: RemainingRecordsTab]>(),`
  "targetRange": {
    "start": { "line": 7, "character": 4 },
    "end":   { "line": 7, "character": 48 }
  },

  // только ИМЯ symbol'а — само слово addTab. Берём его
  "targetSelectionRange": {
    "start": { "line": 7, "character": 4 },
    "end":   { "line": 7, "character": 10 }
  }
}
```

Нам нужна одна точка — начало имени `symbol`'а: `uri` + `range.start` у `Location`, либо `targetUri` + `targetSelectionRange.start` у `LocationLink`. Из неё создаём `definitionKey`: `packages/campaigns-state-page/src/events.ts:7:4`.

Иногда ответ пустой: language server ещё индексирует проект, или для языка нет провайдера. Тогда пин создаётся без `definitionKey` — он просто не участвует в `edge`'ах.

Это чинит `retryUnresolvedDefinitions`. Он запускается при последующих добавлениях пинов и при открытии `CodePinsFile`, в фоне. Алгоритм:

1. Идём по всем пинам всех узлов, ищем пины с `definitionKey === undefined`.
2. Для каждого такого пина восстанавливаем позицию: парсим его `locationKey` (`packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:22:11` → файл, строка 22, колонка 11), открываем документ.
3. Повторяем тот же `executeDefinitionProvider` в этой позиции.
4. Ответ пришёл — записываем `definitionKey` в копию пина. Пусто — оставляем как есть, попробуем в следующий раз.

## Два ключа пина

```ts
locationKey: string      // где сам symbol:      "packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:22:11"
definitionKey?: string   // куда ведёт definition: "packages/campaigns-state-page/src/events.ts:7:4"
```

Один `symbol` может быть объявлением и ссылкой одновременно:

Пин A — объявление:

```ts
const pinA: Pin = {
	id: 'a1…',
	symbolName: 'addTab',
	locationKey:   'packages/campaigns-state-page/src/events.ts:7:4',
	definitionKey: 'packages/campaigns-state-page/src/events.ts:7:4', // сам на себя → объявление
	lines: [
		{ line: 6, text: 'export const campaignsPageStateControlEvents = {' },
		{ line: 7, text: '    addTab: event<[tab: RemainingRecordsTab]>(),' },
	],
};
```

Пин B — деструктуризация:

```ts
const pinB: Pin = {
	id: 'b2…',
	symbolName: 'addTab',
	locationKey:   'packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:22:11',
	definitionKey: 'packages/campaigns-state-page/src/events.ts:7:4', // definition ведёт к объявлению
	lines: [
		{ line: 19, text: 'export const ListPopupMenu: FC<Props> = ({list, table}) => {' },
		{ line: 22, text: '    const {addTab} = useCampaignsPageStateMethods()' },
	],
};
```

Пин C — вызов:

```ts
const pinC: Pin = {
	id: 'c3…',
	symbolName: 'addTab',
	locationKey:   'packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:51:16',
	definitionKey: 'packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:22:11', // TS ведёт не в events.ts, а к деструктуризации!
	lines: [
		{ line: 19, text: 'export const ListPopupMenu: FC<Props> = ({list, table}) => {' },
		{ line: 28, text: '    const menuOptions: MoreOption[] = useMemo(() => [' },
		{ line: 48, text: '            onSelect() {' },
		{ line: 51, text: '                addTab({' },
	],
};
```

Всё выводится из ключей, ничего лишнего не храним:

- **Объявление**: `definitionKey === locationKey` (синяя полоска слева).
- **`Edge`**: мой `definitionKey` равен чьему-то `locationKey` в другом узле. Цепочка C → B → A.
- **Один и тот же `symbol`** (подсветка при выборе): любые два ключа пересеклись (`checkIsSameSymbol`).
- **Дубликат**: одинаковый `locationKey` — этот `symbol` уже запинен.

## Breadcrumbs (`buildBreadcrumbLines`)

Запрашиваем дерево `symbol`'ов файла:

```ts
vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri)
```

Ответ — вложенные `DocumentSymbol` (класс → метод → колбэк — тоже `symbol`'ы, но здесь они играют роль скоупов). Идём от корня вниз к курсору, с каждого уровня берём первую строку скоупа, в конце — строку курсора:

```
ListPopupMenu (19..57)          → 19
└─ menuOptions (28..56)         → 28
   └─ useMemo callback (28..56) → 28, дубль соседний — пропускаем
      └─ onSelect (48..53)      → 48
курсор                          → 51
```

Строки храним **сырыми** (с отступами): колонка из `locationKey` указывает прямо в текст — отдельный `symbolRange` не нужен.

## Модель данных

```ts
Pin      = { id, locationKey, definitionKey?, symbolName, lines: PinLine[] }
PinLine  = { line: number, text: string }        // сырая строка исходника
FileNode = { filePath, x, y, pins: Pin[] }       // узел CodePinsFile = файл; filePath = id узла
CodePinsFile = { version: 2, fileNodes }         // формат сохранения
```

Позиция узла — на `FileNode`, у пина позиции нет. `Edge`'и не хранятся — выводятся из ключей.

## Отрисовка узла

`buildPinsTree(pins)` — чистая функция (есть unit-тесты, `pnpm test:unit`): пины одного файла с общим началом `breadcrumbs` группируются:

- общие подряд идущие строки → `sharedLines` группы, рисуются один раз сверху;
- пин, воткнутый прямо в общую строку, сам рисует её первым ребёнком;
- сортировка по номеру строки, порядок добавления не важен.

Компоненты: `FileNodeView` (шапка: имя файла, при hover — путь с marquee) → `PinsTree`/`GroupView` → `PinView` (рамка) → строки: `BreadcrumbLineView` (голая) и `PinLineView` (подсветка `symbol`'а + выбор + крестик удаления). Общий каркас строки — `LineShell` (клик = открыть файл на строке, marquee при переполнении).

## Выбор `symbol`'а

Клик по подсвеченному `symbol`'у → в атом `selectedSymbolAtom` кладутся ключи пина. Каждый `PinLineView` сравнивает себя с выбранным через `checkIsSameSymbol` — совпал → стиль выделения. `App` тем же сравнением красит `edge`'и (линия и наконечник цветом focusBorder). Повторный клик — сброс.

## Сообщения webview ↔ extension

```
webview → extension: ready | moveFileNode | removePin | openLocation
extension → webview: setState { fileNodes }
```

Типизированы юнионом в `types.ts`; отправка через `sendToExtension(type, payload)` — payload проверяется TS по типу сообщения. На стороне extension — мапа обработчиков по типу (`panel/messages.ts`).

`moveFileNode` — silent: стор обновляется без события, чтобы не эхо-нить позицию обратно в webview во время drag.

## Сохранение

- Команды: Save/Open/New File (`.json`, формат `CodePinsFile`). `cmd+s` работает при фокусе на панели.
- Dev mode: каждый `onDidChange` пишет снапшот в `<корень проекта>/dev.code-pins.json` (`saveDevSnapshot`).
- Пути и ключи относительные от корня workspace — файл переносим между машинами.

## Сборка

esbuild, два бандла: `dist/extension.js` (Node) и `dist/webview.js` (+`webview.css` — esbuild сам собирает импортированный CSS). Tailwind v4 отдельно: `src/webview/tailwind.css` → `dist/tailwind.css`. `pnpm watch` крутит всё; F5 сначала гоняет unit-тесты.


## TODOS
[ ] Может сделать это расширение как нового типа дерактор файлов с расширением `.codepins.json`?

[ ] `lines` -> `breadcrumbs`?

[ ] `definitionKey` -> `symbolDefinitionPath`, `locationKey` -> `symbolLocationPath`?
[ ] узлами на edges

[ ] прочесть еще раз
