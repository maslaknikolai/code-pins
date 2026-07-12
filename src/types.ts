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

/** One pinned entity; lives inside the FileNode of its file. */
export interface Pin {
	id: string;
	kind: PinKind;
	/** Location of the entity's definition — pins sharing a key are linked by an arrow. */
	definitionKey: string;
	/** The pinned entity name */
	symbolName: string;
	lines: PinLine[];
}

/** A node on the map: one file, holding every pin made in it. filePath is the node's identity. */
export interface FileNode {
	filePath: string;
	x: number;
	y: number;
	pins: Pin[];
}

/** Saved map format. Arrows are not stored — they are computed from definitionKey. */
export interface MapFile {
	version: 2;
	fileNodes: FileNode[];
}

export enum WebviewMessageType {
	Ready = 'ready',
	MoveFileNode = 'moveFileNode',
	RemovePin = 'removePin',
	OpenLocation = 'openLocation',
}

export enum ExtensionMessageType {
	SetState = 'setState',
}

export type WebviewToExtensionMessage =
	| { type: WebviewMessageType.Ready }
	| { type: WebviewMessageType.MoveFileNode; filePath: string; x: number; y: number }
	| { type: WebviewMessageType.RemovePin; id: string }
	| { type: WebviewMessageType.OpenLocation; file: string; line: number };

export type ExtensionToWebviewMessage = { type: ExtensionMessageType.SetState; fileNodes: FileNode[] };
