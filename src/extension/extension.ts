import * as vscode from 'vscode';
import { importToActiveGraphCommand } from './commands/importToActiveGraphCommand';
import { addPinCommand } from './commands/addPinCommand';
import { showPinsPanelCommand } from './commands/showPinsPanelCommand';
import { switchPinsGraphCommand } from './commands/switchPinsGraphCommand';
import { ActivePinsGraphStore } from './stores/active-pins-graph-store';
import { clearActiveGraphCommand } from './commands/clearActiveGraphCommand';
import { exportActiveGraphCommand } from './commands/exportActiveGraphCommand';
import { loadActivePinsGraph } from './storage/loadActivePinsGraph';
import { saveActivePinsGraph } from './storage/saveActivePinsGraph';
import { saveDevSnapshot } from './storage/saveDevSnapshot';
import { GraphPanel } from './panel/graph-panel';
import { PinsGraphsStore } from './storage/pins-graphs-store';
import { ViewportCenterStore } from './stores/viewport-center-store';

export function activate(context: vscode.ExtensionContext) {
	const activePinsGraphStore = new ActivePinsGraphStore();
	const viewportCenterStore = new ViewportCenterStore();
	const pinsGraphsStore = new PinsGraphsStore(context.workspaceState);
	const graphPanel = new GraphPanel(context, activePinsGraphStore, viewportCenterStore);

	loadActivePinsGraph(pinsGraphsStore, activePinsGraphStore);

	context.subscriptions.push(
		activePinsGraphStore.onDidChange(() => {
			saveActivePinsGraph(pinsGraphsStore, activePinsGraphStore);
		})
	);

	if (context.extensionMode === vscode.ExtensionMode.Development) {
		context.subscriptions.push(activePinsGraphStore.onDidChange(() => saveDevSnapshot(activePinsGraphStore)));
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.addPin', () => addPinCommand({ activePinsGraphStore, viewportCenterStore, graphPanel })),
		vscode.commands.registerCommand('code-pins.showPinsPanel', () => showPinsPanelCommand({ activePinsGraphStore, graphPanel })),
		vscode.commands.registerCommand('code-pins.switchPinsGraph', () => switchPinsGraphCommand({ pinsGraphsStore, activePinsGraphStore, graphPanel })),
		vscode.commands.registerCommand('code-pins.exportActiveGraph', () => exportActiveGraphCommand(activePinsGraphStore)),
		vscode.commands.registerCommand('code-pins.importToActiveGraph', () => importToActiveGraphCommand({ activePinsGraphStore, graphPanel })),
		vscode.commands.registerCommand('code-pins.clearActiveGraph', () => clearActiveGraphCommand(activePinsGraphStore))
	);
}

export function deactivate() {}
