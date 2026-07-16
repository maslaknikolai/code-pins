import { AppCtx } from '../types';

export function deleteGraphById(id: string, { pinsGraphsStore }: AppCtx): Thenable<void> {
	return pinsGraphsStore.set(pinsGraphsStore.get().filter((graph) => graph.id !== id));
}
