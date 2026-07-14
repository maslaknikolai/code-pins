import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';

export function removeFileNode(activePinsGraphStore: ActivePinsGraphStore, filePath: string): void {
	activePinsGraphStore.setFileNodes(activePinsGraphStore.getFileNodes().filter((node) => node.filePath !== filePath));
}
