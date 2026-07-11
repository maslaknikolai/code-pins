import { Handle, Position, type NodeProps } from '@xyflow/react';
import { WebviewMessageType } from '../../types';
import { cn } from '../utils/cn';
import type { PinFlowNode } from '../types';
import { vscode } from '../utils/vscodeApi';
import { LineText } from './LineText';

/** Edge anchors only — not user-connectable, so keep them invisible. */
const handleClass = 'opacity-0! pointer-events-none!';

export function PinNode({ data }: NodeProps<PinFlowNode>) {
	const pin = data.pin;
	const dirPath = pin.filePath.slice(0, pin.filePath.length - pin.fileName.length);

	return (
		<div
			className={cn(
				'min-w-45 max-w-105 overflow-hidden rounded-sm select-none font-(family-name:--vscode-editor-font-family) text-(length:--vscode-editor-font-size) bg-(--vscode-editorWidget-background)',
				'border border-(--vscode-editorWidget-border)',
				pin.kind === 'declaration' && 'border-2 border-(--vscode-charts-blue,#4a90d9)'
			)}
		>
			<Handle type="target" position={Position.Left} className={handleClass} />
			<div className="group px-2 py-0.75 font-bold whitespace-nowrap bg-(--vscode-editorGroupHeader-tabsBackground) border-b border-(--vscode-editorWidget-border)">
				<span className="mr-1 hidden font-normal opacity-70 group-hover:inline">{dirPath}</span>
				<span>{pin.fileName}</span>
				<button
					className="nodrag float-right ml-2 cursor-pointer px-1 opacity-50 hover:opacity-100 hover:text-(--vscode-errorForeground,#f66)"
					title="Remove pin"
					onClick={() => vscode.postMessage({ type: WebviewMessageType.RemovePin, id: pin.id })}
				>
					×
				</button>
			</div>
			{pin.lines.map((line) => (
				<div
					key={line.line}
					className="cursor-pointer py-px pr-2 whitespace-pre hover:bg-(--vscode-list-hoverBackground)"
					style={{ paddingLeft: 8 + line.indent * 14 }}
					title={`${pin.filePath}:${line.line + 1}`}
					onClick={() => vscode.postMessage({ type: WebviewMessageType.OpenLocation, file: pin.filePath, line: line.line })}
				>
					<LineText pin={pin} text={line.text} />
				</div>
			))}
			<Handle type="source" position={Position.Right} className={handleClass} />
		</div>
	);
}