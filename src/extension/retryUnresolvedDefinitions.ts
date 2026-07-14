import * as vscode from 'vscode';
import { ActivePinsGraphStore } from './active-pins-graph-store';
import { parsePinPath } from '../shared/pinPath';
import { Pin } from '../shared/types';
import { resolveSymbolDefinitionPath } from './pin';
import { resolveUri } from './utils/resolveUri';

export async function retryUnresolvedDefinitions(activePinsGraphStore: ActivePinsGraphStore): Promise<void> {
	let changed = false;

	const updated = await Promise.all(activePinsGraphStore.getFileNodes().map(async (node) => {
		const pins = await Promise.all(node.pins.map(async (pin) => {
			const symbolDefinitionPath = await resolveSymbolDefinitionPathAtPinLocation(node.filePath, pin);
			if (!symbolDefinitionPath || symbolDefinitionPath === pin.symbolDefinitionPath) {
				return pin;
			}
			changed = true;
			const updatedPin: Pin = { ...pin, symbolDefinitionPath };
			return updatedPin;
		}));
		return { ...node, pins };
	}));

	if (changed) {
		activePinsGraphStore.setFileNodes(updated);
	}
}

async function resolveSymbolDefinitionPathAtPinLocation(filePath: string, pin: Pin): Promise<string | undefined> {
	if (pin.symbolDefinitionPath && pin.symbolDefinitionPath !== pin.pinPath) {
		return undefined;
	}

	try {
		const document = await vscode.workspace.openTextDocument(resolveUri(filePath));
		const location = parsePinPath(pin.pinPath);
		const position = new vscode.Position(location.line, location.character);

		return await resolveSymbolDefinitionPath(document, position);
	} catch {
		return undefined;
	}
}
