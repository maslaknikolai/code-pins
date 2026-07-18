import { Coords, FileNode } from '../../../shared/types';
import { AppCtx } from '../../types';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

export function moveActiveGraphFileNodes(
	moves: Array<{
		filePath: string;
		position: Coords
	}>,
	appCtx: AppCtx
): void {
	const activeGraph = getActiveGraph(appCtx);

	if (!activeGraph) {
		return;
	}

	const positionByFilePath = new Map(moves.map((move) => [move.filePath, move.position]));

	setActiveGraph({
		...activeGraph,
		fileNodes: activeGraph.fileNodes.map<FileNode>((node) => {
			const position = positionByFilePath.get(node.filePath);
			return position
				? { ...node, position }
				: node;
		})
	}, appCtx);
}
