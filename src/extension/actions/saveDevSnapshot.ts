import * as vscode from 'vscode';
import { PinsGraphFile, SUPPORTED_PINS_GRAPH_FILE_VERSION } from '../../shared/types';
import { AppCtx } from '../types';
import { getActiveGraph } from './getActiveGraph';

export async function saveDevSnapshot(appCtx: AppCtx): Promise<void> {
	const root = vscode.workspace.workspaceFolders?.[0]?.uri;
	const activeGraph = getActiveGraph(appCtx);

	if (!root || !activeGraph) {
		return;
	}

	const { id: _id, ...pinsGraph } = activeGraph;
	const data: PinsGraphFile = {
		version: SUPPORTED_PINS_GRAPH_FILE_VERSION,
		pinsGraph,
	};
	await vscode.workspace.fs.writeFile(
		vscode.Uri.joinPath(root, 'dev.code-pins.json'),
		Buffer.from(JSON.stringify(data, null, '\t'), 'utf8')
	);
}
