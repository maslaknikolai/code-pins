import { useOnViewportChange, useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';
import { Coords } from '../../shared/types';
import { useSetAtom } from 'jotai';
import { viewSettingsAtom } from '../atoms';


export function ViewportSettingsReporter() {
	const { getViewport } = useReactFlow();
	const setViewSettingsAtom = useSetAtom(viewSettingsAtom)

	useOnViewportChange({ onChange: () => {
		const { x, y, zoom } = getViewport();
		const position: Coords = { x, y };
		setViewSettingsAtom(v => ({
			...v,
			position,
			zoom
		}))
	} });

	return null;
}
