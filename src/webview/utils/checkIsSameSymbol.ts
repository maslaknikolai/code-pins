import type { Pin } from '../../shared/types';

export type SymbolPaths = Pick<Pin, 'pinLocationPath' | 'symbolDefinitionPath'>;

/**
 * A symbol occurrence can be a declaration and a reference at once
 * (`const {addTab} = useMethods()`), so two pins mean the same symbol when any
 * of their location/definition keys intersect.
 */
export function checkIsSameSymbol(a: SymbolPaths, b: SymbolPaths): boolean {
	return (
		a.pinLocationPath === b.pinLocationPath ||
		a.pinLocationPath === b.symbolDefinitionPath ||
		(a.symbolDefinitionPath !== undefined &&
			(a.symbolDefinitionPath === b.pinLocationPath || a.symbolDefinitionPath === b.symbolDefinitionPath))
	);
}
