import * as vscode from 'vscode';
import { GraphNode, MapFile } from './types';

const FILE_FILTERS = { 'Code Pins Map': ['json'] };

/** Holds the current map. Arrows are never stored — computed from definitionKey. */
export class GraphManager {
	private nodes: GraphNode[] = [];

	private readonly _onDidChange = new vscode.EventEmitter<void>();
	readonly onDidChange = this._onDidChange.event;

	getNodes(): GraphNode[] {
		return this.nodes;
	}

	add(node: GraphNode): void {
		const anchor = node.lines[node.lines.length - 1];
		const duplicate = this.nodes.find(
			(n) =>
				n.kind === node.kind &&
				n.filePath === node.filePath &&
				n.lines[n.lines.length - 1]?.line === anchor?.line
		);
		if (duplicate) {
			vscode.window.setStatusBarMessage('Code Pins: already on the map', 2000);
			return;
		}
		node.x = 40 + (this.nodes.length % 4) * 320;
		node.y = 40 + Math.floor(this.nodes.length / 4) * 160;
		this.nodes.push(node);
		this._onDidChange.fire();
	}

	move(id: string, x: number, y: number): void {
		const node = this.nodes.find((n) => n.id === id);
		if (node) {
			node.x = x;
			node.y = y;
		}
	}

	remove(id: string): void {
		const index = this.nodes.findIndex((n) => n.id === id);
		if (index !== -1) {
			this.nodes.splice(index, 1);
			this._onDidChange.fire();
		}
	}

	clear(): void {
		this.nodes = [];
		this._onDidChange.fire();
	}

	async save(): Promise<void> {
		const target = await vscode.window.showSaveDialog({ filters: FILE_FILTERS });
		if (!target) {
			return;
		}
		const data: MapFile = { version: 1, nodes: this.nodes };
		await vscode.workspace.fs.writeFile(target, Buffer.from(JSON.stringify(data, null, '\t'), 'utf8'));
		vscode.window.setStatusBarMessage(`Code Pins: map saved to ${target.fsPath}`, 3000);
	}

	async open(): Promise<boolean> {
		const picked = await vscode.window.showOpenDialog({ filters: FILE_FILTERS, canSelectMany: false });
		if (!picked || picked.length === 0) {
			return false;
		}
		const raw = await vscode.workspace.fs.readFile(picked[0]);
		let data: MapFile;
		try {
			data = JSON.parse(Buffer.from(raw).toString('utf8')) as MapFile;
		} catch {
			vscode.window.showErrorMessage('Code Pins: file is not a valid map.');
			return false;
		}
		if (!Array.isArray(data.nodes)) {
			vscode.window.showErrorMessage('Code Pins: file is not a valid map.');
			return false;
		}
		this.nodes = data.nodes;
		this._onDidChange.fire();
		return true;
	}
}
