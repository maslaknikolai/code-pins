import * as vscode from 'vscode';
import { addActiveEditorSymbolAsPinCommand } from './commands/addPinCommand';
import { setupDev } from './setupDev';
import { createAppCtx } from './createAppCtx';
import { removeAllNodesOfActiveGraph } from './actions/removeAllNodes';

export function activate(context: vscode.ExtensionContext) {
	const appCtx = createAppCtx(context);

	setupDev(appCtx);

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.addPin', () => addActiveEditorSymbolAsPinCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.clearActiveGraph', () => removeAllNodesOfActiveGraph(appCtx))
	);
}

export function deactivate() {}
