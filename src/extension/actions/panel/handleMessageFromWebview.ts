import { AppCtx } from "../../types";
import { WebviewMessageType, WebviewToExtensionMessage } from '../../../shared/messages';
import { openLocation } from './openLocation';
import { sendViewportSettingToWebview } from './sendViewportSettingToWebview';
import { removePinsGraph } from '../graphs/removePinsGraph';
import { copyGraphAsText } from '../graphs/copyGraphAsText';
import { exportGraph } from '../graphs/exportGraph';
import { cloneGraph } from '../graphs/cloneGraph';
import { addNewGraph } from '../graphs/addNewGraph';
import { importGraphFile } from '../graphs/importGraphFile';
import { moveActiveGraphFileNodes } from '../activeGraph/moveActiveGraphFileNodes';
import { undoActiveGraph } from '../activeGraph/undoActiveGraph';
import { removeFileNodesFromActiveGraph } from '../activeGraph/removeFileNodesFromActiveGraph';
import { renameGraph } from '../graphs/renameGraph';
import { reorderGraphs } from '../graphs/reorderGraphs';
import { removePinFromActiveGraph } from '../activeGraph/removePinFromActiveGraph';
import { sendGraphsToWebview } from "./sendGraphsToWebview";
import { sendActiveFileToWebview } from "./sendActiveFileToWebview";
import { WebviewPanel } from "vscode";
import { PanelCallbacks } from "./types";

export function handleMessageFromWebview(
    message: WebviewToExtensionMessage,
    panel: WebviewPanel,
    callbacks: PanelCallbacks,
    appCtx: AppCtx,
) {
    if (message.type === WebviewMessageType.Ready) {
        sendViewportSettingToWebview(panel.webview, appCtx);
        sendGraphsToWebview(panel.webview, appCtx);
        sendActiveFileToWebview(appCtx);
        callbacks.onReady?.(panel);
    }
    if (message.type === WebviewMessageType.MoveFileNodes) {
        moveActiveGraphFileNodes(message.moves, appCtx);
    }
    if (message.type === WebviewMessageType.Undo) {
        undoActiveGraph(appCtx);
    }
    if (message.type === WebviewMessageType.RemovePin) {
        removePinFromActiveGraph(message.id, appCtx);
    }
    if (message.type === WebviewMessageType.RemoveFileNodes) {
        removeFileNodesFromActiveGraph(message.filePaths, appCtx);
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
    if (message.type === WebviewMessageType.CopyGraphAsText) {
        copyGraphAsText(message.id, appCtx);
    }
    if (message.type === WebviewMessageType.ReorderGraphs) {
        reorderGraphs(message.ids, appCtx);
    }
}
