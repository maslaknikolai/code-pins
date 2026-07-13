import { useMemo, type ReactNode } from 'react';
import { useAtom } from 'jotai';
import { parsePinPath } from '../../shared/pinPath';
import { FileNode, WebviewMessageType, type Pin } from '../../shared/types';
import { selectedPinAtom } from '../atoms';
import type { LineElement } from '../utils/buildPinLinesTree';
import { checkIsSameSymbol } from '../utils/checkIsSameSymbol';
import { cn } from '../utils/cn';
import { sendToExtension } from '../utils/vscodeApi';
import { HoverScrollText } from './HoverScrollText';


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
						isSelectedPin
							? 'bg-(--vscode-focusBorder) font-bold text-(--vscode-editor-background)'
							: isSelectedSymbol &&
								'bg-(--vscode-editor-selectionBackground) outline outline-(--vscode-focusBorder)'
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

	const hasDeclarationPin = useMemo(() => {
		return pins.some(pin => pin.symbolDefinitionPath === pin.pinPath)
	}, [pins])

	return (
		<div
			className={cn(
				'group/line relative cursor-pointer overflow-hidden py-1 pr-2 pl-2 whitespace-pre hover:bg-(--vscode-list-hoverBackground)',
				pins.length > 0 && 'border-b border-(--vscode-editorWidget-border) last:border-b-0',
				hasDeclarationPin && 'border-l-2 border-l-(--vscode-charts-blue,#4a90d9)'
			)}
			title={`${fileNode.filePath}:${line.line + 1}`}
			onClick={() => sendToExtension(WebviewMessageType.OpenLocation, { file: fileNode.filePath, line: line.line })}
		>
			<HoverScrollText>{segments}</HoverScrollText>
		</div>
	);
}
