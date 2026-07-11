import { GraphManager } from '../graph';
import { moveNode, removeNode } from '../graph/actions';
import { WebviewToExtensionMessage } from '../types';
import { openLocation } from './openLocation';

export interface MessageContext {
	graph: GraphManager;
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
	ready: (_message, ctx) => ctx.postState(),
	moveNode: (message, ctx) => moveNode(ctx.graph, message.id, message.x, message.y),
	removeNode: (message, ctx) => removeNode(ctx.graph, message.id),
	openLocation: (message) => openLocation(message.file, message.line),
};

export function handleWebviewMessage(message: WebviewToExtensionMessage, ctx: MessageContext): void {
	// The map guarantees a matching handler per type; the cast erases the per-key narrowing.
	(handlers[message.type] as (message: WebviewToExtensionMessage, ctx: MessageContext) => void)(
		message,
		ctx
	);
}
