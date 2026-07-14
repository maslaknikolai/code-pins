import { sendStateToWebview } from './panel/sendStateToWebview';
import { createPinsGraph } from '../states/active-pins-graph-state';
import { AppCtx } from '../types';


export function cloneGraph(appCtx: AppCtx, id: string): void {
	const source = appCtx.pinsGraphsStore.getGraphById(id);

	if (!source) {
		return;
	}

	const name = appCtx.pinsGraphsStore.getNextName(source.label);

	appCtx.activePinsGraphState.setPinsGraph(createPinsGraph(name, structuredClone(source.fileNodes)));

	const panel = appCtx.vsCodePanelState.getPanel();

	if (panel) {
		sendStateToWebview(panel.webview, appCtx);
	}
}
