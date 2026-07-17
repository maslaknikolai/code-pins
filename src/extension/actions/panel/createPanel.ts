import * as vscode from 'vscode';
import { AppCtx } from '../../types';
import { onGraphsChange } from '../graphs/onGraphsChange';
import { handleMessageFromWebview } from './handleMessageFromWebview';
import { renderHtml } from './html';
import { refreshVsCodePanelTitle } from './refreshVsCodePanelTitle';
import { sendActiveFileToWebview } from './sendActiveFileToWebview';
import { sendGraphsToWebview } from './sendGraphsToWebview';
import { PanelCallbacks } from './types';


export function createPanel(callbacks: PanelCallbacks, appCtx: AppCtx): vscode.WebviewPanel {
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
			handleMessageFromWebview(message, panel, callbacks, appCtx);
		}),
		onGraphsChange(() => {
			sendGraphsToWebview(panel.webview, appCtx);
			refreshVsCodePanelTitle(appCtx);
		}, appCtx),
		appCtx.lastActiveFilePathStore.onDidChange(() => {
			sendActiveFileToWebview(appCtx);
		}),
	];

	panel.onDidDispose(() => {
		disposables.forEach((d) => d.dispose());
	});

	return panel;
}
