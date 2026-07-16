import * as vscode from 'vscode';


export function createVSCodePanelState() {
	let panel: vscode.WebviewPanel | undefined;

	return {
		getPanel: (): vscode.WebviewPanel | undefined => panel,

		setPanel: (next: vscode.WebviewPanel | undefined): void => {
			panel = next;
		}
	};
}

export type VSCodePanelState = ReturnType<typeof createVSCodePanelState>;
