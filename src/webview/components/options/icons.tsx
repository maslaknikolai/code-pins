const iconProps = {
	width: 14,
	height: 14,
	viewBox: '0 0 16 16',
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 1.5,
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
} as const;

export function PlusIcon() {
	return (
		<svg {...iconProps}>
			<path d="M8 3v10M3 8h10" />
		</svg>
	);
}

export function ImportIcon() {
	return (
		<svg {...iconProps}>
			<path d="M8 2v8M5 7l3 3 3-3M3 13h10" />
		</svg>
	);
}

export function EditIcon() {
	return (
		<svg {...iconProps}>
			<path d="M11.5 2.5l2 2L5 13l-2.5.5L3 11l8.5-8.5z" />
		</svg>
	);
}

export function CloneIcon() {
	return (
		<svg {...iconProps}>
			<rect x="5.5" y="5.5" width="8" height="8" rx="1" />
			<path d="M10.5 3.5h-6a1 1 0 0 0-1 1v6" />
		</svg>
	);
}

export function TrashIcon() {
	return (
		<svg {...iconProps}>
			<path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 8.5h6l.5-8.5" />
		</svg>
	);
}
