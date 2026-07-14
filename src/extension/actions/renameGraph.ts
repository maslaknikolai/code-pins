import * as vscode from 'vscode';
import { sendStateToWebview } from './panel/sendStateToWebview';
import { AppCtx } from '../types';


export async function renameGraph(appCtx: AppCtx, id: string): Promise<void> {
	const source = appCtx.pinsGraphsStore.getGraphById(id);

	if (!source) {
		return;
	}

	const input = await vscode.window.showInputBox({ prompt: `Rename graph "${source.label}"`, value: source.label });

	if (!input || input === source.label) {
		return;
	}

	const renamed = { ...source, label: appCtx.pinsGraphsStore.getNextName(input) };

	await appCtx.pinsGraphsStore.saveGraph(renamed);

	// Renaming the active graph already sends state via the panel's onDidChange subscription.
	if (appCtx.activePinsGraphState.getPinsGraph().id === id) {
		return;
	}

	const panel = appCtx.vsCodePanelState.getPanel();
	if (panel) {
		sendStateToWebview(panel.webview, appCtx);
	}
}
