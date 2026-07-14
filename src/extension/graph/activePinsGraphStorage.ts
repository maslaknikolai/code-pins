import { ActivePinsGraphStore } from '../active-pins-graph-store';
import { DEFAULT_PINS_GRAPH_NAME, PinsGraphsStore } from '../pins-graphs-store';

export function loadActivePinsGraph(pinsGraphsStore: PinsGraphsStore, activePinsGraphStore: ActivePinsGraphStore): void {
	activePinsGraphStore.setFileNodes(
		pinsGraphsStore.getGraph(
			pinsGraphsStore.getActiveGraphName()
		) ?? []
	);
}

/** Autosave: the active graph in workspaceState always mirrors the activePinsGraphStore. */
export function saveActivePinsGraph(pinsGraphsStore: PinsGraphsStore, activePinsGraphStore: ActivePinsGraphStore): void {
	pinsGraphsStore.saveGraph(pinsGraphsStore.getActiveGraphName(), activePinsGraphStore.getFileNodes());
}


export async function deletePinsGraph(
	pinsGraphsStore: PinsGraphsStore,
	activePinsGraphStore: ActivePinsGraphStore,
	name: string
): Promise<void> {
	const wasActive = pinsGraphsStore.getActiveGraphName() === name;
	await pinsGraphsStore.deleteGraph(name);

	if (wasActive) {
		const fallback = pinsGraphsStore.getGraphNames()[0] ?? DEFAULT_PINS_GRAPH_NAME;
		await pinsGraphsStore.setActiveGraphName(fallback);
		activePinsGraphStore.setFileNodes(pinsGraphsStore.getGraph(fallback) ?? []);
	}
}
