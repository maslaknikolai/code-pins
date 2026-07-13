import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { ExtensionMessageType, type ExtensionToWebviewMessage } from '../../shared/messages';
import { activeFilePathAtom, flowNodesAtom } from '../atoms';
import { toFlowNode } from '../utils/flowNodes';

export function useSubscribeForExtensionMessages(): void {
	const setNodes = useSetAtom(flowNodesAtom);
	const setActiveFilePath = useSetAtom(activeFilePathAtom);

	useEffect(() => {
		const onMessage = (event: MessageEvent<ExtensionToWebviewMessage>) => {
			if (event.data.type === ExtensionMessageType.SetState) {
				setNodes(event.data.fileNodes.map(toFlowNode));
			}
			if (event.data.type === ExtensionMessageType.SetActiveFile) {
				setActiveFilePath(event.data.filePath);
			}
		};
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, [setNodes, setActiveFilePath]);
}
