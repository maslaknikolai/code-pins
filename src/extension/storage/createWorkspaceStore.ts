import * as vscode from 'vscode';


export interface WorkspaceStore<T> {
	onDidChange: vscode.Event<void>;
	get(): T;
	set(value: T): Thenable<void>;
}

export function createWorkspaceStore<T>(
	workspaceState: vscode.Memento,
	key: string,
	defaultValue: T
): WorkspaceStore<T> {
	const onDidChangeEmitter = new vscode.EventEmitter<void>();

	return {
		onDidChange: onDidChangeEmitter.event,

		get: (): T => workspaceState.get<T>(key) ?? defaultValue,

		set(value: T): Thenable<void> {
			const updated = workspaceState.update(key, value);
			onDidChangeEmitter.fire();
			return updated;
		}
	};
}
