import { FileNode, type PinLine } from '../../types';
import { LineShell } from './LineShell';

/** A plain context line above a pin — no symbol, no controls. */
export function BreadcrumbLineView({ line, fileNode }: { line: PinLine; fileNode: FileNode }) {
	return <LineShell line={line} fileNode={fileNode} />;
}
