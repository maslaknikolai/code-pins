import { ActivePinsGraphStore } from '../active-pins-graph-store';
import { DEFAULT_PINS_GRAPH_NAME, PinsGraphsStore } from '../pins-graphs-store';

export function loadActivePinsGraph(pinsGraphsStore: PinsGraphsStore, activePinsGraphStore: ActivePinsGraphStore): void {
	const name = pinsGraphsStore.getActiveGraphName();
	activePinsGraphStore.setGraph(name, pinsGraphsStore.getGraph(name) ?? []);
}

export function saveActivePinsGraph(pinsGraphsStore: PinsGraphsStore, activePinsGraphStore: ActivePinsGraphStore): void {
	pinsGraphsStore.saveGraph(activePinsGraphStore.getGraphName(), activePinsGraphStore.getFileNodes());
	pinsGraphsStore.setActiveGraphName(activePinsGraphStore.getGraphName());
}

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
