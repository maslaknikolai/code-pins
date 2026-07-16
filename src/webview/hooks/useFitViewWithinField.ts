import { getViewportForBounds, useReactFlow, useStore, type Viewport } from '@xyflow/react';
import { MAP_FIELD } from '../../shared/types';
import { useEvent } from './useEvent';

const PADDING = 0.1;

export const VIEWPORT_ANIMATION_MS = 300;

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


export function useFitViewWithinField() {
	const { getNodes, getNodesBounds, setViewport } = useReactFlow();
	const width = useStore((state) => state.width);
	const height = useStore((state) => state.height);
	const minZoom = useStore((state) => state.minZoom);
	const maxZoom = useStore((state) => state.maxZoom);

	/** Resolves once the animation lands, with the viewport it landed on. */
	return useEvent(async (): Promise<Viewport | undefined> => {
		const nodes = getNodes();

		if (nodes.length === 0) {
			return undefined;
		}

		const bounds = getNodesBounds(nodes);
		const { x, y, zoom } = getViewportForBounds(bounds, width, height, minZoom, maxZoom, PADDING);

		const viewport: Viewport = {
			zoom,
			x: clampAxis(x, width, MAP_FIELD.width * zoom),
			y: clampAxis(y, height, MAP_FIELD.height * zoom),
		};

		await setViewport(viewport, { duration: VIEWPORT_ANIMATION_MS });

		return viewport;
	});
}
