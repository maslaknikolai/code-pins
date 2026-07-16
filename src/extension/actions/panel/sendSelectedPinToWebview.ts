import * as vscode from 'vscode';
import { ExtensionMessageType } from '../../../shared/messages';
import { Pin } from '../../../shared/types';
import { sendToWebview } from './sendToWebview';

export function sendSelectedPinToWebview(webview: vscode.Webview, pin: Pin | undefined): void {
	sendToWebview(webview, {
		type: ExtensionMessageType.SetSelectedPin,
		pin,
	});
}
