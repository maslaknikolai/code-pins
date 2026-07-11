import * as vscode from 'vscode';
import { PinsStore } from './graph';
import { addNode, clearMap } from './graph/actions';
import { openMap, saveMap } from './graph/persistence';
import { showGraphPanel } from './panel/showGraphPanel';
import { buildPinnedNode } from './pin';

export function activate(context: vscode.ExtensionContext) {
	const pinsStore = new PinsStore();

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.pin', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showWarningMessage('Code Pins: open a file and place the cursor on a symbol.');
				return;
			}
			const node = await buildPinnedNode(editor);
			if (!node) {
				return;
			}
			addNode(pinsStore, node);
			showGraphPanel(context.extensionUri, pinsStore);
		}),

		vscode.commands.registerCommand('code-pins.showMap', () => {
			showGraphPanel(context.extensionUri, pinsStore);
		}),

		vscode.commands.registerCommand('code-pins.saveMap', () => saveMap(pinsStore)),

		vscode.commands.registerCommand('code-pins.openMap', async () => {
			if (await openMap(pinsStore)) {
				showGraphPanel(context.extensionUri, pinsStore);
			}
		}),

		vscode.commands.registerCommand('code-pins.newMap', () => clearMap(pinsStore))
	);
}

export function deactivate() {}
