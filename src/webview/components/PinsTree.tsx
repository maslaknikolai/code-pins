import type { Pin, PinLine } from '../../types';
import { LineView } from './LineView';
import { PinView } from './PinView';

interface PinEntry {
	pin: Pin;
	/** The pin's lines not yet rendered by an enclosing shared line. */
	lines: PinLine[];
}

interface Group {
	/** The line the group's pins have in common; unset for a pin that stands alone. */
	shared?: PinLine;
	entries: PinEntry[];
}

/**
 * Pins in one file often share enclosing scopes (class, function). Renders any
 * breadcrumb line shared by several pins once, above them, and recurses with
 * the remaining lines so each pin only shows what's unique to it.
 * A pin's last line (the pinned one) is never shared away.
 */
export function PinsTree({ pins, filePath }: { pins: Pin[]; filePath: string }) {
	const rootEntries = pins.map<PinEntry>((pin) => ({
		pin,
		lines: pin.lines
	}))
	return <Level entries={rootEntries} filePath={filePath} />;
}

function Level({ entries, filePath }: { entries: PinEntry[]; filePath: string }) {
	const groups = groupByFirstLine(entries);

	return (
		<>
			{groups.map((group) => {
				if (group.entries.length === 1 || !group.shared) {
					const { pin, lines } = group.entries[0];
					return <PinView key={pin.id} pin={pin} lines={lines} filePath={filePath} />;
				}
				return (
					<div key={`shared-${group.shared.line}`} className="flex flex-col gap-2">
						<LineView line={group.shared} filePath={filePath} />
						<Level
							entries={group.entries.map(({ pin, lines }) => ({ pin, lines: lines.slice(1) }))}
							filePath={filePath}
						/>
					</div>
				);
			})}
		</>
	);
}

function groupByFirstLine(entries: PinEntry[]): Group[] {
	const groups: Group[] = [];
	const byLine = new Map<number, Group>();

	for (const entry of entries) {
		// The last line is the pinned one — keep it inside the pin even when shared.
		if (entry.lines.length < 2) {
			groups.push({ entries: [entry] });
			continue;
		}
		const first = entry.lines[0];
		const existing = byLine.get(first.line);
		if (existing) {
			existing.entries.push(entry);
			continue;
		}
		const group: Group = { shared: first, entries: [entry] };
		byLine.set(first.line, group);
		groups.push(group);
	}

	return groups;
}
