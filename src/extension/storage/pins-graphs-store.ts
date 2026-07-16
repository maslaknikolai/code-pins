import * as vscode from 'vscode';
import { PinsGraph } from '../../shared/types';
import { createWorkspaceStore, type WorkspaceStore } from './createWorkspaceStore';


const GRAPHS_KEY = 'codePins.graphs';

export type PinsGraphsStore = WorkspaceStore<PinsGraph[]>;

export function createPinsGraphsStore(workspaceState: vscode.Memento): PinsGraphsStore {
	return createWorkspaceStore(workspaceState, GRAPHS_KEY, []);
}
