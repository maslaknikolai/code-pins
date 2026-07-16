import * as vscode from 'vscode';
import { onGraphsChange } from './actions/onGraphsChange';
import { saveDevSnapshot } from './actions/saveDevSnapshot';
import { wipeStorage } from './actions/wipeStorage';
import { AppCtx } from './types';


export function setupDev(appCtx: AppCtx): void {
	if (appCtx.vscodeContext.extensionMode !== vscode.ExtensionMode.Development) {
		return;
	}

	// Gates the palette entry, see contributes.menus.commandPalette.
	vscode.commands.executeCommand('setContext', 'codePins.isDev', true);

	appCtx.vscodeContext.subscriptions.push(
		onGraphsChange(appCtx, () => saveDevSnapshot(appCtx)),
		vscode.commands.registerCommand('code-pins.wipeStorage', () => wipeStorage(appCtx))
	);
}
