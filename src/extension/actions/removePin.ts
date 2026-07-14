import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';

export function removePin(activePinsGraphStore: ActivePinsGraphStore, id: string): void {
	const fileNodes = activePinsGraphStore.getFileNodes()
		.map((node) => ({ ...node, pins: node.pins.filter((pin) => pin.id !== id) }))
		.filter((node) => node.pins.length > 0);
	activePinsGraphStore.setFileNodes(fileNodes);
}
