import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { WebviewMessageType } from '../../shared/messages';
import { activeGraphAtom } from '../atoms';
import { debounce } from '../utils/debounce';
import { sendToExtension } from '../utils/vscodeApi';
import { useEvent } from './useEvent';
import { useFitViewWithinField } from './useFitViewWithinField';


export function useSwitchGraph() {
	const activeGraph = useAtomValue(activeGraphAtom);
	const fitViewWithinField = useFitViewWithinField();
	const debouncedFit = useMemo(() => debounce(fitViewWithinField, 300), [fitViewWithinField]);

	return useEvent((id: string) => {
		if (id === activeGraph?.id) {
			return;
		}

		sendToExtension({ type: WebviewMessageType.SwitchGraph, id });
		debouncedFit();
	});
}
