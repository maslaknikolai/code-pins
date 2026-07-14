import { AppCtx } from '../types';

export function clearActiveGraphCommand({ activePinsGraphState }: AppCtx): void {
	activePinsGraphState.setFileNodes([]);
}
