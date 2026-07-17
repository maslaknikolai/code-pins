import * as vscode from 'vscode';
import { AppCtx } from '../../types';
import { getRelativePath } from '../../utils/getRelativePath';


export function updateLastActiveFilePath(appCtx: AppCtx): void {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		return;
	}

	appCtx.lastActiveFilePathStore.set(getRelativePath(editor.document.uri));
}
