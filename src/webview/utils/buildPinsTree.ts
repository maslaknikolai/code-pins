import type { Pin, PinLine } from '../../shared/types';

/**
 * One source line of the file node's tree. Pins in one file often share
 * enclosing scopes (class, function), so every pin's breadcrumb lines merge
 * into one tree keyed by line number and each line renders once.
 */
export interface LineElement {
	line: PinLine;
	/** Pins made exactly on this line — several pinned symbols on one line all land here. */
	pins: Pin[];
	children: LineElement[];
}

export function buildPinsTree(pins: Pin[]): LineElement[] {
	const roots: LineElement[] = [];

	for (const pin of pins) {
		let level = roots;
		for (const [index, line] of pin.lines.entries()) {
			let element = level.find((el) => el.line.line === line.line);
			if (!element) {
				element = { line, pins: [], children: [] };
				level.push(element);
			}
			if (index === pin.lines.length - 1) {
				element.pins.push(pin);
			}
			level = element.children;
		}
	}

	sortByLine(roots);
	return roots;
}

/** Source order, not the order pins were added in. */
function sortByLine(elements: LineElement[]): void {
	elements.sort((a, b) => a.line.line - b.line.line);
	for (const element of elements) {
		sortByLine(element.children);
	}
}
