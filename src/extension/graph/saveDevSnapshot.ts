import * as vscode from 'vscode';
import { ActivePinsGraphStore } from '../active-pins-graph-store';
import { PinsGraph } from '../../shared/types';

export async function saveDevSnapshot(activePinsGraphStore: ActivePinsGraphStore): Promise<void> {
	const root = vscode.workspace.workspaceFolders?.[0]?.uri;
	if (!root) {
		return;
	}
	const data: PinsGraph = { version: 1, fileNodes: activePinsGraphStore.getFileNodes() };
	await vscode.workspace.fs.writeFile(
		vscode.Uri.joinPath(root, 'dev.code-pins.json'),
		Buffer.from(JSON.stringify(data, null, '\t'), 'utf8')
	);
}
