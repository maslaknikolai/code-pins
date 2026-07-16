import * as vscode from 'vscode';
import { onGraphsChange } from './actions/onGraphsChange';
import { saveDevSnapshot } from './actions/saveDevSnapshot';
import { AppCtx } from './types';


export function setupDevSnapshot(appCtx: AppCtx): void {
	if (appCtx.vscodeContext.extensionMode !== vscode.ExtensionMode.Development) {
		return;
	}

	appCtx.vscodeContext.subscriptions.push(onGraphsChange(appCtx, () => saveDevSnapshot(appCtx)));
}
