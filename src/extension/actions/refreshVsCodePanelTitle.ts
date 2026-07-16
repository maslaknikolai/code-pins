import { AppCtx } from '../types';
import { getActiveGraph } from './getActiveGraph';


export function refreshVsCodePanelTitle(appCtx: AppCtx): void {
	const panel = appCtx.vsCodePanelState.getPanel();

	if (!panel) {
		return;
	}

	const activeGraph = getActiveGraph(appCtx);

	panel.title = activeGraph ? `Code Pins — ${activeGraph.label}` : 'Code Pins';
}
