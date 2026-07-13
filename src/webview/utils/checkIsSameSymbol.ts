import type { Pin } from '../../shared/types';

export type SymbolPaths = Pick<Pin, 'pinPath' | 'symbolDefinitionPath'>;

/**
 * A symbol occurrence can be a declaration and a reference at once
 * (`const {addTab} = useMethods()`), so two pins mean the same symbol when any
 * of their location/definition keys intersect.
 */
export function checkIsSameSymbol(a: SymbolPaths, b: SymbolPaths): boolean {
	return (
		a.pinPath === b.pinPath ||
		a.pinPath === b.symbolDefinitionPath ||
		(a.symbolDefinitionPath !== undefined &&
			(a.symbolDefinitionPath === b.pinPath || a.symbolDefinitionPath === b.symbolDefinitionPath))
	);
}
