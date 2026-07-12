import type { WebviewMessageType, WebviewToExtensionMessage } from '../../shared/types';

declare function acquireVsCodeApi(): {
	postMessage(message: WebviewToExtensionMessage): void;
	getState(): unknown;
	setState(state: unknown): void;
};

/** May only be called once per webview session, so acquired here and shared. */
export const vscode = acquireVsCodeApi();

type PayloadOf<K extends WebviewMessageType> = Omit<
	Extract<WebviewToExtensionMessage, { type: K }>,
	'type'
>;

/** Typed postMessage: the payload shape is checked against the message type. */
export function sendToExtension<K extends WebviewMessageType>(
	type: K,
	...payload: keyof PayloadOf<K> extends never ? [] : [PayloadOf<K>]
): void {
	vscode.postMessage({ type, ...payload[0] } as WebviewToExtensionMessage);
}
