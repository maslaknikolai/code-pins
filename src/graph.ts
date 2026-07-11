import * as vscode from 'vscode';
import { Pin } from './types';


export class PinsStore {
	private pins: Pin[] = [];

	private readonly _onDidChange = new vscode.EventEmitter<void>();
	readonly onDidChange = this._onDidChange.event;

	getPins(): Pin[] {
		return this.pins;
	}

	setPins(pins: Pin[], options?: { silent?: boolean }): void {
		this.pins = pins;
		if (!options?.silent) {
			this._onDidChange.fire();
		}
	}
}
