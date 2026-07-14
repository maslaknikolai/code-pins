import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { activeFilePathAtom } from '../atoms';
import type { FileFlowNode } from '../types';
import { buildPinLinesTree } from '../utils/buildPinLinesTree';
import { cn } from '../utils/cn';
import { FileNodeHeader } from './FileNodeHeader';
import { PinsLinesTree } from './PinsTree';

/** Edge anchors only — not user-connectable, so keep them invisible. */
const handleClass = 'opacity-0! pointer-events-none!';

export function FileNodeView({ data: {fileNode} }: NodeProps<FileFlowNode>) {
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

			<FileNodeHeader fileNode={fileNode} />
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
