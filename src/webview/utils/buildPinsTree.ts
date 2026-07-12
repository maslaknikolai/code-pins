import type { Pin, PinLine } from '../../types';

/** A pin block: the pin plus the lines it still has to render itself. */
export interface PinBlock {
	pin: Pin;
	lines: PinLine[];
}

export type PinsTreeNode = PinNode | GroupNode;

export interface PinNode extends PinBlock {
	type: 'pin';
}

/** Pins that share their first breadcrumb line, hoisted above them. */
export interface GroupNode {
	type: 'group';
	/** The shared line's number — also the node's identity within its level. */
	lineNumber: number;
	/** Pins pinned directly ON the shared line — their blocks render it themselves. */
	pinnedOnSharedLine: PinBlock[];
	/** Set when no pin owns the shared line and it must render as plain text. */
	sharedLine?: PinLine;
	children: PinsTreeNode[];
}

/**
 * Pins in one file often share enclosing scopes (class, function). Hoists any
 * breadcrumb line shared by several pins above them, recursively, so each pin
 * only keeps what's unique to it.
 */
export function buildPinsTree(pins: Pin[]): PinsTreeNode[] {
	return buildLevel(pins.map((pin) => ({ pin, lines: pin.lines })));
}

function buildLevel(blocks: PinBlock[]): PinsTreeNode[] {
	return groupByFirstLine(blocks).map((group) => {
		if (group.length === 1) {
			return { type: 'pin', ...group[0] };
		}

		const pinnedOnSharedLine = group.filter((block) => block.lines.length === 1);
		const deeper = group.filter((block) => block.lines.length > 1);

		return {
			type: 'group',
			lineNumber: group[0].lines[0].line,
			pinnedOnSharedLine,
			sharedLine: pinnedOnSharedLine.length === 0 ? deeper[0]?.lines[0] : undefined,
			children: buildLevel(deeper.map(({ pin, lines }) => ({ pin, lines: lines.slice(1) }))),
		};
	});
}

/** Groups blocks by their first line's number — regardless of the order pins were added in. */
function groupByFirstLine(blocks: PinBlock[]): PinBlock[][] {
	const byLine = new Map<number, PinBlock[]>();

	for (const block of blocks) {
		const lineNumber = block.lines[0].line;
		const group = byLine.get(lineNumber);
		if (group) {
			group.push(block);
		} else {
			byLine.set(lineNumber, [block]);
		}
	}

	// Source order, not the order pins were added in.
	return [...byLine.values()].sort((a, b) => a[0].lines[0].line - b[0].lines[0].line);
}
