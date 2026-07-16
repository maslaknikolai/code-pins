import * as vscode from 'vscode';


const ACTIVE_GRAPH_ID_KEY = 'codePins.activeGraphId';

export function createActivePinsGraphIdStore(workspaceState: vscode.Memento) {
	const onDidChangeEmitter = new vscode.EventEmitter<void>();

	return {
		onDidChange: onDidChangeEmitter.event,

		get(): string | undefined {
			return workspaceState.get<string>(ACTIVE_GRAPH_ID_KEY);
		},

		set(id: string): Thenable<void> {
			const updated = workspaceState.update(ACTIVE_GRAPH_ID_KEY, id);
			onDidChangeEmitter.fire();
			return updated;
		}
	};
}

export type ActivePinsGraphIdStore = ReturnType<typeof createActivePinsGraphIdStore>;
