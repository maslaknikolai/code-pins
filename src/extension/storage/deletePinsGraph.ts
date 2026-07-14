import { ActivePinsGraphState, DEFAULT_PINS_GRAPH_NAME } from '../states/active-pins-graph-state';
import { PinsGraphsState } from './pins-graphs-state';

export async function deletePinsGraph(
	pinsGraphsState: PinsGraphsState,
	activePinsGraphState: ActivePinsGraphState,
	name: string
): Promise<void> {
	const wasActive = activePinsGraphState.getGraphName() === name;
	await pinsGraphsState.deleteGraph(name);

	if (wasActive) {
		const fallback = pinsGraphsState.getGraphNames()[0] ?? DEFAULT_PINS_GRAPH_NAME;
		await pinsGraphsState.setActiveGraphName(fallback);
		activePinsGraphState.setGraph(fallback, pinsGraphsState.getGraph(fallback) ?? []);
	}
}
