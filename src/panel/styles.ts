/** Styles injected into the webview's <head>; pin nodes themselves are styled here too. */
export const panelStyles = /* css */ `
	html, body, #root {
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
	.pin {
		min-width: 180px;
		max-width: 420px;
		font-family: var(--vscode-editor-font-family);
		font-size: var(--vscode-editor-font-size);
		background: var(--vscode-editorWidget-background);
		border: 1px solid var(--vscode-editorWidget-border);
		border-radius: 4px;
		user-select: none;
		overflow: hidden;
	}
	.pin.declaration {
		border-color: var(--vscode-charts-blue, #4a90d9);
		border-width: 2px;
	}
	.pin .header {
		padding: 3px 8px;
		font-weight: bold;
		background: var(--vscode-editorGroupHeader-tabsBackground);
		border-bottom: 1px solid var(--vscode-editorWidget-border);
		white-space: nowrap;
	}
	.pin .header .remove {
		float: right;
		margin-left: 8px;
		padding: 0 4px;
		border: none;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
		opacity: 0.5;
	}
	.pin .header .remove:hover {
		opacity: 1;
		color: var(--vscode-errorForeground, #f66);
	}
	.pin .header .path {
		display: none;
		font-weight: normal;
		opacity: 0.7;
		margin-right: 4px;
	}
	.pin .header:hover .path {
		display: inline;
	}
	.pin .line {
		padding: 1px 8px;
		white-space: pre;
		cursor: pointer;
	}
	.pin .line:hover {
		background: var(--vscode-list-hoverBackground);
	}
	.pin .hl {
		background: var(--vscode-editor-findMatchHighlightBackground, rgba(234, 92, 0, 0.33));
		border-radius: 2px;
	}
	/* Edge anchors only — not user-connectable, so keep them invisible. */
	.pin-handle {
		opacity: 0;
		pointer-events: none;
	}
`;
