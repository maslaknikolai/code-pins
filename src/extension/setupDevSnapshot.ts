import * as vscode from 'vscode';
import { onGraphsChange } from './actions/onGraphsChange';
import { saveDevSnapshot } from './actions/saveDevSnapshot';
import { AppCtx } from './types';


export function setupDevSnapshot(appCtx: AppCtx): void {
	if (appCtx.context.extensionMode !== vscode.ExtensionMode.Development) {
		return;
	}

	appCtx.context.subscriptions.push(onGraphsChange(appCtx, () => saveDevSnapshot(appCtx)));
}
