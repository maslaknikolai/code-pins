import { Fragment } from 'react';
import type { Pin } from '../../types';

/** Line text with the pinned entity highlighted in declaration nodes. */
export function LineText({ pin, text }: { pin: Pin; text: string }) {
	if (!pin.highlightWord || !text.includes(pin.highlightWord)) {
		return <>{text}</>;
	}
	const parts = text.split(pin.highlightWord);
	return (
		<>
			{parts.map((part, i) => (
				<Fragment key={i}>
					{i > 0 && (
						<span className="rounded-xs bg-(--vscode-editor-findMatchHighlightBackground,rgba(234,92,0,0.33))">
							{pin.highlightWord}
						</span>
					)}
					{part}
				</Fragment>
			))}
		</>
	);
}
