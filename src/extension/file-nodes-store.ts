import * as vscode from 'vscode';
import { FileNode } from '../shared/types';


export class FileNodesStore {
	private fileNodes: FileNode[] = [];

	private readonly _onDidChange = new vscode.EventEmitter<void>();
	readonly onDidChange = this._onDidChange.event;

	getFileNodes(): FileNode[] {
		return this.fileNodes;
	}

	setFileNodes(fileNodes: FileNode[]): void {
		if (JSON.stringify(fileNodes) === JSON.stringify(this.fileNodes)) {
			return;
		}
		this.fileNodes = fileNodes;
		this._onDidChange.fire();
	}
}
