import * as vscode from 'vscode';
import { GraphNode } from './types';


export class PinsStore {
	private nodes: GraphNode[] = [];

	private readonly _onDidChange = new vscode.EventEmitter<void>();
	readonly onDidChange = this._onDidChange.event;

	getNodes(): GraphNode[] {
		return this.nodes;
	}

	setNodes(nodes: GraphNode[], options?: { silent?: boolean }): void {
		this.nodes = nodes;
		if (!options?.silent) {
			this._onDidChange.fire();
		}
	}
}
