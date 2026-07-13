/** `path:line:char` paths identifying a symbol occurrence; shared by extension and webview. */

export function buildPinPath(path: string, line: number, character: number): string {
	return `${path}:${line}:${character}`;
}

/** The path may contain colons, so the numbers are taken from the end. */
export function parsePinPath(symbolPath: string): { line: number; character: number } {
	const parts = symbolPath.split(':');
	return {
		line: Number(parts[parts.length - 2]),
		character: Number(parts[parts.length - 1]),
	};
}
