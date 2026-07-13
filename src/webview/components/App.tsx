import {
	applyNodeChanges,
	Background,
	Controls,
	MarkerType,
	ReactFlow,
	type CoordinateExtent,
	type Edge,
	type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import { MAP_FIELD, WebviewMessageType } from '../../shared/types';
import { flowNodesAtom, selectedSymbolAtom } from '../atoms';
import { checkIsSameSymbol } from '../utils/checkIsSameSymbol';
import { useEvent } from '../hooks/useEvent';
import { useSubscribeForExtensionMessages } from '../hooks/useExtensionMessages';
import type { FileFlowNode } from '../types';
import { sendToExtension } from '../utils/vscodeApi';
import { FileNodeView } from './FileNodeView';
import { FLOATING_EDGE_TYPE, FloatingEdge } from './FloatingEdge';

const nodeTypes = {
	file: FileNodeView
};

const edgeTypes = {
	[FLOATING_EDGE_TYPE]: FloatingEdge
};

const fieldExtent: CoordinateExtent = [
	[0, 0],
	[MAP_FIELD.width, MAP_FIELD.height],
];

const GRID_SIZE = 20;

const SELECTED_EDGE_COLOR = 'var(--vscode-focusBorder, #007fd4)';

export function App() {
	const [nodes, setNodes] = useAtom(flowNodesAtom);
	const selectedSymbol = useAtomValue(selectedSymbolAtom);

	useEffect(() => {
		sendToExtension(WebviewMessageType.Ready);
	}, [])

	useSubscribeForExtensionMessages();

	/** Arrows are derived, never stored: a pin points at the node holding the pin its definition lives on. */
	const edges = useMemo(() => {
		const result: Edge[] = [];
		for (const { data } of nodes) {
			for (const pin of data.fileNode.pins) {
				// Pins whose definition is themselves (plain declarations) draw no arrow.
				if (!pin.symbolDefinitionPath || pin.symbolDefinitionPath === pin.pinPath) {
					continue;
				}
				const definitionNode = nodes.find(
					(n) =>
						n.data.fileNode.filePath !== data.fileNode.filePath &&
						n.data.fileNode.pins.some((p) => p.pinPath === pin.symbolDefinitionPath)
				);
				if (definitionNode) {
					const isSelected = Boolean(selectedSymbol && checkIsSameSymbol(selectedSymbol, pin));
					result.push({
						id: pin.id,
						type: FLOATING_EDGE_TYPE,
						source: data.fileNode.filePath,
						target: definitionNode.id,
						style: isSelected ? { stroke: SELECTED_EDGE_COLOR, strokeWidth: 2 } : undefined,
						markerEnd: isSelected
							? { type: MarkerType.ArrowClosed, color: SELECTED_EDGE_COLOR }
							: { type: MarkerType.ArrowClosed },
					});
				}
			}
		}
		return result;
	}, [nodes, selectedSymbol]);

	const onNodesChange = useEvent((changes: NodeChange<FileFlowNode>[]) => {
		setNodes((prev) => applyNodeChanges(changes, prev));
	});

	const onNodeDragStop = useEvent((_event: MouseEvent | TouchEvent, node: FileFlowNode) => {
		sendToExtension(WebviewMessageType.MoveFileNode, {
			filePath: node.id,
			x: node.position.x,
			y: node.position.y,
		});
	});

	const colorMode = document.body.classList.contains('vscode-light') ? 'light' : 'dark';

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			edgeTypes={edgeTypes}
			onNodesChange={onNodesChange}
			onNodeDragStop={onNodeDragStop}
			colorMode={colorMode}
			nodesConnectable={false}
			deleteKeyCode={null}
			snapToGrid
			snapGrid={[GRID_SIZE, GRID_SIZE]}
			translateExtent={fieldExtent}
			nodeExtent={fieldExtent}
		>

			<Background gap={GRID_SIZE} />
			<Controls />
		</ReactFlow>
	);
}
