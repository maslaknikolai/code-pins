import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';
import { PinsGraphsStore } from './pins-graphs-store';

/** Autosave: the active graph in workspaceState always mirrors the activePinsGraphStore. */
export function saveActivePinsGraph(pinsGraphsStore: PinsGraphsStore, activePinsGraphStore: ActivePinsGraphStore): void {
	pinsGraphsStore.saveGraph(activePinsGraphStore.getGraphName(), activePinsGraphStore.getFileNodes());
	pinsGraphsStore.setActiveGraphName(activePinsGraphStore.getGraphName());
}
