import { AppCtx } from "../../types";
import { WebviewMessageType, WebviewToExtensionMessage } from '../../../shared/messages';
import { openLocation } from './openLocation';
import { sendInitialStateToWebview } from './sendStateToWebview';
import { removePinsGraph } from '../removePinsGraph';
import { exportGraph } from '../exportGraph';
import { cloneGraph } from '../cloneGraph';
import { addNewGraph } from '../addNewGraph';
import { importGraphFile } from '../importGraphFile';
import { moveFileNode } from '../moveFileNode';
import { removeFileNode } from '../removeFileNode';
import { renameGraph } from '../renameGraph';
import { removePin } from '../removePin';
import { sendGraphsToWebview } from "./sendGraphsToWebview";
import { sendActiveFileToWebview } from "./sendActiveFileToWebview";
import { WebviewPanel } from "vscode";
import type { PanelCallbacks } from "./createPanel";

export function handleMessageFromWebview(
    message: WebviewToExtensionMessage,
    panel: WebviewPanel,
    callbacks: PanelCallbacks,
    appCtx: AppCtx,
) {
    if (message.type === WebviewMessageType.Ready) {
        sendInitialStateToWebview(panel.webview, appCtx);
        sendGraphsToWebview(panel.webview, appCtx);
        sendActiveFileToWebview(panel.webview);
        callbacks.onShow?.(panel);
    }
    if (message.type === WebviewMessageType.MoveFileNode) {
        moveFileNode(message.filePath, message.position, appCtx);
    }
    if (message.type === WebviewMessageType.RemovePin) {
        removePin(message.id, appCtx);
    }
    if (message.type === WebviewMessageType.RemoveFileNode) {
        removeFileNode(message.filePath, appCtx);
    }
    if (message.type === WebviewMessageType.OpenLocation) {
        openLocation(message.file, message.line);
    }
    if (message.type === WebviewMessageType.ViewSettingsChanged) {
        appCtx.viewSettingsStore.set(message.viewSettings);
    }
    if (message.type === WebviewMessageType.SwitchGraph) {
        appCtx.activePinsGraphIdStore.set(message.id);
    }
    if (message.type === WebviewMessageType.DeleteGraph) {
        removePinsGraph(message.id, appCtx);
    }
    if (message.type === WebviewMessageType.ImportGraph) {
        importGraphFile(appCtx);
    }
    if (message.type === WebviewMessageType.NewGraph) {
        addNewGraph(appCtx);
    }
    if (message.type === WebviewMessageType.CloneGraph) {
        cloneGraph(message.id, appCtx);
    }
    if (message.type === WebviewMessageType.RenameGraph) {
        renameGraph(message.id, appCtx);
    }
    if (message.type === WebviewMessageType.ExportGraph) {
        exportGraph(message.id, appCtx);
    }
}
