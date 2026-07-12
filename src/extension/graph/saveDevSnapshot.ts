import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import { CodePinsFile } from '../../types';

/** Dev mode: mirrors the store into <workspace root>/dev.code-pins.json on every change. */
export async function saveDevSnapshot(store: FileNodesStore): Promise<void> {
	const root = vscode.workspace.workspaceFolders?.[0]?.uri;
	if (!root) {
		return;
	}
	const data: CodePinsFile = { version: 2, fileNodes: store.getFileNodes() };
	await vscode.workspace.fs.writeFile(
		vscode.Uri.joinPath(root, 'dev.code-pins.json'),
		Buffer.from(JSON.stringify(data, null, '\t'), 'utf8')
	);
}
