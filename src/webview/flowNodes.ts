import type { Node, NodeChange } from '@xyflow/react';
import type { GraphNode } from '../types';

/** React Flow node carrying the pinned entity in its data. */
export type PinFlowNode = Node<{ pin: GraphNode }, 'pin'>;

export function toFlowNode(pin: GraphNode): PinFlowNode {
	return {
		id: pin.id,
		type: 'pin',
		position: { x: pin.x, y: pin.y },
		data: { pin },
	};
}

/** Maps React Flow position changes back onto the raw pins; other change kinds are irrelevant here. */
export function applyChangesToPins(changes: NodeChange<PinFlowNode>[], pins: GraphNode[]): GraphNode[] {
	let next = pins;
	for (const change of changes) {
		if (change.type === 'position' && change.position) {
			const { x, y } = change.position;
			next = next.map((pin) => (pin.id === change.id ? { ...pin, x, y } : pin));
		}
	}
	return next;
}
