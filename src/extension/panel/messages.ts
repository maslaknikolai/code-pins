import { FileNodesStore } from '../file-nodes-store';
import { moveFileNode, removePin } from '../graph/actions';
import { WebviewMessageType, WebviewToExtensionMessage } from '../../shared/types';
import { openLocation } from './openLocation';

export interface MessageContext {
	store: FileNodesStore;
	sendStateToWebview: () => void;
}

type MessageOf<K extends WebviewToExtensionMessage['type']> = Extract<
	WebviewToExtensionMessage,
	{ type: K }
>;

const handlers: {
	[K in WebviewToExtensionMessage['type']]: (message: MessageOf<K>, ctx: MessageContext) => void;
} = {
	[WebviewMessageType.Ready]: (_message, ctx) => ctx.sendStateToWebview(),
	[WebviewMessageType.MoveFileNode]: (message, ctx) => moveFileNode(ctx.store, message.filePath, message.x, message.y),
	[WebviewMessageType.RemovePin]: (message, ctx) => removePin(ctx.store, message.id),
	[WebviewMessageType.OpenLocation]: (message) => openLocation(message.file, message.line),
};

export function handleWebviewMessage(message: WebviewToExtensionMessage, ctx: MessageContext): void {
	// The map guarantees a matching handler per type; the cast erases the per-key narrowing.
	(handlers[message.type] as (message: WebviewToExtensionMessage, ctx: MessageContext) => void)(
		message,
		ctx
	);
}
