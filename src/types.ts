export type PinKind = 'reference' | 'declaration';

export interface PinLine {
	/** Zero-based line number in the source file. */
	line: number;
	text: string;
	/** Breadcrumb depth, used for display indentation. */
	indent: number;
}

export interface Pin {
	id: string;
	kind: PinKind;
	filePath: string;
	fileName: string;
	/** Location of the entity's definition — pins sharing a key are linked by an arrow. */
	definitionKey: string;
	/** The pinned entity name, highlighted in declaration nodes. */
	highlightWord: string;
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
