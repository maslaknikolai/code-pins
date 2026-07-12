import type { FileNode } from '../../shared/types';
import type { FileFlowNode } from '../types';

export function toFlowNode(fileNode: FileNode): FileFlowNode {
	return {
		id: fileNode.filePath,
		type: 'file',
		position: { x: fileNode.x, y: fileNode.y },
		data: { fileNode },
	};
}
