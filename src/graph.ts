import * as vscode from 'vscode';
import { Pin } from './types';


export class PinsStore {
	private nodes: Pin[] = [];

	private readonly _onDidChange = new vscode.EventEmitter<void>();
	readonly onDidChange = this._onDidChange.event;

	getNodes(): Pin[] {
		return this.nodes;
	}

	setNodes(nodes: Pin[], options?: { silent?: boolean }): void {
		this.nodes = nodes;
		if (!options?.silent) {
			this._onDidChange.fire();
		}
	}
}
