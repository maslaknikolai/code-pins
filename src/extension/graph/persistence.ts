import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import { PinsGraph } from '../../shared/types';

const FILE_FILTERS = { 'Code Pins File': ['json'] };

export async function savePinsGraph(store: FileNodesStore): Promise<void> {
	const target = await vscode.window.showSaveDialog({ filters: FILE_FILTERS });
	if (!target) {
		return;
	}
	const data: PinsGraph = { version: 1, fileNodes: store.getFileNodes() };
	await vscode.workspace.fs.writeFile(target, Buffer.from(JSON.stringify(data, null, '\t'), 'utf8'));
	vscode.window.setStatusBarMessage(`Code Pins: saved to ${target.fsPath}`, 3000);
}

/** Returns true when a file was picked and loaded into the store. */
export async function openPinsGraph(store: FileNodesStore): Promise<boolean> {
	const picked = await vscode.window.showOpenDialog({ filters: FILE_FILTERS, canSelectMany: false });
	if (!picked || picked.length === 0) {
		return false;
	}
	const raw = await vscode.workspace.fs.readFile(picked[0]);
	const data = parsePinsGraph(raw);
	if (!data) {
		vscode.window.showErrorMessage('Code Pins: not a valid Code Pins file.');
		return false;
	}
	store.setFileNodes(data.fileNodes);
	return true;
}

function parsePinsGraph(raw: Uint8Array): PinsGraph | undefined {
	try {
		const data = JSON.parse(Buffer.from(raw).toString('utf8')) as PinsGraph;
		return Array.isArray(data.fileNodes) ? data : undefined;
	} catch {
		return undefined;
	}
}
