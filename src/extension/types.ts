import * as vscode from 'vscode';
import { VSCodePanelState } from './states/vscode-panel-state';
import { ActivePinsGraphState } from './states/active-pins-graph-state';
import { ViewportCenterState } from './states/viewport-center-state';
import { ActivePinsGraphIdStore } from './storage/active-pins-graph-id-store';
import { PinsGraphsStore } from './storage/pins-graphs-store';

export interface AppCtx {
	context: vscode.ExtensionContext;
	activePinsGraphState: ActivePinsGraphState;
	viewportCenterState: ViewportCenterState;
	pinsGraphsStore: PinsGraphsStore;
	activePinsGraphIdStore: ActivePinsGraphIdStore;
	vsCodePanelState: VSCodePanelState;
}
