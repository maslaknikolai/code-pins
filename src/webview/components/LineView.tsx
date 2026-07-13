import { useMemo, type ReactNode } from 'react';
import { useAtom } from 'jotai';
import { parsePinPath } from '../../shared/pinPath';
import { FileNode, WebviewMessageType, type Pin } from '../../shared/types';
import { selectedPinAtom } from '../atoms';
import type { LineElement } from '../utils/buildPinsTree';
import { checkIsDeclaration } from '../utils/checkIsDeclaration';
import { checkIsSameSymbol } from '../utils/checkIsSameSymbol';
import { cn } from '../utils/cn';
import { sendToExtension } from '../utils/vscodeApi';

/**
 * One clickable line of the tree: opens its location, marquees overflowing text
 * on hover. Without pins it's a plain context line; with pins it's framed and
 * gets a selectable highlight per pin.
 */
export function LineView({ element, fileNode }: { element: LineElement; fileNode: FileNode }) {
	const [selectedPin, setSelectedPin] = useAtom(selectedPinAtom);
	const { line, pins } = element;

	const segments = useMemo(() => {
		const sortedPins = [...pins].sort(
			(a, b) => parsePinPath(a.pinPath).character - parsePinPath(b.pinPath).character
		);

		const toggleSelection = (event: React.MouseEvent, pin: Pin, isSelectedPin: boolean) => {
			event.stopPropagation();
			setSelectedPin(isSelectedPin ? undefined : pin);
		};

		const result: ReactNode[] = [];
		let cursor = 0;
		for (const pin of sortedPins) {
			const start = parsePinPath(pin.pinPath).character;
			const end = start + pin.symbolName.length;
			const isSelectedPin = selectedPin?.id === pin.id;
			const isSelectedSymbol = Boolean(selectedPin && checkIsSameSymbol(selectedPin, pin));

			result.push(line.text.slice(cursor, start));
			result.push(
				<span
					key={pin.id}
					className={cn(
						'nodrag cursor-pointer rounded-xs bg-(--vscode-editor-findMatchHighlightBackground,rgba(234,92,0,0.33))',
						isSelectedSymbol && 'bg-(--vscode-editor-selectionBackground) outline outline-(--vscode-focusBorder)',
						isSelectedPin && 'outline-2 outline-(--vscode-charts-orange,#e69f4c)'
					)}
					onClick={(event) => toggleSelection(event, pin, isSelectedPin)}
				>
					{line.text.slice(start, end)}
				</span>
			);
			cursor = end;
		}
		result.push(line.text.slice(cursor));
		return result;
	}, [line, pins, selectedPin, setSelectedPin]);

	return (
		<div
			className={cn(
				'group/line @container relative cursor-pointer overflow-hidden py-px pr-2 pl-2 whitespace-pre hover:bg-(--vscode-list-hoverBackground)',
				pins.length > 0 && 'border-b border-(--vscode-editorWidget-border) last:border-b-0',
				pins.some(checkIsDeclaration) && 'border-l-2 border-l-(--vscode-charts-blue,#4a90d9)'
			)}
			title={`${fileNode.filePath}:${line.line + 1}`}
			onClick={() => sendToExtension(WebviewMessageType.OpenLocation, { file: fileNode.filePath, line: line.line })}
		>
			<span className="inline-block min-w-full group-hover/line:animate-marquee-x group-active/line:[animation-play-state:paused]">
				{segments}
			</span>
		</div>
	);
}
