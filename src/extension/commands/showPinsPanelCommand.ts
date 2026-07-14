import { FileNodesStore } from '../file-nodes-store';
import { GraphPanel } from '../panel/graph-panel';
import { retryUnresolvedDefinitions } from '../retryUnresolvedDefinitions';

export function showPinsPanelCommand({
	fileNodesStore,
	graphPanel,
}: {
	fileNodesStore: FileNodesStore;
	graphPanel: GraphPanel;
}): void {
	graphPanel.show();
	retryUnresolvedDefinitions(fileNodesStore);
}
