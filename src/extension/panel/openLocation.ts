import * as vscode from 'vscode';
import { resolveUri } from '../utils/resolveUri';

/** Opens the file in the first editor column with the cursor on the given line, centered. */
export async function openLocation(file: string, line: number): Promise<void> {
	const document = await vscode.workspace.openTextDocument(resolveUri(file));
	const editor = await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.One });
	const position = new vscode.Position(line, 0);
	editor.selection = new vscode.Selection(position, position);
	editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
}
