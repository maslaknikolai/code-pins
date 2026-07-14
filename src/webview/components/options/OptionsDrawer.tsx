import { useState } from 'react';
import { GraphsPanel } from './GraphsPanel';
import { TabButton } from './TabButton';
import { ToolsPanel } from './ToolsPanel';


type DrawerTab = 'tools' | 'graphs';

export function OptionsDrawer() {
	const [isOpen, setIsOpen] = useState(true);
	const [tab, setTab] = useState<DrawerTab>('graphs');

	return (
		<div className="fixed bottom-0 left-1/2 z-10 -translate-x-1/2">
			{isOpen ? (
				<div className="w-80 rounded-t-md border border-b-0 border-(--vscode-editorWidget-border) bg-(--vscode-editorWidget-background) text-(--vscode-editorWidget-foreground) shadow-lg">
					<div className="flex items-center border-b border-(--vscode-editorWidget-border)">
						<TabButton label="Graphs" isActive={tab === 'graphs'} onClick={() => setTab('graphs')} />
						{/* <TabButton label="Tools" isActive={tab === 'tools'} onClick={() => setTab('tools')} /> */}

						<button
							className="ml-auto cursor-pointer px-3 py-1.5 opacity-60 hover:opacity-100"
							title="Close"
							onClick={() => setIsOpen(false)}
						>
							▾
						</button>
					</div>

					<div className="max-h-60 overflow-y-auto p-2">
						{tab === 'tools' && <ToolsPanel />}
						{tab === 'graphs' && <GraphsPanel />}
					</div>
				</div>
			) : (
				<button
					className="cursor-pointer rounded-t-md border border-b-0 border-(--vscode-editorWidget-border) bg-(--vscode-editorWidget-background) px-4 py-1 text-(--vscode-editorWidget-foreground) opacity-70 hover:opacity-100"
					title="Open options"
					onClick={() => setIsOpen(true)}
				>
					▴ Options
				</button>
			)}
		</div>
	);
}
