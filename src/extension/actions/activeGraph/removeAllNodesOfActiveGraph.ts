import { AppCtx } from '../../types';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

export function removeAllNodesOfActiveGraph(appCtx: AppCtx): void {
	const activeGraph = getActiveGraph(appCtx);

	if (!activeGraph) {
		return;
	}

	setActiveGraph({ ...activeGraph, fileNodes: [] }, appCtx);
}
