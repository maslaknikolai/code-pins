import { FileNode } from '../../types';
import type { GroupNode, PinsTreeNode } from '../utils/buildPinsTree';
import { BreadcrumbLineView } from './BreadcrumbLineView';
import { PinView } from './PinView';

/** Renders the shared-scope tree built by buildPinsTree. */
export function PinsTree({ nodes, fileNode }: { nodes: PinsTreeNode[]; fileNode: FileNode }) {
	return (
		<>
			{nodes.map((node) =>
				node.type === 'pin' ? (
					<PinView
						key={node.pin.id}
						pin={node.pin}
						lines={node.lines}
						fileNode={fileNode}
					/>
				) : (
					<GroupView
						key={node.lineNumber}
						group={node}
						fileNode={fileNode}
					/>
				)
			)}
		</>
	);
}

function GroupView({ group, fileNode }: { group: GroupNode; fileNode: FileNode }) {
	return (
		<div className="flex flex-col gap-2">
			{group.sharedLines.map((line) => (
				<BreadcrumbLineView
					key={line.line}
					line={line}
					fileNode={fileNode}
				/>
			))}

			<PinsTree
				nodes={group.children}
				fileNode={fileNode}
			/>
		</div>
	);
}
