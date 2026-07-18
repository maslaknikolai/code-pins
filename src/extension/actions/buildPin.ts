import { randomUUID } from 'crypto';
import * as vscode from 'vscode';
import { buildPinPath } from '../../shared/pinPath';
import { Pin, PinLine } from '../../shared/types';
import { getRelativePath } from '../utils/getRelativePath';
import { resolveSymbolDefinitionPath } from './resolveSymbolDefinitionPath';

/**
 * Builds a pin for the entity under the cursor: resolves its definition
 * (same lookup as cmd+click) and collects the enclosing-scope breadcrumb lines.
 */
export function buildPin(
	editor: vscode.TextEditor
): Promise<{ filePath: string; pin: Pin } | undefined> {
	return buildPinAt(editor.document, editor.selection.active);
}

/** Same as {@link buildPin}, but for any document position instead of the cursor. */
export async function buildPinAt(
	document: vscode.TextDocument,
	position: vscode.Position
): Promise<{ filePath: string; pin: Pin } | undefined> {
	const wordRange = document.getWordRangeAtPosition(position);

	if (!wordRange) {
		return undefined;
	}

	const word = document.getText(wordRange);
	const symbolDefinitionPath = await resolveSymbolDefinitionPath(document, position);
	const lines = await buildBreadcrumbLines(document, position);

	return {
		filePath: getRelativePath(document.uri),
		pin: {
			id: randomUUID(),
			pinPath: buildPinPath(getRelativePath(document.uri), wordRange.start.line, wordRange.start.character),
			symbolDefinitionPath,
			symbolName: word,
			lines,
		},
	};
}

/**
 * Walks the document symbol tree down to the cursor, taking the first line of
 * every enclosing scope, and ends with the cursor's own line.
 */
async function buildBreadcrumbLines(
	document: vscode.TextDocument,
	position: vscode.Position
): Promise<PinLine[]> {
	const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[] | undefined>(
		'vscode.executeDocumentSymbolProvider',
		document.uri
	);

	const scopeLines: number[] = [];
	let level = symbols ?? [];
	while (level.length > 0) {
		const enclosing = level.find((s) => 'range' in s && s.range.contains(position));
		if (!enclosing) {
			break;
		}
		// Nested symbols can start on the same line (`const x = useMemo(() => [`) — keep it once.
		const line = enclosing.range.start.line;
		if (scopeLines[scopeLines.length - 1] !== line) {
			scopeLines.push(line);
		}
		level = enclosing.children ?? [];
	}

	if (scopeLines[scopeLines.length - 1] !== position.line) {
		scopeLines.push(position.line);
	}

	// Raw text, indentation included — the pinPath column points straight into it.
	return scopeLines.map((line) => ({
		line,
		text: document.lineAt(line).text,
	}));
}
