import { Coords, FileNode } from '../../shared/types';
import { ActivePinsGraphState } from '../states/active-pins-graph-state';

export function moveFileNode(
	activePinsGraphState: ActivePinsGraphState,
	filePath: string,
	position: Coords
): void {
	activePinsGraphState.setFileNodes(
		activePinsGraphState.getPinsGraph().fileNodes
			.map((node) => node.filePath === filePath ?
				{ ...node, position } satisfies FileNode
				: node
			)
	);
}
