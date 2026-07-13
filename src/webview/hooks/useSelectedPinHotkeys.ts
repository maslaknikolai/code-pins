import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { WebviewMessageType } from '../../shared/types';
import { selectedPinAtom } from '../atoms';
import { sendToExtension } from '../utils/vscodeApi';


export function useSelectedPinHotkeys() {
	const [selectedPin, setSelectedPin] = useAtom(selectedPinAtom);

	useEffect(() => {
		if (!selectedPin) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setSelectedPin(undefined);
				return;
			}
			if (event.key !== 'Delete' && event.key !== 'Backspace') {
				return;
			}
			sendToExtension(WebviewMessageType.RemovePin, { id: selectedPin.id });
			setSelectedPin(undefined);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [selectedPin, setSelectedPin]);
}
