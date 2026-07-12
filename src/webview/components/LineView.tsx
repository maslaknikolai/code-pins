import { useAtom } from 'jotai';
import { WebviewMessageType, type PinLine } from '../../types';
import { selectedDefinitionKeyAtom } from '../atoms';
import { cn } from '../utils/cn';
import { sendToExtension } from '../utils/vscodeApi';

/** One clickable breadcrumb line; overflowing text marquees back and forth on hover. */
export function LineView({
	line,
	filePath,
	definitionKey,
}: {
	line: PinLine;
	filePath: string;
	/** Makes the highlighted symbol selectable; same key lights up across all nodes. */
	definitionKey?: string;
}) {
	const [selectedKey, setSelectedKey] = useAtom(selectedDefinitionKeyAtom);
	const isSelectable = Boolean(definitionKey && line.symbolRange);
	const isSelected = Boolean(definitionKey) && selectedKey === definitionKey;

	const toggleSelection = (event: React.MouseEvent) => {
		event.stopPropagation();
		setSelectedKey(isSelected ? undefined : definitionKey);
	};

	const beforeSymbol = line.symbolRange && line.text.slice(0, line.symbolRange.start);
	const symbol = line.symbolRange && line.text.slice(line.symbolRange.start, line.symbolRange.end);
	const afterSymbol = line.symbolRange && line.text.slice(line.symbolRange.end);

	return (
		<div
			className="group/line @container cursor-pointer overflow-hidden py-px pr-2 whitespace-pre hover:bg-(--vscode-list-hoverBackground)"
			style={{ paddingLeft: 8 + line.indent * 14 }}
			title={`${filePath}:${line.line + 1}`}
			onClick={() => sendToExtension(WebviewMessageType.OpenLocation, { file: filePath, line: line.line })}
		>
			<span className="inline-block min-w-full group-hover/line:animate-marquee-x group-active/line:[animation-play-state:paused]">
				{line.symbolRange ? (
					<>
						{beforeSymbol}
						<span
							className={cn(
								'rounded-xs bg-(--vscode-editor-findMatchHighlightBackground,rgba(234,92,0,0.33))',
								isSelectable && 'nodrag cursor-pointer',
								isSelected &&
									'bg-(--vscode-editor-selectionBackground) outline outline-(--vscode-focusBorder)'
							)}
							onClick={isSelectable ? toggleSelection : undefined}
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
