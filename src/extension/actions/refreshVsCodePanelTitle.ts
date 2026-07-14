import { AppCtx } from '../types';


export function refreshVsCodePanelTitle({ vsCodePanelState, activePinsGraphState }: AppCtx): void {
	const panel = vsCodePanelState.getPanel();
	if (panel) {
		panel.title = `Code Pins — ${activePinsGraphState.getPinsGraph().label}`;
	}
}
