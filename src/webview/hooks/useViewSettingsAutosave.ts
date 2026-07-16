import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { WebviewMessageType } from '../../shared/messages';
import { viewSettingsAtom } from '../atoms';
import { sendToExtension } from '../utils/vscodeApi';
import { useEvent } from './useEvent';
import { ViewSettings } from '../../shared/types';

export function useViewSettingsAutosave(): void {
	const viewSettings = useAtomValue(viewSettingsAtom);

	const save = useEvent((viewSettingsToSave: ViewSettings | undefined) => {
		console.log('Code Pins: save view settings', viewSettings);

		sendToExtension({
			type: WebviewMessageType.ViewSettingsChanged,
			viewSettings: viewSettingsToSave,
		});
	});

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			save(viewSettings);
		}, 100);
	}, [viewSettings, save]);
}
