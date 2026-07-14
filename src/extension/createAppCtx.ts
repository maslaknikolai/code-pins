import * as vscode from 'vscode';
import { VSCodePanelState } from './states/vscode-panel-state';
import { ActivePinsGraphState } from './states/active-pins-graph-state';
import { ViewportCenterState } from './states/viewport-center-state';
import { ActivePinsGraphIdStore } from './storage/active-pins-graph-id-store';
import { PinsGraphsStore } from './storage/pins-graphs-store';
import { AppCtx } from './types';

export function createAppCtx(context: vscode.ExtensionContext): AppCtx {
	const viewportCenterState = new ViewportCenterState();
	const pinsGraphsStore = new PinsGraphsStore(context.workspaceState);
	const activePinsGraphIdStore = new ActivePinsGraphIdStore(context.workspaceState);
	const activePinsGraphState = new ActivePinsGraphState(pinsGraphsStore, activePinsGraphIdStore);
	const vsCodePanelState = new VSCodePanelState();

	return {
		context,
		activePinsGraphState,
		viewportCenterState,
		pinsGraphsStore,
		activePinsGraphIdStore,
		vsCodePanelState
	};
}
