import { PinsGraph } from '../../shared/types';
import { AppCtx } from '../types';

export function saveOrAddGraph(pinsGraph: PinsGraph, { pinsGraphsStore }: AppCtx): Thenable<void> {
	const graphs = pinsGraphsStore.getGraphs();
	const index = graphs.findIndex((graph) => graph.id === pinsGraph.id);

	if (index === -1) {
		graphs.push(pinsGraph);
	} else {
		graphs[index] = pinsGraph;
	}

	return pinsGraphsStore.setGraphs(graphs);
}
