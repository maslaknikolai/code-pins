import * as vscode from 'vscode';
import { GraphPanelState } from './panel/graph-panel-state';
import { ActivePinsGraphState } from './states/active-pins-graph-state';
import { ViewportCenterState } from './states/viewport-center-state';
import { PinsGraphsState } from './storage/pins-graphs-state';
import { AppCtx } from './types';

export function createState(context: vscode.ExtensionContext): AppCtx {
	const activePinsGraphState = new ActivePinsGraphState();
	const viewportCenterState = new ViewportCenterState();
	const pinsGraphsState = new PinsGraphsState(context.workspaceState);
	const graphPanelState = new GraphPanelState();

	return {
		context,
		activePinsGraphState,
		viewportCenterState,
		pinsGraphsState,
		graphPanelState
	};
}
