import { Coords, FileNode, Pin, PinsGraph, ViewSettings } from '../../../shared/types';

/**
 * Pure add: appends the pin to its file's node, creating the node at
 * `newNodePosition` when missing. `added` is false for a duplicate pinPath.
 */
export function addPinToGraph(
	graph: PinsGraph,
	filePath: string,
	pin: Pin,
	newNodePosition: Coords
): { graph: PinsGraph; added: boolean } {
	const existingNode = graph.fileNodes.find((node) => node.filePath === filePath);

	if (!existingNode) {
		const newFileNode: FileNode = {
			filePath,
			position: newNodePosition,
			pins: [pin],
		};

		return {
			graph: { ...graph, fileNodes: [...graph.fileNodes, newFileNode] },
			added: true,
		};
	}

	if (existingNode.pins.some((existing) => existing.pinPath === pin.pinPath)) {
		return { graph, added: false };
	}

	return {
		graph: {
			...graph,
			fileNodes: graph.fileNodes.map((node) => node === existingNode
				? { ...node, pins: [...node.pins, pin] } satisfies FileNode
				: node
			),
		},
		added: true,
	};
}


const CORNER_MARGIN = 40;

/**
 * `ViewSettings.position` is React Flow's viewport transform, where
 * `screen = flow * zoom + position`. Inverting it gives the flow coords currently
 * visible in the top-left corner; CORNER_MARGIN stays a screen-space offset.
 */
export function nextPosition(viewSettings?: ViewSettings): Coords {
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
