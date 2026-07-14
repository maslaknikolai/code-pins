import * as vscode from 'vscode';
import { Coords, FileNode, Pin } from '../../shared/types';
import { AppCtx } from '../types';

export function addPin(
	{ activePinsGraphState, viewportCenterState }: AppCtx,
	filePath: string,
	pin: Pin
): void {
	const viewportCenter = viewportCenterState.getCenter();
	const currentFileNodes = activePinsGraphState.getPinsGraph().fileNodes;
	const existingNode = currentFileNodes.find((node) => node.filePath === filePath);

	if (!existingNode) {
		const newFileNode: FileNode = {
			filePath,
			...nextPosition(currentFileNodes.length, viewportCenter),
			pins: [pin]
		};

		const newFileNodes = [ ...currentFileNodes, newFileNode ];
		console.log('Code Pins: adding new node for pin', {newFileNodes});
		activePinsGraphState.setFileNodes(newFileNodes);
		return;
	}

	if (existingNode.pins.some((existing) => existing.pinPath === pin.pinPath)) {
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

	activePinsGraphState.setFileNodes(newFileNodes);
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
