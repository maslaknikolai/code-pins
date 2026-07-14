# Как работает Code Pins

Расширение VS Code: дает визуальную карту взаимоотношений кодовой базы. Пользователь ставит курсор на `symbol`. Нажимает сочетание клавишь (Ctrl+Y) и сущность `Pin` добавляется на канвас в открышейся панели. Пины одного файла живут в одном `FileNode`. Каждый `FileNode` на канвасе представляет файл из анализируемой кодовой базы, в котором создан `Pin`. Между `FileNode` рисуются стрелки.

`Symbol` — Термин из VS Code / language server. Именованная сущность кода: переменная, функция, метод, класс и подобное.

## Архитектура

Два процесса:

- **Extension host** (`src/extension/`) — Node backend. Объяление команд для VSCode, общение с language server, хранение данных `PinsGraph`, сохранение файлов.
- **Webview** (`src/webview/`) — Frontend, показ графа.

Процессы общаются сообщениями через `postMessage`.


## Модель данных

```ts
export interface Pin {
	id: string;
	symbolName: string;
	pinPath: string;
	symbolDefinitionPath?: string;
	lines: PinLine[];
}

export interface PinLine {
	/** Zero-based line number in the source file. */
	line: number;
	/** Raw source line, indentation included */
	text: string;
}

/** A node on the graph: one file, holding every pin made in it. filePath is the node's identity. */
export interface FileNode {
	filePath: string;
	x: number;
	y: number;
	pins: Pin[];
}

/** Saved file format */
export interface PinsGraph {
	version: 1;
	fileNodes: FileNode[];
}
```

`edge` вычисляются c помощью `pinPath` и `symbolDefinitionPath`.


## Сквозной пример

Все объяснения ниже показаны на примере этих двух файлов.

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

В первом файле `addTab` объявлен, во втором — используется. Пиним все три места. Для каждого пина можно спросить go-to-definition — «где этот `symbol` определён?» — и ответы будут разные:

- **Объявление** — `packages/campaigns-state-page/src/events.ts:7`. Здесь `addTab` создаётся. Go-to-definition отсюда ведёт в эту же самую точку. По этому признаку — «definition указывает сам на себя» — пин и распознаётся как объявление.
- **Деструктуризация** — `packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:22`. У неё двойная роль. С одной стороны это использование: go-to-definition отсюда ведёт в `events.ts:7`. С другой — `const {addTab} = …` создаёт новую локальную константу, то есть строка сама является объявлением, и для кода ниже definition — это она.
- **Вызов** — `packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:51`. Просто использование той локальной константы: go-to-definition отсюда ведёт на строку 22, к деструктуризации, а не в `events.ts` — TS показывает ближайшее объявление, а не первоисточник.

## Создание пина

1. Берём `symbol` под курсором: `document.getWordRangeAtPosition(position)` → `range` слова, `getText` получаем `"addTab"`.
2. **Получаем `definition`** (см. ниже).
3. Собираем `lines` — первые строки всех скоупов, внутри которых лежит `symbol`: компонент → `useMemo` → `onSelect` → строка с самим `symbol`'ом (см. ниже).

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

Нам нужна одна точка — начало имени `symbol`'а: `uri` + `range.start` у `Location`, либо `targetUri` + `targetSelectionRange.start` у `LocationLink`. Из неё создаём `symbolDefinitionPath`: `packages/campaigns-state-page/src/events.ts:7:4`.

Иногда ответ пустой: language server ещё индексирует проект, или для языка нет провайдера. Тогда пин создаётся без `symbolDefinitionPath` — он просто не участвует в `edge`'ах.

Это чинит `retryUnresolvedDefinitions`. Он запускается при последующих добавлениях пинов и при открытии `PinsGraph`, в фоне. Алгоритм:

1. Идём по всем пинам всех `node`'ов, ищем пины с `symbolDefinitionPath === undefined` — и самоопределения (`symbolDefinitionPath === pinPath`): настоящее объявление от «эха» непрогретого tsserver (partial semantic mode) по значению не отличить, поэтому ретраим и их. Для настоящих объявлений ретрай идемпотентен.
2. Для каждого такого пина восстанавливаем позицию: парсим его `pinPath` (`packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:22:11` → файл, строка 22, колонка 11), открываем документ. Файл пропал или не читается — пин пропускаем.
3. Повторяем тот же `executeDefinitionProvider` в этой позиции.
4. Ответ пришёл и отличается от текущего — записываем `symbolDefinitionPath` в копию пина. Пусто или то же самое — оставляем как есть, без холостого сохранения.

## Два ключа пина

```ts
pinPath: string      // где сам symbol:      "packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:22:11"
symbolDefinitionPath?: string   // куда ведёт definition: "packages/campaigns-state-page/src/events.ts:7:4"
```

Один `symbol` может быть объявлением и ссылкой одновременно:

Пин A — объявление:

```ts
const pinA: Pin = {
	id: 'a1…',
	symbolName: 'addTab',
	pinPath:   'packages/campaigns-state-page/src/events.ts:7:4',
	symbolDefinitionPath: 'packages/campaigns-state-page/src/events.ts:7:4', // сам на себя → объявление
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
	pinPath:   'packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:22:11',
	symbolDefinitionPath: 'packages/campaigns-state-page/src/events.ts:7:4', // definition ведёт к объявлению
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
	pinPath:   'packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:51:16',
	symbolDefinitionPath: 'packages/campaigns-ui/src/components/tables/ListsTable/ListPopupMenu.tsx:22:11', // TS ведёт не в events.ts, а к деструктуризации!
	lines: [
		{ line: 19, text: 'export const ListPopupMenu: FC<Props> = ({list, table}) => {' },
		{ line: 28, text: '    const menuOptions: MoreOption[] = useMemo(() => [' },
		{ line: 48, text: '            onSelect() {' },
		{ line: 51, text: '                addTab({' },
	],
};
```

Всё выводится из ключей:

- **Объявление**: `symbolDefinitionPath === pinPath` (синяя полоска слева).
- **`Edge`**: мой `symbolDefinitionPath` равен чьему-то `pinPath` в другом `node`. Цепочка C → B → A.
- **Один и тот же `symbol`** (подсветка при выборе): любые два ключа пересеклись (`checkIsSameSymbol`).
- **Дубликат**: одинаковый `pinPath` — этот `symbol` уже запинен.

## Строки скоупов (`buildBreadcrumbLines`)

Запрашиваем дерево `symbol`'ов файла:

```ts
vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri)
```

Ответ — вложенные `DocumentSymbol` (класс → метод → колбэк — тоже `symbol`'ы, но здесь они играют роль скоупов). Идём от корня вниз к курсору, с каждого уровня берём первую строку скоупа, в конце — строку курсора:

```
ListPopupMenu (19..57)          → 19
└─ menuOptions (28..56)         → 28
   └─ useMemo callback (28..56) → 28
      └─ onSelect (48..53)      → 48
курсор                          → 51
```

Соседние уровни могут указывать на одну и ту же строку: `menuOptions` и колбэк `useMemo` оба начинаются на 28 — объявление и колбэк живут в одной строке `const menuOptions = useMemo(() => [`. Такие дубли схлопываем: строка попадает в `lines` один раз.

Строки храним **сырыми** (с отступами): колонка из `pinPath` указывает прямо в текст — отдельный `symbolRange` не нужен.

## Отрисовка `node`

Пины одного файла часто делят объемлющие скоупы (класс, функция) — их первые строки у пинов совпадают. Поэтому `buildPinLinesTree(pins)` сливает `lines` всех пинов файла в одно дерево строк, и каждая строка рисуется один раз:

```ts
interface LineElement {
	line: PinLine;
	pins: Pin[];          // пины, воткнутые именно в эту строку (на одной строке их может быть несколько)
	children: LineElement[];
}
```

Ключ `node`'а — номер строки, поэтому:

- общая строка скоупа встречается в дереве один раз, все пины под ней — её `children`;
- пин, воткнутый прямо в общую строку, — это `pins` у того же элемента, у которого есть `children`;
- сортировка по номеру строки, порядок добавления не важен.

`node` последнего активного файла подсвечен (рамка + свечение focusBorder): extension шлёт `setActiveFile` при смене активного редактора и при `ready`/`setState`; `undefined`-редактор (фокус на самой панели) игнорируется, чтобы подсветка не гасла. В webview путь лежит в `activeFilePathAtom`.

Компоненты: `FileNodeView` (шапка: имя файла, при hover — путь) → `PinsLinesTree`/`LineElementView` → `LineView` (одна строка дерева: клик = открыть файл на строке; без `pins` — голая, с `pins` — рамка + подсветка `symbol`'а с выбором на каждый пин), дальше рекурсия по `children`. Переполнение строки обрезается; hover скраббит текст (`HoverScrollText`): позиция курсора по ширине строки 0..100% мапится на скрытый overflow — курсор слева = начало, справа = конец.

## Группы `node`'ов

`node`'ы с общими директориями обводятся серыми рамками, вложенно: каждая директория с `node`'ами в поддереве даёт свою рамку (одиночный `node` тоже) — `packages/campaigns-state-page/src` своя, вокруг неё общая `packages`. Над левым верхним углом рамки — общий префикс. `groupFileNodes` строит trie по сегментам пути (цепочки директорий без развилок схлопываются в один префикс). `GroupOutlines` считает bounding box по позициям и `measured`-размерам (паддинг растёт с уровнем вложенности, чтобы рамки не слипались) и рисует через `ViewportPortal` — div живёт в координатах канваса, двигается с pan/zoom сам. Позиции берутся из `flowNodesAtom`, поэтому рамки следуют за drag'ом без доп. логики.

## Выбор `symbol`'а

Клик по подсвеченному `symbol`'у → в атом `selectedPinAtom` кладётся сам `Pin`. Каждый `LineView` сравнивает свои пины с выбранным через `checkIsSameSymbol` — совпал → стиль выделения; сам выбранный пин (по `id`) выделен отдельным цветом (оранжевый outline). `App` тем же сравнением красит `edge`'и (линия и наконечник цветом focusBorder). Повторный клик — сброс. Delete (на mac — Backspace) удаляет выбранный пин (`RemovePin`).

## Сохранение

Основной сценарий — как bookmarks, без файлов и диалогов:

- Все графы живут в `context.workspaceState` (Memento VS Code, per-workspace): `codePins.graphs` — `{ [имя]: FileNode[] }`, `codePins.activeGraphName` — активный граф. Единственное место, знающее про Memento и ключи — класс `PinsGraphsStore`; оркестрация (флаш/загрузка/rename/delete + связка с `FileNodesStore`) — свободные функции в `activePinsGraphStorage.ts`.
- Автосейв: каждый `onDidChange` стора пишет активный граф в workspaceState (`saveActivePinsGraph`). Ctrl+Y всегда добавляет в активный.
- «Code Pins: Switch PinsGraph» — QuickPick по графам + «New PinsGraph…», у каждого пункта кнопки rename/delete (после операции пикер открывается заново; удаление активного — фолбэк на первый оставшийся). Выбор: текущий флашится, выбранный грузится в стор. Имя активного графа — в title панели.
- При активации расширения активный граф загружается обратно (`loadActivePinsGraph`).

Файлы — второстепенно, для экспорта/шаринга: Save (`cmd+s` при фокусе на панели) экспортирует `.json` формата `PinsGraph`, «Import to Active Graph» вливает такой файл в активный граф, Clear очищает его. Пути и ключи относительные от корня workspace — файл переносим между машинами.

## Сборка

esbuild, два бандла: `dist/extension.js` (Node) и `dist/webview.js` (+`webview.css` — esbuild сам собирает импортированный CSS). Tailwind v4 отдельно: `src/webview/tailwind.css` → `dist/tailwind.css`. `pnpm watch` крутит всё; F5 сначала гоняет unit-тесты.
