import { atom } from 'jotai';
import type { Pin } from '../shared/types';
import type { FileFlowNode } from './types';


// Stored as nodes to make them not rerender on every postiion change
export const flowNodesAtom = atom<FileFlowNode[]>([]);

/** The selected pin — the same symbol lights up across all nodes, Delete removes the pin. */
export const selectedPinAtom = atom<Pin | undefined>(undefined);
