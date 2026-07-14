import { ActivePinsGraphStore } from '../active-pins-graph-store';

export function clearActiveGraphCommand({ activePinsGraphStore }: { activePinsGraphStore: ActivePinsGraphStore }): void {
	activePinsGraphStore.setFileNodes([]);
}
