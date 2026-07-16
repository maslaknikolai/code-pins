import * as vscode from 'vscode';
import { AppCtx } from '../types';


export function onGraphsChange(
	{ pinsGraphsStore, activePinsGraphIdStore }: AppCtx,
	listener: () => void
): vscode.Disposable {
	return vscode.Disposable.from(
		pinsGraphsStore.onDidChange(listener),
		activePinsGraphIdStore.onDidChange(listener)
	);
}
