import * as vscode from 'vscode';
import { PinsGraphFile, SUPPORTED_PINS_GRAPH_FILE_VERSION } from '../../shared/types';
import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';
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
	const pinsGraphFile = parsePinsGraphFile(raw);

	if (!pinsGraphFile) {
		vscode.window.showErrorMessage('Code Pins: not a valid Code Pins file.');
		return;
	}

	if (pinsGraphFile.version > SUPPORTED_PINS_GRAPH_FILE_VERSION) {
		vscode.window.showErrorMessage(`Code Pins: file version ${pinsGraphFile.version} is newer than supported version ${SUPPORTED_PINS_GRAPH_FILE_VERSION}.`);
		return;
	}

	activePinsGraphStore.setFileNodes(pinsGraphFile.pinsGraph.fileNodes);
	graphPanel.show();
}

function parsePinsGraphFile(raw: Uint8Array): PinsGraphFile | undefined {
	try {
		const data = JSON.parse(Buffer.from(raw).toString('utf8')) as PinsGraphFile;
		return Array.isArray(data.pinsGraph?.fileNodes) ? data : undefined;
	} catch {
		return undefined;
	}
}
