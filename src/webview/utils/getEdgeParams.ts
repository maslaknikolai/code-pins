import type { InternalNode } from '@xyflow/react';

/**
 * Endpoints of the straight line between two nodes' centers, clipped to each
 * node's rectangle border — so the edge always takes the shortest path.
 */
export function getEdgeParams(source: InternalNode, target: InternalNode) {
	const sourcePoint = getNodeIntersection(source, target);
	const targetPoint = getNodeIntersection(target, source);
	return {
		sx: sourcePoint.x,
		sy: sourcePoint.y,
		tx: targetPoint.x,
		ty: targetPoint.y,
	};
}

/** Where the center-to-center line crosses the border of `node` towards `other`. */
function getNodeIntersection(node: InternalNode, other: InternalNode): { x: number; y: number } {
	const w = (node.measured.width ?? 0) / 2;
	const h = (node.measured.height ?? 0) / 2;

	const x2 = node.internals.positionAbsolute.x + w;
	const y2 = node.internals.positionAbsolute.y + h;
	const x1 = other.internals.positionAbsolute.x + (other.measured.width ?? 0) / 2;
	const y1 = other.internals.positionAbsolute.y + (other.measured.height ?? 0) / 2;

	const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
	const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
	const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
	const xx3 = a * xx1;
	const yy3 = a * yy1;

	return {
		x: w * (xx3 + yy3) + x2,
		y: h * (-xx3 + yy3) + y2,
	};
}
