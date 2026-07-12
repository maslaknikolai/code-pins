import type { ReactNode } from 'react';
import { FileNode, WebviewMessageType, type PinLine } from '../../shared/types';
import { sendToExtension } from '../utils/vscodeApi';

/**
 * Shared shell of one clickable line: opens the location, marquees overflowing
 * text on hover. Content and trailing controls come from the caller.
 */
export function LineShell({
	line,
	fileNode,
	children,
	trailing,
}: {
	line: PinLine;
	fileNode: FileNode;
	/** Line content; defaults to the plain text. */
	children?: ReactNode;
	/** Rendered outside the marquee, e.g. a hover action button. */
	trailing?: ReactNode;
}) {
	return (
		<div
			className="group/line @container relative cursor-pointer overflow-hidden py-px pr-2 pl-2 whitespace-pre hover:bg-(--vscode-list-hoverBackground)"
			title={`${fileNode.filePath}:${line.line + 1}`}
			onClick={() => sendToExtension(WebviewMessageType.OpenLocation, { file: fileNode.filePath, line: line.line })}
		>
			<span className="inline-block min-w-full group-hover/line:animate-marquee-x group-active/line:[animation-play-state:paused]">
				{children ?? line.text}
			</span>
			{trailing}
		</div>
	);
}
