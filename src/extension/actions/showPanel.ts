import * as vscode from 'vscode';
import { AppCtx } from '../types';
import { renderHtml } from './panel/html';
import { sendActiveFileToWebview } from './panel/sendActiveFileToWebview';
import { sendGraphsToWebview } from './panel/sendGraphsToWebview';
import { refreshVsCodePanelTitle } from './refreshVsCodePanelTitle';
import { handleMessageFromWebview } from './panel/handleMessageFromWebview';
import { onGraphsChange } from './onGraphsChange';
import { retryUnresolvedDefinitions } from './retryUnresolvedDefinitions';

export interface PanelCallbacks {
	onShow?: (panel: vscode.WebviewPanel) => void;
}

export function createOrShowPanel(appCtx: AppCtx, callbacks: PanelCallbacks = {}): void {
	const existingPanel = appCtx.vscodePanel;

	if (!existingPanel) {
		const panel = createPanel(appCtx, callbacks);

		appCtx.vscodePanel = panel;
		panel.onDidDispose(() => {
			appCtx.vscodePanel = undefined;
		});
	} else {
		existingPanel.reveal(undefined, false);
		callbacks.onShow?.(existingPanel);
	}

	refreshVsCodePanelTitle(appCtx);
	retryUnresolvedDefinitions(appCtx);
}

function createPanel(appCtx: AppCtx, callbacks: PanelCallbacks): vscode.WebviewPanel {
	const panel = vscode.window.createWebviewPanel(
		'codePins',
		'Code Pins',
		{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: false },
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [
				vscode.Uri.joinPath(appCtx.vscodeContext.extensionUri, 'dist')
			],
		}
	);

	panel.webview.html = renderHtml(panel.webview, appCtx.vscodeContext.extensionUri);

	const disposables: vscode.Disposable[] = [
		panel.webview.onDidReceiveMessage((message) => {
			handleMessageFromWebview(message, panel, appCtx, callbacks);
		}),
		onGraphsChange(appCtx, () => {
			sendGraphsToWebview(panel.webview, appCtx);
			refreshVsCodePanelTitle(appCtx);
		}),
		vscode.window.onDidChangeActiveTextEditor(() => {
			sendActiveFileToWebview(panel.webview);
		}),
	];

	panel.onDidDispose(() => {
		disposables.forEach((d) => d.dispose());
	});

	return panel;
}
