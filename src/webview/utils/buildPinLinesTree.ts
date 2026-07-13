import type { Pin, PinLine } from '../../shared/types';

export interface LineElement {
	line: PinLine;
	pins: Pin[];
	children: LineElement[];
}

export function buildPinLinesTree(pins: Pin[]): LineElement[] {
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
