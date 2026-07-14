import * as vscode from 'vscode';


export class GraphPanelState {
	private panel: vscode.WebviewPanel | undefined;

	getPanel(): vscode.WebviewPanel | undefined {
		return this.panel;
	}

	setPanel(panel: vscode.WebviewPanel | undefined): void {
		this.panel = panel;
	}
}
