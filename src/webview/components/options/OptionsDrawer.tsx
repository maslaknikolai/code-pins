import { GraphsPanel } from './GraphsPanel';
import { ChevronDownIcon, ChevronUpIcon } from './icons';
import { PanelButton } from './PanelButton';
import { TabButton } from './TabButton';
import { useAtom } from 'jotai';
import { viewSettingsAtom } from '../../atoms';
import { HotkeyHint } from '../HotkeyHint';


export function OptionsDrawer() {
	const [viewSettings, setViewSettings] = useAtom(viewSettingsAtom);

	return (
		<div className="fixed bottom-0 left-1/2 z-10 -translate-x-1/2">
			{viewSettings?.isDrawerOpen ? (
				<div className="w-80 rounded-t-md border border-b-0 border-(--vscode-editorWidget-border) bg-(--vscode-editorWidget-background) text-(--vscode-editorWidget-foreground) shadow-lg flex flex-col gap-1">
					<div className="flex items-center justify-between border-b border-(--vscode-editorWidget-border) pr-1">
						<TabButton label="Graphs" isActive />

						<PanelButton
							title="Close (Space)"
							onClick={() => setViewSettings(v => ({...v, isDrawerOpen: false}))}
						>
							<HotkeyHint>␣</HotkeyHint>
							<ChevronDownIcon />
						</PanelButton>
					</div>

					<GraphsPanel />
				</div>
			) : (
				<button
					className="flex cursor-pointer items-center gap-1.5 rounded-t-md border border-b-0 border-(--vscode-editorWidget-border) bg-(--vscode-editorWidget-background) px-4 py-1 text-(--vscode-editorWidget-foreground) opacity-70 hover:opacity-100"
					title="Open options (Space)"
					onClick={() => setViewSettings(v => ({...v, isDrawerOpen: true}))}
				>
					<ChevronUpIcon />
					<HotkeyHint>␣</HotkeyHint>
				</button>
			)}
		</div>
	);
}
