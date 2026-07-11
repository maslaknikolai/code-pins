import * as vscode from 'vscode';
import { PinsStore } from '../graph';
import { ExtensionMessageType, ExtensionToWebviewMessage, WebviewToExtensionMessage } from '../types';
import { renderHtml } from './html';
import { handleWebviewMessage } from './messages';


let currentPanel: vscode.WebviewPanel | undefined;

export function showGraphPanel(extensionUri: vscode.Uri, pinsStore: PinsStore): void {
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
		const message: ExtensionToWebviewMessage = { type: ExtensionMessageType.SetState, nodes: pinsStore.getNodes() };
		panel.webview.postMessage(message);
	};

	const disposables: vscode.Disposable[] = [
		panel.webview.onDidReceiveMessage((message: WebviewToExtensionMessage) =>
			handleWebviewMessage(message, { pinsStore, postState })
		),
		pinsStore.onDidChange(postState),
	];

	panel.onDidDispose(() => {
		currentPanel = undefined;
		disposables.forEach((d) => d.dispose());
	});

	currentPanel = panel;
}
