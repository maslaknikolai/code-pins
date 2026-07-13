export const MAP_FIELD = {
	width: 5000,
	height: 5000
};

export interface PinLine {
	line: number;
	text: string;
}

export interface Pin {
	id: string;
	symbolName: string;
	pinPath: string;
	symbolDefinitionPath?: string;
	lines: PinLine[];
}

export interface FileNode {
	filePath: string;
	x: number;
	y: number;
	pins: Pin[];
}

export interface CodePinsFile {
	version: 1;
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
