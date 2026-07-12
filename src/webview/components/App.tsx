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
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { MAP_FIELD, PinKind, WebviewMessageType } from '../../types';
import { flowNodesAtom } from '../atoms';
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

export function App() {
	const [nodes, setNodes] = useAtom(flowNodesAtom);

	useEffect(() => {
		sendToExtension(WebviewMessageType.Ready);
	}, [])

	useSubscribeForExtensionMessages();

	/** Arrows are derived, never stored: reference → declaration with the same definitionKey, across file nodes. */
	const edges = useMemo(() => {
		const result: Edge[] = [];
		for (const { data } of nodes) {
			for (const pin of data.fileNode.pins) {
				if (pin.kind !== PinKind.Reference || !pin.definitionKey) {
					continue;
				}
				const declarationNode = nodes.find(
					(n) =>
						n.data.fileNode.filePath !== data.fileNode.filePath &&
						n.data.fileNode.pins.some(
							(p) => p.kind === PinKind.Declaration && p.definitionKey === pin.definitionKey
						)
				);
				if (declarationNode) {
					result.push({
						id: pin.id,
						type: FLOATING_EDGE_TYPE,
						source: data.fileNode.filePath,
						target: declarationNode.id,
						markerEnd: { type: MarkerType.ArrowClosed },
					});
				}
			}
		}
		return result;
	}, [nodes]);

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
