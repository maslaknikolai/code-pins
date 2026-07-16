import * as vscode from 'vscode';
import { AppCtx } from '../../types';
import { onGraphsChange } from '../onGraphsChange';
import { handleMessageFromWebview } from './handleMessageFromWebview';
import { renderHtml } from './html';
import { refreshVsCodePanelTitle } from './refreshVsCodePanelTitle';
import { sendActiveFileToWebview } from './sendActiveFileToWebview';
import { sendGraphsToWebview } from './sendGraphsToWebview';

export interface PanelCallbacks {
	/** Runs once the webview can receive messages. */
	onShow?: (panel: vscode.WebviewPanel) => void;
}

export function createPanel(appCtx: AppCtx, callbacks: PanelCallbacks): vscode.WebviewPanel {
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
