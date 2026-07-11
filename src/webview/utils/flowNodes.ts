import type { Pin } from '../../types';
import type { PinFlowNode } from '../types';

export function toFlowNode(pin: Pin): PinFlowNode {
	return {
		id: pin.id,
		type: 'pin',
		position: { x: pin.x, y: pin.y },
		data: { pin },
	};
}
