import * as vscode from 'vscode';
import { GraphManager } from './graph';
import { GraphPanel } from './panel';
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
				graph.add(node);
				GraphPanel.createOrShow(context.extensionUri, graph);
			}
		}),

		vscode.commands.registerCommand('code-pins.showMap', () => {
			GraphPanel.createOrShow(context.extensionUri, graph);
		}),

		vscode.commands.registerCommand('code-pins.saveMap', () => graph.save()),

		vscode.commands.registerCommand('code-pins.openMap', async () => {
			if (await graph.open()) {
				GraphPanel.createOrShow(context.extensionUri, graph);
			}
		}),

		vscode.commands.registerCommand('code-pins.newMap', () => graph.clear())
	);
}

export function deactivate() {}
