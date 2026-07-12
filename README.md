# code-pins

A VS Code extension for building a visual flow map of your code.

The developer decides which entities matter; the extension helps add them to the map and link them together.

When the user spots an important entity in the code — a function, class, method, variable, component, hook, store, etc. — they place the cursor on it and press a hotkey, e.g. `cmd+Y`. The extension adds that entity to the graph as a node.

## Features

### Example flow

1. The user places the cursor on `updateCampaign()`.
2. Presses `cmd+Y`.
3. A `ReferenceNode` is added to the graph:

    ```bash
    (path)/CampaignsList.tsx
        const CampaignList
            handleSubmit(() => {
                  store.updateCampaign({
    ```

    1. The path is hidden and only shown on hover.
    2. Every line is clickable and opens the file focused on the selected line.
4. Via `cmd+click` on `updateCampaign` in the code, the developer jumps to the method's declaration and places the cursor on `updateCampaign`.
5. Presses `cmd+Y` again.
6. A second node, `DeclarationNode`, is added to the graph:

    ```bash
    (path)/campaignsState.ts
        class campaignsState {
            updateCampaign = (options: UpdateCampaignOptions) => {
    ```

    1. `updateCampaign` is highlighted.
7. Since both nodes refer to the same entity, an arrow shows the link between them.
    1. Adding the new node triggered `vscode.executeDefinitionProvider` — same as pressing `cmd+click`.
    2. The arrow is directed.
8. `ReferenceNode` and `DeclarationNode` look different.
9. Nodes can be dragged around.
10. A map can be saved, a saved one opened, or a new one started.
11. The saved data contains no object describing the arrow — it is a value computed from `definitionKey`.

### Symbol keys: how pins link together

Every pin stores two addresses (format `path:line:char`):

- `locationKey` — where the pinned word itself sits. "I live here."
- `definitionKey` — where go-to-definition jumps from that word. "My source is there." Undefined until the language server resolves it.

Example, three pins:

```
state.ts:10      addTab = () => {}                 pin A
menu.tsx:5       const {addTab} = useMethods()     pin B
menu.tsx:20      addTab({...})                     pin C
```

- A: locationKey `state.ts:10`, definitionKey `state.ts:10` — points at itself, so it's a declaration.
- B: locationKey `menu.tsx:5`, definitionKey `state.ts:10` — cmd+click jumps to state.ts. A declaration and a reference at once.
- C: locationKey `menu.tsx:20`, definitionKey `menu.tsx:5` — cmd+click jumps to the destructure line, not state.ts.

Everything derives from these two keys, nothing else is stored:

- **Declaration**: `definitionKey === locationKey` (blue accent in the node).
- **Arrow**: my `definitionKey` equals a pin's `locationKey` in another node. Chain above renders C → B → A.
- **Same symbol** (selection highlight): any of the two pins' keys intersect.
- **Duplicate pin**: same `locationKey` — same word occurrence pinned twice.

## Requirements

None yet.

## Extension Settings

None yet.

## Known Issues

None yet.

## Release Notes

### 0.0.1

Initial scaffold.
