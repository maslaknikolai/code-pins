import * as vscode from 'vscode';
import { addPinCommand } from './commands/addPinCommand';
import { setupDevSnapshot } from './setupDevSnapshot';
import { createAppCtx } from './createAppCtx';

export function activate(context: vscode.ExtensionContext) {
	const appCtx = createAppCtx(context);
	setupDevSnapshot(appCtx);

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.addPin', () => addPinCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.clearActiveGraph', () => appCtx.activePinsGraphState.removeAllNodes())
	);
}

export function deactivate() {}
