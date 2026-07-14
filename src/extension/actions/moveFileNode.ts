import { ActivePinsGraphState } from '../states/active-pins-graph-state';

export function moveFileNode(activePinsGraphState: ActivePinsGraphState, filePath: string, x: number, y: number): void {
	activePinsGraphState.setFileNodes(
		activePinsGraphState.getPinsGraph().fileNodes
			.map((node) => node.filePath === filePath ? { ...node, x, y } : node
		)
	);
}
