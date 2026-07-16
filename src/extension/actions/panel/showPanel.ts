import { AppCtx } from '../../types';
import { retryUnresolvedDefinitions } from '../retryUnresolvedDefinitions';
import { createPanel, type PanelCallbacks } from './createPanel';
import { refreshVsCodePanelTitle } from './refreshVsCodePanelTitle';

export function createOrShowPanel(appCtx: AppCtx, callbacks: PanelCallbacks = {}): void {
	const existingPanel = appCtx.vscodePanel;

	if (!existingPanel) {
		const panel = createPanel(appCtx, callbacks);

		appCtx.vscodePanel = panel;
		panel.onDidDispose(() => {
			appCtx.vscodePanel = undefined;
		});
	} else {
		existingPanel.reveal(undefined, false);
		callbacks.onShow?.(existingPanel);
	}

	refreshVsCodePanelTitle(appCtx);
	retryUnresolvedDefinitions(appCtx);
}
