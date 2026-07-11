import * as vscode from 'vscode';
import { GraphManager } from './graph';
import { addNode, clearMap } from './graph/actions';
import { openMap, saveMap } from './graph/persistence';
import { showGraphPanel } from './panel';
import { buildPinnedNode } from './pin';

export function activate(context: vscode.ExtensionContext) {
	const graph = new GraphManager();

	context.subscriptions.push(
		vscode.commands.registerCommand('code-pins.pin', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showWarningMessage('Code Pins: open a file and place the cursor on a symbol.');
				return;
			}
			const node = await buildPinnedNode(editor);
			if (node) {
				addNode(graph, node);
				showGraphPanel(context.extensionUri, graph);
			}
		}),

		vscode.commands.registerCommand('code-pins.showMap', () => {
			showGraphPanel(context.extensionUri, graph);
		}),

		vscode.commands.registerCommand('code-pins.saveMap', () => saveMap(graph)),

		vscode.commands.registerCommand('code-pins.openMap', async () => {
			if (await openMap(graph)) {
				showGraphPanel(context.extensionUri, graph);
			}
		}),

		vscode.commands.registerCommand('code-pins.newMap', () => clearMap(graph))
	);
}

export function deactivate() {}
