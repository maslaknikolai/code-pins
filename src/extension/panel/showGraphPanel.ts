import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import { ExtensionMessageType, ExtensionToWebviewMessage, WebviewToExtensionMessage } from '../../shared/types';
import { renderHtml } from './html';
import { handleWebviewMessage } from './messages';


let currentPanel: vscode.WebviewPanel | undefined;

export function showGraphPanel(extensionUri: vscode.Uri, store: FileNodesStore): void {
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

	const sendStateToWebview = () => {
		const message: ExtensionToWebviewMessage = { type: ExtensionMessageType.SetState, fileNodes: store.getFileNodes() };
		panel.webview.postMessage(message);
	};

	const disposables: vscode.Disposable[] = [
		panel.webview.onDidReceiveMessage((message: WebviewToExtensionMessage) =>
			handleWebviewMessage(message, { store, sendStateToWebview })
		),
		store.onDidChange(sendStateToWebview),
	];

	panel.onDidDispose(() => {
		currentPanel = undefined;
		disposables.forEach((d) => d.dispose());
	});

	currentPanel = panel;
}
