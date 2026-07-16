import { cn } from '../utils/cn';

export function HotkeyHint({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<kbd
			className={cn(
				'shrink-0 rounded border border-(--vscode-editorWidget-border) px-1 font-mono text-[10px] leading-4 opacity-60',
				className
			)}
		>
			{children}
		</kbd>
	);
}
