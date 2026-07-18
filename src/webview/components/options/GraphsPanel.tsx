import { useAtomValue } from 'jotai';
import { WebviewMessageType } from '../../../shared/messages';
import { allGraphsAtom } from '../../atoms';
import { useSelectGraphByOffset } from '../../hooks/useSelectGraphByOffset';
import { sendToExtension } from '../../utils/vscodeApi';
import { HotkeyHint } from '../HotkeyHint';
import { Tooltip } from '../ui/tooltip';
import { SortableGraphList } from './SortableGraphList';
import { ChevronDownIcon, ChevronUpIcon, ImportIcon, PlusIcon } from './icons';

const STEP_BUTTON_CLASS = 'flex cursor-pointer flex-col items-center gap-0.5 rounded border border-(--vscode-editorWidget-border) px-1.5 py-1 opacity-70 hover:bg-(--vscode-list-hoverBackground) hover:opacity-100 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent';

export function GraphsPanel() {
	const graphs = useAtomValue(allGraphsAtom);
	const { selectGraphByOffset, canSelectPrev, canSelectNext } = useSelectGraphByOffset();

	const newGraph = () => {
		sendToExtension({ type: WebviewMessageType.NewGraph });
	};

	const importGraph = () => {
		sendToExtension({ type: WebviewMessageType.ImportGraph });
	};

	return (
		<div className="flex flex-col gap-1">
			<div className="flex gap-1 px-1">
				<Tooltip body="New graph (X)">
					<button
						className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border border-(--vscode-editorWidget-border) px-2 py-1 opacity-70 hover:opacity-100 hover:bg-(--vscode-list-hoverBackground)"
						onClick={newGraph}
					>
						<PlusIcon />
						New graph
						<HotkeyHint>X</HotkeyHint>
					</button>
				</Tooltip>

				<button
					className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border border-(--vscode-editorWidget-border) px-2 py-1 opacity-70 hover:opacity-100 hover:bg-(--vscode-list-hoverBackground)"
					onClick={importGraph}
				>
					<ImportIcon />
					Import
				</button>
			</div>


			<div className="flex gap-1 px-1">
				<div className="h-48 min-w-0 flex-1 overflow-y-scroll">
					{!graphs.length && (
						<div className="px-1 py-2 opacity-60">No saved graphs.</div>
					)}

					<SortableGraphList />
				</div>

				<div className="flex shrink-0 flex-col gap-1">
					<Tooltip body="Previous graph (Q)">
						<button
							className={STEP_BUTTON_CLASS}
							disabled={!canSelectPrev}
							onClick={() => selectGraphByOffset(-1)}
						>
							<ChevronUpIcon />
							<HotkeyHint>Q</HotkeyHint>
						</button>
					</Tooltip>

					<Tooltip body="Next graph (E)">
						<button
							className={STEP_BUTTON_CLASS}
							disabled={!canSelectNext}
							onClick={() => selectGraphByOffset(1)}
						>
							<ChevronDownIcon />
							<HotkeyHint>E</HotkeyHint>
						</button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
