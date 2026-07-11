import { Fragment } from 'react';
import type { Pin } from '../../types';

/** Line text with the pinned entity highlighted in declaration nodes. */
export function LineText({ pin, text }: { pin: Pin; text: string }) {
	if (!pin.symbolName || !text.includes(pin.symbolName)) {
		return <>{text}</>;
	}
	const parts = text.split(pin.symbolName);
	return (
		<>
			{parts.map((part, i) => (
				<Fragment key={i}>
					{i > 0 && (
						<span className="rounded-xs bg-(--vscode-editor-findMatchHighlightBackground,rgba(234,92,0,0.33))">
							{pin.symbolName}
						</span>
					)}
					{part}
				</Fragment>
			))}
		</>
	);
}
