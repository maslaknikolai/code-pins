import {
	applyNodeChanges,
	Background,
	Controls,
	MarkerType,
	ReactFlow,
	type Edge,
	type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { WebviewMessageType } from '../../types';
import { flowNodesAtom } from '../atoms';
import { useEvent } from '../hooks/useEvent';
import { useSubscribeForExtensionMessages } from '../hooks/useExtensionMessages';
import type { PinFlowNode } from '../types';
import { vscode } from '../utils/vscodeApi';
import { PinNode } from './PinNode';

const nodeTypes = { pin: PinNode };

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
			if (data.pin.kind !== 'reference') {
				continue;
			}
			const declaration = nodes.find(
				(n) => n.data.pin.kind === 'declaration' && n.data.pin.definitionKey === data.pin.definitionKey
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
		vscode.postMessage({ type: WebviewMessageType.MoveNode, id: node.id, x: node.position.x, y: node.position.y });
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
		>
			<Background />
			<Controls />
		</ReactFlow>
	);
}
