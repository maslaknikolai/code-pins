import * as vscode from 'vscode';
import { GraphManager } from '../graph';
import { GraphNode } from '../types';

export function addNode(graph: GraphManager, node: GraphNode): void {
	const nodes = graph.getNodes();
	if (nodes.some((existing) => pinsSameLine(existing, node))) {
		vscode.window.setStatusBarMessage('Code Pins: already on the map', 2000);
		return;
	}
	graph.setNodes([...nodes, { ...node, ...nextPosition(nodes.length) }]);
}

/** Silent: positions come from the webview itself, so no state echo back. */
export function moveNode(graph: GraphManager, id: string, x: number, y: number): void {
	graph.setNodes(
		graph.getNodes().map((node) => (node.id === id ? { ...node, x, y } : node)),
		{ silent: true }
	);
}

export function removeNode(graph: GraphManager, id: string): void {
	const remaining = graph.getNodes().filter((node) => node.id !== id);
	if (remaining.length !== graph.getNodes().length) {
		graph.setNodes(remaining);
	}
}

export function clearMap(graph: GraphManager): void {
	graph.setNodes([]);
}

/** Two pins are the same when they anchor the same kind on the same last line of a file. */
function pinsSameLine(a: GraphNode, b: GraphNode): boolean {
	return (
		a.kind === b.kind &&
		a.filePath === b.filePath &&
		a.lines[a.lines.length - 1]?.line === b.lines[b.lines.length - 1]?.line
	);
}

/** Lays new pins out in a 4-column grid until the user drags them elsewhere. */
function nextPosition(count: number): { x: number; y: number } {
	return {
		x: 40 + (count % 4) * 320,
		y: 40 + Math.floor(count / 4) * 160,
	};
}
