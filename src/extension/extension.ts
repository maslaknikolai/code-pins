import * as vscode from 'vscode';
import { addActiveEditorSymbolAsPinCommand } from './commands/addPinCommand';
import { addActiveEditorSymbolReferencesCommand } from './commands/addReferencesCommand';
import { showPanelCommand } from './commands/showPanelCommand';
import { setupDev } from './setupDev';
import { createAppCtx } from './createAppCtx';
import { updateLastActiveFilePath } from './actions/panel/updateLastActiveFilePath';

export function activate(vscodeContext: vscode.ExtensionContext) {
	const appCtx = createAppCtx(vscodeContext);

	setupDev(appCtx);

	vscodeContext.subscriptions.push(
		vscode.commands.registerCommand('code-pins.addPin', () => addActiveEditorSymbolAsPinCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.addReferences', () => addActiveEditorSymbolReferencesCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.showPanel', () => showPanelCommand(appCtx)),
		vscode.window.onDidChangeActiveTextEditor(() => updateLastActiveFilePath(appCtx))
	);
}

export function deactivate() {}
