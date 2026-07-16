import { AppCtx } from '../types';
import { deleteGraphById } from './deleteGraphById';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

export async function removePinsGraph(appCtx: AppCtx, id: string): Promise<void> {
	const wasActive = getActiveGraph(appCtx)?.id === id;
	const deletedIndex = appCtx.pinsGraphsStore.get().findIndex((graph) => graph.id === id);

	await deleteGraphById(id, appCtx);

	if (!wasActive) {
		return;
	}

	const graphs = appCtx.pinsGraphsStore.get();
	const fallback = graphs[deletedIndex - 1] ?? graphs[deletedIndex];

	if (fallback) {
		setActiveGraph(fallback, appCtx);
	}
}
