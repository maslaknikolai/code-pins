import * as vscode from 'vscode';
import { WebviewMessageType, WebviewToExtensionMessage } from '../../shared/messages';
import { openLocation } from './panel/openLocation';
import { renderHtml } from './panel/html';
import { sendActiveFileToWebview } from './panel/sendActiveFileToWebview';
import { sendStateToWebview } from './panel/sendStateToWebview';
import { deletePinsGraph } from './deletePinsGraph';
import { exportGraph } from './exportGraph';
import { AppCtx } from '../types';
import { cloneGraph } from './cloneGraph';
import { createGraph } from './createGraph';
import { importGraphFile } from './importGraphFile';
import { moveFileNode } from './moveFileNode';
import { refreshVsCodePanelTitle } from './refreshVsCodePanelTitle';
import { removeFileNode } from './removeFileNode';
import { renameGraph } from './renameGraph';
import { removePin } from './removePin';

export function showGraphPanel(appCtx: AppCtx): void {
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
}

function createPanel(appCtx: AppCtx): vscode.WebviewPanel {
	const { context, activePinsGraphState, viewportCenterState, pinsGraphsStore } = appCtx;
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
				sendStateToWebview(panel.webview, appCtx);
				sendActiveFileToWebview(panel.webview);
			}
			if (message.type === WebviewMessageType.MoveFileNode) {
				moveFileNode(activePinsGraphState, message.filePath, message.position);
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
				viewportCenterState.setCenter(message.position);
			}
			if (message.type === WebviewMessageType.SwitchGraph) {
				const pickedGraph = pinsGraphsStore.getGraphById(message.id);
				if (pickedGraph) {
					activePinsGraphState.setPinsGraph(pickedGraph);
				}
			}
			if (message.type === WebviewMessageType.DeleteGraph) {
				deletePinsGraph(appCtx, message.id);
			}
			if (message.type === WebviewMessageType.ImportGraph) {
				importGraphFile(appCtx);
			}
			if (message.type === WebviewMessageType.NewGraph) {
				createGraph(appCtx);
			}
			if (message.type === WebviewMessageType.CloneGraph) {
				cloneGraph(appCtx, message.id);
			}
			if (message.type === WebviewMessageType.RenameGraph) {
				renameGraph(appCtx, message.id);
			}
			if (message.type === WebviewMessageType.ExportGraph) {
				exportGraph(appCtx, message.id);
			}
		}),
		activePinsGraphState.onDidChange(() => {
			sendStateToWebview(panel.webview, appCtx);
			refreshVsCodePanelTitle(appCtx);
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
