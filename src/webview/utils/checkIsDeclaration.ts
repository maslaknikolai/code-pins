import type { Pin } from '../../shared/types';

/** A pin is a declaration when its definition points back at its own location. */
export function checkIsDeclaration(pin: Pin): boolean {
	return pin.symbolDefinitionPath === pin.pinLocationPath;
}
