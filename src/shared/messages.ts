import type { FileNode } from './types';

/**
 * Everything the two processes say to each other, in one place.
 * The enums name the messages, the unions type their payloads; the senders are
 * `sendToExtension` (webview side) and `sendToWebview` (extension side).
 */

export enum WebviewMessageType {
	Ready = 'ready',
	MoveFileNode = 'moveFileNode',
	RemovePin = 'removePin',
	RemoveFileNode = 'removeFileNode',
	OpenLocation = 'openLocation',
	ViewportChanged = 'viewportChanged',
}

export type WebviewToExtensionMessage =
	| { type: WebviewMessageType.Ready }
	| { type: WebviewMessageType.MoveFileNode; filePath: string; x: number; y: number }
	| { type: WebviewMessageType.RemovePin; id: string }
	| { type: WebviewMessageType.RemoveFileNode; filePath: string }
	| { type: WebviewMessageType.OpenLocation; file: string; line: number }
	/** The viewport center in flow coordinates — new nodes land there. */
	| { type: WebviewMessageType.ViewportChanged; x: number; y: number };

export enum ExtensionMessageType {
	SetState = 'setState',
	SetActiveFile = 'setActiveFile',
}

export type ExtensionToWebviewMessage =
	| { type: ExtensionMessageType.SetState; fileNodes: FileNode[] }
	/** Workspace-relative path of the active editor's file — its node highlights on the map. */
	| { type: ExtensionMessageType.SetActiveFile; filePath: string };
