import * as vscode from 'vscode';
import { addPin } from '../actions/addPin';
import { buildPin } from '../actions/buildPin';
import { retryUnresolvedDefinitions } from '../actions/retryUnresolvedDefinitions';
import { showGraphPanel } from '../actions/showGraphPanel';
import { AppCtx } from '../types';

export async function addPinCommand(appCtx: AppCtx): Promise<void> {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showWarningMessage('Code Pins: open a file and place the cursor on a symbol.');
		return;
	}

	const built = await buildPin(editor);

	if (!built) {
		vscode.window.showWarningMessage('Code Pins: failed to create pin.');
		return;
	}

	addPin(appCtx, built.filePath, built.pin);
	showGraphPanel(appCtx);
	retryUnresolvedDefinitions(appCtx.activePinsGraphState);
}
