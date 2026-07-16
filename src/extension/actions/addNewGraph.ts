import { AppCtx } from '../types';
import { createPinsGraph } from './createPinsGraph';
import { getNextGraphName } from './getNextGraphName';
import { setActiveGraph } from './setActiveGraph';


export function addNewGraph(appCtx: AppCtx): void {
	const name = getNextGraphName(appCtx.pinsGraphsStore, 'new graph');

	setActiveGraph(createPinsGraph(name), appCtx);
}
