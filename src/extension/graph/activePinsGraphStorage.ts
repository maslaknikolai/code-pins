import * as vscode from 'vscode';
import { FileNode } from '../../shared/types';
import { FileNodesStore } from '../file-nodes-store';

const GRAPHS_KEY = 'codePins.graphs';
const ACTIVE_GRAPH_KEY = 'codePins.activeGraphName';

export const DEFAULT_PINS_GRAPH_NAME = 'default';

type StoredGraphs = Record<string, FileNode[]>;

export function getActivePinsGraphName(context: vscode.ExtensionContext): string {
	return context.workspaceState.get<string>(ACTIVE_GRAPH_KEY) ?? DEFAULT_PINS_GRAPH_NAME;
}

export function getPinsGraphNames(context: vscode.ExtensionContext): string[] {
	return Object.keys(getGraphs(context));
}

/** Fills the store from the active graph; called on activation. */
export function loadActivePinsGraph(context: vscode.ExtensionContext, store: FileNodesStore): void {
	store.setFileNodes(getGraphs(context)[getActivePinsGraphName(context)] ?? []);
}

/** Autosave: the active graph in workspaceState always mirrors the store. */
export function saveActivePinsGraph(context: vscode.ExtensionContext, store: FileNodesStore): void {
	const graphs = getGraphs(context);
	graphs[getActivePinsGraphName(context)] = store.getFileNodes();
	context.workspaceState.update(GRAPHS_KEY, graphs);
}

/** Flushes the current graph, then makes `name` active and loads it (empty when new). */
export async function setActivePinsGraph(
	context: vscode.ExtensionContext,
	store: FileNodesStore,
	name: string
): Promise<void> {
	saveActivePinsGraph(context, store);
	await context.workspaceState.update(ACTIVE_GRAPH_KEY, name);
	store.setFileNodes(getGraphs(context)[name] ?? []);
}

/** Moves the graph to a new name; an active graph stays active under the new one. */
export async function renamePinsGraph(
	context: vscode.ExtensionContext,
	store: FileNodesStore,
	oldName: string,
	newName: string
): Promise<void> {
	if (getActivePinsGraphName(context) === oldName) {
		saveActivePinsGraph(context, store);
	}
	const graphs = getGraphs(context);
	graphs[newName] = graphs[oldName] ?? [];
	delete graphs[oldName];
	await context.workspaceState.update(GRAPHS_KEY, graphs);
	if (getActivePinsGraphName(context) === oldName) {
		await context.workspaceState.update(ACTIVE_GRAPH_KEY, newName);
	}
}

/** Deletes the graph; when it was the active one, falls back to the first remaining (or an empty default). */
export async function deletePinsGraph(
	context: vscode.ExtensionContext,
	store: FileNodesStore,
	name: string
): Promise<void> {
	const graphs = getGraphs(context);
	delete graphs[name];
	await context.workspaceState.update(GRAPHS_KEY, graphs);

	if (getActivePinsGraphName(context) === name) {
		const fallback = Object.keys(graphs)[0] ?? DEFAULT_PINS_GRAPH_NAME;
		await context.workspaceState.update(ACTIVE_GRAPH_KEY, fallback);
		store.setFileNodes(graphs[fallback] ?? []);
	}
}

function getGraphs(context: vscode.ExtensionContext): StoredGraphs {
	return context.workspaceState.get<StoredGraphs>(GRAPHS_KEY) ?? {};
}
