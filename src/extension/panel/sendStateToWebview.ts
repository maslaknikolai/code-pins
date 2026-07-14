import * as vscode from 'vscode';
import { ExtensionMessageType } from '../../shared/messages';
import { ActivePinsGraphState } from '../states/active-pins-graph-state';
import { sendToWebview } from './sendToWebview';

export function sendStateToWebview(webview: vscode.Webview, activePinsGraphState: ActivePinsGraphState): void {
	sendToWebview(webview, {
		type: ExtensionMessageType.SetState,
		fileNodes: activePinsGraphState.getFileNodes(),
	});
}
