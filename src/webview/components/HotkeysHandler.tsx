import { useReactFlow, useStore } from '@xyflow/react';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { WebviewMessageType } from '../../shared/messages';
import { selectedPinAtom, viewSettingsAtom } from '../atoms';
import { useEvent } from '../hooks/useEvent';
import { useFitViewToggle } from '../hooks/useFitViewToggle';
import { useSelectGraphByOffset } from '../hooks/useSelectGraphByOffset';
import { sendToExtension } from '../utils/vscodeApi';

const PAN_STEP = 60;

/** made as component to have access to ReactFlow */
export function HotkeysHandler() {
	const { zoomIn, zoomOut } = useReactFlow();
	const [selectedPin, setSelectedPin] = useAtom(selectedPinAtom);
	const setViewSettings = useSetAtom(viewSettingsAtom);
	const { selectGraphByOffset } = useSelectGraphByOffset();
	const toggleFitView = useFitViewToggle();
	const panBy = useStore((state) => state.panBy);

	const onKeyDown = useEvent((event: KeyboardEvent) => {
		if (selectedPin && event.code === 'Escape') {
			setSelectedPin(undefined);
			return;
		}

		if (selectedPin && (event.code === 'Delete' || event.code === 'Backspace')) {
			sendToExtension({ type: WebviewMessageType.RemovePin, id: selectedPin.id });
			setSelectedPin(undefined);
			return;
		}

		if (event.code === 'Space') {
			// A focused button would treat Space as a click, toggling the drawer twice.
			event.preventDefault();
			setViewSettings((v) => ({ ...v, isDrawerOpen: !v?.isDrawerOpen }));
			return;
		}

		if (event.code === 'Equal' || event.code === 'NumpadAdd') {
			zoomIn();
			return;
		}

		if (event.code === 'Minus' || event.code === 'NumpadSubtract') {
			zoomOut();
			return;
		}

		if (event.code === 'KeyA') {
			toggleFitView();
			return;
		}

		if (event.code === 'KeyX') {
			sendToExtension({ type: WebviewMessageType.NewGraph });
			return;
		}

		if (event.code === 'KeyW') {
			selectGraphByOffset(-1);
			return;
		}

		if (event.code === 'KeyS') {
			selectGraphByOffset(1);
			return;
		}

		if (event.code === 'ArrowUp') {
			event.preventDefault();
			panBy({ x: 0, y: PAN_STEP });
			return;
		}

		if (event.code === 'ArrowDown') {
			event.preventDefault();
			panBy({ x: 0, y: -PAN_STEP });
			return;
		}

		if (event.code === 'ArrowLeft') {
			event.preventDefault();
			panBy({ x: PAN_STEP, y: 0 });
			return;
		}

		if (event.code === 'ArrowRight') {
			event.preventDefault();
			panBy({ x: -PAN_STEP, y: 0 });
			return;
		}
	});

	useEffect(() => {
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [onKeyDown]);

	return null;
}
