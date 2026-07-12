import * as vscode from 'vscode';
import { FileNodesStore } from './file-nodes-store';
import { addPin, clearMap } from './graph/actions';
import { openMap, saveMap } from './graph/persistence';
import { showGraphPanel } from './panel/showGraphPanel';
import { buildPin } from './pin';

export function activate(context: vscode.ExtensionContext) {
	const store = new FileNodesStore();

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.pin', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showWarningMessage('Code Pins: open a file and place the cursor on a symbol.');
				return;
			}
			const built = await buildPin(editor);
			if (!built) {
				return;
			}
			addPin(store, built.filePath, built.pin);
			showGraphPanel(context.extensionUri, store);
		}),

		vscode.commands.registerCommand('code-pins.showMap', () => {
			showGraphPanel(context.extensionUri, store);
		}),

		vscode.commands.registerCommand('code-pins.saveMap', () => saveMap(store)),

		vscode.commands.registerCommand('code-pins.openMap', async () => {
			if (await openMap(store)) {
				showGraphPanel(context.extensionUri, store);
			}
		}),

		vscode.commands.registerCommand('code-pins.newMap', () => clearMap(store))
	);
}

export function deactivate() {}
