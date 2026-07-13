export const MAP_FIELD = {
	width: 5000,
	height: 5000
};

export interface PinLine {
	/** Zero-based line number in the source file. */
	line: number;
	/** Raw source line, indentation included — so the pinned symbol's position inside it equals the symbolLocationPath column. */
	text: string;
}

/**
 * One pinned entity; lives inside the FileNode of its file.
 * No stored "kind": a pin is a declaration exactly when symbolDefinitionPath === symbolLocationPath.
 */
export interface Pin {
	id: string;
	/**
	 * The pinned symbol's own location (`path:line:char`). A symbol can be a
	 * declaration and a reference at once (`const {addTab} = useMethods()`), so
	 * pins are linked when one's symbolDefinitionPath equals another's symbolLocationPath.
	 */
	symbolLocationPath: string;
	/**
	 * Location of the entity's definition, same format as symbolLocationPath.
	 * Undefined when the language server couldn't resolve the definition at pin time
	 * (e.g. still indexing); such pins get no arrows until a retry resolves them.
	 */
	symbolDefinitionPath?: string;
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

/** Saved file format */
export interface CodePinsFile {
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
