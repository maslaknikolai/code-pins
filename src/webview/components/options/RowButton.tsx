import { cn } from '../../utils/cn';
import { Tooltip } from '../ui/tooltip';

export function RowButton({ tooltip, className, onClick, children }: {
	tooltip: React.ReactNode;
	className?: string;
	onClick: (event: React.MouseEvent) => void;
	children: React.ReactNode;
}) {
	return (
		<Tooltip body={tooltip}>
			<button
				className={cn('shrink-0 cursor-pointer px-1 opacity-50 hover:opacity-100!', className)}
				onClick={onClick}
			>
				{children}
			</button>
		</Tooltip>
	);
}
