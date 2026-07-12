import { randomUUID } from 'crypto';
import * as vscode from 'vscode';
import { Pin, PinKind, PinLine } from '../types';
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
	const lines = await buildBreadcrumbLines(document, position, wordRange);

	return {
		filePath: getRelativePath(document.uri),
		pin: {
			id: randomUUID(),
			kind: getPinKind(document, position, definition),
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

/**
 * A pin is a declaration when its definition points back at itself.
 * With no resolved definition this is only a provisional guess (declaration) —
 * retryUnresolvedDefinitions recomputes it once the definition resolves.
 */
export function getPinKind(
	document: vscode.TextDocument,
	position: vscode.Position,
	definition: ResolvedDefinition | undefined
): PinKind {
	const isDeclaration = definition === undefined || (
		getRelativePath(definition.uri) === getRelativePath(document.uri) &&
		definition.range.contains(position)
	);
	return isDeclaration ? PinKind.Declaration : PinKind.Reference;
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

	const key = `${getRelativePath(uri)}:${range.start.line}:${range.start.character}`;

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
	position: vscode.Position,
	wordRange: vscode.Range
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
		scopeLines.push(enclosing.range.start.line);
		level = enclosing.children ?? [];
	}

	if (scopeLines[scopeLines.length - 1] !== position.line) {
		scopeLines.push(position.line);
	}

	return scopeLines.map((line, index) => {
		const rawText = document.lineAt(line).text;
		const text = rawText.trim();
		const trimOffset = rawText.length - rawText.trimStart().length;
		const isPinnedWordLine = line === wordRange.start.line;
		return {
			line,
			text,
			indent: index,
			...(isPinnedWordLine && {
				symbolRange: {
					start: wordRange.start.character - trimOffset,
					end: wordRange.end.character - trimOffset,
				},
			}),
		};
	});
}
