import { PinsGraph, PinsGraphFile, SUPPORTED_PINS_GRAPH_FILE_VERSION } from '../../../shared/types';

export function serializePinsGraph(source: PinsGraph): string {
	const { id: _id, ...pinsGraph } = source;
	const data: PinsGraphFile = {
		version: SUPPORTED_PINS_GRAPH_FILE_VERSION,
		pinsGraph,
	};
	return JSON.stringify(data, null, '\t');
}
