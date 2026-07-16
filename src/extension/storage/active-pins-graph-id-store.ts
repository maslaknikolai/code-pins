import * as vscode from 'vscode';
import { createWorkspaceStore, type WorkspaceStore } from './createWorkspaceStore';


const ACTIVE_GRAPH_ID_KEY = 'codePins.activeGraphId';

export type ActivePinsGraphIdStore = WorkspaceStore<string | undefined>;

export function createActivePinsGraphIdStore(workspaceState: vscode.Memento): ActivePinsGraphIdStore {
	return createWorkspaceStore(workspaceState, ACTIVE_GRAPH_ID_KEY, undefined);
}
