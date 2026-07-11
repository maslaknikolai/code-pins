import { PinsStore } from '../graph';
import { movePin, removePin } from '../graph/actions';
import { WebviewMessageType, WebviewToExtensionMessage } from '../types';
import { openLocation } from './openLocation';

export interface MessageContext {
	pinsStore: PinsStore;
	/** Pushes the current graph state to the webview. */
	postState: () => void;
}

type MessageOf<K extends WebviewToExtensionMessage['type']> = Extract<
	WebviewToExtensionMessage,
	{ type: K }
>;

const handlers: {
	[K in WebviewToExtensionMessage['type']]: (message: MessageOf<K>, ctx: MessageContext) => void;
} = {
	[WebviewMessageType.Ready]: (_message, ctx) => ctx.postState(),
	[WebviewMessageType.MovePin]: (message, ctx) => movePin(ctx.pinsStore, message.id, message.x, message.y),
	[WebviewMessageType.RemovePin]: (message, ctx) => removePin(ctx.pinsStore, message.id),
	[WebviewMessageType.OpenLocation]: (message) => openLocation(message.file, message.line),
};

export function handleWebviewMessage(message: WebviewToExtensionMessage, ctx: MessageContext): void {
	// The map guarantees a matching handler per type; the cast erases the per-key narrowing.
	(handlers[message.type] as (message: WebviewToExtensionMessage, ctx: MessageContext) => void)(
		message,
		ctx
	);
}
