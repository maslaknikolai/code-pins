import { AppCtx } from '../../types';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

export function removeFileNodeFromActiveGraph(filePath: string, appCtx: AppCtx): void {
	const activeGraph = getActiveGraph(appCtx);

	if (!activeGraph) {
		return;
	}

	setActiveGraph({
		...activeGraph,
		fileNodes: activeGraph.fileNodes.filter((node) => node.filePath !== filePath)
	}, appCtx);
}
