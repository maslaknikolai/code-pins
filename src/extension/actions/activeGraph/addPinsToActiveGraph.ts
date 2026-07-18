import { Pin } from '../../../shared/types';
import { AppCtx } from '../../types';
import { createPinsGraph, DEFAULT_PINS_GRAPH_NAME } from '../graphs/createPinsGraph';
import { addPinToGraph, nextPosition } from './addPinToGraph';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

/** New nodes cascade from the viewport corner so they don't stack on one spot. */
const NEW_NODE_STAGGER = 40;

/** Adds all pins in one graph update (single broadcast, single undo step). Returns the added count. */
export function addPinsToActiveGraph(items: { filePath: string; pin: Pin }[], appCtx: AppCtx): number {
	let graph = getActiveGraph(appCtx) ?? createPinsGraph(DEFAULT_PINS_GRAPH_NAME);

	const basePosition = nextPosition(appCtx.viewSettingsStore.get());
	let addedCount = 0;
	let newNodeCount = 0;

	for (const { filePath, pin } of items) {
		const hadNode = graph.fileNodes.some((node) => node.filePath === filePath);
		const result = addPinToGraph(graph, filePath, pin, {
			x: basePosition.x + NEW_NODE_STAGGER * newNodeCount,
			y: basePosition.y + NEW_NODE_STAGGER * newNodeCount,
		});

		graph = result.graph;

		if (result.added) {
			addedCount++;

			if (!hadNode) {
				newNodeCount++;
			}
		}
	}

	if (addedCount > 0) {
		setActiveGraph(graph, appCtx);
	}

	return addedCount;
}
