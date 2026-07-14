import * as vscode from 'vscode';
import { PinsGraph } from '../../shared/types';
import { FileNodesStore } from '../file-nodes-store';

export const FILE_FILTERS = { 'Code Pins File': ['json'] };

export async function exportActiveGraphCommand({
	fileNodesStore,
}: {
	fileNodesStore: FileNodesStore;
}): Promise<void> {
	const target = await vscode.window.showSaveDialog({ filters: FILE_FILTERS });
	if (!target) {
		return;
	}
	const data: PinsGraph = { version: 1, fileNodes: fileNodesStore.getFileNodes() };
	await vscode.workspace.fs.writeFile(target, Buffer.from(JSON.stringify(data, null, '\t'), 'utf8'));
	vscode.window.setStatusBarMessage(`Code Pins: saved to ${target.fsPath}`, 3000);
}
