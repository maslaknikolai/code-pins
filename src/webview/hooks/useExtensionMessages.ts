import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { ExtensionMessageType, type ExtensionToWebviewMessage } from '../../shared/messages';
import { activeFilePathAtom, activeGraphIdAtom, flowNodesAtom, allGraphsAtom } from '../atoms';
import { toFlowNode } from '../utils/flowNodes';

export function useSubscribeForExtensionMessages(): void {
	const setNodes = useSetAtom(flowNodesAtom);
	const setActiveFilePath = useSetAtom(activeFilePathAtom);
	const setGraphs = useSetAtom(allGraphsAtom);
	const setActiveGraphId = useSetAtom(activeGraphIdAtom);

	useEffect(() => {
		const onMessage = (event: MessageEvent<ExtensionToWebviewMessage>) => {
			if (event.data.type === ExtensionMessageType.SetState) {
				const { graphs, activeGraphId } = event.data;
				const activeGraph = graphs.find((graph) => graph.id === activeGraphId);
				setNodes(activeGraph?.fileNodes?.map(toFlowNode) || []);
				setGraphs(graphs);
				setActiveGraphId(activeGraphId);
			}
			if (event.data.type === ExtensionMessageType.SetActiveFile) {
				setActiveFilePath(event.data.filePath);
			}
		};
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, [setNodes, setActiveFilePath, setGraphs, setActiveGraphId]);
}
