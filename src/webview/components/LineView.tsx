import { WebviewMessageType, type PinLine } from '../../types';
import { sendToExtension } from '../utils/vscodeApi';

/** One clickable breadcrumb line; overflowing text marquees back and forth on hover. */
export function LineView({ line, filePath }: { line: PinLine; filePath: string }) {
	return (
		<div
			className="group/line @container cursor-pointer overflow-hidden py-px pr-2 whitespace-pre hover:bg-(--vscode-list-hoverBackground)"
			style={{ paddingLeft: 8 + line.indent * 14 }}
			title={`${filePath}:${line.line + 1}`}
			onClick={() => sendToExtension(WebviewMessageType.OpenLocation, { file: filePath, line: line.line })}
		>
			<span className="inline-block min-w-full group-hover/line:animate-marquee-x group-active/line:[animation-play-state:paused]">
				{line.highlight ? (
					<>
						{line.text.slice(0, line.highlight.start)}
						<span className="rounded-xs bg-(--vscode-editor-findMatchHighlightBackground,rgba(234,92,0,0.33))">
							{line.text.slice(line.highlight.start, line.highlight.end)}
						</span>
						{line.text.slice(line.highlight.end)}
					</>
				) : (
					line.text
				)}
			</span>
		</div>
	);
}
