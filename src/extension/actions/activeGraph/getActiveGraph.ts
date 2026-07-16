import { PinsGraph } from '../../../shared/types';
import { AppCtx } from '../../types';
import { getGraphById } from '../graphs/getGraphById';

export function getActiveGraph(appCtx: AppCtx): PinsGraph | undefined {
	const activeId = appCtx.activePinsGraphIdStore.get();

	return activeId ? getGraphById(activeId, appCtx) : undefined;
}
