import { sendStateToWebview } from './panel/sendStateToWebview';
import { createPinsGraph, DEFAULT_PINS_GRAPH_NAME } from '../states/active-pins-graph-state';
import { AppCtx } from '../types';

export async function deletePinsGraph(appCtx: AppCtx, id: string): Promise<void> {
	const { pinsGraphsStore, activePinsGraphState } = appCtx;
	const wasActive = activePinsGraphState.getPinsGraph().id === id;
	const deletedIndex = pinsGraphsStore.getGraphs().findIndex((graph) => graph.id === id);
	await pinsGraphsStore.deleteGraphById(id);

	if (wasActive) {
		const graphs = pinsGraphsStore.getGraphs();
		const fallback = graphs[deletedIndex - 1] ?? graphs[deletedIndex];

		if (fallback) {
			activePinsGraphState.setPinsGraph(fallback);
		} else {
			activePinsGraphState.setPinsGraph(createPinsGraph(DEFAULT_PINS_GRAPH_NAME));
		}

		// Switching the active graph already sends state via the panel's onDidChange subscription.
		return;
	}

	const panel = appCtx.vsCodePanelState.getPanel();

	if (panel) {
		sendStateToWebview(panel.webview, appCtx);
	}
}
