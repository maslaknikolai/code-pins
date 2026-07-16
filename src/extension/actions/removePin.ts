import { AppCtx } from '../types';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

export function removePin(id: string, appCtx: AppCtx): void {
	const activeGraph = getActiveGraph(appCtx);

	if (!activeGraph) {
		return;
	}

	setActiveGraph({
		...activeGraph,
		fileNodes: activeGraph.fileNodes
			.map((node) => ({ ...node, pins: node.pins.filter((pin) => pin.id !== id) }))
			.filter((node) => node.pins.length > 0)
	}, appCtx);
}
