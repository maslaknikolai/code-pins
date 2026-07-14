import * as vscode from 'vscode';
import { ExtensionToWebviewMessage } from '../../../shared/messages';

export function sendToWebview(webview: vscode.Webview, message: ExtensionToWebviewMessage): void {
	webview.postMessage(message);
}
