import * as vscode from 'vscode';
import { addPin } from '../actions/addPin';
import { buildPin } from '../actions/buildPin';
import { sendSelectedPinToWebview } from '../actions/panel/sendSelectedPinToWebview';
import { createOrShowPanel } from '../actions/showPanel';
import { AppCtx } from '../types';

export async function addActiveEditorSymbolAsPinCommand(appCtx: AppCtx) {
	const editor = vscode.window.activeTextEditor;

	const built = editor
		? await buildPin(editor)
		: undefined;

	if (built) {
		addPin(appCtx, built.filePath, built.pin);
	}

	createOrShowPanel(appCtx, {
		onShow: (panel) => {
			if (built) {
				sendSelectedPinToWebview(panel.webview, built.pin);
			}
		}
	});
}
