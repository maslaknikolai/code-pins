import * as vscode from 'vscode';
import { ExtensionMessageType } from '../../shared/messages';
import { getRelativePath } from '../utils/getRelativePath';
import { sendToWebview } from './sendToWebview';


export function sendActiveFileToWebview(webview: vscode.Webview, editor = vscode.window.activeTextEditor): void {
	if (!editor) {
		return;
	}
	sendToWebview(webview, {
		type: ExtensionMessageType.SetActiveFile,
		filePath: getRelativePath(editor.document.uri),
	});
}
