import * as vscode from 'vscode';
import { saveDevSnapshot } from './actions/saveDevSnapshot';
import { AppCtx } from './types';

/** Development only: mirrors the active graph into dev.code-pins.json on every change. */
export function setupDevSnapshot(appCtx: AppCtx): void {
	const { context, activePinsGraphState } = appCtx;

	if (context.extensionMode !== vscode.ExtensionMode.Development) {
		return;
	}

	context.subscriptions.push(activePinsGraphState.onDidChange(() => saveDevSnapshot(appCtx)));
}
