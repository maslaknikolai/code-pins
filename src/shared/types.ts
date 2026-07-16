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
	position: Coords
	pins: Pin[];
}

export interface PinsGraph {
	id: string
	label: string
	fileNodes: FileNode[];
}

export type PinGraphWithoutId = Omit<PinsGraph, 'id'>;

export const SUPPORTED_PINS_GRAPH_FILE_VERSION = 1;

export interface PinsGraphFile {
	version: typeof SUPPORTED_PINS_GRAPH_FILE_VERSION;
	pinsGraph: PinGraphWithoutId
}

export interface Coords {
	x: number;
	y: number;
}

export type ViewSettings = {
	position?: Coords,
	zoom?: number
	isDrawerOpen?: boolean
}