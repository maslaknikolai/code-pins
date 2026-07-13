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

export interface PinsGraph {
	version: 1;
	fileNodes: FileNode[];
}

export interface Coords {
	x: number;
	y: number;
}
