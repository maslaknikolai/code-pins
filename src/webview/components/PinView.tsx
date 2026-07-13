import { parseSymbolLocationPath } from '../../shared/symbolLocationPath';
import { FileNode, type Pin, type PinLine } from '../../shared/types';
import { checkIsDeclaration } from '../utils/checkIsDeclaration';
import { cn } from '../utils/cn';
import { BreadcrumbLineView } from './BreadcrumbLineView';
import { PinLineView } from './PinLineView';

/** One pinned entity inside the file node: breadcrumb lines plus the pinned line itself. */
export function PinView({ pin, lines, fileNode }: { pin: Pin; lines: PinLine[]; fileNode: FileNode }) {
	const pinnedLineNumber = parseSymbolLocationPath(pin.symbolLocationPath).line;

	return (
		<div
			className={cn(
				'border-b border-(--vscode-editorWidget-border) last:border-b-0',
				checkIsDeclaration(pin) && 'border-l-2 border-l-(--vscode-charts-blue,#4a90d9)'
			)}
		>
			{lines.map((line) =>
				line.line === pinnedLineNumber ? (
					<PinLineView key={line.line} line={line} pin={pin} fileNode={fileNode} />
				) : (
					<BreadcrumbLineView key={line.line} line={line} fileNode={fileNode} />
				)
			)}
		</div>
	);
}
