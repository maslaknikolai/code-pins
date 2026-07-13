import { ViewportPortal } from '@xyflow/react';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { flowNodesAtom } from '../atoms';
import { groupFileNodes } from '../utils/groupFileNodes';
import type { FileFlowNode } from '../types';

const PADDING = 16;

/** Until React Flow measures a node, assume the fixed w-90 width and a rough height. */
const FALLBACK_WIDTH = 360;
const FALLBACK_HEIGHT = 60;

/**
 * Grey outline around every group of nodes sharing a path prefix, with the
 * prefix written above the top-left corner. Positions come from the nodes
 * atom, so the bounds follow drags live.
 */
export function GroupOutlines() {
	const nodes = useAtomValue(flowNodesAtom);
	const groups = useMemo(() => groupFileNodes(nodes), [nodes]);

	return (
		<ViewportPortal>
			{groups.map((group) => {
				const { minX, minY, maxX, maxY } = bounds(group.nodes, PADDING * (group.nesting + 1));
				return (
					<div
						key={group.prefix}
						className="pointer-events-none absolute rounded-md border-2 border-(--vscode-editorWidget-border)"
						style={{
							transform: `translate(${minX}px, ${minY}px)`,
							width: maxX - minX,
							height: maxY - minY,
						}}
					>
						<span className="absolute -top-6 left-0 whitespace-nowrap font-(family-name:--vscode-editor-font-family) text-(length:--vscode-editor-font-size) opacity-60">
							{group.prefix}
						</span>
					</div>
				);
			})}
		</ViewportPortal>
	);
}

function bounds(nodes: FileFlowNode[], padding: number) {
	return {
		minX: Math.min(...nodes.map((n) => n.position.x)) - padding,
		minY: Math.min(...nodes.map((n) => n.position.y)) - padding,
		maxX: Math.max(...nodes.map((n) => n.position.x + (n.measured?.width ?? FALLBACK_WIDTH))) + padding,
		maxY: Math.max(...nodes.map((n) => n.position.y + (n.measured?.height ?? FALLBACK_HEIGHT))) + padding,
	};
}
