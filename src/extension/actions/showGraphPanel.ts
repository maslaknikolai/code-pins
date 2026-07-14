import * as vscode from 'vscode';
import { WebviewMessageType, WebviewToExtensionMessage } from '../../shared/messages';
import { openLocation } from '../panel/openLocation';
import { renderHtml } from '../panel/html';
import { sendActiveFileToWebview } from '../panel/sendActiveFileToWebview';
import { sendStateToWebview } from '../panel/sendStateToWebview';
import { AppCtx } from '../types';
import { moveFileNode } from './moveFileNode';
import { refreshGraphPanelTitle } from './refreshGraphPanelTitle';
import { removeFileNode } from './removeFileNode';
import { removePin } from './removePin';

export function showGraphPanel(appCtx: AppCtx): void {
	const { graphPanelState } = appCtx;
	const existingPanel = graphPanelState.getPanel();

	if (!existingPanel) {
		const panel = createPanel(appCtx);
		graphPanelState.setPanel(panel);
		panel.onDidDispose(() => {
			graphPanelState.setPanel(undefined);
		});
	} else {
		existingPanel.reveal(undefined, true);
	}

	refreshGraphPanelTitle(appCtx);
}

function createPanel({ context, activePinsGraphState, viewportCenterState }: AppCtx): vscode.WebviewPanel {
	const panel = vscode.window.createWebviewPanel(
		'codePins',
		'Code Pins',
		{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')],
		}
	);

	panel.webview.html = renderHtml(panel.webview, context.extensionUri);

	const disposables: vscode.Disposable[] = [
		panel.webview.onDidReceiveMessage((message: WebviewToExtensionMessage) => {
			if (message.type === WebviewMessageType.Ready) {
				sendStateToWebview(panel.webview, activePinsGraphState);
				sendActiveFileToWebview(panel.webview);
			}
			if (message.type === WebviewMessageType.MoveFileNode) {
				moveFileNode(activePinsGraphState, message.filePath, message.x, message.y);
			}
			if (message.type === WebviewMessageType.RemovePin) {
				removePin(activePinsGraphState, message.id);
			}
			if (message.type === WebviewMessageType.RemoveFileNode) {
				removeFileNode(activePinsGraphState, message.filePath);
			}
			if (message.type === WebviewMessageType.OpenLocation) {
				openLocation(message.file, message.line);
			}
			if (message.type === WebviewMessageType.ViewportChanged) {
				viewportCenterState.setCenter({ x: message.x, y: message.y });
			}
		}),
		activePinsGraphState.onDidChange(() => {
			sendStateToWebview(panel.webview, activePinsGraphState);
		}),
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			sendActiveFileToWebview(panel.webview, editor);
		}),
	];

	panel.onDidDispose(() => {
		disposables.forEach((d) => d.dispose());
	});

	return panel;
}
