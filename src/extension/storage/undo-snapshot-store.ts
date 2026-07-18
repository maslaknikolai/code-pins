import { PinsGraph } from '../../shared/types';
import { createMemoryStore, type MemoryStore } from './createMemoryStore';


export type UndoSnapshotStore = MemoryStore<PinsGraph | undefined>;

export function createUndoSnapshotStore(): UndoSnapshotStore {
	return createMemoryStore<PinsGraph | undefined>(undefined);
}
