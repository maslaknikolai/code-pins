import { useAtom } from 'jotai';
import type { ReactNode } from 'react';
import { type Pin } from '../../shared/types';
import { selectedPinAtom } from '../atoms';
import { checkIsSameSymbol } from '../utils/checkIsSameSymbol';
import { cn } from '../utils/cn';


export function PinHighlight({ pin, children }: { pin: Pin; children: ReactNode }) {
	const [selectedPin, setSelectedPin] = useAtom(selectedPinAtom);
	const isSelectedPin = selectedPin?.id === pin.id;
	const isSelectedSymbol = Boolean(selectedPin && checkIsSameSymbol(selectedPin, pin));

	const toggleSelection = (event: React.MouseEvent) => {
		event.stopPropagation();
		setSelectedPin(isSelectedPin ? undefined : pin);
	};

	return (
		<span
			className={cn(
				'nodrag cursor-pointer rounded-xs bg-(--vscode-editor-findMatchHighlightBackground,rgba(234,92,0,0.33))',
				isSelectedPin
					? 'bg-(--vscode-focusBorder) font-bold text-(--vscode-editor-background)'
					: isSelectedSymbol &&
						'bg-(--vscode-editor-selectionBackground) outline outline-(--vscode-focusBorder)'
			)}
			onClick={toggleSelection}
		>
			{children}
		</span>
	);
}
