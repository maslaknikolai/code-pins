import * as vscode from 'vscode';
import { FileNode } from '../shared/types';

const GRAPHS_KEY = 'codePins.graphs';
const ACTIVE_GRAPH_KEY = 'codePins.activeGraphName';

export const DEFAULT_PINS_GRAPH_NAME = 'default';

type StoredGraphs = Record<string, FileNode[]>;

/** The only place that knows how graphs live in workspaceState. */
export class PinsGraphsStore {
	constructor(private readonly workspaceState: vscode.Memento) {}

	getActiveGraphName(): string {
		return this.workspaceState.get<string>(ACTIVE_GRAPH_KEY) ?? DEFAULT_PINS_GRAPH_NAME;
	}

	setActiveGraphName(name: string): Thenable<void> {
		return this.workspaceState.update(ACTIVE_GRAPH_KEY, name);
	}

	getGraphNames(): string[] {
		return Object.keys(this.getGraphs());
	}

	getGraph(name: string): FileNode[] | undefined {
		return this.getGraphs()[name];
	}

	saveGraph(name: string, fileNodes: FileNode[]): Thenable<void> {
		const graphs = this.getGraphs();
		graphs[name] = fileNodes;
		return this.workspaceState.update(GRAPHS_KEY, graphs);
	}

	deleteGraph(name: string): Thenable<void> {
		const graphs = this.getGraphs();
		delete graphs[name];
		return this.workspaceState.update(GRAPHS_KEY, graphs);
	}

	private getGraphs(): StoredGraphs {
		return this.workspaceState.get<StoredGraphs>(GRAPHS_KEY) ?? {};
	}
}
