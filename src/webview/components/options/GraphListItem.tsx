import { WebviewMessageType } from '../../../shared/messages';
import type { PinsGraph } from '../../../shared/types';
import { cn } from '../../utils/cn';
import { sendToExtension } from '../../utils/vscodeApi';
import { CloneIcon, EditIcon, TrashIcon } from './icons';

export function GraphListItem({ graph, isActive }: { graph: PinsGraph; isActive: boolean }) {
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

	const deleteGraph = (event: React.MouseEvent) => {
		event.stopPropagation();
		sendToExtension({ type: WebviewMessageType.DeleteGraph, id: graph.id });
	};

	return (
		<div
			className={cn(
				'flex cursor-pointer items-center rounded px-2 py-1 hover:bg-(--vscode-list-hoverBackground)',
				isActive && 'bg-(--vscode-list-activeSelectionBackground) text-(--vscode-list-activeSelectionForeground)'
			)}
			onClick={switchGraph}
		>
			<span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{graph.label}</span>

			<button
				className="ml-1 shrink-0 cursor-pointer px-1 opacity-50 hover:opacity-100!"
				title={`Rename graph "${graph.label}"`}
				onClick={renameGraph}
			>
				<EditIcon />
			</button>

			<button
				className="ml-1 shrink-0 cursor-pointer px-1 opacity-50 hover:opacity-100!"
				title={`Clone graph "${graph.label}"`}
				onClick={cloneGraph}
			>
				<CloneIcon />
			</button>

			<button
				className="ml-1 shrink-0 cursor-pointer px-1 opacity-50 hover:opacity-100! hover:text-(--vscode-errorForeground,#f66)"
				title={`Delete graph "${graph.label}"`}
				onClick={deleteGraph}
			>
				<TrashIcon />
			</button>
		</div>
	);
}
