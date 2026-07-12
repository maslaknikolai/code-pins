import { atom } from 'jotai';
import type { FileFlowNode } from './types';


// Stored as nodes to make them not rerender on every postiion change
export const flowNodesAtom = atom<FileFlowNode[]>([]);
