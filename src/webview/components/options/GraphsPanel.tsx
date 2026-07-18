import { useAtomValue } from 'jotai';
import { WebviewMessageType } from '../../../shared/messages';
import { allGraphsAtom } from '../../atoms';
import { useSelectGraphByOffset } from '../../hooks/useSelectGraphByOffset';
import { sendToExtension } from '../../utils/vscodeApi';
import { HotkeyHint } from '../HotkeyHint';
import { Tooltip } from '../ui/tooltip';
import { SortableGraphList } from './SortableGraphList';
import { ChevronDownIcon, ChevronUpIcon, ImportIcon, PlusIcon } from './icons';
import { PanelButton } from './PanelButton';

const STEP_BUTTON_CLASS = 'flex-col gap-0.5 px-1.5';

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
					<PanelButton className="flex-1 justify-center" onClick={newGraph}>
						<PlusIcon />
						New graph
						<HotkeyHint>X</HotkeyHint>
					</PanelButton>
				</Tooltip>

				<PanelButton className="flex-1 justify-center" onClick={importGraph}>
					<ImportIcon />
					Import
				</PanelButton>
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
						<PanelButton
							className={STEP_BUTTON_CLASS}
							disabled={!canSelectPrev}
							onClick={() => selectGraphByOffset(-1)}
						>
							<ChevronUpIcon />
							<HotkeyHint>Q</HotkeyHint>
						</PanelButton>
					</Tooltip>

					<Tooltip body="Next graph (E)">
						<PanelButton
							className={STEP_BUTTON_CLASS}
							disabled={!canSelectNext}
							onClick={() => selectGraphByOffset(1)}
						>
							<ChevronDownIcon />
							<HotkeyHint>E</HotkeyHint>
						</PanelButton>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
