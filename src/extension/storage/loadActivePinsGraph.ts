import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';
import { PinsGraphsStore } from './pins-graphs-store';

export function loadActivePinsGraph(pinsGraphsStore: PinsGraphsStore, activePinsGraphStore: ActivePinsGraphStore): void {
	const name = pinsGraphsStore.getActiveGraphName();
	activePinsGraphStore.setGraph(name, pinsGraphsStore.getGraph(name) ?? []);
}
