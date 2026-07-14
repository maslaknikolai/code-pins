import * as vscode from 'vscode';
import { ExtensionMessageType } from '../../shared/messages';
import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';
import { sendToWebview } from './sendToWebview';

export function sendStateToWebview(webview: vscode.Webview, activePinsGraphStore: ActivePinsGraphStore): void {
	sendToWebview(webview, {
		type: ExtensionMessageType.SetState,
		fileNodes: activePinsGraphStore.getFileNodes(),
	});
}
