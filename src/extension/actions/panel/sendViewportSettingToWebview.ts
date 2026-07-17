import * as vscode from 'vscode';
import { ExtensionMessageType } from '../../../shared/messages';
import { AppCtx } from '../../types';
import { sendToWebview } from './sendToWebview';

export function sendViewportSettingToWebview(webview: vscode.Webview, appCtx: AppCtx): void {
	sendToWebview(webview, {
		type: ExtensionMessageType.SetInitialState,
		viewSettings: appCtx.viewSettingsStore.get()
	});
}
