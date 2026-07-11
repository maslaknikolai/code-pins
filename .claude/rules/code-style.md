# Code style

- Try to keep classes thin: state plus a change event only (e.g. `GraphManager` is just `getNodes`/`setNodes` + `onDidChange`). Behavior goes in free functions in separate files that take the instance as an argument (see `src/graph/`).
