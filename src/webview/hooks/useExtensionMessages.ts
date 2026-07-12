import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { ExtensionMessageType, type ExtensionToWebviewMessage } from '../../types';
import { flowNodesAtom } from '../atoms';
import { toFlowNode } from '../utils/flowNodes';

export function useSubscribeForExtensionMessages(): void {
	const setNodes = useSetAtom(flowNodesAtom);

	useEffect(() => {
		const onMessage = (event: MessageEvent<ExtensionToWebviewMessage>) => {
			if (event.data.type === ExtensionMessageType.SetState) {
				setNodes(event.data.fileNodes.map(toFlowNode));
			}
		};
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, [setNodes]);
}
