import * as vscode from 'vscode';
import { PinsGraph } from '../../shared/types';


const GRAPHS_KEY = 'codePins.graphs';

export function createPinsGraphsStore(workspaceState: vscode.Memento) {
	const onDidChangeEmitter = new vscode.EventEmitter<void>();

	return {
		onDidChange: onDidChangeEmitter.event,

		getGraphs: (): PinsGraph[] => workspaceState.get<PinsGraph[]>(GRAPHS_KEY) ?? [],

		setGraphs(graphs: PinsGraph[]): Thenable<void> {
			const updated = workspaceState.update(GRAPHS_KEY, graphs);
			onDidChangeEmitter.fire();
			return updated;
		}
	};
}

export type PinsGraphsStore = ReturnType<typeof createPinsGraphsStore>;
