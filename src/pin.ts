import { randomUUID } from 'crypto';
import * as vscode from 'vscode';
import { Pin, PinKind, PinLine } from './types';

/**
 * Builds a pin for the entity under the cursor: resolves its definition
 * (same lookup as cmd+click) and collects the enclosing-scope breadcrumb lines.
 */
export async function buildPin(editor: vscode.TextEditor): Promise<Pin | undefined> {
	const document = editor.document;
	const position = editor.selection.active;

	const wordRange = document.getWordRangeAtPosition(position);
	if (!wordRange) {
		vscode.window.showWarningMessage('Code Pins: place the cursor on a symbol to pin it.');
		return undefined;
	}
	const word = document.getText(wordRange);

	const definition = await resolveDefinition(document, position);
	// Fallback: entity with no resolvable definition keys to its own location.
	const definitionKey = definition?.key ??
		`${document.uri.toString()}:${wordRange.start.line}:${wordRange.start.character}`;

	const isDeclaration = definition === undefined || (
		definition.uri.toString() === document.uri.toString() &&
		definition.range.contains(position)
	);

	const lines = await buildBreadcrumbLines(document, position);

	return {
		id: randomUUID(),
		kind: isDeclaration ? PinKind.Declaration : PinKind.Reference,
		filePath: document.uri.fsPath,
		definitionKey,
		symbolName: word,
		x: 0,
		y: 0,
		lines,
	};
}

interface ResolvedDefinition {
	uri: vscode.Uri;
	range: vscode.Range;
	key: string;
}

async function resolveDefinition(
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
	return { uri, range, key: `${uri.toString()}:${range.start.line}:${range.start.character}` };
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
		scopeLines.push(enclosing.range.start.line);
		level = enclosing.children ?? [];
	}

	if (scopeLines[scopeLines.length - 1] !== position.line) {
		scopeLines.push(position.line);
	}

	return scopeLines.map((line, index) => ({
		line,
		text: document.lineAt(line).text.trim(),
		indent: index,
	}));
}
