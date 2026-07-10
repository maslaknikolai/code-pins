import type { WebviewToExtensionMessage } from '../types';

declare function acquireVsCodeApi(): {
	postMessage(message: WebviewToExtensionMessage): void;
	getState(): unknown;
	setState(state: unknown): void;
};

/** May only be called once per webview session, so acquired here and shared. */
export const vscode = acquireVsCodeApi();
