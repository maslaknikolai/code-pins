import { ExtensionMessageType } from '../../../shared/messages';
import { AppCtx } from '../../types';
import { sendToWebview } from './sendToWebview';


export function sendActiveFileToWebview(appCtx: AppCtx): void {
	const webview = appCtx.vscodePanel?.webview;
	const filePath = appCtx.lastActiveFilePathStore.get();

	if (!webview || !filePath) {
		return;
	}

	sendToWebview(webview, {
		type: ExtensionMessageType.SetActiveFile,
		filePath,
	});
}
