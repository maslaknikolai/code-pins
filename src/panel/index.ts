import * as vscode from 'vscode';
import { GraphManager } from '../graph';
import { ExtensionToWebviewMessage, WebviewToExtensionMessage } from '../types';
import { renderHtml } from './html';
import { handleWebviewMessage } from './messages';


let currentPanel: vscode.WebviewPanel | undefined;

export function showGraphPanel(extensionUri: vscode.Uri, graph: GraphManager): void {
	if (currentPanel) {
		currentPanel.reveal(undefined, true);
		return;
	}

	const panel = vscode.window.createWebviewPanel(
		'codePins',
		'Code Pins',
		{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
		}
	);

	panel.webview.html = renderHtml(panel.webview, extensionUri);

	const postState = () => {
		const message: ExtensionToWebviewMessage = { type: 'setState', nodes: graph.getNodes() };
		panel.webview.postMessage(message);
	};

	const disposables: vscode.Disposable[] = [
		panel.webview.onDidReceiveMessage((message: WebviewToExtensionMessage) =>
			handleWebviewMessage(message, { graph, postState })
		),
		graph.onDidChange(postState),
	];

	panel.onDidDispose(() => {
		currentPanel = undefined;
		disposables.forEach((d) => d.dispose());
	});

	currentPanel = panel;
}
