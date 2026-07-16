import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useSetAtom } from 'jotai';
import { ExtensionMessageType, WebviewMessageType, type ExtensionToWebviewMessage } from '../../shared/messages';
import { activeFilePathAtom, activeGraphAtom, flowNodesAtom, allGraphsAtom, viewSettingsAtom } from '../atoms';
import { toFlowNode } from '../utils/flowNodes';
import { sendToExtension } from '../utils/vscodeApi';

/** made as component to have access to ReactFlow */
export function ExtensionMessageHandler() {
	const { setViewport } = useReactFlow();
	const setNodes = useSetAtom(flowNodesAtom);
	const setActiveFilePath = useSetAtom(activeFilePathAtom);
	const setGraphs = useSetAtom(allGraphsAtom);
	const setActiveGraph = useSetAtom(activeGraphAtom);
	const setViewSettings = useSetAtom(viewSettingsAtom);

	useEffect(() => {
		const onMessage = (event: MessageEvent<ExtensionToWebviewMessage>) => {

			if (event.data.type === ExtensionMessageType.SetInitialState) {
				const { viewSettings } = event.data;
				setViewSettings(viewSettings);
                console.log('Code Pins: ExtensionMessageType.SetInitialState', viewSettings);

                setTimeout(() => {
                    if (viewSettings?.zoom && viewSettings?.position) {
                        setViewport({
                            x: viewSettings.position.x,
                            y: viewSettings.position.y,
                            zoom: viewSettings.zoom
                        });
                    }
                }, 100);
                return;
            }

            if (event.data.type === ExtensionMessageType.SetGraphs) {
                const { graphs, activeGraph } = event.data;
                setNodes(activeGraph?.fileNodes?.map(toFlowNode) || []);
                setGraphs(graphs);
				setActiveGraph(activeGraph);
				return;
			}

			if (event.data.type === ExtensionMessageType.SetActiveFile) {
				setActiveFilePath(event.data.filePath);
				return;
			}

		};
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, [setNodes, setActiveFilePath, setGraphs, setActiveGraph, setViewSettings, setViewport]);

	useEffect(() => {
		sendToExtension({ type: WebviewMessageType.Ready });
	}, []);

	return null;
}
