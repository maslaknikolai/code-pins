import * as vscode from 'vscode';
import { createActivePinsGraphIdStore } from './storage/active-pins-graph-id-store';
import { createPinsGraphsStore } from './storage/pins-graphs-store';
import { createViewSettingsStore } from './storage/viewport-data-store';
import { AppCtx } from './types';

export function createAppCtx(vscodeContext: vscode.ExtensionContext): AppCtx {
	return {
		pinsGraphsStore: createPinsGraphsStore(vscodeContext.workspaceState),
		activePinsGraphIdStore: createActivePinsGraphIdStore(vscodeContext.workspaceState),
		viewSettingsStore: createViewSettingsStore(vscodeContext.workspaceState),
		vscodeContext,
		vscodePanel: undefined,
	};
}
