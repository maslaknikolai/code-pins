import { AppCtx } from '../types';

export function loadActivePinsGraph({ pinsGraphsState, activePinsGraphState }: AppCtx): void {
	const name = pinsGraphsState.getActiveGraphName();
	activePinsGraphState.setGraph(name, pinsGraphsState.getGraph(name) ?? []);
}
