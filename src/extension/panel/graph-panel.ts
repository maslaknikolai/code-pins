import * as vscode from 'vscode';
import { WebviewToExtensionMessage } from '../../shared/messages';
import { FileNodesStore } from '../file-nodes-store';
import { PinsGraphsStore } from '../pins-graphs-store';
import { ViewportCenterStore } from '../viewport-center-store';
import { renderHtml } from './html';
import { handleWebviewMessage } from './messages';
import { sendActiveFileToWebview } from './sendActiveFileToWebview';
import { sendStateToWebview } from './sendStateToWebview';

/** The single graph webview panel: reveal-or-create plus its title. */
export class GraphPanel {
	private panel: vscode.WebviewPanel | undefined;

	constructor(
		private readonly context: vscode.ExtensionContext,
		private readonly fileNodesStore: FileNodesStore,
		private readonly viewportCenterStore: ViewportCenterStore,
		private readonly pinsGraphsStore: PinsGraphsStore
	) {}

	/** Reveals the existing panel or creates one, and refreshes the title with the active graph name. */
	show(): void {
		if (!this.panel) {
			this.panel = this.createPanel();
			this.panel.onDidDispose(() => {
				this.panel = undefined;
			});
		} else {
			this.panel.reveal(undefined, true);
		}

		this.refreshTitle();
	}

	/** Puts the active graph's name into the panel tab; no-op while the panel is closed. */
	refreshTitle(): void {
		if (this.panel) {
			this.panel.title = `Code Pins — ${this.pinsGraphsStore.getActiveGraphName()}`;
		}
	}

	private createPanel(): vscode.WebviewPanel {
		const panel = vscode.window.createWebviewPanel(
			'codePins',
			'Code Pins',
			{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'dist')],
			}
		);

		panel.webview.html = renderHtml(panel.webview, this.context.extensionUri);

		const disposables: vscode.Disposable[] = [
			panel.webview.onDidReceiveMessage((message: WebviewToExtensionMessage) => {
				handleWebviewMessage(message, {
					fileNodesStore: this.fileNodesStore,
					sendStateToWebview: () => sendStateToWebview(panel.webview, this.fileNodesStore),
					sendActiveFileToWebview: () => sendActiveFileToWebview(panel.webview),
					viewportCenterStore: this.viewportCenterStore,
				});
			}),
			this.fileNodesStore.onDidChange(() => {
				sendStateToWebview(panel.webview, this.fileNodesStore);
			}),
			vscode.window.onDidChangeActiveTextEditor((editor) => {
				sendActiveFileToWebview(panel.webview, editor);
			}),
		];

		panel.onDidDispose(() => {
			disposables.forEach((d) => d.dispose());
		});

		return panel;
	}
}
