import { Pin } from '../../shared/types';


export function createLastAddedPinState() {
	let lastAddedPin: Pin | undefined;

	return {
		get: (): Pin | undefined => lastAddedPin,

		set: (pin: Pin | undefined): void => {
			lastAddedPin = pin;
		}
	};
}

export type LastAddedPinState = ReturnType<typeof createLastAddedPinState>;
