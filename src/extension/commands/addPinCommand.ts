import * as vscode from 'vscode';
import { ActivePinsGraphStore } from '../active-pins-graph-store';
import { addPin } from '../graph/actions';
import { GraphPanel } from '../panel/graph-panel';
import { buildPin } from '../pin';
import { retryUnresolvedDefinitions } from '../retryUnresolvedDefinitions';
import { ViewportCenterStore } from '../viewport-center-store';

export async function addPinCommand({
	activePinsGraphStore,
	viewportCenterStore,
	graphPanel,
}: {
	activePinsGraphStore: ActivePinsGraphStore;
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

	addPin(activePinsGraphStore, built.filePath, built.pin, viewportCenterStore.getCenter());
	graphPanel.show();
	retryUnresolvedDefinitions(activePinsGraphStore);
}
