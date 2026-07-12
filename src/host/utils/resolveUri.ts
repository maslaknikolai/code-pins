import * as path from 'path';
import * as vscode from 'vscode';

/** Pins store workspace-relative paths; absolute ones only for files outside the workspace. */
export function resolveUri(file: string): vscode.Uri {
	const root = vscode.workspace.workspaceFolders?.[0]?.uri;
	if (path.isAbsolute(file) || !root) {
		return vscode.Uri.file(file);
	}
	return vscode.Uri.joinPath(root, file);
}
