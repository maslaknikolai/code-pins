import * as vscode from 'vscode';
import { AppCtx } from '../types';
import { getGraphById } from './getGraphById';
import { getNextGraphName } from './getNextGraphName';
import { updateGraph } from './updateGraph';


export async function renameGraph(appCtx: AppCtx, id: string): Promise<void> {
	const source = getGraphById(id, appCtx);

	if (!source) {
		return;
	}

	const input = await vscode.window.showInputBox({ prompt: `Rename graph "${source.label}"`, value: source.label });

	if (!input || input === source.label) {
		return;
	}

	await updateGraph({ ...source, label: getNextGraphName(appCtx.pinsGraphsStore, input) }, appCtx);
}
