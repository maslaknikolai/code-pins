import { AppCtx } from '../types';
import { createPinsGraph } from './createPinsGraph';
import { getGraphById } from './getGraphById';
import { getNextGraphName } from './getNextGraphName';
import { setActiveGraph } from './setActiveGraph';


export function cloneGraph(appCtx: AppCtx, id: string): void {
	const source = getGraphById(id, appCtx);

	if (!source) {
		return;
	}

	const name = getNextGraphName(appCtx.pinsGraphsStore, source.label);

	setActiveGraph(createPinsGraph(name, structuredClone(source.fileNodes)), appCtx);
}
