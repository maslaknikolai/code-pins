import { useReactFlow } from '@xyflow/react';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { WebviewMessageType } from '../../shared/messages';
import { selectedPinAtom, viewSettingsAtom } from '../atoms';
import { useEvent } from '../hooks/useEvent';
import { useSelectGraphByOffset } from '../hooks/useSelectGraphByOffset';
import { sendToExtension } from '../utils/vscodeApi';

/** made as component to have access to ReactFlow */
export function HotkeysHandler() {
	const { zoomIn, zoomOut, fitView } = useReactFlow();
	const [selectedPin, setSelectedPin] = useAtom(selectedPinAtom);
	const setViewSettings = useSetAtom(viewSettingsAtom);
	const { selectGraphByOffset } = useSelectGraphByOffset();

	const onKeyDown = useEvent((event: KeyboardEvent) => {
		if (selectedPin && event.key === 'Escape') {
			setSelectedPin(undefined);
			return;
		}

		if (selectedPin && (event.key === 'Delete' || event.key === 'Backspace')) {
			sendToExtension({ type: WebviewMessageType.RemovePin, id: selectedPin.id });
			setSelectedPin(undefined);
			return;
		}

		if (event.key === ' ') {
			// A focused button would treat Space as a click, toggling the drawer twice.
			event.preventDefault();
			setViewSettings((v) => ({ ...v, isDrawerOpen: !v?.isDrawerOpen }));
			return;
		}

		if (event.key === '+' || event.key === '=') {
			zoomIn();
			return;
		}

		if (event.key === '-' || event.key === '_') {
			zoomOut();
			return;
		}

		if (event.key === 'a' || event.key === 'A') {
			fitView();
			return;
		}

		if (event.key === 'x' || event.key === 'X') {
			sendToExtension({ type: WebviewMessageType.NewGraph });
			return;
		}

		if (event.key === 'w' || event.key === 'W') {
			selectGraphByOffset(-1);
			return;
		}

		if (event.key === 's' || event.key === 'S') {
			selectGraphByOffset(1);
			return;
		}
	});

	useEffect(() => {
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [onKeyDown]);

	return null;
}
