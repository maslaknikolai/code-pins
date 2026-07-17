import * as vscode from 'vscode';


export interface PanelCallbacks {
    /** Runs once the webview can receive messages. */
    onReady?: (panel: vscode.WebviewPanel) => void;
}