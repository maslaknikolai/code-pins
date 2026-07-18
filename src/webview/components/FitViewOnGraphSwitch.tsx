import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import { activeGraphAtom } from '../atoms';
import { useFitViewWithinField } from '../hooks/useFitViewWithinField';
import { debounce } from '../utils/debounce';

export function FitViewOnGraphSwitch() {
	const activeGraphId = useAtomValue(activeGraphAtom)?.id;
	const fitViewWithinField = useFitViewWithinField();
	const debouncedFit = useMemo(() => debounce(fitViewWithinField, 300), [fitViewWithinField]);
	const hasLoadedRef = useRef(false);

	/** made as effect to fit after delete */
	useEffect(() => {
		if (!activeGraphId) {
			return;
		}

		// The first graph arrival is the initial load, where the saved viewport is being restored.
		if (!hasLoadedRef.current) {
			hasLoadedRef.current = true;
			return;
		}

		debouncedFit();
	}, [activeGraphId, debouncedFit]);

	return null;
}
