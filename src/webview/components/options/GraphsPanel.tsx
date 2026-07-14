import { useAtomValue } from 'jotai';
import { WebviewMessageType } from '../../../shared/messages';
import { activeGraphIdAtom, allGraphsAtom } from '../../atoms';
import { sendToExtension } from '../../utils/vscodeApi';
import { GraphListItem } from './GraphListItem';
import { ImportIcon, PlusIcon } from './icons';

export function GraphsPanel() {
	const graphs = useAtomValue(allGraphsAtom);
	const activeGraphId = useAtomValue(activeGraphIdAtom);

	const newGraph = () => {
		sendToExtension({ type: WebviewMessageType.NewGraph });
	};

	const importGraph = () => {
		sendToExtension({ type: WebviewMessageType.ImportGraph });
	};

	return (
		<div className="flex flex-col">
			<div className="mb-1 flex gap-1">
				<button
					className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border border-(--vscode-editorWidget-border) px-2 py-1 opacity-70 hover:opacity-100 hover:bg-(--vscode-list-hoverBackground)"
					onClick={newGraph}
				>
					<PlusIcon />
					New graph
				</button>

				<button
					className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border border-(--vscode-editorWidget-border) px-2 py-1 opacity-70 hover:opacity-100 hover:bg-(--vscode-list-hoverBackground)"
					onClick={importGraph}
				>
					<ImportIcon />
					Import
				</button>
			</div>

			{graphs.length === 0 && <div className="px-1 py-2 opacity-60">No saved graphs.</div>}

			{[...graphs].reverse().map((graph) => (
				<GraphListItem
					key={graph.id}
					graph={graph}
					isActive={graph.id === activeGraphId}
				/>
			))}
		</div>
	);
}
