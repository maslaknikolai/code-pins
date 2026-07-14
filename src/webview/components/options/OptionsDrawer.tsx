import { useState } from 'react';
import { GraphsPanel } from './GraphsPanel';
import { ChevronDownIcon, ChevronUpIcon } from './icons';
import { TabButton } from './TabButton';



export function OptionsDrawer() {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="fixed bottom-0 left-1/2 z-10 -translate-x-1/2">
			{isOpen ? (
				<div className="w-80 rounded-t-md border border-b-0 border-(--vscode-editorWidget-border) bg-(--vscode-editorWidget-background) text-(--vscode-editorWidget-foreground) shadow-lg">
					<div className="flex items-center justify-between border-b border-(--vscode-editorWidget-border)">
						<TabButton label="Graphs" isActive />

						<button
							className="cursor-pointer px-3 py-1.5 opacity-60 hover:opacity-100"
							title="Close"
							onClick={() => setIsOpen(false)}
						>
							<ChevronDownIcon />
						</button>
					</div>

					<GraphsPanel />
				</div>
			) : (
				<button
					className="flex cursor-pointer items-center gap-1.5 rounded-t-md border border-b-0 border-(--vscode-editorWidget-border) bg-(--vscode-editorWidget-background) px-4 py-1 text-(--vscode-editorWidget-foreground) opacity-70 hover:opacity-100"
					title="Open options"
					onClick={() => setIsOpen(true)}
				>
					<ChevronUpIcon />
					Options
				</button>
			)}
		</div>
	);
}
