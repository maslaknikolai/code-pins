/** `path:line:char` keys identifying a symbol occurrence; shared by extension and webview. */

export function buildLocationKey(path: string, line: number, character: number): string {
	return `${path}:${line}:${character}`;
}

/** The path may contain colons, so the numbers are taken from the end. */
export function parseLocationKey(key: string): { line: number; character: number } {
	const parts = key.split(':');
	return {
		line: Number(parts[parts.length - 2]),
		character: Number(parts[parts.length - 1]),
	};
}
