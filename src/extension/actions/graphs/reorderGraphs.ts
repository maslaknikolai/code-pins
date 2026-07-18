import { AppCtx } from '../../types';


export function reorderGraphs(ids: string[], { pinsGraphsStore }: AppCtx): void {
	const graphs = pinsGraphsStore.get();
	const byId = new Map(graphs.map((graph) => [graph.id, graph]));

	const ordered = ids
		.map((id) => byId.get(id))
		.filter((graph) => graph !== undefined);

	const missing = graphs.filter((graph) => !ids.includes(graph.id));

	pinsGraphsStore.set([...ordered, ...missing]);
}
