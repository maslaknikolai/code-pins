import { AppCtx } from '../../types';

export function getNextGraphName(label: string, { pinsGraphsStore }: AppCtx): string {
	const base = label.replace(/ \(\d+\)$/, '');
	const existingNames = pinsGraphsStore.get().map((graph) => graph.label);

	if (!existingNames.includes(base)) {
		return base;
	}

	let counter = 2;
	while (existingNames.includes(`${base} (${counter})`)) {
		counter++;
	}
	return `${base} (${counter})`;
}
