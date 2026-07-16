import { getViewportForBounds, useReactFlow, useStore } from '@xyflow/react';
import { MAP_FIELD } from '../../shared/types';
import { useEvent } from './useEvent';

const PADDING = 0.1;

/**
 * Keeps one axis of the field covering the viewport: its near edge can't slide past the
 * viewport's, and its far edge can't come inside. A field smaller than the viewport gets centered.
 */
function clampAxis(value: number, viewportSize: number, fieldSize: number): number {
	if (fieldSize < viewportSize) {
		return (viewportSize - fieldSize) / 2;
	}

	return Math.min(0, Math.max(viewportSize - fieldSize, value));
}

/**
 * React Flow's own fitView centers the nodes and ignores `translateExtent`, so a single node
 * near a field corner ends up mid-viewport with the field's edge pulled inside it.
 */
export function useFitViewWithinField() {
	const { getNodes, getNodesBounds, setViewport } = useReactFlow();
	const width = useStore((state) => state.width);
	const height = useStore((state) => state.height);
	const minZoom = useStore((state) => state.minZoom);
	const maxZoom = useStore((state) => state.maxZoom);

	return useEvent(() => {
		const nodes = getNodes();

		if (nodes.length === 0) {
			return;
		}

		const bounds = getNodesBounds(nodes);
		const { x, y, zoom } = getViewportForBounds(bounds, width, height, minZoom, maxZoom, PADDING);

		setViewport({
			zoom,
			x: clampAxis(x, width, MAP_FIELD.width * zoom),
			y: clampAxis(y, height, MAP_FIELD.height * zoom),
		});
	});
}
