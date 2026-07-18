import { createOrShowPanel } from '../actions/panel/createOrShowPanel';
import { AppCtx } from '../types';

export function showPanelCommand(appCtx: AppCtx) {
	createOrShowPanel({}, appCtx);
}
