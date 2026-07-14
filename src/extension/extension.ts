import * as vscode from 'vscode';
import { importToActiveGraphCommand } from './commands/importToActiveGraphCommand';
import { addPinCommand } from './commands/addPinCommand';
import { showPinsPanelCommand } from './commands/showPinsPanelCommand';
import { switchPinsGraphCommand } from './commands/switchPinsGraphCommand';
import { FileNodesStore } from './file-nodes-store';
import { clearActiveGraphCommand } from './commands/clearActiveGraphCommand';
import { exportActiveGraphCommand } from './commands/exportActiveGraphCommand';
import { loadActivePinsGraph, saveActivePinsGraph } from './graph/activePinsGraphStorage';
import { saveDevSnapshot } from './graph/saveDevSnapshot';
import { GraphPanel } from './panel/graph-panel';
import { PinsGraphsStore } from './pins-graphs-store';
import { ViewportCenterStore } from './viewport-center-store';

export function activate(context: vscode.ExtensionContext) {
	const fileNodesStore = new FileNodesStore();
	const viewportCenterStore = new ViewportCenterStore();
	const pinsGraphsStore = new PinsGraphsStore(context.workspaceState);
	const graphPanel = new GraphPanel(context, fileNodesStore, viewportCenterStore, pinsGraphsStore);

	loadActivePinsGraph(pinsGraphsStore, fileNodesStore);

	context.subscriptions.push(fileNodesStore.onDidChange(() => {
		saveActivePinsGraph(pinsGraphsStore, fileNodesStore);
	}));

	if (context.extensionMode === vscode.ExtensionMode.Development) {
		context.subscriptions.push(fileNodesStore.onDidChange(() => saveDevSnapshot(fileNodesStore)));
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.addPin', () => addPinCommand({ fileNodesStore, viewportCenterStore, graphPanel })),
		vscode.commands.registerCommand('code-pins.showPinsPanel', () => showPinsPanelCommand({ fileNodesStore, graphPanel })),
		vscode.commands.registerCommand('code-pins.switchPinsGraph', () => switchPinsGraphCommand({ pinsGraphsStore, fileNodesStore, graphPanel })),
		vscode.commands.registerCommand('code-pins.exportActiveGraph', () => exportActiveGraphCommand({ fileNodesStore })),
		vscode.commands.registerCommand('code-pins.importToActiveGraph', () => importToActiveGraphCommand({ fileNodesStore, graphPanel })),
		vscode.commands.registerCommand('code-pins.clearActiveGraph', () => clearActiveGraphCommand({ fileNodesStore }))
	);
}

export function deactivate() {}
