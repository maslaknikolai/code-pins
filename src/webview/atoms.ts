import { atom } from 'jotai';
import type { FileFlowNode } from './types';
import type { SymbolKeys } from './utils/checkIsSameSymbol';


// Stored as nodes to make them not rerender on every postiion change
export const flowNodesAtom = atom<FileFlowNode[]>([]);

/** Keys of the selected pinned symbol — same symbol lights up across all nodes. */
export const selectedSymbolAtom = atom<SymbolKeys | undefined>(undefined);
