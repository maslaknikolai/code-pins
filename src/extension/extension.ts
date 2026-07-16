import * as vscode from 'vscode';
import { addActiveEditorSymbolAsPinCommand } from './commands/addPinCommand';
import { setupDev } from './setupDev';
import { createAppCtx } from './createAppCtx';
import { removeAllNodesOfActiveGraph } from './actions/activeGraph/removeAllNodesOfActiveGraph';

export function activate(vscodeContext: vscode.ExtensionContext) {
	const appCtx = createAppCtx(vscodeContext);

	setupDev(appCtx);

	vscodeContext.subscriptions.push(
		vscode.commands.registerCommand('code-pins.addPin', () => addActiveEditorSymbolAsPinCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.clearActiveGraph', () => removeAllNodesOfActiveGraph(appCtx))
	);
}

export function deactivate() {}
