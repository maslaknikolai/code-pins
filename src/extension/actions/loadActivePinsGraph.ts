import { createPinsGraph, DEFAULT_PINS_GRAPH_NAME } from '../states/active-pins-graph-state';
import { AppCtx } from '../types';

export function loadActivePinsGraph({ pinsGraphsStore, activePinsGraphIdStore, activePinsGraphState }: AppCtx): void {
	const id = activePinsGraphIdStore.getId();
	const stored = id ? pinsGraphsStore.getGraphById(id) : undefined;

	if (stored) {
		activePinsGraphState.setPinsGraph(stored);
	} else {
		activePinsGraphState.setPinsGraph(createPinsGraph(DEFAULT_PINS_GRAPH_NAME));
	}
}
