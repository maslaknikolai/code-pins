import { AppCtx } from '../types';

/** Autosave: the active graph in workspaceState always mirrors the activePinsGraphState. */
export function saveActivePinsGraph({ pinsGraphsState, activePinsGraphState }: AppCtx): void {
	pinsGraphsState.saveGraph(activePinsGraphState.getGraphName(), activePinsGraphState.getFileNodes());
	pinsGraphsState.setActiveGraphName(activePinsGraphState.getGraphName());
}
