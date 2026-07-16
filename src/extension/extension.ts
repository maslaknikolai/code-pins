import * as vscode from 'vscode';
import { addActiveEditorSymbolAsPinCommand } from './commands/addPinCommand';
import { setupDevSnapshot } from './setupDevSnapshot';
import { createAppCtx } from './createAppCtx';
import { removeAllNodesOfActiveGraph } from './actions/removeAllNodes';

export function activate(context: vscode.ExtensionContext) {
	const appCtx = createAppCtx(context);
	setupDevSnapshot(appCtx);

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.addPin', () => addActiveEditorSymbolAsPinCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.clearActiveGraph', () => removeAllNodesOfActiveGraph(appCtx))
	);
}

export function deactivate() {}
