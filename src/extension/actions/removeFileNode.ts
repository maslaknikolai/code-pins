import { ActivePinsGraphState } from '../states/active-pins-graph-state';

export function removeFileNode(activePinsGraphState: ActivePinsGraphState, filePath: string): void {
	activePinsGraphState.setFileNodes(
		activePinsGraphState.getPinsGraph().fileNodes
			.filter((node) => node.filePath !== filePath
		)
	);
}
