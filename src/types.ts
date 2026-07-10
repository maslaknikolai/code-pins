export type NodeKind = 'reference' | 'declaration';

export interface NodeLine {
	/** Zero-based line number in the source file. */
	line: number;
	text: string;
	/** Breadcrumb depth, used for display indentation. */
	indent: number;
}

export interface GraphNode {
	id: string;
	kind: NodeKind;
	filePath: string;
	fileName: string;
	/** Location of the entity's definition — nodes sharing a key are linked by an arrow. */
	definitionKey: string;
	/** The pinned entity name, highlighted in declaration nodes. */
	highlightWord: string;
	x: number;
	y: number;
	lines: NodeLine[];
}

/** Saved map format. Arrows are not stored — they are computed from definitionKey. */
export interface MapFile {
	version: 1;
	nodes: GraphNode[];
}

export type WebviewToExtensionMessage =
	| { type: 'ready' }
	| { type: 'moveNode'; id: string; x: number; y: number }
	| { type: 'openLocation'; file: string; line: number };

export type ExtensionToWebviewMessage = { type: 'setState'; nodes: GraphNode[] };
