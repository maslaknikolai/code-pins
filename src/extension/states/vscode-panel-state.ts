import * as vscode from 'vscode';


export class VSCodePanelState {
	private panel: vscode.WebviewPanel | undefined;

	getPanel(): vscode.WebviewPanel | undefined {
		return this.panel;
	}

	setPanel(panel: vscode.WebviewPanel | undefined): void {
		this.panel = panel;
	}
}
