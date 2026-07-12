import { useAtom } from 'jotai';
import { parseLocationKey } from '../../locationKey';
import { FileNode, WebviewMessageType, type Pin, type PinLine } from '../../types';
import { selectedSymbolAtom } from '../atoms';
import { cn } from '../utils/cn';
import { checkIsSameSymbol } from '../utils/checkIsSameSymbol';
import { sendToExtension } from '../utils/vscodeApi';

/** One clickable breadcrumb line; overflowing text marquees back and forth on hover. */
export function LineView({
	line,
	fileNode,
	pin,
}: {
	line: PinLine;
	fileNode: FileNode;
	/** Makes the pinned symbol on its line highlighted and selectable; the same symbol lights up across all nodes. */
	pin?: Pin;
}) {
	const [selectedSymbol, setSelectedSymbol] = useAtom(selectedSymbolAtom);

	// The pinned symbol's place inside the raw line comes straight from the locationKey column.
	const pinnedLocation = pin && parseLocationKey(pin.locationKey);
	const symbolRange = pin && pinnedLocation && pinnedLocation.line === line.line
		? { start: pinnedLocation.character, end: pinnedLocation.character + pin.symbolName.length }
		: undefined;

	const isSelected = Boolean(pin && selectedSymbol && checkIsSameSymbol(selectedSymbol, pin));

	const toggleSelection = (event: React.MouseEvent) => {
		event.stopPropagation();
		setSelectedSymbol(isSelected ? undefined : pin);
	};

	const beforeSymbol = symbolRange && line.text.slice(0, symbolRange.start);
	const symbol = symbolRange && line.text.slice(symbolRange.start, symbolRange.end);
	const afterSymbol = symbolRange && line.text.slice(symbolRange.end);

	return (
		<div
			className="group/line @container cursor-pointer overflow-hidden py-px pr-2 pl-2 whitespace-pre hover:bg-(--vscode-list-hoverBackground)"
			title={`${fileNode.filePath}:${line.line + 1}`}
			onClick={() => sendToExtension(WebviewMessageType.OpenLocation, { file: fileNode.filePath, line: line.line })}
		>
			<span className="inline-block min-w-full group-hover/line:animate-marquee-x group-active/line:[animation-play-state:paused]">
				{symbolRange ? (
					<>
						{beforeSymbol}
						<span
							className={cn(
								'nodrag cursor-pointer rounded-xs bg-(--vscode-editor-findMatchHighlightBackground,rgba(234,92,0,0.33))',
								isSelected &&
									'bg-(--vscode-editor-selectionBackground) outline outline-(--vscode-focusBorder)'
							)}
							onClick={toggleSelection}
						>
							{symbol}
						</span>
						{afterSymbol}
					</>
				) : (
					line.text
				)}
			</span>
		</div>
	);
}
