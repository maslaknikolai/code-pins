import * as vscode from 'vscode';
import { PinsGraphFile, SUPPORTED_PINS_GRAPH_FILE_VERSION } from '../../shared/types';
import { FILE_FILTERS } from './exportGraph';
import { AppCtx } from '../types';
import { createPinsGraph } from './createPinsGraph';
import { getNextGraphName } from './getNextGraphName';
import { setActiveGraph } from './setActiveGraph';


export async function importGraphFile(appCtx: AppCtx): Promise<void> {
	const pickedFiles = await vscode.window.showOpenDialog({
		filters: FILE_FILTERS,
		canSelectMany: true
	});

	if (!pickedFiles || pickedFiles.length === 0) {
		return;
	}

	for (const pickedFile of pickedFiles) {
		const raw = await vscode.workspace.fs.readFile(pickedFile);
		const pinsGraphFile = parsePinsGraphFile(raw);

		if (!pinsGraphFile) {
			vscode.window.showErrorMessage(`Code Pins: ${pickedFile.fsPath} is not a valid Code Pins file.`);
			continue;
		}

		if (pinsGraphFile.version > SUPPORTED_PINS_GRAPH_FILE_VERSION) {
			vscode.window.showErrorMessage(`Code Pins: ${pickedFile.fsPath} version ${pinsGraphFile.version} is newer than supported version ${SUPPORTED_PINS_GRAPH_FILE_VERSION}.`);
			continue;
		}

		const name = getNextGraphName(pinsGraphFile.pinsGraph.label || 'imported', appCtx);

		setActiveGraph(createPinsGraph(name, pinsGraphFile.pinsGraph.fileNodes), appCtx);
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
