import * as vscode from 'vscode';
import { importToActiveGraphCommand } from './commands/importToActiveGraphCommand';
import { addPinCommand } from './commands/addPinCommand';
import { showPinsPanelCommand } from './commands/showPinsPanelCommand';
import { switchPinsGraphCommand } from './commands/switchPinsGraphCommand';
import { clearActiveGraphCommand } from './commands/clearActiveGraphCommand';
import { exportActiveGraphCommand } from './commands/exportActiveGraphCommand';
import { loadActivePinsGraph } from './storage/loadActivePinsGraph';
import { saveActivePinsGraph } from './storage/saveActivePinsGraph';
import { saveDevSnapshot } from './storage/saveDevSnapshot';
import { createState } from './createState';

export function activate(context: vscode.ExtensionContext) {
	const appCtx = createState(context);

	loadActivePinsGraph(appCtx);

	context.subscriptions.push(
		appCtx.activePinsGraphState.onDidChange(() => {
			saveActivePinsGraph(appCtx);
		})
	);

	if (context.extensionMode === vscode.ExtensionMode.Development) {
		context.subscriptions.push(appCtx.activePinsGraphState.onDidChange(() => saveDevSnapshot(appCtx)));
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.addPin', () => addPinCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.showPinsPanel', () => showPinsPanelCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.switchPinsGraph', () => switchPinsGraphCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.exportActiveGraph', () => exportActiveGraphCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.importToActiveGraph', () => importToActiveGraphCommand(appCtx)),
		vscode.commands.registerCommand('code-pins.clearActiveGraph', () => clearActiveGraphCommand(appCtx))
	);
}

export function deactivate() {}
