import * as vscode from 'vscode';
import { addPinCommand } from './commands/addPinCommand';
import { loadActivePinsGraph } from './actions/loadActivePinsGraph';
import { setupDevSnapshot } from './setupDevSnapshot';
import { createAppCtx } from './createAppCtx';

export function activate(context: vscode.ExtensionContext) {
	const appCtx = createAppCtx(context);
	loadActivePinsGraph(appCtx);
	setupDevSnapshot(appCtx);

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.addPin', () => addPinCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.clearActiveGraph', () => appCtx.activePinsGraphState.setFileNodes([]))
	);
}

export function deactivate() {}
