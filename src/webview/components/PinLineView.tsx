import { useAtom } from 'jotai';
import { parseLocationKey } from '../../locationKey';
import { FileNode, WebviewMessageType, type Pin, type PinLine } from '../../types';
import { selectedSymbolAtom } from '../atoms';
import { cn } from '../utils/cn';
import { checkIsSameSymbol } from '../utils/checkIsSameSymbol';
import { sendToExtension } from '../utils/vscodeApi';
import { LineShell } from './LineShell';

/** The line a pin was made on: highlighted selectable symbol plus its remove button. */
export function PinLineView({ line, pin, fileNode }: { line: PinLine; pin: Pin; fileNode: FileNode }) {
	const [selectedSymbol, setSelectedSymbol] = useAtom(selectedSymbolAtom);
	const isSelected = Boolean(selectedSymbol && checkIsSameSymbol(selectedSymbol, pin));

	// The pinned symbol's place inside the raw line comes straight from the locationKey column.
	const start = parseLocationKey(pin.locationKey).character;
	const end = start + pin.symbolName.length;

	const toggleSelection = (event: React.MouseEvent) => {
		event.stopPropagation();
		setSelectedSymbol(isSelected ? undefined : pin);
	};

	const removePin = (event: React.MouseEvent) => {
		event.stopPropagation();
		sendToExtension(WebviewMessageType.RemovePin, { id: pin.id });
	};

	return (
		<LineShell
			line={line}
			fileNode={fileNode}
			trailing={
				<button
					className="nodrag absolute top-0 right-1 z-10 hidden cursor-pointer px-1 opacity-50 group-hover/line:block hover:opacity-100 hover:text-(--vscode-errorForeground,#f66)"
					title="Remove pin"
					onClick={removePin}
				>
					×
				</button>
			}
		>
			{line.text.slice(0, start)}
			<span
				className={cn(
					'nodrag cursor-pointer rounded-xs bg-(--vscode-editor-findMatchHighlightBackground,rgba(234,92,0,0.33))',
					isSelected && 'bg-(--vscode-editor-selectionBackground) outline outline-(--vscode-focusBorder)'
				)}
				onClick={toggleSelection}
			>
				{line.text.slice(start, end)}
			</span>
			{line.text.slice(end)}
		</LineShell>
	);
}
