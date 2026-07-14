import { randomUUID } from 'crypto';
import * as vscode from 'vscode';
import { ActivePinsGraphStore, DEFAULT_PINS_GRAPH_NAME } from '../stores/active-pins-graph-store';
import { PinsGraphFile, SUPPORTED_PINS_GRAPH_FILE_VERSION } from '../../shared/types';

export async function saveDevSnapshot(activePinsGraphStore: ActivePinsGraphStore): Promise<void> {
	const root = vscode.workspace.workspaceFolders?.[0]?.uri;
	if (!root) {
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
	await vscode.workspace.fs.writeFile(
		vscode.Uri.joinPath(root, 'dev.code-pins.json'),
		Buffer.from(JSON.stringify(data, null, '\t'), 'utf8')
	);
}
