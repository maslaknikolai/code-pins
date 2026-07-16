import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { WebviewMessageType } from '../../shared/messages';
import { selectedPinAtom, viewSettingsAtom } from '../atoms';
import { sendToExtension } from '../utils/vscodeApi';


export function useHotkeys() {
	const [selectedPin, setSelectedPin] = useAtom(selectedPinAtom);
	const setViewSettings = useSetAtom(viewSettingsAtom);

	useEffect(() => {
		if (!selectedPin) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setSelectedPin(undefined);
				return;
			}
			if (event.key === 'Delete' || event.key === 'Backspace') {
				sendToExtension({ type: WebviewMessageType.RemovePin, id: selectedPin.id });
				setSelectedPin(undefined);
				return;
			}

			if (event.key === 'Space') {
				setViewSettings(v => ({...v, isDrawerOpen: v?.isDrawerOpen}));
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [selectedPin, setSelectedPin]);
}
