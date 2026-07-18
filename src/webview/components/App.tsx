import {
	applyNodeChanges,
	Background,
	ReactFlow,
	type CoordinateExtent,
	type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAtom } from 'jotai';
import { WebviewMessageType } from '../../shared/messages';
import { MAP_FIELD } from '../../shared/types';
import { flowNodesAtom } from '../atoms';
import { useEdges } from '../hooks/useEdges';
import { useEvent } from '../hooks/useEvent';
import type { FileFlowNode } from '../types';
import { sendToExtension } from '../utils/vscodeApi';
import { FileNodeView } from './FileNodeView';
import { FLOATING_EDGE_TYPE, FloatingEdge } from './FloatingEdge';
import { GroupOutlines } from './GroupOutlines';
import { OptionsDrawer } from './options/OptionsDrawer';
import { ViewportSettingsReporter } from './ViewportSettingsReporter';
import { ExtensionMessageHandler } from './ExtensionMessageHandler';
import { FlowControls } from './FlowControls';
import { HotkeysHandler } from './HotkeysHandler';
import { useEndDragOnLeave } from '../hooks/useEndDragOnLeave';
import { useViewSettingsAutosave } from '../hooks/useViewSettingsAutosave';

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

	useViewSettingsAutosave()
	useEndDragOnLeave()

	const edges = useEdges();

	const onNodesChange = useEvent((changes: NodeChange<FileFlowNode>[]) => {
		setNodes((prev) => {
			const r = applyNodeChanges(changes, prev)
			console.log({changes, prev, r})
			return r
		});
	});

	const onNodeDragStop = useEvent((_event: MouseEvent | TouchEvent, _node: FileFlowNode, nodes: FileFlowNode[]) => {
		sendToExtension({
			type: WebviewMessageType.MoveFileNodes,
			moves: nodes.map((node) => ({
				filePath: node.id,
				position: node.position,
			})),
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
			minZoom={0.1}
			nodesConnectable={false}
			deleteKeyCode={null}
			snapToGrid
			snapGrid={[GRID_SIZE, GRID_SIZE]}
			translateExtent={fieldExtent}
			nodeExtent={fieldExtent}
		>

			<Background gap={GRID_SIZE} color={colorMode === 'light' ? '#7d7d88' : '#6b6b78'} />
			<FlowControls />
			<GroupOutlines />
			<ExtensionMessageHandler />
			<HotkeysHandler />
			<ViewportSettingsReporter />
			<OptionsDrawer />
		</ReactFlow>
	);
}
