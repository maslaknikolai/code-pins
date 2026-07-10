import type { Node } from '@xyflow/react';
import { atom } from 'jotai';
import type { GraphNode } from '../types';

/** React Flow node carrying the pinned entity in its data. */
export type PinFlowNode = Node<{ pin: GraphNode }, 'pin'>;

export const flowNodesAtom = atom<PinFlowNode[]>([]);
