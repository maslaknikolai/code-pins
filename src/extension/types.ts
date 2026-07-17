import * as vscode from 'vscode';
import { ActivePinsGraphIdStore } from './storage/active-pins-graph-id-store';
import { LastActiveFilePathStore } from './storage/last-active-file-path-store';
import { PinsGraphsStore } from './storage/pins-graphs-store';
import { ViewSettingsStore } from './storage/viewport-data-store';

export interface AppCtx {
	vscodeContext: vscode.ExtensionContext;
	viewSettingsStore: ViewSettingsStore;
	pinsGraphsStore: PinsGraphsStore;
	activePinsGraphIdStore: ActivePinsGraphIdStore;
	lastActiveFilePathStore: LastActiveFilePathStore;
	vscodePanel: vscode.WebviewPanel | undefined;
}
