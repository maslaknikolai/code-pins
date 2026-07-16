import * as vscode from 'vscode';
import { AppCtx } from '../types';

/** Development only: drops every stored key, leaving a fresh-install state. */
export async function wipeStorage(appCtx: AppCtx): Promise<void> {
	const { workspaceState } = appCtx.vscodeContext;

	await Promise.all(workspaceState.keys().map((key) => workspaceState.update(key, undefined)));

	vscode.window.setStatusBarMessage('Code Pins: storage wiped', 2000);
}
