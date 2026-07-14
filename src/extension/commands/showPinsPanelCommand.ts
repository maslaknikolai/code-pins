import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';
import { GraphPanel } from '../panel/graph-panel';
import { retryUnresolvedDefinitions } from '../actions/retryUnresolvedDefinitions';

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
