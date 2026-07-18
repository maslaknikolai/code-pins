import * as vscode from 'vscode';
import { Pin } from '../../../shared/types';
import { AppCtx } from '../../types';
import { createPinsGraph, DEFAULT_PINS_GRAPH_NAME } from '../graphs/createPinsGraph';
import { addPinToGraph, nextPosition } from './addPinToGraph';
import { getActiveGraph } from './getActiveGraph';
import { setActiveGraph } from './setActiveGraph';

export function addPinToActiveGraph(filePath: string, pin: Pin, appCtx: AppCtx): void {
	const activeGraph = getActiveGraph(appCtx) ?? createPinsGraph(DEFAULT_PINS_GRAPH_NAME);

	const result = addPinToGraph(activeGraph, filePath, pin, nextPosition(appCtx.viewSettingsStore.get()));

	if (!result.added) {
		vscode.window.setStatusBarMessage('Code Pins: already on the graph', 2000);
		return;
	}

	setActiveGraph(result.graph, appCtx);
}
