import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import { FileNode, Pin } from '../../types';

export function addPin(store: FileNodesStore, filePath: string, pin: Pin): void {
	const currentFileNodes = store.getFileNodes();
	const existingNode = currentFileNodes.find((node) => node.filePath === filePath);

	if (!existingNode) {
		store.setFileNodes([
			...currentFileNodes,
			{
				filePath,
				...nextPosition(currentFileNodes.length),
				pins: [pin]
			}
		]);
		return;
	}

	if (existingNode.pins.some((existing) => checkIsSameLine(existing, pin))) {
		vscode.window.setStatusBarMessage('Code Pins: already on the map', 2000);
		return;
	}

	const newFileNodes = currentFileNodes.map((node) => node === existingNode ? {
		...node,
		pins: [...node.pins, pin]
	} : node);

	store.setFileNodes(newFileNodes);
}

/** Silent: positions come from the webview itself, so no state echo back. */
export function moveFileNode(store: FileNodesStore, filePath: string, x: number, y: number): void {
	store.setFileNodes(
		store.getFileNodes().map((node) => (node.filePath === filePath ? { ...node, x, y } : node)),
		{ silent: true }
	);
}

/** Removes the pin; a file node with no pins left disappears from the map. */
export function removePin(store: FileNodesStore, id: string): void {
	const fileNodes = store.getFileNodes()
		.map((node) => ({ ...node, pins: node.pins.filter((pin) => pin.id !== id) }))
		.filter((node) => node.pins.length > 0);
	store.setFileNodes(fileNodes);
}

export function clearMap(store: FileNodesStore): void {
	store.setFileNodes([]);
}

/** Two pins are the same when they anchor the same kind on the same last line. */
function checkIsSameLine(a: Pin, b: Pin): boolean {
	return (
		a.kind === b.kind &&
		a.lines[a.lines.length - 1]?.line === b.lines[b.lines.length - 1]?.line
	);
}

const CORNER_MARGIN = 40;
const CASCADE_STEP = 30;
const CASCADE_LENGTH = 8;

/** New file nodes land in the top-left corner, cascading slightly so they don't fully overlap. */
function nextPosition(count: number): Pick<FileNode, 'x' | 'y'> {
	const offset = (count % CASCADE_LENGTH) * CASCADE_STEP;
	return {
		x: CORNER_MARGIN + offset,
		y: CORNER_MARGIN + offset,
	};
}
