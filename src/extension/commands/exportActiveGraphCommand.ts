import * as vscode from 'vscode';
import { PinsGraphFile, SUPPORTED_PINS_GRAPH_FILE_VERSION } from '../../shared/types';
import { AppCtx } from '../types';

export const FILE_FILTERS = { 'Code Pins File': ['json'] };

export async function exportActiveGraphCommand({ activePinsGraphState }: AppCtx): Promise<void> {
	const target = await vscode.window.showSaveDialog({ filters: FILE_FILTERS });
	if (!target) {
		return;
	}
	const { id: _id, ...pinsGraph } = activePinsGraphState.getPinsGraph();
	const data: PinsGraphFile = {
		version: SUPPORTED_PINS_GRAPH_FILE_VERSION,
		pinsGraph,
	};
	await vscode.workspace.fs.writeFile(target, Buffer.from(JSON.stringify(data, null, '\t'), 'utf8'));
	vscode.window.setStatusBarMessage(`Code Pins: saved to ${target.fsPath}`, 3000);
}
