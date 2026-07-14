import { sendStateToWebview } from './panel/sendStateToWebview';
import { createPinsGraph } from '../states/active-pins-graph-state';
import { AppCtx } from '../types';


export function createGraph(appCtx: AppCtx): void {
	const name = appCtx.pinsGraphsStore.getNextName('new graph');

	appCtx.activePinsGraphState.setPinsGraph(createPinsGraph(name));

	const panel = appCtx.vsCodePanelState.getPanel();
	if (panel) {
		sendStateToWebview(panel.webview, appCtx);
	}
}
