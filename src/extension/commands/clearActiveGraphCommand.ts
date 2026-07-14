import { FileNodesStore } from '../file-nodes-store';

export function clearActiveGraphCommand({ fileNodesStore }: { fileNodesStore: FileNodesStore }): void {
	fileNodesStore.setFileNodes([]);
}
