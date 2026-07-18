import { Coords, Pin } from '../../../shared/types';
import { AppCtx } from '../../types';
import { createPinsGraph, DEFAULT_PINS_GRAPH_NAME } from '../graphs/createPinsGraph';
import { addPinToGraph, nextPosition } from './addPinToGraph';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

const COLUMN_STEP = 280;
const ROW_STEP = 200;

function pathDepth(filePath: string): number {
	return filePath.split(/[\\/]/).length;
}

/**
 * Lays out the new nodes from the viewport corner: one row per directory depth,
 * shallow paths on top, deeper ones below; same-depth nodes spread to the right.
 */
function layoutNewNodes(filePaths: string[], base: Coords): Map<string, Coords> {
	const sorted = [...filePaths].sort((a, b) => pathDepth(a) - pathDepth(b) || a.localeCompare(b));
	const minDepth = sorted.length ? pathDepth(sorted[0]) : 0;

	const positions = new Map<string, Coords>();
	const columnByDepth = new Map<number, number>();

	for (const filePath of sorted) {
		const depth = pathDepth(filePath);
		const column = columnByDepth.get(depth) ?? 0;
		columnByDepth.set(depth, column + 1);

		positions.set(filePath, {
			x: base.x + COLUMN_STEP * column,
			y: base.y + ROW_STEP * (depth - minDepth),
		});
	}

	return positions;
}

/** Adds all pins in one graph update (single broadcast, single undo step). Returns the added count. */
export function addPinsToActiveGraph(items: { filePath: string; pin: Pin }[], appCtx: AppCtx): number {
	let graph = getActiveGraph(appCtx) ?? createPinsGraph(DEFAULT_PINS_GRAPH_NAME);

	const base = nextPosition(appCtx.viewSettingsStore.get());
	const newFilePaths = [...new Set(items.map((item) => item.filePath))]
		.filter((filePath) => !graph.fileNodes.some((node) => node.filePath === filePath));
	const positions = layoutNewNodes(newFilePaths, base);

	let addedCount = 0;

	for (const { filePath, pin } of items) {
		const result = addPinToGraph(graph, filePath, pin, positions.get(filePath) ?? base);

		graph = result.graph;

		if (result.added) {
			addedCount++;
		}
	}

	if (addedCount > 0) {
		setActiveGraph(graph, appCtx);
	}

	return addedCount;
}
