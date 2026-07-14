import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import { addPin } from '../graph/actions';
import { GraphPanel } from '../panel/graph-panel';
import { buildPin } from '../pin';
import { retryUnresolvedDefinitions } from '../retryUnresolvedDefinitions';
import { ViewportCenterStore } from '../viewport-center-store';

export async function pinCommand({
	fileNodesStore,
	viewportCenterStore,
	graphPanel,
}: {
	fileNodesStore: FileNodesStore;
	viewportCenterStore: ViewportCenterStore;
	graphPanel: GraphPanel;
}): Promise<void> {
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

	addPin(fileNodesStore, built.filePath, built.pin, viewportCenterStore.getCenter());
	graphPanel.show();
	retryUnresolvedDefinitions(fileNodesStore);
}
