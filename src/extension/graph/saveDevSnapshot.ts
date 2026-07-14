import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import { PinsGraph } from '../../shared/types';

export async function saveDevSnapshot(fileNodesStore: FileNodesStore): Promise<void> {
	const root = vscode.workspace.workspaceFolders?.[0]?.uri;
	if (!root) {
		return;
	}
	const data: PinsGraph = { version: 1, fileNodes: fileNodesStore.getFileNodes() };
	await vscode.workspace.fs.writeFile(
		vscode.Uri.joinPath(root, 'dev.code-pins.json'),
		Buffer.from(JSON.stringify(data, null, '\t'), 'utf8')
	);
}
