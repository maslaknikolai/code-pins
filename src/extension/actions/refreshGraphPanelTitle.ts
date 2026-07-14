import { AppCtx } from '../types';

/** Puts the active graph's name into the panel tab; no-op while the panel is closed. */
export function refreshGraphPanelTitle({ graphPanelState, activePinsGraphState }: AppCtx): void {
	const panel = graphPanelState.getPanel();
	if (panel) {
		panel.title = `Code Pins — ${activePinsGraphState.getGraphName()}`;
	}
}
