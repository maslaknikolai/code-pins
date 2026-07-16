import { randomUUID } from 'crypto';
import { FileNode, PinsGraph } from '../../../shared/types';

export const DEFAULT_PINS_GRAPH_NAME = 'default';

export function createPinsGraph(label: string, fileNodes: FileNode[] = []): PinsGraph {
	return {
		id: randomUUID(),
		label,
		fileNodes,
	};
}
