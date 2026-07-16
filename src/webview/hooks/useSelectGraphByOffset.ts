import { useAtomValue } from 'jotai';
import { WebviewMessageType } from '../../shared/messages';
import { activeGraphAtom, allGraphsAtom } from '../atoms';
import { sendToExtension } from '../utils/vscodeApi';
import { useEvent } from './useEvent';

/** Steps through `allGraphsAtom` in list order, without wrapping at the ends. */
export function useSelectGraphByOffset() {
	const graphs = useAtomValue(allGraphsAtom);
	const activeGraph = useAtomValue(activeGraphAtom);
	const currentIndex = graphs.findIndex((graph) => graph.id === activeGraph?.id);

	const selectGraphByOffset = useEvent((offset: number) => {
		const next = currentIndex === -1 ? undefined : graphs[currentIndex + offset];

		if (next) {
			sendToExtension({ type: WebviewMessageType.SwitchGraph, id: next.id });
		}
	});

	return {
		selectGraphByOffset,
		canSelectPrev: currentIndex > 0,
		canSelectNext: currentIndex !== -1 && currentIndex < graphs.length - 1,
	};
}
