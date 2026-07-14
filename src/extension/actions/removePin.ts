import { ActivePinsGraphState } from '../states/active-pins-graph-state';

export function removePin(activePinsGraphState: ActivePinsGraphState, id: string): void {
	const fileNodes = activePinsGraphState.getFileNodes()
		.map((node) => ({ ...node, pins: node.pins.filter((pin) => pin.id !== id) }))
		.filter((node) => node.pins.length > 0);
	activePinsGraphState.setFileNodes(fileNodes);
}
