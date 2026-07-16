import { PinsGraph } from '../../shared/types';
import { AppCtx } from '../types';


export function updateGraph(pinsGraph: PinsGraph, { pinsGraphsStore }: AppCtx): Thenable<void> {
	const graphs = pinsGraphsStore.get();
	const index = graphs.findIndex((graph) => graph.id === pinsGraph.id);

	if (index === -1) {
		return Promise.resolve();
	}

	graphs[index] = pinsGraph;

	return pinsGraphsStore.set(graphs);
}
