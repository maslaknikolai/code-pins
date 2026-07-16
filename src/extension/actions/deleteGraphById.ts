import { AppCtx } from '../types';

export function deleteGraphById(id: string, { pinsGraphsStore }: AppCtx): Thenable<void> {
	return pinsGraphsStore.setGraphs(pinsGraphsStore.getGraphs().filter((graph) => graph.id !== id));
}
