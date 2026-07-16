import * as vscode from 'vscode';
import { AppCtx } from '../types';
import { getGraphById } from './getGraphById';
import { getNextGraphName } from './getNextGraphName';
import { saveOrAddGraph } from './saveOrAddGraph';


export async function renameGraph(appCtx: AppCtx, id: string): Promise<void> {
	const source = getGraphById(id, appCtx);

	if (!source) {
		return;
	}

	const input = await vscode.window.showInputBox({ prompt: `Rename graph "${source.label}"`, value: source.label });

	if (!input || input === source.label) {
		return;
	}

	await saveOrAddGraph({ ...source, label: getNextGraphName(appCtx.pinsGraphsStore, input) }, appCtx);
}
