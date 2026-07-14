import { atom } from 'jotai';
import type { Pin, PinsGraph } from '../shared/types';
import type { FileFlowNode } from './types';


export const flowNodesAtom = atom<FileFlowNode[]>([]);

export const selectedPinAtom = atom<Pin | undefined>(undefined);

export const activeFilePathAtom = atom<string | undefined>(undefined);

export const allGraphsAtom = atom<PinsGraph[]>([]);

export const activeGraphIdAtom = atom<string | undefined>(undefined);
