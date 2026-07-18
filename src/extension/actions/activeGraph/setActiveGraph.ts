import { PinsGraph } from '../../../shared/types';
import { AppCtx } from '../../types';
import { getGraphById } from '../graphs/getGraphById';
import { saveOrAddGraph } from '../graphs/saveOrAddGraph';

export function setActiveGraph(pinsGraph: PinsGraph, appCtx: AppCtx): void {
	appCtx.undoSnapshotStore.set(getGraphById(pinsGraph.id, appCtx));
	saveOrAddGraph(pinsGraph, appCtx);
	appCtx.activePinsGraphIdStore.set(pinsGraph.id);
}
