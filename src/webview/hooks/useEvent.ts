import { useCallback, useInsertionEffect, useRef } from 'react';

/**
 * Returns a function with a stable identity across renders that always calls
 * the latest version of `handler`. Unlike useCallback there is no dependency
 * list to maintain — the handler may freely close over current props/state.
 */
export function useEvent<Args extends unknown[], Return>(
	handler: (...args: Args) => Return
): (...args: Args) => Return {
	const handlerRef = useRef(handler);

	// Update the ref after every render, before any effects or refs run.
	useInsertionEffect(() => {
		handlerRef.current = handler;
	});

	return useCallback((...args: Args) => handlerRef.current(...args), []);
}
