import { useEffect, useRef, useState } from 'react';


export function GraphLabelField({ initialValue, onSubmit, onClose }: {
	initialValue: string;
	onSubmit: (label: string) => void;
	onClose: () => void;
}) {
	const [value, setValue] = useState(initialValue);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.select();
	}, []);

	const commit = () => {
		const trimmed = value.trim();

		if (trimmed && trimmed !== initialValue) {
			onSubmit(trimmed);
		}

		onClose();
	};

	const onKeyDown = (event: React.KeyboardEvent) => {
		// Keep typing away from the window-level hotkey handler (Q/E/Space/…).
		event.stopPropagation();

		if (event.key === 'Enter') {
			commit();
		}

		if (event.key === 'Escape') {
			onClose();
		}
	};

	return (
		<input
			ref={inputRef}
			autoFocus
			className="min-w-0 flex-1 rounded border border-(--vscode-input-border,transparent) bg-(--vscode-input-background) px-1 text-(--vscode-input-foreground) outline-none"
			value={value}
			onChange={(event) => setValue(event.target.value)}
			onBlur={commit}
			onKeyDown={onKeyDown}
			onClick={(event) => event.stopPropagation()}
			onPointerDown={(event) => event.stopPropagation()}
			onDoubleClick={(event) => event.stopPropagation()}
		/>
	);
}
