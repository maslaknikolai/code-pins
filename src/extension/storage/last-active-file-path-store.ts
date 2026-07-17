import { createMemoryStore, type MemoryStore } from './createMemoryStore';


export type LastActiveFilePathStore = MemoryStore<string | undefined>;

export function createLastActiveFilePathStore(initial: string | undefined): LastActiveFilePathStore {
	return createMemoryStore<string | undefined>(initial);
}
