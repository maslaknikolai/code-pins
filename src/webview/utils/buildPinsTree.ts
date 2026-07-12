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

/** Pins that share their leading breadcrumb lines, hoisted above them. */
export interface GroupNode {
	type: 'group';
	/** The first shared line's number — also the node's identity within its level. */
	lineNumber: number;
	/**
	 * Consecutive lines every pin below has in common, rendered once on top.
	 * Empty when a pin was pinned ON the shared line: that pin then leads
	 * `children` and its own block renders the line.
	 */
	sharedLines: PinLine[];
	children: PinsTreeNode[];
}

/**
 * Pins in one file often share enclosing scopes (class, function). Hoists any
 * breadcrumb lines shared by several pins above them, recursively, so each pin
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

		const lineNumber = group[0].lines[0].line;

		// Pins down to their last line were pinned ON the shared line: their blocks render
		// it themselves (with highlight and remove button), leading the group's children.
		const pinnedOnSharedLine = group.filter((block) => block.lines.length === 1);
		if (pinnedOnSharedLine.length > 0) {
			const deeper = dropFirstLine(group.filter((block) => block.lines.length > 1));
			return {
				type: 'group',
				lineNumber,
				sharedLines: [],
				children: [
					...pinnedOnSharedLine.map<PinNode>((block) => ({ type: 'pin', ...block })),
					...buildLevel(deeper),
				],
			};
		}

		// Absorb consecutive lines shared by the whole group into one flat list,
		// instead of one nested group per line.
		const sharedLines: PinLine[] = [];
		let rest = group;
		while (
			rest.every((block) => block.lines.length > 1) &&
			rest.every((block) => block.lines[0].line === rest[0].lines[0].line)
		) {
			sharedLines.push(rest[0].lines[0]);
			rest = dropFirstLine(rest);
		}

		return { type: 'group', lineNumber, sharedLines, children: buildLevel(rest) };
	});
}

function dropFirstLine(blocks: PinBlock[]): PinBlock[] {
	return blocks.map(({ pin, lines }) => ({ pin, lines: lines.slice(1) }));
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
