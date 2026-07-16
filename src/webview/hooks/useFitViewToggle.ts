import { useReactFlow, type Viewport } from '@xyflow/react';
import { atom, useAtom } from 'jotai';
import { useEvent } from './useEvent';
import { useFitViewWithinField, VIEWPORT_ANIMATION_MS } from './useFitViewWithinField';

const beforeFitAtom = atom<Viewport | undefined>(undefined);
const fittedAtom = atom<Viewport | undefined>(undefined);
const isAnimatingAtom = atom(false);

function isSameViewport(a: Viewport, b: Viewport): boolean {
	return a.x === b.x && a.y === b.y && a.zoom === b.zoom;
}

/**
 * Fits the view; called again, it returns to where the view was before that fit.
 *
 * Only restores while the view still sits exactly where the fit left it, so any pan or zoom in
 * between drops the saved viewport. Comparing viewports keeps us from having to tell our own
 * updates apart from the user's.
 */
export function useFitViewToggle() {
	const { getViewport, setViewport } = useReactFlow();
	const fitViewWithinField = useFitViewWithinField();
	const [beforeFit, setBeforeFit] = useAtom(beforeFitAtom);
	const [fitted, setFitted] = useAtom(fittedAtom);
	const [isAnimating, setIsAnimating] = useAtom(isAnimatingAtom);

	return useEvent(async () => {
		// Mid-animation the viewport sits between values, so the comparison below can't judge it.
		if (isAnimating) {
			return;
		}

		const current = getViewport();
		const isStillFitted = fitted && isSameViewport(current, fitted);

		setIsAnimating(true);

		if (beforeFit && isStillFitted) {
			setBeforeFit(undefined);
			setFitted(undefined);
			await setViewport(beforeFit, { duration: VIEWPORT_ANIMATION_MS });
		} else {
			const fittedViewport = await fitViewWithinField();

			setBeforeFit(fittedViewport && current);
			setFitted(fittedViewport);
		}

		setIsAnimating(false);
	});
}
