import { AppCtx } from '../../types';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

export function removeFileNodesFromActiveGraph(filePaths: string[], appCtx: AppCtx): void {
	const activeGraph = getActiveGraph(appCtx);

	if (!activeGraph) {
		return;
	}

	setActiveGraph({
		...activeGraph,
		fileNodes: activeGraph.fileNodes.filter((node) => !filePaths.includes(node.filePath))
	}, appCtx);
}
