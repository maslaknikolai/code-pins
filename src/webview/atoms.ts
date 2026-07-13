import { atom } from 'jotai';
import type { FileFlowNode } from './types';
import type { SymbolPaths } from './utils/checkIsSameSymbol';


// Stored as nodes to make them not rerender on every postiion change
export const flowNodesAtom = atom<FileFlowNode[]>([]);

/** Paths of the selected pinned symbol — same symbol lights up across all nodes. */
export const selectedSymbolAtom = atom<SymbolPaths | undefined>(undefined);
