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
 * Lays out the new nodes in a grid starting at the viewport corner.
 *
 * Each directory depth gets its own row: files at the project root land in the
 * top row, deeper files in rows below. Files of the same depth fill their row
 * left to right in alphabetical order.
 */
function layoutNewNodes(filePaths: string[], base: Coords): Map<string, Coords> {
	// Shallow paths first; alphabetical within the same depth so the order is stable.
	const sorted = [...filePaths].sort((a, b) =>
		pathDepth(a) - pathDepth(b) || a.localeCompare(b)
	);

	// Depths rarely start at 1 (e.g. everything lives under `src/`),
	// so the shallowest actual depth becomes row 0 — the top row.
	const shallowestDepth = sorted.length > 0 ? pathDepth(sorted[0]) : 0;

	const positions = new Map<string, Coords>();
	const filledPerRow = new Map<number, number>();

	for (const filePath of sorted) {
		const row = pathDepth(filePath) - shallowestDepth;
		const column = filledPerRow.get(row) ?? 0;
		filledPerRow.set(row, column + 1);

		positions.set(filePath, {
			x: base.x + column * COLUMN_STEP,
			y: base.y + row * ROW_STEP,
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
