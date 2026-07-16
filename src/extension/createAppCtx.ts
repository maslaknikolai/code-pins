import * as vscode from 'vscode';
import { createLastAddedPinState } from './states/last-added-pin-state';
import { createVSCodePanelState } from './states/vscode-panel-state';
import { createActivePinsGraphIdStore } from './storage/active-pins-graph-id-store';
import { createPinsGraphsStore } from './storage/pins-graphs-store';
import { createViewSettingsStore } from './storage/viewport-data-store';
import { createPinsGraph, DEFAULT_PINS_GRAPH_NAME } from './actions/createPinsGraph';
import { setActiveGraph } from './actions/setActiveGraph';
import { AppCtx } from './types';

export function createAppCtx(context: vscode.ExtensionContext): AppCtx {
	const appCtx: AppCtx = {
		context,
		pinsGraphsStore: createPinsGraphsStore(context.workspaceState),
		activePinsGraphIdStore: createActivePinsGraphIdStore(context.workspaceState),
		viewSettingsStore: createViewSettingsStore(context.workspaceState),
		vsCodePanelState: createVSCodePanelState(),
		lastAddedPinState: createLastAddedPinState()
	};

	if (!appCtx.activePinsGraphIdStore.get()) {
		setActiveGraph(createPinsGraph(DEFAULT_PINS_GRAPH_NAME), appCtx);
	}

	return appCtx;
}
