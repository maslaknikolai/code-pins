import type { Node } from '@xyflow/react';
import type { FileNode } from '../types';

/** React Flow node carrying one file node in its data. */
export type FileFlowNode = Node<{ fileNode: FileNode }, 'file'>;
