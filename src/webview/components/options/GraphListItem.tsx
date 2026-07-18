import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { WebviewMessageType } from '../../../shared/messages';
import type { PinsGraph } from '../../../shared/types';
import { activeGraphAtom } from '../../atoms';
import { cn } from '../../utils/cn';
import { sendToExtension } from '../../utils/vscodeApi';
import { CloneIcon, CopyTextIcon, EditIcon, ExportIcon, TrashIcon } from './icons';

export function GraphListItem({ graph }: { graph: PinsGraph; }) {
	const activeGraph = useAtomValue(activeGraphAtom);
	const isActive = graph.id === activeGraph?.id
	const rowRef = useRef<HTMLDivElement>(null);
	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: graph.id });

	useEffect(() => {
		if (isActive) {
			rowRef.current?.scrollIntoView({ block: 'center' });
		}
	}, [isActive]);

	const switchGraph = () => {
		if (!isActive) {
			sendToExtension({ type: WebviewMessageType.SwitchGraph, id: graph.id });
		}
	};

	const renameGraph = (event: React.MouseEvent) => {
		event.stopPropagation();
		sendToExtension({ type: WebviewMessageType.RenameGraph, id: graph.id });
	};

	const cloneGraph = (event: React.MouseEvent) => {
		event.stopPropagation();
		sendToExtension({ type: WebviewMessageType.CloneGraph, id: graph.id });
	};

	const exportGraph = (event: React.MouseEvent) => {
		event.stopPropagation();
		sendToExtension({ type: WebviewMessageType.ExportGraph, id: graph.id });
	};

	const copyGraphAsText = (event: React.MouseEvent) => {
		event.stopPropagation();
		sendToExtension({ type: WebviewMessageType.CopyGraphAsText, id: graph.id });
	};

	const deleteGraph = (event: React.MouseEvent) => {
		event.stopPropagation();
		sendToExtension({ type: WebviewMessageType.DeleteGraph, id: graph.id });
	};

	return (
		<div
			ref={node => {
				rowRef.current = node;
				setNodeRef(node);
			}}
			className={cn(
				'group flex cursor-pointer items-center gap-0.5 rounded px-2 py-1',
				isActive
					? 'bg-(--vscode-list-activeSelectionBackground) text-(--vscode-list-activeSelectionForeground)'
					: 'hover:bg-(--vscode-list-hoverBackground)',
				isDragging && 'relative z-10 opacity-80'
			)}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			onClick={switchGraph}
			{...attributes}
			{...listeners}
		>
			<span className="min-w-0 flex-1 truncate">{graph.label}</span>

			<div
				className="hidden shrink-0 items-center gap-0.5 group-focus-within:flex group-hover:flex"
			>
				<button
					className="shrink-0 cursor-pointer px-1 opacity-50 hover:opacity-100!"
					title={`Rename graph "${graph.label}"`}
					onClick={renameGraph}
				>
					<EditIcon />
				</button>

				<button
					className="shrink-0 cursor-pointer px-1 opacity-50 hover:opacity-100!"
					title={`Clone graph "${graph.label}"`}
					onClick={cloneGraph}
				>
					<CloneIcon />
				</button>

				<button
					className="shrink-0 cursor-pointer px-1 opacity-50 hover:opacity-100!"
					title={`Export graph "${graph.label}"`}
					onClick={exportGraph}
				>
					<ExportIcon />
				</button>

				<button
					className="shrink-0 cursor-pointer px-1 opacity-50 hover:opacity-100!"
					title={`Copy graph "${graph.label}" as text`}
					onClick={copyGraphAsText}
				>
					<CopyTextIcon />
				</button>

				<button
					className="shrink-0 cursor-pointer px-1 opacity-50 hover:opacity-100! hover:text-(--vscode-errorForeground,#f66)"
					title={`Delete graph "${graph.label}"`}
					onClick={deleteGraph}
				>
					<TrashIcon />
				</button>
			</div>
		</div>
	);
}
