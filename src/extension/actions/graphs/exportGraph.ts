import { homedir } from 'os';
import { join } from 'path';
import * as vscode from 'vscode';
import { AppCtx } from '../../types';
import { getGraphById } from './getGraphById';
import { serializePinsGraph } from './serializePinsGraph';

export const FILE_FILTERS = { 'Code Pins File': ['json'] };

export async function exportGraph(id: string, appCtx: AppCtx): Promise<void> {
	const source = getGraphById(id, appCtx);

	if (!source) {
		return;
	}

	const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri;
	const fileName = `${source.label}.json`;
	const target = await vscode.window.showSaveDialog({
		filters: FILE_FILTERS,
		defaultUri: workspaceRoot ? vscode.Uri.joinPath(workspaceRoot, fileName) : vscode.Uri.file(join(homedir(), fileName)),
	});

	if (!target) {
		return;
	}

	await vscode.workspace.fs.writeFile(target, Buffer.from(serializePinsGraph(source), 'utf8'));
	vscode.window.setStatusBarMessage(`Code Pins: saved to ${target.fsPath}`, 3000);
}
