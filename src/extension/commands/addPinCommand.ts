import * as vscode from 'vscode';
import { addPin } from '../actions/addPin';
import { buildPin } from '../actions/buildPin';
import { showPanel } from '../actions/showPanel';
import { AppCtx } from '../types';

export async function addActiveEditorSymbolAsPinCommand(appCtx: AppCtx) {
	const editor = vscode.window.activeTextEditor;

	const built = editor
		? await buildPin(editor)
		: undefined;

	if (built) {
		addPin(appCtx, built.filePath, built.pin);
	}

	showPanel(appCtx);
}
