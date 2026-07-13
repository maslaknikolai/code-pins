import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useMemo } from 'react';
import type { FileFlowNode } from '../types';
import { buildPinsTree } from '../utils/buildPinsTree';
import { PinsTree } from './PinsTree';

/** Edge anchors only — not user-connectable, so keep them invisible. */
const handleClass = 'opacity-0! pointer-events-none!';

export function FileNodeView({ data }: NodeProps<FileFlowNode>) {
	const fileNode = data.fileNode;
	const lastSlash = Math.max(fileNode.filePath.lastIndexOf('/'), fileNode.filePath.lastIndexOf('\\')) + 1;
	const fileName = fileNode.filePath.slice(lastSlash);
	const pinsTree = useMemo(() => buildPinsTree(fileNode.pins), [fileNode.pins]);

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
				<PinsTree
					elements={pinsTree}
					fileNode={fileNode}
				/>
			</div>

			<Handle type="source" position={Position.Right} className={handleClass} />
		</div>
	);
}
