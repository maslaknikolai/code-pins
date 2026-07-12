import * as vscode from 'vscode';
import { panelStyles } from './styles';

export function renderHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
	const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js'));
	const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.css'));
	const tailwindUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'tailwind.css'));
	const nonce = getNonce();
	return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Security-Policy"
		content="default-src 'none'; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
	<link rel="stylesheet" href="${tailwindUri}">
	<link rel="stylesheet" href="${styleUri}">
	<style>${panelStyles}</style>
</head>
<body>
	<div id="root"></div>
	<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

/**
 * Random token for the webview's Content-Security-Policy. The CSP above blocks
 * all scripts except ones tagged with this nonce (`script-src 'nonce-...'`),
 * so only the <script> we emit ourselves can run — anything injected into the
 * webview HTML by other means won't execute. Regenerated on every panel open.
 */
function getNonce(): string {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
