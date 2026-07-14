import * as vscode from 'vscode';
import { PinsGraphFile, SUPPORTED_PINS_GRAPH_FILE_VERSION } from '../../shared/types';
import { FILE_FILTERS } from '../commands/exportActiveGraphCommand';
import { createPinsGraph } from '../states/active-pins-graph-state';
import { sendStateToWebview } from './panel/sendStateToWebview';
import { AppCtx } from '../types';


export async function importGraphFile(appCtx: AppCtx): Promise<void> {
	const pickedFile = await vscode.window.showOpenDialog({
		filters: FILE_FILTERS,
		canSelectMany: false
	});

	if (!pickedFile || pickedFile.length === 0) {
		return;
	}

	const raw = await vscode.workspace.fs.readFile(pickedFile[0]);
	const pinsGraphFile = parsePinsGraphFile(raw);

	if (!pinsGraphFile) {
		vscode.window.showErrorMessage('Code Pins: not a valid Code Pins file.');
		return;
	}

	if (pinsGraphFile.version > SUPPORTED_PINS_GRAPH_FILE_VERSION) {
		vscode.window.showErrorMessage(`Code Pins: file version ${pinsGraphFile.version} is newer than supported version ${SUPPORTED_PINS_GRAPH_FILE_VERSION}.`);
		return;
	}

	const defaultName = appCtx.pinsGraphsStore.getNextName(pinsGraphFile.pinsGraph.label || '');
	const input = await vscode.window.showInputBox({ prompt: 'Imported graph name', value: defaultName });

	if (!input) {
		return;
	}

	appCtx.activePinsGraphState.setPinsGraph(createPinsGraph(input, pinsGraphFile.pinsGraph.fileNodes));

	const panel = appCtx.vsCodePanelState.getPanel();
	if (panel) {
		sendStateToWebview(panel.webview, appCtx);
	}
}

function parsePinsGraphFile(raw: Uint8Array): PinsGraphFile | undefined {
	try {
		const data = JSON.parse(Buffer.from(raw).toString('utf8')) as PinsGraphFile;
		return Array.isArray(data.pinsGraph?.fileNodes) ? data : undefined;
	} catch {
		return undefined;
	}
}
