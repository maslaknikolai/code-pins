import { AppCtx } from '../../types';
import { retryUnresolvedDefinitions } from '../activeGraph/retryUnresolvedDefinitions';
import { createPanel, type PanelCallbacks } from './createPanel';
import { refreshVsCodePanelTitle } from './refreshVsCodePanelTitle';

export function createOrShowPanel(callbacks: PanelCallbacks, appCtx: AppCtx): void {
	const existingPanel = appCtx.vscodePanel;

	if (!existingPanel) {
		const panel = createPanel(callbacks, appCtx);

		appCtx.vscodePanel = panel;
		panel.onDidDispose(() => {
			appCtx.vscodePanel = undefined;
		});
	} else {
		existingPanel.reveal(undefined, false);
		// Ready fires once per webview load, so an already-loaded panel never repeats it.
		callbacks.onReady?.(existingPanel);
	}

	refreshVsCodePanelTitle(appCtx);
	retryUnresolvedDefinitions(appCtx);
}
