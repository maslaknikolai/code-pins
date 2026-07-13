import * as vscode from 'vscode';
import { FileNodesStore } from './file-nodes-store';
import { addPin, clearPinsGraph } from './graph/actions';
import { getActivePinsGraphName, loadActivePinsGraph, saveActivePinsGraph } from './graph/activePinsGraphStorage';
import { openPinsGraph, savePinsGraph } from './graph/persistence';
import { saveDevSnapshot } from './graph/saveDevSnapshot';
import { switchPinsGraph } from './graph/switchPinsGraph';
import { setGraphPanelTitle, showGraphPanel } from './panel/showGraphPanel';
import { buildPin } from './pin';
import { retryUnresolvedDefinitions } from './retryUnresolvedDefinitions';
import { ViewportCenterStore } from './viewport-center-store';

export function activate(context: vscode.ExtensionContext) {
	const store = new FileNodesStore();
	const viewportCenterStore = new ViewportCenterStore();

	loadActivePinsGraph(context, store);
	context.subscriptions.push(store.onDidChange(() => saveActivePinsGraph(context, store)));

	if (context.extensionMode === vscode.ExtensionMode.Development) {
		context.subscriptions.push(store.onDidChange(() => saveDevSnapshot(store)));
	}

	const showPanel = () => {
		showGraphPanel(context.extensionUri, store, viewportCenterStore);
		setGraphPanelTitle(getActivePinsGraphName(context));
	};

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.pin', async () => {
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				vscode.window.showWarningMessage('Code Pins: open a file and place the cursor on a symbol.');
				return;
			}

			const built = await buildPin(editor);

			if (!built) {
				vscode.window.showWarningMessage('Code Pins: failed to create pin.');
				return;
			}

			addPin(store, built.filePath, built.pin, viewportCenterStore.getCenter());
			showPanel();
			retryUnresolvedDefinitions(store);
		}),

		vscode.commands.registerCommand('code-pins.showPinsGraph', () => {
			showPanel();
			retryUnresolvedDefinitions(store);
		}),

		vscode.commands.registerCommand('code-pins.switchPinsGraph', async () => {
			const picked = await switchPinsGraph(context, store);
			// Rename/delete can change the active graph even when the pick was cancelled.
			setGraphPanelTitle(getActivePinsGraphName(context));
			if (picked) {
				showPanel();
			}
		}),

		vscode.commands.registerCommand('code-pins.savePinsGraph', () => savePinsGraph(store)),

		vscode.commands.registerCommand('code-pins.openPinsGraph', async () => {
			if (await openPinsGraph(store)) {
				showPanel();
			}
		}),

		vscode.commands.registerCommand('code-pins.clearPinsGraph', () => clearPinsGraph(store))
	);
}

export function deactivate() {}
