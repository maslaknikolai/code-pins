import * as vscode from 'vscode';
import { ExtensionMessageType } from '../../../shared/messages';
import { AppCtx } from '../../types';
import { getActiveGraph } from '../activeGraph/getActiveGraph';
import { sendToWebview } from './sendToWebview';

export function sendGraphsToWebview(webview: vscode.Webview, appCtx: AppCtx): void {
	sendToWebview(webview, {
		type: ExtensionMessageType.SetGraphs,
		graphs: appCtx.pinsGraphsStore.get(),
		activeGraph: getActiveGraph(appCtx),
	});
}
