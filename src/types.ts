export const MAP_FIELD = {
	width: 5000,
	height: 5000
};

export enum PinKind {
	Reference = 'reference',
	Declaration = 'declaration',
}

export interface PinLine {
	/** Zero-based line number in the source file. */
	line: number;
	text: string;
	/** Breadcrumb depth, used for display indentation. */
	indent: number;
}

export interface Pin {
	id: string;
	definitionKey: string;
	kind: PinKind;
	symbolName: string;
	filePath: string;
	x: number;
	y: number;
	lines: PinLine[];
}

/** Saved map format. Arrows are not stored — they are computed from definitionKey. */
export interface MapFile {
	version: 1;
	pins: Pin[];
}

export enum WebviewMessageType {
	Ready = 'ready',
	MovePin = 'movePin',
	RemovePin = 'removePin',
	OpenLocation = 'openLocation',
}

export enum ExtensionMessageType {
	SetState = 'setState',
}

export type WebviewToExtensionMessage =
	| { type: WebviewMessageType.Ready }
	| { type: WebviewMessageType.MovePin; id: string; x: number; y: number }
	| { type: WebviewMessageType.RemovePin; id: string }
	| { type: WebviewMessageType.OpenLocation; file: string; line: number };

export type ExtensionToWebviewMessage = { type: ExtensionMessageType.SetState; pins: Pin[] };
