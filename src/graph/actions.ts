import * as vscode from 'vscode';
import { PinsStore } from '../graph';
import { Pin } from '../types';

export function addNode(pinsStore: PinsStore, node: Pin): void {
	const nodes = pinsStore.getNodes();
	if (nodes.some((existing) => pinsSameLine(existing, node))) {
		vscode.window.setStatusBarMessage('Code Pins: already on the map', 2000);
		return;
	}
	pinsStore.setNodes([...nodes, { ...node, ...nextPosition(nodes.length) }]);
}

/** Silent: positions come from the webview itself, so no state echo back. */
export function moveNode(pinsStore: PinsStore, id: string, x: number, y: number): void {
	pinsStore.setNodes(
		pinsStore.getNodes().map((node) => (node.id === id ? { ...node, x, y } : node)),
		{ silent: true }
	);
}

export function removeNode(pinsStore: PinsStore, id: string): void {
	const remaining = pinsStore.getNodes().filter((node) => node.id !== id);
	if (remaining.length !== pinsStore.getNodes().length) {
		pinsStore.setNodes(remaining);
	}
}

export function clearMap(pinsStore: PinsStore): void {
	pinsStore.setNodes([]);
}

/** Two pins are the same when they anchor the same kind on the same last line of a file. */
function pinsSameLine(a: Pin, b: Pin): boolean {
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
