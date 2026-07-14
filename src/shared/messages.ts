import type { Coords, PinsGraph } from './types';


export enum WebviewMessageType {
	Ready = 'ready',
	MoveFileNode = 'moveFileNode',
	RemovePin = 'removePin',
	RemoveFileNode = 'removeFileNode',
	OpenLocation = 'openLocation',
	ViewportChanged = 'viewportChanged',
	SwitchGraph = 'switchGraph',
	DeleteGraph = 'deleteGraph',
	ImportGraph = 'importGraph',
	NewGraph = 'newGraph',
	CloneGraph = 'cloneGraph',
	RenameGraph = 'renameGraph',
	ExportGraph = 'exportGraph',
}

export type WebviewToExtensionMessage =
	| { type: WebviewMessageType.Ready }
	| { type: WebviewMessageType.MoveFileNode; filePath: string; position: Coords }
	| { type: WebviewMessageType.RemovePin; id: string }
	| { type: WebviewMessageType.RemoveFileNode; filePath: string }
	| { type: WebviewMessageType.OpenLocation; file: string; line: number }
	| { type: WebviewMessageType.ViewportChanged; position: Coords }
	| { type: WebviewMessageType.SwitchGraph; id: string }
	| { type: WebviewMessageType.DeleteGraph; id: string }
	| { type: WebviewMessageType.ImportGraph }
	| { type: WebviewMessageType.NewGraph }
	| { type: WebviewMessageType.CloneGraph; id: string }
	| { type: WebviewMessageType.RenameGraph; id: string }
	| { type: WebviewMessageType.ExportGraph; id: string };

export enum ExtensionMessageType {
	SetState = 'setState',
	SetActiveFile = 'setActiveFile',
}

export type ExtensionToWebviewMessage =
	| { type: ExtensionMessageType.SetState; graphs: PinsGraph[]; activeGraphId: string }
	| { type: ExtensionMessageType.SetActiveFile; filePath: string };
