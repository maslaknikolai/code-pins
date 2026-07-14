import * as vscode from 'vscode';
import { FileNode } from '../shared/types';
import { DEFAULT_PINS_GRAPH_NAME } from './pins-graphs-store';


export class ActivePinsGraphStore {
	private graphName: string = DEFAULT_PINS_GRAPH_NAME;
	private fileNodes: FileNode[] = [];

	private readonly _onDidChange = new vscode.EventEmitter<void>();
	readonly onDidChange = this._onDidChange.event;

	getGraphName(): string {
		return this.graphName;
	}

	getFileNodes(): FileNode[] {
		return this.fileNodes;
	}

	setGraph(graphName: string, fileNodes: FileNode[]): void {
		if (graphName === this.graphName && JSON.stringify(fileNodes) === JSON.stringify(this.fileNodes)) {
			return;
		}
		this.graphName = graphName;
		this.fileNodes = fileNodes;
		this._onDidChange.fire();
	}

	setFileNodes(fileNodes: FileNode[]): void {
		this.setGraph(this.graphName, fileNodes);
	}
}
