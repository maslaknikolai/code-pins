import * as vscode from 'vscode';
import { Pin } from '../../shared/types';
import { addPinsToActiveGraph } from '../actions/activeGraph/addPinsToActiveGraph';
import { buildPinAt } from '../actions/buildPin';
import { createOrShowPanel } from '../actions/panel/createOrShowPanel';
import { AppCtx } from '../types';


export async function addActiveEditorSymbolReferencesCommand(appCtx: AppCtx) {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		return;
	}

	const locations = await vscode.commands.executeCommand<vscode.Location[] | undefined>(
		'vscode.executeReferenceProvider',
		editor.document.uri,
		editor.selection.active
	) ?? [];

	const items: { filePath: string; pin: Pin }[] = [];

	for (const location of locations) {
		const document = await vscode.workspace.openTextDocument(location.uri);
		const built = await buildPinAt(document, location.range.start);

		if (built) {
			items.push(built);
		}
	}

	const added = addPinsToActiveGraph(items, appCtx);
	vscode.window.setStatusBarMessage(`Code Pins: added ${added} reference${added === 1 ? '' : 's'}`, 3000);

	createOrShowPanel({}, appCtx);
}
