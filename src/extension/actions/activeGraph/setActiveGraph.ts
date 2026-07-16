import { PinsGraph } from '../../../shared/types';
import { AppCtx } from '../../types';
import { saveOrAddGraph } from '../graphs/saveOrAddGraph';

export function setActiveGraph(pinsGraph: PinsGraph, appCtx: AppCtx): void {
	saveOrAddGraph(pinsGraph, appCtx);
	appCtx.activePinsGraphIdStore.set(pinsGraph.id);
}
