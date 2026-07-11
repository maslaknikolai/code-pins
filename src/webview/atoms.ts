import { atom } from 'jotai';
import type { GraphNode } from '../types';

/** Raw pins as sent by the extension — the single source of truth. */
export const pinsAtom = atom<GraphNode[]>([]);
