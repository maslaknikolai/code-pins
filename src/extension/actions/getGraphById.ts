import { PinsGraph } from '../../shared/types';
import { AppCtx } from '../types';

export function getGraphById(id: string, { pinsGraphsStore }: AppCtx): PinsGraph | undefined {
	return pinsGraphsStore.getGraphs().find((graph) => graph.id === id);
}
