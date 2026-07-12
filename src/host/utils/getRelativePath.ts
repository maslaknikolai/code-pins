import * as vscode from 'vscode';

/** Workspace-relative path; falls back to the full path for files outside the workspace. */
export function getRelativePath(uri: vscode.Uri): string {
	return vscode.workspace.asRelativePath(uri, false);
}
