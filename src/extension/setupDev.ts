import * as vscode from 'vscode';
import { PinsGraphFile, SUPPORTED_PINS_GRAPH_FILE_VERSION } from '../shared/types';
import { getActiveGraph } from './actions/activeGraph/getActiveGraph';
import { onGraphsChange } from './actions/graphs/onGraphsChange';
import { AppCtx } from './types';


export function setupDev(appCtx: AppCtx): void {
	if (appCtx.vscodeContext.extensionMode !== vscode.ExtensionMode.Development) {
		return;
	}

	// Gates the palette entry, see contributes.menus.commandPalette.
	vscode.commands.executeCommand('setContext', 'codePins.isDev', true);

	appCtx.vscodeContext.subscriptions.push(
		onGraphsChange(() => saveDevSnapshot(appCtx), appCtx),
		vscode.commands.registerCommand('code-pins.wipeStorage', () => wipeStorage(appCtx))
	);
}

async function saveDevSnapshot(appCtx: AppCtx): Promise<void> {
	const root = vscode.workspace.workspaceFolders?.[0]?.uri;
	const activeGraph = getActiveGraph(appCtx);

	if (!root || !activeGraph) {
		return;
	}

	const { id: _id, ...pinsGraph } = activeGraph;
	const data: PinsGraphFile = {
		version: SUPPORTED_PINS_GRAPH_FILE_VERSION,
		pinsGraph,
	};

	await vscode.workspace.fs.writeFile(
		vscode.Uri.joinPath(root, 'dev.code-pins.json'),
		Buffer.from(JSON.stringify(data, null, '\t'), 'utf8')
	);
}

async function wipeStorage(appCtx: AppCtx): Promise<void> {
	const { workspaceState } = appCtx.vscodeContext;

	await Promise.all(workspaceState.keys().map((key) => workspaceState.update(key, undefined)));

	vscode.window.setStatusBarMessage('Code Pins: storage wiped', 2000);
}
