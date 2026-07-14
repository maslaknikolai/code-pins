import type { FileNode } from '../../shared/types';
import type { FileFlowNode } from '../types';

export function toFlowNode(fileNode: FileNode): FileFlowNode {
	return {
		id: fileNode.filePath,
		type: 'file',
		position: fileNode.position,
		data: { fileNode },
	};
}
