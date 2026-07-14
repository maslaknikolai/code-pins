import * as vscode from 'vscode';
import { WebviewToExtensionMessage } from '../../shared/messages';
import { ActivePinsGraphStore } from '../stores/active-pins-graph-store';
import { ViewportCenterStore } from '../stores/viewport-center-store';
import { renderHtml } from './html';
import { handleWebviewMessage } from './messages';
import { sendActiveFileToWebview } from './sendActiveFileToWebview';
import { sendStateToWebview } from './sendStateToWebview';

/** The single graph webview panel: reveal-or-create plus its title. */
export class GraphPanel {
	private panel: vscode.WebviewPanel | undefined;

	constructor(
		private readonly context: vscode.ExtensionContext,
		private readonly activePinsGraphStore: ActivePinsGraphStore,
		private readonly viewportCenterStore: ViewportCenterStore
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
			this.panel.title = `Code Pins — ${this.activePinsGraphStore.getGraphName()}`;
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
					activePinsGraphStore: this.activePinsGraphStore,
					sendStateToWebview: () => sendStateToWebview(panel.webview, this.activePinsGraphStore),
					sendActiveFileToWebview: () => sendActiveFileToWebview(panel.webview),
					viewportCenterStore: this.viewportCenterStore,
				});
			}),
			this.activePinsGraphStore.onDidChange(() => {
				sendStateToWebview(panel.webview, this.activePinsGraphStore);
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
