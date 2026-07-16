import * as vscode from 'vscode';
import { ExtensionMessageType } from '../../../shared/messages';
import { getRelativePath } from '../../utils/getRelativePath';
import { sendToWebview } from './sendToWebview';


export function sendActiveFileToWebview(webview: vscode.Webview): void {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		return;
	}

	sendToWebview(webview, {
		type: ExtensionMessageType.SetActiveFile,
		filePath: getRelativePath(editor.document.uri),
	});
}
