import { PinKind, WebviewMessageType, type Pin, type PinLine } from '../../types';
import { cn } from '../utils/cn';
import { sendToExtension } from '../utils/vscodeApi';
import { LineView } from './LineView';

/**
 * One pinned entity inside the file node: its breadcrumb lines plus its own remove
 * button.
 */
export function PinView({ pin, lines, filePath }: { pin: Pin; lines: PinLine[]; filePath: string }) {
	return (
		<div
			className={cn(
				'group/pin relative border-b border-(--vscode-editorWidget-border) last:border-b-0',
				pin.kind === PinKind.Declaration && 'border-l-2 border-l-(--vscode-charts-blue,#4a90d9)'
			)}
		>
			<button
				className="nodrag absolute top-0 right-1 z-10 hidden cursor-pointer px-1 opacity-50 group-hover/pin:block hover:opacity-100 hover:text-(--vscode-errorForeground,#f66)"
				title="Remove pin"
				onClick={() => sendToExtension(WebviewMessageType.RemovePin, { id: pin.id })}
			>
				×
			</button>

			{lines.map((line) => (
				<LineView key={line.line} line={line} filePath={filePath} />
			))}
		</div>
	);
}
