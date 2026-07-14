import { ActivePinsGraphStore } from '../active-pins-graph-store';
import { ViewportCenterStore } from '../viewport-center-store';
import { moveFileNode, removeFileNode, removePin } from '../graph/actions';
import { WebviewMessageType, WebviewToExtensionMessage } from '../../shared/messages';
import { openLocation } from './openLocation';

export interface MessageContext {
	activePinsGraphStore: ActivePinsGraphStore;
	sendStateToWebview: () => void;
	sendActiveFileToWebview: () => void;
	viewportCenterStore: ViewportCenterStore;
}

type MessageOf<K extends WebviewToExtensionMessage['type']> = Extract<
	WebviewToExtensionMessage,
	{ type: K }
>;

const handlers: {
	[K in WebviewToExtensionMessage['type']]: (message: MessageOf<K>, ctx: MessageContext) => void;
} = {
	[WebviewMessageType.Ready]: (_message, ctx) => {
		ctx.sendStateToWebview();
		ctx.sendActiveFileToWebview();
	},
	[WebviewMessageType.MoveFileNode]: (message, ctx) => moveFileNode(ctx.activePinsGraphStore, message.filePath, message.x, message.y),
	[WebviewMessageType.RemovePin]: (message, ctx) => removePin(ctx.activePinsGraphStore, message.id),
	[WebviewMessageType.RemoveFileNode]: (message, ctx) => removeFileNode(ctx.activePinsGraphStore, message.filePath),
	[WebviewMessageType.OpenLocation]: (message) => openLocation(message.file, message.line),
	[WebviewMessageType.ViewportChanged]: (message, ctx) => ctx.viewportCenterStore.setCenter({ x: message.x, y: message.y }),
};

export function handleWebviewMessage(message: WebviewToExtensionMessage, ctx: MessageContext): void {
	// The map guarantees a matching handler per type; the cast erases the per-key narrowing.
	(handlers[message.type] as (message: WebviewToExtensionMessage, ctx: MessageContext) => void)(
		message,
		ctx
	);
}
