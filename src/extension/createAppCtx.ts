import * as vscode from 'vscode';
import { createActivePinsGraphIdStore } from './storage/active-pins-graph-id-store';
import { createPinsGraphsStore } from './storage/pins-graphs-store';
import { createViewSettingsStore } from './storage/viewport-data-store';
import { AppCtx } from './types';

export function createAppCtx(context: vscode.ExtensionContext): AppCtx {
	return {
		vscodeContext: context,
		pinsGraphsStore: createPinsGraphsStore(context.workspaceState),
		activePinsGraphIdStore: createActivePinsGraphIdStore(context.workspaceState),
		viewSettingsStore: createViewSettingsStore(context.workspaceState),
		vscodePanel: undefined
	};
}
