import * as vscode from 'vscode';


const ACTIVE_GRAPH_ID_KEY = 'codePins.activeGraphId';

export class ActivePinsGraphIdStore {
	constructor(private readonly workspaceState: vscode.Memento) {}

	getId(): string | undefined {
		return this.workspaceState.get<string>(ACTIVE_GRAPH_ID_KEY);
	}

	setId(id: string): Thenable<void> {
		return this.workspaceState.update(ACTIVE_GRAPH_ID_KEY, id);
	}
}
