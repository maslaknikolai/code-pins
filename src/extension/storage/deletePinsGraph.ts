import { ActivePinsGraphStore, DEFAULT_PINS_GRAPH_NAME } from '../stores/active-pins-graph-store';
import { PinsGraphsStore } from './pins-graphs-store';

export async function deletePinsGraph(
	pinsGraphsStore: PinsGraphsStore,
	activePinsGraphStore: ActivePinsGraphStore,
	name: string
): Promise<void> {
	const wasActive = activePinsGraphStore.getGraphName() === name;
	await pinsGraphsStore.deleteGraph(name);

	if (wasActive) {
		const fallback = pinsGraphsStore.getGraphNames()[0] ?? DEFAULT_PINS_GRAPH_NAME;
		await pinsGraphsStore.setActiveGraphName(fallback);
		activePinsGraphStore.setGraph(fallback, pinsGraphsStore.getGraph(fallback) ?? []);
	}
}
