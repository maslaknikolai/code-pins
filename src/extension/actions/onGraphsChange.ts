import * as vscode from 'vscode';
import { AppCtx } from '../types';

/** Fires on any change to the stored graphs or to which one is active. */
export function onGraphsChange(
	{ pinsGraphsStore, activePinsGraphIdStore }: AppCtx,
	listener: () => void
): vscode.Disposable {
	return vscode.Disposable.from(
		pinsGraphsStore.onDidChange(listener),
		activePinsGraphIdStore.onDidChange(listener)
	);
}
