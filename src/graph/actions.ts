import * as vscode from 'vscode';
import { PinsStore } from '../graph';
import { Pin } from '../types';

export function addPin(pinsStore: PinsStore, pin: Pin): void {
	const pins = pinsStore.getPins();
	if (pins.some((existing) => pinsSameLine(existing, pin))) {
		vscode.window.setStatusBarMessage('Code Pins: already on the map', 2000);
		return;
	}
	pinsStore.setPins([...pins, { ...pin, ...nextPosition(pins.length) }]);
}

/** Silent: positions come from the webview itself, so no state echo back. */
export function movePin(pinsStore: PinsStore, id: string, x: number, y: number): void {
	pinsStore.setPins(
		pinsStore.getPins().map((pin) => (pin.id === id ? { ...pin, x, y } : pin)),
		{ silent: true }
	);
}

export function removePin(pinsStore: PinsStore, id: string): void {
	const remaining = pinsStore.getPins().filter((pin) => pin.id !== id);
	if (remaining.length !== pinsStore.getPins().length) {
		pinsStore.setPins(remaining);
	}
}

export function clearMap(pinsStore: PinsStore): void {
	pinsStore.setPins([]);
}

/** Two pins are the same when they anchor the same kind on the same last line of a file. */
function pinsSameLine(a: Pin, b: Pin): boolean {
	return (
		a.kind === b.kind &&
		a.filePath === b.filePath &&
		a.lines[a.lines.length - 1]?.line === b.lines[b.lines.length - 1]?.line
	);
}

/** Lays new pins out in a 4-column grid until the user drags them elsewhere. */
function nextPosition(count: number): { x: number; y: number } {
	return {
		x: 40 + (count % 4) * 320,
		y: 40 + Math.floor(count / 4) * 160,
	};
}
