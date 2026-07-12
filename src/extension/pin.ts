import { randomUUID } from 'crypto';
import * as vscode from 'vscode';
import { buildLocationKey } from '../locationKey';
import { Pin, PinLine } from '../types';
import { getRelativePath } from './utils/getRelativePath';

/**
 * Builds a pin for the entity under the cursor: resolves its definition
 * (same lookup as cmd+click) and collects the enclosing-scope breadcrumb lines.
 */
export async function buildPin(
	editor: vscode.TextEditor
): Promise<{ filePath: string; pin: Pin } | undefined> {
	const document = editor.document;
	const position = editor.selection.active;
	const wordRange = document.getWordRangeAtPosition(position);

	if (!wordRange) {
		vscode.window.showWarningMessage('Code Pins: place the cursor on a symbol to pin it.');
		return undefined;
	}

	const word = document.getText(wordRange);
	const definition = await resolveDefinition(document, position);
	const lines = await buildBreadcrumbLines(document, position);

	return {
		filePath: getRelativePath(document.uri),
		pin: {
			id: randomUUID(),
			locationKey: buildLocationKey(getRelativePath(document.uri), wordRange.start.line, wordRange.start.character),
			definitionKey: definition?.key,
			symbolName: word,
			lines,
		},
	};
}

export interface ResolvedDefinition {
	uri: vscode.Uri;
	range: vscode.Range;
	key: string;
}

export async function resolveDefinition(
	document: vscode.TextDocument,
	position: vscode.Position
): Promise<ResolvedDefinition | undefined> {
	const results = await vscode.commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>(
		'vscode.executeDefinitionProvider',
		document.uri,
		position
	);
	const first = results?.[0];
	if (!first) {
		return undefined;
	}
	const uri = 'targetUri' in first ? first.targetUri : first.uri;
	const range = 'targetUri' in first ? (first.targetSelectionRange ?? first.targetRange) : first.range;

	const key = buildLocationKey(getRelativePath(uri), range.start.line, range.start.character);

	return {
		uri,
		range,
		key,
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

	// Raw text, indentation included — the locationKey column points straight into it.
	return scopeLines.map((line) => ({
		line,
		text: document.lineAt(line).text,
	}));
}
