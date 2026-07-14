import * as vscode from 'vscode';
import { PinsGraph } from '../../shared/types';
import { ActivePinsGraphStore } from '../active-pins-graph-store';
import { FILE_FILTERS } from './exportActiveGraphCommand';
import { GraphPanel } from '../panel/graph-panel';

export async function importToActiveGraphCommand({
	activePinsGraphStore,
	graphPanel,
}: {
	activePinsGraphStore: ActivePinsGraphStore;
	graphPanel: GraphPanel;
}): Promise<void> {
	const pickedFile = await vscode.window.showOpenDialog({
		filters: FILE_FILTERS,
		canSelectMany: false
	});

	if (!pickedFile || pickedFile.length === 0) {
		return;
	}

	const raw = await vscode.workspace.fs.readFile(pickedFile[0]);
	const importedPinsGraph = parsePinsGraph(raw);

	if (!importedPinsGraph) {
		vscode.window.showErrorMessage('Code Pins: not a valid Code Pins file.');
		return;
	}

	activePinsGraphStore.setFileNodes(importedPinsGraph.fileNodes);
	graphPanel.show();
}

function parsePinsGraph(raw: Uint8Array): PinsGraph | undefined {
	try {
		const data = JSON.parse(Buffer.from(raw).toString('utf8')) as PinsGraph;
		return Array.isArray(data.fileNodes) ? data : undefined;
	} catch {
		return undefined;
	}
}
