import { AppCtx } from '../types';
import { createPinsGraph } from './createPinsGraph';
import { getGraphById } from './getGraphById';
import { getNextGraphName } from './getNextGraphName';
import { setActiveGraph } from './setActiveGraph';


export function cloneGraph(id: string, appCtx: AppCtx): void {
	const source = getGraphById(id, appCtx);

	if (!source) {
		return;
	}

	const name = getNextGraphName(source.label, appCtx);

	setActiveGraph(createPinsGraph(name, structuredClone(source.fileNodes)), appCtx);
}
