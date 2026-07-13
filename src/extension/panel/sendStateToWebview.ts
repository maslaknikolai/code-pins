import * as vscode from 'vscode';
import { ExtensionMessageType } from '../../shared/messages';
import { FileNodesStore } from '../file-nodes-store';
import { sendToWebview } from './sendToWebview';

export function sendStateToWebview(webview: vscode.Webview, store: FileNodesStore): void {
	sendToWebview(webview, {
		type: ExtensionMessageType.SetState,
		fileNodes: store.getFileNodes(),
	});
}
