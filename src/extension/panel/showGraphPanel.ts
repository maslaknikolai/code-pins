import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import { WebviewToExtensionMessage } from '../../shared/messages';
import { ViewportCenterStore } from '../viewport-center-store';
import { renderHtml } from './html';
import { handleWebviewMessage } from './messages';
import { sendActiveFileToWebview } from './sendActiveFileToWebview';
import { sendStateToWebview } from './sendStateToWebview';


let currentPanel: vscode.WebviewPanel | undefined;

/** Shows the active graph's name in the panel tab; no-op while the panel is closed. */
export function setGraphPanelTitle(graphName: string): void {
	if (currentPanel) {
		currentPanel.title = `Code Pins — ${graphName}`;
	}
}

/** One panel at a time: reveals the existing one, otherwise creates and remembers it. */
export function showGraphPanel(extensionUri: vscode.Uri, store: FileNodesStore, viewportCenterStore: ViewportCenterStore): void {
	if (currentPanel) {
		currentPanel.reveal(undefined, true);
		return;
	}

	currentPanel = createGraphPanel(extensionUri, store, viewportCenterStore);
	currentPanel.onDidDispose(() => {
		currentPanel = undefined;
	});
}

function createGraphPanel(extensionUri: vscode.Uri, store: FileNodesStore, viewportCenterStore: ViewportCenterStore): vscode.WebviewPanel {
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

	const fileNodeStoreSenderDisposable = store.onDidChange(() => {
		sendStateToWebview(panel.webview, store);
	});

	const webviewMessagesHandlerDisposable = panel.webview.onDidReceiveMessage((message: WebviewToExtensionMessage) => {
		handleWebviewMessage(message, {
			store,
			sendStateToWebview: () => sendStateToWebview(panel.webview, store),
			sendActiveFileToWebview: () => sendActiveFileToWebview(panel.webview),
			viewportCenterStore,
		});
	});

	const activeEditorSubscriptionDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
		sendActiveFileToWebview(panel.webview, editor);
	});

	const disposables: vscode.Disposable[] = [
		webviewMessagesHandlerDisposable,
		fileNodeStoreSenderDisposable,
		activeEditorSubscriptionDisposable,
	];

	panel.onDidDispose(() => {
		disposables.forEach((d) => {
			d.dispose();
		});
	});

	return panel;
}
