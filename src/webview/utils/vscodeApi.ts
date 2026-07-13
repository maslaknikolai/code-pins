import type { WebviewToExtensionMessage } from '../../shared/messages';

declare function acquireVsCodeApi(): {
	postMessage(message: WebviewToExtensionMessage): void;
	getState(): unknown;
	setState(state: unknown): void;
};

export const vscode = acquireVsCodeApi();

export function sendToExtension(message: WebviewToExtensionMessage): void {
	vscode.postMessage(message);
}
