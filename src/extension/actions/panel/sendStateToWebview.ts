import * as vscode from 'vscode';
import { ExtensionMessageType } from '../../../shared/messages';
import { AppCtx } from '../../types';
import { sendToWebview } from './sendToWebview';

export function sendStateToWebview(webview: vscode.Webview, { pinsGraphsStore, activePinsGraphState }: AppCtx): void {
	const activePinsGraph = activePinsGraphState.getPinsGraph();
	const graphs = pinsGraphsStore.getGraphs().map((graph) => graph.id === activePinsGraph.id ? activePinsGraph : graph);

	if (!graphs.some((graph) => graph.id === activePinsGraph.id)) {
		graphs.unshift(activePinsGraph);
	}

	sendToWebview(webview, {
		type: ExtensionMessageType.SetState,
		graphs,
		activeGraphId: activePinsGraph.id,
	});
}
