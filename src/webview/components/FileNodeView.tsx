import { Handle, Position, type NodeProps } from '@xyflow/react';
import { PinKind, WebviewMessageType, type Pin } from '../../types';
import { cn } from '../utils/cn';
import type { FileFlowNode } from '../types';
import { vscode } from '../utils/vscodeApi';
import { LineText } from './LineText';

/** Edge anchors only — not user-connectable, so keep them invisible. */
const handleClass = 'opacity-0! pointer-events-none!';

export function FileNodeView({ data }: NodeProps<FileFlowNode>) {
	const fileNode = data.fileNode;
	const lastSlash = Math.max(fileNode.filePath.lastIndexOf('/'), fileNode.filePath.lastIndexOf('\\')) + 1;
	const fileName = fileNode.filePath.slice(lastSlash);

	return (
		<div className="w-90 overflow-hidden rounded-sm select-none font-(family-name:--vscode-editor-font-family) text-(length:--vscode-editor-font-size) bg-(--vscode-editorWidget-background) border border-(--vscode-editorWidget-border)">
			<Handle type="target" position={Position.Left} className={handleClass} />
			<div className="group flex items-center px-2 py-0.75 font-bold whitespace-nowrap bg-(--vscode-editorGroupHeader-tabsBackground) border-b border-(--vscode-editorWidget-border)">
				<span className="@container mr-1 hidden min-w-0 flex-1 overflow-hidden font-normal opacity-70 group-hover:block">
					<span className="inline-block min-w-full animate-marquee-x group-active:[animation-play-state:paused]">
						{fileNode.filePath}
					</span>
				</span>
				<span className="group-hover:hidden">{fileName}</span>
			</div>
			<div className="flex flex-col gap-2">
				{fileNode.pins.map((pin) => (
					<PinSection
						key={pin.id}
						pin={pin}
						filePath={fileNode.filePath}
					/>
				))}
			</div>
			<Handle type="source" position={Position.Right} className={handleClass} />
		</div>
	);
}

/** One pinned entity inside the file node: its breadcrumb lines plus its own remove button. */
function PinSection({ pin, filePath }: { pin: Pin; filePath: string }) {
	return (
		<div
			className={cn(
				'group/pin relative border-b border-(--vscode-editorWidget-border) last:border-b-0',
				pin.kind === PinKind.Declaration && 'border-l-2 border-l-(--vscode-charts-blue,#4a90d9)'
			)}
		>
			<button
				className="nodrag absolute top-0 right-1 hidden cursor-pointer px-1 opacity-50 group-hover/pin:block hover:opacity-100 hover:text-(--vscode-errorForeground,#f66)"
				title="Remove pin"
				onClick={() => vscode.postMessage({ type: WebviewMessageType.RemovePin, id: pin.id })}
			>
				×
			</button>

			{pin.lines.map((line) => (
				<div
					key={line.line}
					className="cursor-pointer py-px pr-2 whitespace-pre hover:bg-(--vscode-list-hoverBackground)"
					style={{ paddingLeft: 8 + line.indent * 14 }}
					title={`${filePath}:${line.line + 1}`}
					onClick={() => vscode.postMessage({ type: WebviewMessageType.OpenLocation, file: filePath, line: line.line })}
				>
					<LineText pin={pin} text={line.text} />
				</div>
			))}
		</div>
	);
}
