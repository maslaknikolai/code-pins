import {
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
import { WebviewMessageType } from '../types';
import { pinsAtom } from './atoms';
import { applyChangesToPins, toFlowNode, type PinFlowNode } from './flowNodes';
import { PinNode } from './PinNode';
import { useEvent } from './useEvent';
import { useSubscribeForExtensionMessages } from './useExtensionMessages';
import { vscode } from './vscodeApi';

const nodeTypes = { pin: PinNode };

export function App() {
	const [pins, setPins] = useAtom(pinsAtom);

	useEffect(() => {
		vscode.postMessage({ type: WebviewMessageType.Ready });
	}, [])

	useSubscribeForExtensionMessages();

	const nodes = useMemo(() => pins.map(toFlowNode), [pins]);

	/** Arrows are derived, never stored: reference → declaration with the same definitionKey. */
	const edges = useMemo(() => {
		const result: Edge[] = [];
		for (const pin of pins) {
			if (pin.kind !== 'reference') {
				continue;
			}
			const declaration = pins.find(
				(p) => p.kind === 'declaration' && p.definitionKey === pin.definitionKey
			);
			if (declaration) {
				result.push({
					id: pin.id,
					source: pin.id,
					target: declaration.id,
					markerEnd: { type: MarkerType.ArrowClosed },
				});
			}
		}
		return result;
	}, [pins]);

	const onNodesChange = useEvent((changes: NodeChange<PinFlowNode>[]) => {
		setPins((prev) => applyChangesToPins(changes, prev));
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
