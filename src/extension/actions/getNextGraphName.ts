import type { PinsGraphsStore } from '../storage/pins-graphs-store';

export function getNextGraphName(pinsGraphsStore: PinsGraphsStore, label: string): string {
	const base = label.replace(/ \(\d+\)$/, '');
	const existingNames = pinsGraphsStore.getGraphs().map((graph) => graph.label);

	if (!existingNames.includes(base)) {
		return base;
	}

	let counter = 2;
	while (existingNames.includes(`${base} (${counter})`)) {
		counter++;
	}
	return `${base} (${counter})`;
}
