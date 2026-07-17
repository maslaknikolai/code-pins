import * as vscode from 'vscode';
import { addPinToActiveGraph } from '../actions/activeGraph/addPinToActiveGraph';
import { buildPin } from '../actions/buildPin';
import { sendSelectedPinToWebview } from '../actions/panel/sendSelectedPinToWebview';
import { createOrShowPanel } from '../actions/panel/showPanel';
import { AppCtx } from '../types';

export async function addActiveEditorSymbolAsPinCommand(appCtx: AppCtx) {
	const editor = vscode.window.activeTextEditor;

	const built = editor
		? await buildPin(editor)
		: undefined;

	if (built) {
		addPinToActiveGraph(built.filePath, built.pin, appCtx);
	}

	createOrShowPanel({
		onReady: (panel) => {
			if (built) {
				sendSelectedPinToWebview(panel.webview, built.pin);
			}
		}
	}, appCtx);
}
