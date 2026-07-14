import { useMemo, type ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import { parsePinPath } from '../../shared/pinPath';
import { WebviewMessageType } from '../../shared/messages';
import { FileNode } from '../../shared/types';
import { selectedPinAtom } from '../atoms';
import type { LineElement } from '../utils/buildPinLinesTree';
import { checkIsSameSymbol } from '../utils/checkIsSameSymbol';
import { cn } from '../utils/cn';
import { sendToExtension } from '../utils/vscodeApi';
import { HoverScrollText } from './HoverScrollText';
import { PinHighlight } from './PinHighlight';


export function LineView({ element, fileNode }: { element: LineElement; fileNode: FileNode }) {
	const selectedPin = useAtomValue(selectedPinAtom);
	const { line, pins } = element;

	const segments = useMemo(() => {
		const sortedPins = [...pins].sort(
			(a, b) => parsePinPath(a.pinPath).character - parsePinPath(b.pinPath).character
		);

		const result: ReactNode[] = [];
		let cursor = 0;
		for (const pin of sortedPins) {
			const start = parsePinPath(pin.pinPath).character;
			const end = start + pin.symbolName.length;

			result.push(line.text.slice(cursor, start));
			result.push(
				<PinHighlight key={pin.id} pin={pin}>
					{line.text.slice(start, end)}
				</PinHighlight>
			);
			cursor = end;
		}
		result.push(line.text.slice(cursor));
		return result;
	}, [line, pins]);

	const hasDeclarationPin = useMemo(() => {
		return pins.some(pin => pin.symbolDefinitionPath === pin.pinPath)
	}, [pins])

	const hasHighlightedPin = useMemo(() => {
		return !!selectedPin && pins.some((pin) => checkIsSameSymbol(selectedPin, pin))
	}, [selectedPin, pins])

	return (
		<div
			className={cn(
				'group/line relative cursor-pointer overflow-hidden py-1 pr-2 pl-2 whitespace-pre hover:bg-(--vscode-list-hoverBackground)',
				pins.length > 0 && 'border-b border-(--vscode-editorWidget-border) last:border-b-0',
				hasDeclarationPin && 'border-l-2 border-l-(--vscode-charts-blue,#4a90d9)',
				hasHighlightedPin && 'bg-(--vscode-focusBorder)/15'
			)}
			title={`${fileNode.filePath}:${line.line + 1}`}
			onClick={() => sendToExtension({ type: WebviewMessageType.OpenLocation, file: fileNode.filePath, line: line.line })}
		>
			<HoverScrollText>{segments}</HoverScrollText>
		</div>
	);
}
