import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { WebviewMessageType } from '../../../shared/messages';
import type { PinsGraph } from '../../../shared/types';
import { activeGraphAtom } from '../../atoms';
import { useSwitchGraph } from '../../hooks/useSwitchGraph';
import { cn } from '../../utils/cn';
import { sendToExtension } from '../../utils/vscodeApi';
import { GraphLabelField } from './GraphLabelField';
import { CloneIcon, CopyTextIcon, EditIcon, ExportIcon, TrashIcon } from './icons';
import { RowButton } from './RowButton';

export function GraphListItem({ graph }: { graph: PinsGraph; }) {
	const activeGraph = useAtomValue(activeGraphAtom);
	const isActive = graph.id === activeGraph?.id
	const rowRef = useRef<HTMLDivElement>(null);
	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: graph.id });
	const switchGraph = useSwitchGraph();

	useEffect(() => {
		if (isActive) {
			rowRef.current?.scrollIntoView({ block: 'center' });
		}
	}, [isActive]);

	const [isNameEditing, setIsNameEditing] = useState(false);

	const startNameEditing = (event: React.MouseEvent) => {
		event.stopPropagation();
		setIsNameEditing(true);
	};

	const submitLabel = (label: string) => {
		sendToExtension({ type: WebviewMessageType.RenameGraph, id: graph.id, label });
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
			onClick={() => switchGraph(graph.id)}
			{...attributes}
			{...listeners}
		>
			{isNameEditing ? (
				<GraphLabelField
					initialValue={graph.label}
					onSubmit={submitLabel}
					onClose={() => setIsNameEditing(false)}
				/>
			) : (<>
				<span className="min-w-0 flex-1 truncate">{graph.label}</span>

				<div className="hidden shrink-0 items-center gap-0.5 group-focus-within:flex group-hover:flex">
					<RowButton tooltip={`Rename graph "${graph.label}"`} onClick={startNameEditing}>
						<EditIcon />
					</RowButton>

					<RowButton tooltip={`Clone graph "${graph.label}"`} onClick={cloneGraph}>
						<CloneIcon />
					</RowButton>

					<RowButton tooltip={`Export graph "${graph.label}"`} onClick={exportGraph}>
						<ExportIcon />
					</RowButton>

					<RowButton tooltip={`Copy graph "${graph.label}" as text`} onClick={copyGraphAsText}>
						<CopyTextIcon />
					</RowButton>

					<RowButton
						tooltip={`Delete graph "${graph.label}"`}
						className="hover:text-(--vscode-errorForeground,#f66)"
						onClick={deleteGraph}
					>
						<TrashIcon />
					</RowButton>
				</div>
			</>)}
		</div>
	);
}
