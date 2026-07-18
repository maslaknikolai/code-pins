import { useAtomValue } from 'jotai';
import { activeGraphAtom, allGraphsAtom } from '../atoms';
import { useEvent } from './useEvent';
import { useSwitchGraph } from './useSwitchGraph';


export function useSelectGraphByOffset() {
	const graphs = useAtomValue(allGraphsAtom);
	const activeGraph = useAtomValue(activeGraphAtom);
	const currentIndex = graphs.findIndex((graph) => graph.id === activeGraph?.id);
	const switchGraph = useSwitchGraph();

	const selectGraphByOffset = useEvent((offset: number) => {
		const next = currentIndex === -1 ? undefined : graphs[currentIndex + offset];

		if (next) {
			switchGraph(next.id);
		}
	});

	return {
		selectGraphByOffset,
		canSelectPrev: currentIndex > 0,
		canSelectNext: currentIndex !== -1 && currentIndex < graphs.length - 1,
	};
}
