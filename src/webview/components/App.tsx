import {
	applyNodeChanges,
	Background,
	Controls,
	ReactFlow,
	type CoordinateExtent,
	type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { MAP_FIELD, WebviewMessageType } from '../../shared/types';
import { flowNodesAtom } from '../atoms';
import { useSelectedPinHotkeys } from '../hooks/useSelectedPinHotkeys';
import { useEdges } from '../hooks/useEdges';
import { useEvent } from '../hooks/useEvent';
import { useSubscribeForExtensionMessages } from '../hooks/useExtensionMessages';
import type { FileFlowNode } from '../types';
import { sendToExtension } from '../utils/vscodeApi';
import { FileNodeView } from './FileNodeView';
import { FLOATING_EDGE_TYPE, FloatingEdge } from './FloatingEdge';
import { GroupOutlines } from './GroupOutlines';

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

	useSelectedPinHotkeys();
	useSubscribeForExtensionMessages();

	const edges = useEdges();

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
			<GroupOutlines />
		</ReactFlow>
	);
}
