import { retryUnresolvedDefinitions } from '../actions/retryUnresolvedDefinitions';
import { showGraphPanel } from '../actions/showGraphPanel';
import { AppCtx } from '../types';

export function showPinsPanelCommand(appCtx: AppCtx): void {
	showGraphPanel(appCtx);
	retryUnresolvedDefinitions(appCtx.activePinsGraphState);
}
