import type { Coords, Pin, PinsGraph, ViewSettings } from './types';


export enum WebviewMessageType {
	Ready = 'ready',
	MoveFileNodes = 'moveFileNodes',
	Undo = 'undo',
	RemovePin = 'removePin',
	RemoveFileNode = 'removeFileNode',
	OpenLocation = 'openLocation',
	ViewSettingsChanged = 'viewSettingsChanged',
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
	| { type: WebviewMessageType.MoveFileNodes; moves: { filePath: string; position: Coords }[] }
	| { type: WebviewMessageType.Undo }
	| { type: WebviewMessageType.RemovePin; id: string }
	| { type: WebviewMessageType.RemoveFileNode; filePath: string }
	| { type: WebviewMessageType.OpenLocation; file: string; line: number }
	| { type: WebviewMessageType.ViewSettingsChanged; viewSettings: ViewSettings | undefined }
	| { type: WebviewMessageType.SwitchGraph; id: string }
	| { type: WebviewMessageType.DeleteGraph; id: string }
	| { type: WebviewMessageType.ImportGraph }
	| { type: WebviewMessageType.NewGraph }
	| { type: WebviewMessageType.CloneGraph; id: string }
	| { type: WebviewMessageType.RenameGraph; id: string }
	| { type: WebviewMessageType.ExportGraph; id: string };

export enum ExtensionMessageType {
	SetInitialState = 'setInitialState',
	SetActiveFile = 'setActiveFile',
	SetGraphs = 'setGraphs',
	SetSelectedPin = 'setSelectedPin',
}

export type ExtensionToWebviewMessage =
	| {
		type: ExtensionMessageType.SetInitialState;
		viewSettings: ViewSettings | undefined
	} | {
		type: ExtensionMessageType.SetActiveFile;
		filePath: string
	} | {
		type: ExtensionMessageType.SetGraphs;
		activeGraph: PinsGraph | undefined
		graphs: PinsGraph[]
	} | {
		type: ExtensionMessageType.SetSelectedPin;
		pin: Pin | undefined
	};
