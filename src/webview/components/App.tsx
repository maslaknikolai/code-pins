import {
	applyNodeChanges,
	Background,
	Controls,
	MarkerType,
	ReactFlow,
	ViewportPortal,
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
import type { PinFlowNode } from '../types';
import { vscode } from '../utils/vscodeApi';
import { PinNode } from './PinNode';

const nodeTypes = {
	pin: PinNode
};

const fieldExtent: CoordinateExtent = [
	[0, 0],
	[MAP_FIELD.width, MAP_FIELD.height],
];

const GRID_SIZE = 20;

export function App() {
	const [nodes, setNodes] = useAtom(flowNodesAtom);

	useEffect(() => {
		vscode.postMessage({ type: WebviewMessageType.Ready });
	}, [])

	useSubscribeForExtensionMessages();

	/** Arrows are derived, never stored: reference → declaration with the same definitionKey. */
	const edges = useMemo(() => {
		const result: Edge[] = [];
		for (const { data } of nodes) {
			if (data.pin.kind !== PinKind.Reference) {
				continue;
			}
			const declaration = nodes.find(
				(n) => n.data.pin.kind === PinKind.Declaration && n.data.pin.definitionKey === data.pin.definitionKey
			);
			if (declaration) {
				result.push({
					id: data.pin.id,
					source: data.pin.id,
					target: declaration.id,
					markerEnd: { type: MarkerType.ArrowClosed },
				});
			}
		}
		return result;
	}, [nodes]);

	const onNodesChange = useEvent((changes: NodeChange<PinFlowNode>[]) => {
		setNodes((prev) => applyNodeChanges(changes, prev));
	});

	const onNodeDragStop = useEvent((_event: MouseEvent | TouchEvent, node: PinFlowNode) => {
		vscode.postMessage({ type: WebviewMessageType.MovePin, id: node.id, x: node.position.x, y: node.position.y });
	});

	const colorMode = document.body.classList.contains('vscode-light') ? 'light' : 'dark';

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
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
