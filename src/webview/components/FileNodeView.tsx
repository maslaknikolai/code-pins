import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { WebviewMessageType } from '../../shared/messages';
import { activeFilePathAtom } from '../atoms';
import type { FileFlowNode } from '../types';
import { buildPinLinesTree } from '../utils/buildPinLinesTree';
import { cn } from '../utils/cn';
import { sendToExtension } from '../utils/vscodeApi';
import { HoverScrollText } from './HoverScrollText';
import { PinsLinesTree } from './PinsTree';

/** Edge anchors only — not user-connectable, so keep them invisible. */
const handleClass = 'opacity-0! pointer-events-none!';

export function FileNodeView({ data }: NodeProps<FileFlowNode>) {
	const fileNode = data.fileNode;
	const lastSlash = Math.max(fileNode.filePath.lastIndexOf('/'), fileNode.filePath.lastIndexOf('\\')) + 1;
	const fileName = fileNode.filePath.slice(lastSlash);
	const pinsTree = useMemo(() => buildPinLinesTree(fileNode.pins), [fileNode.pins]);
	const isActiveFile = useAtomValue(activeFilePathAtom) === fileNode.filePath;

	return (
		<div
			className={cn(
				'w-90 overflow-hidden rounded-sm select-none font-(family-name:--vscode-editor-font-family) text-(length:--vscode-editor-font-size) bg-(--vscode-editorWidget-background) border border-(--vscode-editorWidget-border)',
				isActiveFile && 'border-(--vscode-focusBorder) shadow-[0_0_8px_var(--vscode-focusBorder)]'
			)}
		>
			<Handle type="target" position={Position.Left} className={handleClass} />

			<div className="group flex items-center px-2 py-0.75 font-bold whitespace-nowrap bg-(--vscode-editorGroupHeader-tabsBackground) border-b border-(--vscode-editorWidget-border)">
				<span className="mr-1 hidden min-w-0 flex-1 overflow-hidden font-normal opacity-70 group-hover:block">
					<HoverScrollText>{fileNode.filePath}</HoverScrollText>
				</span>
				<span className="min-w-0 flex-1 overflow-hidden text-ellipsis group-hover:hidden">{fileName}</span>
				<button
					className="nodrag ml-1 shrink-0 cursor-pointer px-1 font-normal opacity-50 hover:opacity-100 hover:text-(--vscode-errorForeground,#f66)"
					title="Remove file node"
					onClick={() => sendToExtension({ type: WebviewMessageType.RemoveFileNode, filePath: fileNode.filePath })}
				>
					×
				</button>
			</div>
			<div className="flex flex-col gap-2">
				<PinsLinesTree
					elements={pinsTree}
					fileNode={fileNode}
				/>
			</div>

			<Handle type="source" position={Position.Right} className={handleClass} />
		</div>
	);
}
