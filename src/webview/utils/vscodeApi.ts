import type { WebviewMessageType, WebviewToExtensionMessage } from '../../shared/types';

declare function acquireVsCodeApi(): {
	postMessage(message: WebviewToExtensionMessage): void;
	getState(): unknown;
	setState(state: unknown): void;
};

export const vscode = acquireVsCodeApi();

type PayloadOf<K extends WebviewMessageType> = Omit<
	Extract<WebviewToExtensionMessage, { type: K }>,
	'type'
>;

export function sendToExtension<K extends WebviewMessageType>(
	type: K,
	...payload: keyof PayloadOf<K> extends never ? [] : [PayloadOf<K>]
): void {
	vscode.postMessage({ type, ...payload[0] } as WebviewToExtensionMessage);
}
