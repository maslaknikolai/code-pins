import * as vscode from 'vscode';
import { addPin } from '../actions/addPin';
import { buildPin } from '../actions/buildPin';
import { retryUnresolvedDefinitions } from '../actions/retryUnresolvedDefinitions';
import { showGraphPanel } from '../actions/showGraphPanel';
import { AppCtx } from '../types';

export async function addPinCommand(appCtx: AppCtx): Promise<void> {
	const editor = vscode.window.activeTextEditor;

	const built = editor
		? await buildPin(editor)
		: undefined;

	if (built) {
		addPin(appCtx, built.filePath, built.pin);
	}

	showGraphPanel(appCtx);
	retryUnresolvedDefinitions(appCtx.activePinsGraphState);
}
