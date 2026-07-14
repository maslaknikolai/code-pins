import { cn } from '../../utils/cn';

export function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick?: () => void }) {
	return (
		<button
			className={cn(
				'cursor-pointer border-b-2 px-3 py-1.5',
				isActive
					? 'border-(--vscode-focusBorder) opacity-100'
					: 'border-transparent opacity-60 hover:opacity-100'
			)}
			onClick={onClick}
		>
			{label}
		</button>
	);
}
