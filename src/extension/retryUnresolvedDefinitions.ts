import * as vscode from 'vscode';
import { FileNodesStore } from './file-nodes-store';
import { Pin } from '../types';
import { getPinKind, resolveDefinition } from './pin';
import { resolveUri } from './utils/resolveUri';

/**
 * Pins created while the language server couldn't resolve a definition have no
 * definitionKey and therefore no arrows. This re-runs the definition request at
 * each such pin's stored location and fills the key in once it resolves.
 */
export async function retryUnresolvedDefinitions(store: FileNodesStore): Promise<void> {
	let changed = false;

	const updated = await Promise.all(store.getFileNodes().map(async (node) => {
		const pins = await Promise.all(node.pins.map(async (pin) => {
				const resolved = await resolvePinDefinition(node.filePath, pin);
				if (resolved) {
					changed = true;
				}
				return resolved || pin;
			})
		);
		return { ...node, pins };
	}));

	if (changed) {
		store.setFileNodes(updated);
	}
}

/** Returns the pin with a resolved definitionKey, or undefined when nothing changed. */
async function resolvePinDefinition(filePath: string, pin: Pin): Promise<Pin | undefined> {
	if (pin.definitionKey) {
		return undefined;
	}
	const pinnedLine = pin.lines[pin.lines.length - 1];
	if (!pinnedLine?.symbolRange) {
		return undefined;
	}

	try {
		const document = await vscode.workspace.openTextDocument(resolveUri(filePath));
		// The stored text is trimmed, so re-add the line's leading whitespace to the symbol offset.
		const rawText = document.lineAt(pinnedLine.line).text;
		const trimOffset = rawText.length - rawText.trimStart().length;
		const position = new vscode.Position(pinnedLine.line, trimOffset + pinnedLine.symbolRange.start);

		const definition = await resolveDefinition(document, position);

		if (!definition) {
			return undefined;
		}

		return {
			...pin,
			definitionKey: definition.key,
			// The kind stored at pin time was a provisional guess (no definition to compare
			// against), so recompute it now.
			kind: getPinKind(document, position, definition),
		};
	} catch {
		// File may be gone or unreadable — leave the pin as is.
		return undefined;
	}
}
