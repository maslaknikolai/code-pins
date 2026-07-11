import { atom } from 'jotai';
import type { PinFlowNode } from './types';

export const flowNodesAtom = atom<PinFlowNode[]>([]);
