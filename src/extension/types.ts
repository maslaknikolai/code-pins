import * as vscode from 'vscode';
import { GraphPanelState } from './panel/graph-panel-state';
import { ActivePinsGraphState } from './states/active-pins-graph-state';
import { ViewportCenterState } from './states/viewport-center-state';
import { PinsGraphsState } from './storage/pins-graphs-state';

export interface AppCtx {
	context: vscode.ExtensionContext;
	activePinsGraphState: ActivePinsGraphState;
	viewportCenterState: ViewportCenterState;
	pinsGraphsState: PinsGraphsState;
	graphPanelState: GraphPanelState;
}
