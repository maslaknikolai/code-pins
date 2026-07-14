import { FileNodesStore } from '../file-nodes-store';
import { DEFAULT_PINS_GRAPH_NAME, PinsGraphsStore } from '../pins-graphs-store';

export function loadActivePinsGraph(pinsGraphsStore: PinsGraphsStore, fileNodesStore: FileNodesStore): void {
	fileNodesStore.setFileNodes(
		pinsGraphsStore.getGraph(
			pinsGraphsStore.getActiveGraphName()
		) ?? []
	);
}

/** Autosave: the active graph in workspaceState always mirrors the fileNodesStore. */
export function saveActivePinsGraph(pinsGraphsStore: PinsGraphsStore, fileNodesStore: FileNodesStore): void {
	pinsGraphsStore.saveGraph(pinsGraphsStore.getActiveGraphName(), fileNodesStore.getFileNodes());
}


/** Deletes the graph; when it was the active one, falls back to the first remaining (or an empty default). */
export async function deletePinsGraph(
	pinsGraphsStore: PinsGraphsStore,
	fileNodesStore: FileNodesStore,
	name: string
): Promise<void> {
	const wasActive = pinsGraphsStore.getActiveGraphName() === name;
	await pinsGraphsStore.deleteGraph(name);

	if (wasActive) {
		const fallback = pinsGraphsStore.getGraphNames()[0] ?? DEFAULT_PINS_GRAPH_NAME;
		await pinsGraphsStore.setActiveGraphName(fallback);
		fileNodesStore.setFileNodes(pinsGraphsStore.getGraph(fallback) ?? []);
	}
}
