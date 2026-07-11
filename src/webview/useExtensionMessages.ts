import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { ExtensionMessageType, type ExtensionToWebviewMessage } from '../types';
import { pinsAtom } from './atoms';

export function useSubscribeForExtensionMessages(): void {
	const setPins = useSetAtom(pinsAtom);

	useEffect(() => {
		const onMessage = (event: MessageEvent<ExtensionToWebviewMessage>) => {
			if (event.data.type === ExtensionMessageType.SetState) {
				setPins(event.data.nodes);
			}
		};
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, [setPins]);
}
