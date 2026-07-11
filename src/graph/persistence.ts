import * as vscode from 'vscode';
import { PinsStore } from '../pins-store';
import { MapFile } from '../types';

const FILE_FILTERS = { 'Code Pins Map': ['json'] };

export async function saveMap(pinsStore: PinsStore): Promise<void> {
	const target = await vscode.window.showSaveDialog({ filters: FILE_FILTERS });
	if (!target) {
		return;
	}
	const data: MapFile = { version: 1, pins: pinsStore.getPins() };
	await vscode.workspace.fs.writeFile(target, Buffer.from(JSON.stringify(data, null, '\t'), 'utf8'));
	vscode.window.setStatusBarMessage(`Code Pins: map saved to ${target.fsPath}`, 3000);
}

/** Returns true when a map was picked and loaded into the store. */
export async function openMap(pinsStore: PinsStore): Promise<boolean> {
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
	pinsStore.setPins(data.pins);
	return true;
}

function parseMapFile(raw: Uint8Array): MapFile | undefined {
	try {
		const data = JSON.parse(Buffer.from(raw).toString('utf8')) as MapFile;
		return Array.isArray(data.pins) ? data : undefined;
	} catch {
		return undefined;
	}
}
