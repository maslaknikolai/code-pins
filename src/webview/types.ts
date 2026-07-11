import type { Node } from '@xyflow/react';
import type { Pin } from '../types';

/** React Flow node carrying the pinned entity in its data. */
export type PinFlowNode = Node<{ pin: Pin }, 'pin'>;
