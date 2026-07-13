import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import { Coords, FileNode, Pin } from '../../shared/types';

export function addPin(
	store: FileNodesStore,
	filePath: string,
	pin: Pin,
	viewportCenter?: Coords
): void {
	const currentFileNodes = store.getFileNodes();
	const existingNode = currentFileNodes.find((node) => node.filePath === filePath);

	if (!existingNode) {
		const newFileNode: FileNode = {
			filePath,
			...nextPosition(currentFileNodes.length, viewportCenter),
			pins: [pin]
		};

		const newFileNodes = [ ...currentFileNodes, newFileNode ];
		console.log('Code Pins: adding new node for pin', {newFileNodes});
		store.setFileNodes(newFileNodes);
		return;
	}

	if (existingNode.pins.some((existing) => checkIsSamePin(existing, pin))) {
		vscode.window.setStatusBarMessage('Code Pins: already on the graph', 2000);
		return;
	}

	const newFileNodes = currentFileNodes.map((node) => {
		if (node !== existingNode) {
			return node;
		}
		const newNode: FileNode = {
			...node,
			pins: [...node.pins, pin]
		};

		return newNode;
	});

	console.log('Code Pins: adding pin', {existingNode, newFileNodes});

	store.setFileNodes(newFileNodes);
}

export function moveFileNode(store: FileNodesStore, filePath: string, x: number, y: number): void {
	store.setFileNodes(
		store.getFileNodes().map((node) => (node.filePath === filePath ? { ...node, x, y } : node))
	);
}

export function removeFileNode(store: FileNodesStore, filePath: string): void {
	store.setFileNodes(store.getFileNodes().filter((node) => node.filePath !== filePath));
}

export function removePin(store: FileNodesStore, id: string): void {
	const fileNodes = store.getFileNodes()
		.map((node) => ({ ...node, pins: node.pins.filter((pin) => pin.id !== id) }))
		.filter((node) => node.pins.length > 0);
	store.setFileNodes(fileNodes);
}

export function clearPinsGraph(store: FileNodesStore): void {
	store.setFileNodes([]);
}

/** Two pins are the same when they pin the same symbol occurrence. */
function checkIsSamePin(a: Pin, b: Pin): boolean {
	return a.pinPath === b.pinPath;
}

const CORNER_MARGIN = 40;
const CASCADE_STEP = 30;
const CASCADE_LENGTH = 8;
const NODE_WIDTH = 360;

/**
 * New file nodes land at the viewport center (top-left corner before the
 * webview has reported one), cascading slightly so they don't fully overlap.
 */
function nextPosition(count: number, viewportCenter?: Coords): Pick<FileNode, 'x' | 'y'> {
	const offset = (count % CASCADE_LENGTH) * CASCADE_STEP;
	if (!viewportCenter) {
		return { x: CORNER_MARGIN + offset, y: CORNER_MARGIN + offset };
	}
	return {
		x: Math.max(0, viewportCenter.x - NODE_WIDTH / 2 + offset),
		y: Math.max(0, viewportCenter.y - 40 + offset),
	};
}
