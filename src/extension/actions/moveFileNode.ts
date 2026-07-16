import { Coords, FileNode } from '../../shared/types';
import { AppCtx } from '../types';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

export function moveFileNode(filePath: string, position: Coords, appCtx: AppCtx): void {
	const activeGraph = getActiveGraph(appCtx);

	if (!activeGraph) {
		return;
	}

	setActiveGraph({
		...activeGraph,
		fileNodes: activeGraph.fileNodes
			.map((node) => node.filePath === filePath ?
				{ ...node, position } satisfies FileNode
				: node
			)
	}, appCtx);
}
