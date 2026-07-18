import * as vscode from 'vscode';
import { AppCtx } from '../../types';
import { getGraphById } from './getGraphById';
import { serializePinsGraph } from './serializePinsGraph';

export async function copyGraphAsText(id: string, appCtx: AppCtx): Promise<void> {
	const source = getGraphById(id, appCtx);

	if (!source) {
		return;
	}

	await vscode.env.clipboard.writeText(serializePinsGraph(source));
	vscode.window.setStatusBarMessage(`Code Pins: copied "${source.label}" to clipboard`, 1000);
}
