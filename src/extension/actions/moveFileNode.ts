import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';

export function moveFileNode(activePinsGraphStore: ActivePinsGraphStore, filePath: string, x: number, y: number): void {
	activePinsGraphStore.setFileNodes(
		activePinsGraphStore.getFileNodes().map((node) => (node.filePath === filePath ? { ...node, x, y } : node))
	);
}
