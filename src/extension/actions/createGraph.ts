import { createPinsGraph } from '../states/active-pins-graph-state';
import { AppCtx } from '../types';


export function createGraph(appCtx: AppCtx): void {
	const name = appCtx.pinsGraphsStore.getNextName('new graph');

	appCtx.activePinsGraphState.setPinsGraph(createPinsGraph(name));

}
