import { ActivePinsGraphStore } from '../active-pins-graph-store';
import { GraphPanel } from '../panel/graph-panel';
import { retryUnresolvedDefinitions } from '../retryUnresolvedDefinitions';

export function showPinsPanelCommand({
	activePinsGraphStore,
	graphPanel,
}: {
	activePinsGraphStore: ActivePinsGraphStore;
	graphPanel: GraphPanel;
}): void {
	graphPanel.show();
	retryUnresolvedDefinitions(activePinsGraphStore);
}
