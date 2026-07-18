import * as vscode from 'vscode';
import { createActivePinsGraphIdStore } from './storage/active-pins-graph-id-store';
import { createLastActiveFilePathStore } from './storage/last-active-file-path-store';
import { createPinsGraphsStore } from './storage/pins-graphs-store';
import { createUndoSnapshotStore } from './storage/undo-snapshot-store';
import { createViewSettingsStore } from './storage/viewport-data-store';
import { AppCtx } from './types';
import { getRelativePath } from './utils/getRelativePath';

export function createAppCtx(vscodeContext: vscode.ExtensionContext): AppCtx {
	const activeEditor = vscode.window.activeTextEditor;

	return {
		pinsGraphsStore: createPinsGraphsStore(vscodeContext.workspaceState),
		activePinsGraphIdStore: createActivePinsGraphIdStore(vscodeContext.workspaceState),
		viewSettingsStore: createViewSettingsStore(vscodeContext.workspaceState),
		lastActiveFilePathStore: createLastActiveFilePathStore(
			activeEditor && getRelativePath(activeEditor.document.uri)
		),
		undoSnapshotStore: createUndoSnapshotStore(),
		vscodeContext,
		vscodePanel: undefined,
	};
}
