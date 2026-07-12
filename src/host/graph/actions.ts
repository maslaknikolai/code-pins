import * as vscode from 'vscode';
import { PinsStore } from '../pins-store';
import { Pin } from '../../types';

export function addPin(pinsStore: PinsStore, pin: Pin): void {
	const pins = pinsStore.getPins();

	if (pins.some((existing) => checkIsSameLine(existing, pin))) {
		vscode.window.setStatusBarMessage('Code Pins: already on the map', 2000);
		return;
	}

	pinsStore.setPins([
		...pins,
		{
			...pin,
			...nextPosition(pins.length)
		}
	]);
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
function checkIsSameLine(a: Pin, b: Pin): boolean {
	return (
		a.kind === b.kind &&
		a.filePath === b.filePath &&
		a.lines[a.lines.length - 1]?.line === b.lines[b.lines.length - 1]?.line
	);
}

const CORNER_MARGIN = 40;
const CASCADE_STEP = 30;
const CASCADE_LENGTH = 8;

/** New pins land in the top-left corner, cascading slightly so they don't fully overlap. */
function nextPosition(count: number): { x: number; y: number } {
	const offset = (count % CASCADE_LENGTH) * CASCADE_STEP;
	return {
		x: CORNER_MARGIN + offset,
		y: CORNER_MARGIN + offset,
	};
}
