import * as vscode from 'vscode';
import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';
import { addPin } from '../actions/addPin';
import { GraphPanel } from '../panel/graph-panel';
import { buildPin } from '../actions/buildPin';
import { retryUnresolvedDefinitions } from '../actions/retryUnresolvedDefinitions';
import { ViewportCenterStore } from '../stores/viewport-center-store';

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
