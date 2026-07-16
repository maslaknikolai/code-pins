import * as vscode from 'vscode';
import { AppCtx } from '../types';


export function onGraphsChange(
	listener: () => void,
	{ pinsGraphsStore, activePinsGraphIdStore }: AppCtx
): vscode.Disposable {
	return vscode.Disposable.from(
		pinsGraphsStore.onDidChange(listener),
		activePinsGraphIdStore.onDidChange(listener)
	);
}
