import { randomUUID } from 'crypto';
import * as vscode from 'vscode';
import { FileNode, PinsGraph } from '../../shared/types';
import type { ActivePinsGraphIdStore } from '../storage/active-pins-graph-id-store';
import type { PinsGraphsStore } from '../storage/pins-graphs-store';

export const DEFAULT_PINS_GRAPH_NAME = 'default';

export function createPinsGraph(label: string, fileNodes: FileNode[] = []): PinsGraph {
	return {
		id: randomUUID(),
		label,
		fileNodes,
	};
}

export class ActivePinsGraphState {
	private pinsGraph: PinsGraph = createPinsGraph(DEFAULT_PINS_GRAPH_NAME);

	private readonly _onDidChange = new vscode.EventEmitter<void>();
	readonly onDidChange = this._onDidChange.event;

	constructor(
		private readonly pinsGraphsStore: PinsGraphsStore,
		private readonly activePinsGraphIdStore: ActivePinsGraphIdStore
	) {
		this.pinsGraphsStore.onDidChange(() => {
			const stored = this.pinsGraphsStore.getGraphById(this.pinsGraph.id);
			if (stored) {
				this.setPinsGraph(stored);
			}
		});
	}

	getPinsGraph(): PinsGraph {
		return this.pinsGraph;
	}

	getGraphName(): string {
		return this.pinsGraph.label;
	}

	getFileNodes(): FileNode[] {
		return this.pinsGraph.fileNodes;
	}

	setPinsGraph(pinsGraph: PinsGraph): void {
		if (JSON.stringify(pinsGraph) === JSON.stringify(this.pinsGraph)) {
			return;
		}
		this.pinsGraph = pinsGraph;
		this.saveToPinsGraphStoreStore();
	}

	setFileNodes(fileNodes: FileNode[]): void {
		this.setPinsGraph({ ...this.pinsGraph, fileNodes });
	}

	private saveToPinsGraphStoreStore(): void {
		this.pinsGraphsStore.saveGraph(this.pinsGraph);
		this.activePinsGraphIdStore.setId(this.pinsGraph.id);
		this._onDidChange.fire();
	}
}
