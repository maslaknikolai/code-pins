import { AppCtx } from '../../types';
import { getGraphById } from './getGraphById';
import { getNextGraphName } from './getNextGraphName';
import { updateGraph } from './updateGraph';


export async function renameGraph(id: string, label: string, appCtx: AppCtx): Promise<void> {
	const source = getGraphById(id, appCtx);

	if (!source || !label || label === source.label) {
		return;
	}

	await updateGraph({ ...source, label: getNextGraphName(label, appCtx) }, appCtx);
}
