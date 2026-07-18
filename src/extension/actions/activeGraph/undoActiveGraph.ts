import { AppCtx } from '../../types';
import { setActiveGraph } from './setActiveGraph';

export function undoActiveGraph(appCtx: AppCtx): void {
	const snapshot = appCtx.undoSnapshotStore.get();

	if (!snapshot || snapshot.id !== appCtx.activePinsGraphIdStore.get()) {
		return;
	}

	// setActiveGraph stashes the pre-undo state, so the next undo redoes.
	setActiveGraph(snapshot, appCtx);
}
