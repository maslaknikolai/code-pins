import { AppCtx } from '../../types';
import { deleteGraphById } from './deleteGraphById';
import { getActiveGraph } from '../activeGraph/getActiveGraph';
import { setActiveGraph } from '../activeGraph/setActiveGraph';

export async function removePinsGraph(id: string, appCtx: AppCtx): Promise<void> {
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
