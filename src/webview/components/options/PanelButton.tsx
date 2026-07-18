import { cn } from '../../utils/cn';

export function PanelButton({ className, ...props }: React.ComponentProps<'button'>) {
	return (
		<button
			className={cn(
				'flex cursor-pointer items-center gap-1.5 rounded border border-(--vscode-editorWidget-border) px-2 py-1 opacity-70 hover:bg-(--vscode-list-hoverBackground) hover:opacity-100 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent',
				className
			)}
			{...props}
		/>
	);
}
