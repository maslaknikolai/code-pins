import * as vscode from 'vscode';
import { AppCtx } from '../types';
import { renderHtml } from './panel/html';
import { sendActiveFileToWebview } from './panel/sendActiveFileToWebview';
import { sendGraphsToWebview } from './panel/sendGraphsToWebview';
import { refreshVsCodePanelTitle } from './refreshVsCodePanelTitle';
import { handleMessageFromWebview } from './panel/handleMessageFromWebview';
import { onGraphsChange } from './onGraphsChange';
import { retryUnresolvedDefinitions } from './retryUnresolvedDefinitions';

export function showPanel(appCtx: AppCtx): void {
	const existingPanel = appCtx.vsCodePanelState.getPanel();

	if (!existingPanel) {
		const panel = createPanel(appCtx);

		appCtx.vsCodePanelState.setPanel(panel);
		panel.onDidDispose(() => {
			appCtx.vsCodePanelState.setPanel(undefined);
		});
	} else {
		existingPanel.reveal(undefined, true);
	}

	refreshVsCodePanelTitle(appCtx);
	retryUnresolvedDefinitions(appCtx);
}

function createPanel(appCtx: AppCtx): vscode.WebviewPanel {
	const panel = vscode.window.createWebviewPanel(
		'codePins',
		'Code Pins',
		{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [
				vscode.Uri.joinPath(appCtx.context.extensionUri, 'dist')
			],
		}
	);

	panel.webview.html = renderHtml(panel.webview, appCtx.context.extensionUri);

	const disposables: vscode.Disposable[] = [
		panel.webview.onDidReceiveMessage((message) => {
			handleMessageFromWebview(message, panel, appCtx);
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
