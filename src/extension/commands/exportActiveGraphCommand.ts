import * as vscode from 'vscode';
import { PinsGraph } from '../../shared/types';
import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';

export const FILE_FILTERS = { 'Code Pins File': ['json'] };

export async function exportActiveGraphCommand({
	activePinsGraphStore,
}: {
	activePinsGraphStore: ActivePinsGraphStore;
}): Promise<void> {
	const target = await vscode.window.showSaveDialog({ filters: FILE_FILTERS });
	if (!target) {
		return;
	}
	const data: PinsGraph = { version: 1, fileNodes: activePinsGraphStore.getFileNodes() };
	await vscode.workspace.fs.writeFile(target, Buffer.from(JSON.stringify(data, null, '\t'), 'utf8'));
	vscode.window.setStatusBarMessage(`Code Pins: saved to ${target.fsPath}`, 3000);
}
