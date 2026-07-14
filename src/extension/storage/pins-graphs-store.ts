import * as vscode from 'vscode';
import { PinsGraph } from '../../shared/types';


const GRAPHS_KEY = 'codePins.graphs';

export class PinsGraphsStore {
	private readonly _onDidChange = new vscode.EventEmitter<void>();
	readonly onDidChange = this._onDidChange.event;

	constructor(private readonly workspaceState: vscode.Memento) {}

	getNextName(label: string): string {
		const base = label.replace(/ \(\d+\)$/, '');
		const existingNames = this.getGraphs().map((graph) => graph.label);

		if (!existingNames.includes(base)) {
			return base;
		}

		let counter = 2;
		while (existingNames.includes(`${base} (${counter})`)) {
			counter++;
		}
		return `${base} (${counter})`;
	}

	getGraphById(id: string): PinsGraph | undefined {
		return this.getGraphs().find((graph) => graph.id === id);
	}

	saveGraph(pinsGraph: PinsGraph): Thenable<void> {
		const graphs = this.getGraphs();
		const index = graphs.findIndex((graph) => graph.id === pinsGraph.id);

		if (index === -1) {
			graphs.push(pinsGraph);
		} else {
			graphs[index] = pinsGraph;
		}

		const updated = this.workspaceState.update(GRAPHS_KEY, graphs);
		this._onDidChange.fire();
		return updated;
	}

	deleteGraphById(id: string): Thenable<void> {
		const updated = this.workspaceState.update(GRAPHS_KEY, this.getGraphs().filter((graph) => graph.id !== id));
		this._onDidChange.fire();
		return updated;
	}

	getGraphs(): PinsGraph[] {
		return this.workspaceState.get<PinsGraph[]>(GRAPHS_KEY) ?? [];
	}
}
