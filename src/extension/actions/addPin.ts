import * as vscode from 'vscode';
import { Coords, FileNode, Pin, ViewSettings } from '../../shared/types';
import { AppCtx } from '../types';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

export function addPin(appCtx: AppCtx, filePath: string, pin: Pin): void {
	const activeGraph = getActiveGraph(appCtx);

	if (!activeGraph) {
		return;
	}

	const currentFileNodes = activeGraph.fileNodes;
	const existingNode = currentFileNodes.find((node) => node.filePath === filePath);

	if (!existingNode) {
		const viewSettings = appCtx.viewSettingsStore.get();

		const newFileNode: FileNode = {
			filePath,
			position: nextPosition(viewSettings),
			pins: [pin]
		};

		const newFileNodes = [ ...currentFileNodes, newFileNode ];
		console.log('Code Pins: adding new node for pin', {newFileNodes});
		setActiveGraph({ ...activeGraph, fileNodes: newFileNodes }, appCtx);
		return;
	}

	const isPinAlreadyExist = existingNode.pins.some((existing) => existing.pinPath === pin.pinPath);

	if (isPinAlreadyExist) {
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

	setActiveGraph({ ...activeGraph, fileNodes: newFileNodes }, appCtx);
}


const CORNER_MARGIN = 40;

/**
 * `ViewSettings.position` is React Flow's viewport transform, where
 * `screen = flow * zoom + position`. Inverting it gives the flow coords currently
 * visible in the top-left corner; CORNER_MARGIN stays a screen-space offset.
 */
function nextPosition(viewSettings?: ViewSettings): Coords {
	const position = viewSettings?.position;

	if (!position) {
		return {
			x: CORNER_MARGIN,
			y: CORNER_MARGIN
		};
	}

	const zoom = viewSettings?.zoom || 1;

	return {
		x: (CORNER_MARGIN - position.x) / zoom,
		y: (CORNER_MARGIN - position.y) / zoom,
	};
}
