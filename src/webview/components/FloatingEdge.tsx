import { BaseEdge, getStraightPath, useInternalNode, type EdgeProps } from '@xyflow/react';
import { getEdgeParams } from '../utils/getEdgeParams';

export const FLOATING_EDGE_TYPE = 'floating';

/** Straight edge between node borders along the shortest path. */
export function FloatingEdge({ id, source, target, markerEnd, style }: EdgeProps) {
	const sourceNode = useInternalNode(source);
	const targetNode = useInternalNode(target);

	if (!sourceNode || !targetNode) {
		return null;
	}

	const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);
	const [path] = getStraightPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty });

	return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />;
}
