import type { Pin } from '../../shared/types';

export type SymbolKeys = Pick<Pin, 'locationKey' | 'definitionKey'>;

/**
 * A symbol occurrence can be a declaration and a reference at once
 * (`const {addTab} = useMethods()`), so two pins mean the same symbol when any
 * of their location/definition keys intersect.
 */
export function checkIsSameSymbol(a: SymbolKeys, b: SymbolKeys): boolean {
	return (
		a.locationKey === b.locationKey ||
		a.locationKey === b.definitionKey ||
		(a.definitionKey !== undefined &&
			(a.definitionKey === b.locationKey || a.definitionKey === b.definitionKey))
	);
}
