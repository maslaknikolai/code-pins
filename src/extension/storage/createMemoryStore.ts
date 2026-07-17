import * as vscode from 'vscode';


export interface MemoryStore<T> {
	onDidChange: vscode.Event<void>;
	get(): T;
	set(value: T): void;
}

export function createMemoryStore<T>(defaultValue: T): MemoryStore<T> {
	const onDidChangeEmitter = new vscode.EventEmitter<void>();
	let value = defaultValue;

	return {
		onDidChange: onDidChangeEmitter.event,

		get: (): T => value,

		set(next: T): void {
			value = next;
			onDidChangeEmitter.fire();
		}
	};
}
