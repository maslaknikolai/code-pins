import * as vscode from 'vscode';
import { ViewSettings } from '../../shared/types';
import { createWorkspaceStore, type WorkspaceStore } from './createWorkspaceStore';


const VIEW_SETTINGS_KEY = 'codePins.viewSettings';

export type ViewSettingsStore = WorkspaceStore<ViewSettings | undefined>;

export function createViewSettingsStore(workspaceState: vscode.Memento): ViewSettingsStore {
	return createWorkspaceStore(workspaceState, VIEW_SETTINGS_KEY, undefined);
}
