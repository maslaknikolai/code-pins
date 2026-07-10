import * as vscode from 'vscode';
import { GraphManager } from './graph';
import { WebviewToExtensionMessage } from './types';

/** Singleton webview panel that renders the flow map. */
export class GraphPanel {
	private static current: GraphPanel | undefined;

	static createOrShow(extensionUri: vscode.Uri, graph: GraphManager): void {
		if (GraphPanel.current) {
			GraphPanel.current.panel.reveal(undefined, true);
			return;
		}
		GraphPanel.current = new GraphPanel(extensionUri, graph);
	}

	private readonly panel: vscode.WebviewPanel;
	private readonly disposables: vscode.Disposable[] = [];

	private constructor(extensionUri: vscode.Uri, private readonly graph: GraphManager) {
		this.panel = vscode.window.createWebviewPanel(
			'codePins',
			'Code Pins',
			{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
			}
		);
		this.panel.webview.html = this.getHtml(this.panel.webview, extensionUri);

		this.panel.webview.onDidReceiveMessage(
			(message: WebviewToExtensionMessage) => this.handleMessage(message),
			undefined,
			this.disposables
		);
		this.graph.onDidChange(() => this.postState(), undefined, this.disposables);
		this.panel.onDidDispose(() => this.dispose(), undefined, this.disposables);
	}

	private handleMessage(message: WebviewToExtensionMessage): void {
		switch (message.type) {
			case 'ready':
				this.postState();
				break;
			case 'moveNode':
				this.graph.move(message.id, message.x, message.y);
				break;
			case 'removeNode':
				this.graph.remove(message.id);
				break;
			case 'openLocation':
				void this.openLocation(message.file, message.line);
				break;
		}
	}

	private postState(): void {
		void this.panel.webview.postMessage({ type: 'setState', nodes: this.graph.getNodes() });
	}

	private async openLocation(file: string, line: number): Promise<void> {
		const document = await vscode.workspace.openTextDocument(vscode.Uri.file(file));
		const editor = await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.One });
		const position = new vscode.Position(line, 0);
		editor.selection = new vscode.Selection(position, position);
		editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
	}

	private dispose(): void {
		GraphPanel.current = undefined;
		this.disposables.forEach((d) => d.dispose());
		this.panel.dispose();
	}

	private getHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js'));
		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.css'));
		const nonce = getNonce();
		return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Security-Policy"
		content="default-src 'none'; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
	<link rel="stylesheet" href="${styleUri}">
	<style>
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
	</style>
</head>
<body>
	<div id="root"></div>
	<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
	}
}

/**
 * Random token for the webview's Content-Security-Policy. The CSP above blocks
 * all scripts except ones tagged with this nonce (`script-src 'nonce-...'`),
 * so only the <script> we emit ourselves can run — anything injected into the
 * webview HTML by other means won't execute. Regenerated on every panel open.
 */
function getNonce(): string {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
