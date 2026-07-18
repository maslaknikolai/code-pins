import * as vscode from 'vscode';
import { Pin } from '../../shared/types';
import { addPinsToActiveGraph } from '../actions/activeGraph/addPinsToActiveGraph';
import { buildPinAt } from '../actions/buildPin';
import { createOrShowPanel } from '../actions/panel/createOrShowPanel';
import { AppCtx } from '../types';

/** Pins every reference of the symbol under the cursor — bulk version of addPin. */
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
		// // References can land outside the workspace (node_modules, lib files) — skip those.
		// if (!vscode.workspace.getWorkspaceFolder(location.uri)) {
		// 	continue;
		// }

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
