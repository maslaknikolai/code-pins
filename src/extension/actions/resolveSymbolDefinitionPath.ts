import * as vscode from 'vscode';
import { buildPinPath } from '../../shared/pinPath';
import { getRelativePath } from '../utils/getRelativePath';

/** Resolves the symbol's definition and returns its location key, or undefined when the provider gives nothing. */
export async function resolveSymbolDefinitionPath(
	document: vscode.TextDocument,
	position: vscode.Position
): Promise<string | undefined> {
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

	return buildPinPath(getRelativePath(uri), range.start.line, range.start.character);
}
