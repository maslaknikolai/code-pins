import { randomUUID } from 'crypto';
import * as vscode from 'vscode';
import { PinsGraphFile, SUPPORTED_PINS_GRAPH_FILE_VERSION } from '../../shared/types';
import { ActivePinsGraphStore, DEFAULT_PINS_GRAPH_NAME } from '../stores/active-pins-graph-store';

export const FILE_FILTERS = { 'Code Pins File': ['json'] };

export async function exportActiveGraphCommand(activePinsGraphStore: ActivePinsGraphStore): Promise<void> {
	const target = await vscode.window.showSaveDialog({ filters: FILE_FILTERS });
	if (!target) {
		return;
	}
	const data: PinsGraphFile = {
		version: SUPPORTED_PINS_GRAPH_FILE_VERSION,
		pinsGraph: {
			id: randomUUID(),
			isDefault: activePinsGraphStore.getGraphName() === DEFAULT_PINS_GRAPH_NAME,
			label: activePinsGraphStore.getGraphName(),
			fileNodes: activePinsGraphStore.getFileNodes(),
		},
	};
	await vscode.workspace.fs.writeFile(target, Buffer.from(JSON.stringify(data, null, '\t'), 'utf8'));
	vscode.window.setStatusBarMessage(`Code Pins: saved to ${target.fsPath}`, 3000);
}
