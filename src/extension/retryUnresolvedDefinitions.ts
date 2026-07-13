import * as vscode from 'vscode';
import { FileNodesStore } from './file-nodes-store';
import { parsePinPath } from '../shared/pinPath';
import { Pin } from '../shared/types';
import { resolveSymbolDefinitionPath } from './pin';
import { resolveUri } from './utils/resolveUri';

/**
 * Pins created while the language server couldn't resolve a definition have no
 * symbolDefinitionPath and therefore no arrows. This re-runs the definition request at
 * each such pin's stored location and fills the key in once it resolves.
 */
export async function retryUnresolvedDefinitions(store: FileNodesStore): Promise<void> {
	let changed = false;

	const updated = await Promise.all(store.getFileNodes().map(async (node) => {
		const pins = await Promise.all(node.pins.map(async (pin) => {
			const symbolDefinitionPath = await resolveSymbolDefinitionPathAtPinLocation(node.filePath, pin);
			if (!symbolDefinitionPath) {
				return pin;
			}
			changed = true;
			const updatedPin: Pin = { ...pin, symbolDefinitionPath };
			return updatedPin;
		}));
		return { ...node, pins };
	}));

	if (changed) {
		store.setFileNodes(updated);
	}
}

/** Re-runs the definition request at the pin's stored location; undefined when already resolved or still unresolvable. */
async function resolveSymbolDefinitionPathAtPinLocation(filePath: string, pin: Pin): Promise<string | undefined> {
	if (pin.symbolDefinitionPath) {
		return undefined;
	}

	try {
		const document = await vscode.workspace.openTextDocument(resolveUri(filePath));
		const location = parsePinPath(pin.pinPath);
		const position = new vscode.Position(location.line, location.character);

		return await resolveSymbolDefinitionPath(document, position);
	} catch {
		// File may be gone or unreadable — leave the pin as is.
		return undefined;
	}
}
