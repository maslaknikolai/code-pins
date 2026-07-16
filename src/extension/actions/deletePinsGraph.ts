import { AppCtx } from '../types';
import { createPinsGraph, DEFAULT_PINS_GRAPH_NAME } from './createPinsGraph';
import { deleteGraphById } from './deleteGraphById';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

export async function deletePinsGraph(appCtx: AppCtx, id: string): Promise<void> {
	const wasActive = getActiveGraph(appCtx)?.id === id;
	const deletedIndex = appCtx.pinsGraphsStore.getGraphs().findIndex((graph) => graph.id === id);

	await deleteGraphById(id, appCtx);

	if (!wasActive) {
		return;
	}

	const graphs = appCtx.pinsGraphsStore.getGraphs();
	const fallback = graphs[deletedIndex - 1] ?? graphs[deletedIndex];

	setActiveGraph(fallback ?? createPinsGraph(DEFAULT_PINS_GRAPH_NAME), appCtx);
}
