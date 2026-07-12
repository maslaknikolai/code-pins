import type { Pin, PinLine } from '../../types';
import { LineView } from './LineView';
import { PinView } from './PinView';

interface PinEntry {
	pin: Pin;
	/** The pin's lines not yet rendered by an enclosing shared line. */
	lines: PinLine[];
}

/**
 * Pins in one file often share enclosing scopes (class, function). Renders any
 * breadcrumb line shared by several pins once, above them, and recurses with
 * the remaining lines so each pin only shows what's unique to it.
 */
export function PinsTree({ pins, filePath }: { pins: Pin[]; filePath: string }) {
	const rootEntries = pins.map<PinEntry>((pin) => ({
		pin,
		lines: pin.lines
	}));
	return <Level entries={rootEntries} filePath={filePath} />;
}

function Level({ entries, filePath }: { entries: PinEntry[]; filePath: string }) {
	const groups = groupByFirstLine(entries);

	return (
		<>
			{groups.map((group) => {
				if (group.length === 1) {
					const { pin, lines } = group[0];
					return <PinView key={pin.id} pin={pin} lines={lines} filePath={filePath} />;
				}

				// Pins whose pinned line IS the shared line own it: their block renders it
				// (keeping the highlight and remove button); deeper pins recurse below.
				const owners = group.filter((entry) => entry.lines.length === 1);
				const deeper = group
					.filter((entry) => entry.lines.length > 1)
					.map(({ pin, lines }) => ({ pin, lines: lines.slice(1) }));
				const sharedLine = group.find((entry) => entry.lines.length > 1)?.lines[0];

				return (
					<div key={`shared-${group[0].lines[0].line}`} className="flex flex-col gap-2">
						{owners.map(({ pin, lines }) => (
							<PinView key={pin.id} pin={pin} lines={lines} filePath={filePath} />
						))}
						{owners.length === 0 && sharedLine && <LineView line={sharedLine} filePath={filePath} />}
						{deeper.length > 0 && <Level entries={deeper} filePath={filePath} />}
					</div>
				);
			})}
		</>
	);
}

/** Groups entries by their first line's number — regardless of the order pins were added in. */
function groupByFirstLine(entries: PinEntry[]): PinEntry[][] {
	const groups: PinEntry[][] = [];
	const byLine = new Map<number, PinEntry[]>();

	for (const entry of entries) {
		const lineNumber = entry.lines[0].line;
		const existing = byLine.get(lineNumber);
		if (existing) {
			existing.push(entry);
			continue;
		}
		const group = [entry];
		byLine.set(lineNumber, group);
		groups.push(group);
	}

	return groups;
}
