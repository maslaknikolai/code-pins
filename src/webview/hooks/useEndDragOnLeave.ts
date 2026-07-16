import { useEffect } from 'react';

/**
 * d3-zoom ends a pan on a `mouseup` it listens for on this window. The webview is an iframe, so
 * releasing the button outside the panel never reaches it and the gesture stays armed — the canvas
 * would then keep panning, button up, as soon as the cursor comes back. Ending it on the way out
 * costs a drag that leaves and returns, which already did nothing.
 */
export function useEndDragOnLeave(): void {
	useEffect(() => {
		const endDrag = () => {
			// `view` matters: d3's mouseupped passes it to dragEnable.
			window.dispatchEvent(new MouseEvent('mouseup', { view: window, bubbles: true }));
		};

		document.addEventListener('mouseleave', endDrag);

		return () => document.removeEventListener('mouseleave', endDrag);
	}, []);
}
