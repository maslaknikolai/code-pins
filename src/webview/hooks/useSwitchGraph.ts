import { useAtomValue } from 'jotai';
import { WebviewMessageType } from '../../shared/messages';
import { activeGraphAtom } from '../atoms';
import { sendToExtension } from '../utils/vscodeApi';
import { useEvent } from './useEvent';


export function useSwitchGraph() {
	const activeGraph = useAtomValue(activeGraphAtom);

	return useEvent((id: string) => {
		if (id === activeGraph?.id) {
			return;
		}

		sendToExtension({ type: WebviewMessageType.SwitchGraph, id });
	});
}
