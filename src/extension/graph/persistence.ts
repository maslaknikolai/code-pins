import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import { MapFile } from '../../types';

const FILE_FILTERS = { 'Code Pins Map': ['json'] };

export async function saveMap(store: FileNodesStore): Promise<void> {
	const target = await vscode.window.showSaveDialog({ filters: FILE_FILTERS });
	if (!target) {
		return;
	}
	const data: MapFile = { version: 2, fileNodes: store.getFileNodes() };
	await vscode.workspace.fs.writeFile(target, Buffer.from(JSON.stringify(data, null, '\t'), 'utf8'));
	vscode.window.setStatusBarMessage(`Code Pins: map saved to ${target.fsPath}`, 3000);
}

/** Returns true when a map was picked and loaded into the store. */
export async function openMap(store: FileNodesStore): Promise<boolean> {
	const picked = await vscode.window.showOpenDialog({ filters: FILE_FILTERS, canSelectMany: false });
	if (!picked || picked.length === 0) {
		return false;
	}
	const raw = await vscode.workspace.fs.readFile(picked[0]);
	const data = parseMapFile(raw);
	if (!data) {
		vscode.window.showErrorMessage('Code Pins: file is not a valid map.');
		return false;
	}
	store.setFileNodes(data.fileNodes);
	return true;
}

function parseMapFile(raw: Uint8Array): MapFile | undefined {
	try {
		const data = JSON.parse(Buffer.from(raw).toString('utf8')) as MapFile;
		return Array.isArray(data.fileNodes) ? data : undefined;
	} catch {
		return undefined;
	}
}
