import * as vscode from 'vscode';
import { VSCodePanelState } from './states/vscode-panel-state';
import { ActivePinsGraphIdStore } from './storage/active-pins-graph-id-store';
import { PinsGraphsStore } from './storage/pins-graphs-store';
import { ViewSettingsStore } from './storage/viewport-data-store';

export interface AppCtx {
	context: vscode.ExtensionContext;
	viewSettingsStore: ViewSettingsStore;
	pinsGraphsStore: PinsGraphsStore;
	activePinsGraphIdStore: ActivePinsGraphIdStore;
	vsCodePanelState: VSCodePanelState;
}
