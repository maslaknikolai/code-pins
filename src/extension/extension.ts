import * as vscode from 'vscode';
import { FileNodesStore } from './file-nodes-store';
import { addPin, clearCodePinsFile } from './graph/actions';
import { openCodePinsFile, saveCodePinsFile } from './graph/persistence';
import { saveDevSnapshot } from './graph/saveDevSnapshot';
import { showGraphPanel } from './panel/showGraphPanel';
import { buildPin } from './pin';
import { retryUnresolvedDefinitions } from './retryUnresolvedDefinitions';

export function activate(context: vscode.ExtensionContext) {
	const store = new FileNodesStore();

	if (context.extensionMode === vscode.ExtensionMode.Development) {
		context.subscriptions.push(store.onDidChange(() => saveDevSnapshot(store)));
	}

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

			addPin(store, built.filePath, built.pin);
			showGraphPanel(context.extensionUri, store);
			retryUnresolvedDefinitions(store);
		}),

		vscode.commands.registerCommand('code-pins.showMap', () => {
			showGraphPanel(context.extensionUri, store);
			retryUnresolvedDefinitions(store);
		}),

		vscode.commands.registerCommand('code-pins.saveCodePinsFile', () => saveCodePinsFile(store)),

		vscode.commands.registerCommand('code-pins.openCodePinsFile', async () => {
			if (await openCodePinsFile(store)) {
				showGraphPanel(context.extensionUri, store);
			}
		}),

		vscode.commands.registerCommand('code-pins.clearCodePinsFile', () => clearCodePinsFile(store))
	);
}

export function deactivate() {}
