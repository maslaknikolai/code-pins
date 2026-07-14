import { randomUUID } from 'crypto';
import * as vscode from 'vscode';
import { DEFAULT_PINS_GRAPH_NAME } from '../states/active-pins-graph-state';
import { PinsGraphFile, SUPPORTED_PINS_GRAPH_FILE_VERSION } from '../../shared/types';
import { AppCtx } from '../types';

export async function saveDevSnapshot({ activePinsGraphState }: AppCtx): Promise<void> {
	const root = vscode.workspace.workspaceFolders?.[0]?.uri;
	if (!root) {
		return;
	}
	const data: PinsGraphFile = {
		version: SUPPORTED_PINS_GRAPH_FILE_VERSION,
		pinsGraph: {
			id: randomUUID(),
			isDefault: activePinsGraphState.getGraphName() === DEFAULT_PINS_GRAPH_NAME,
			label: activePinsGraphState.getGraphName(),
			fileNodes: activePinsGraphState.getFileNodes(),
		},
	};
	await vscode.workspace.fs.writeFile(
		vscode.Uri.joinPath(root, 'dev.code-pins.json'),
		Buffer.from(JSON.stringify(data, null, '\t'), 'utf8')
	);
}
