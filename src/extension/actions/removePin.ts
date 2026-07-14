import { ActivePinsGraphState } from '../states/active-pins-graph-state';

export function removePin(activePinsGraphState: ActivePinsGraphState, id: string): void {
	activePinsGraphState.setFileNodes(
		activePinsGraphState.getPinsGraph().fileNodes
			.map((node) => ({ ...node, pins: node.pins.filter((pin) => pin.id !== id) }))
			.filter((node) => node.pins.length > 0)
	);
}
