import type { GroupNode, PinsTreeNode } from '../utils/buildPinsTree';
import { LineView } from './LineView';
import { PinView } from './PinView';

/** Renders the shared-scope tree built by buildPinsTree. */
export function PinsTree({ nodes, filePath }: { nodes: PinsTreeNode[]; filePath: string }) {
	return (
		<>
			{nodes.map((node) =>
				node.type === 'pin' ? (
					<PinView key={node.pin.id} pin={node.pin} lines={node.lines} filePath={filePath} />
				) : (
					<GroupView key={node.lineNumber} group={node} filePath={filePath} />
				)
			)}
		</>
	);
}

function GroupView({ group, filePath }: { group: GroupNode; filePath: string }) {
	return (
		<div className="flex flex-col gap-2">
			{group.pinnedOnSharedLine.map(({ pin, lines }) => (
				<PinView key={pin.id} pin={pin} lines={lines} filePath={filePath} />
			))}

			{group.sharedLine && <LineView line={group.sharedLine} filePath={filePath} />}

			<PinsTree nodes={group.children} filePath={filePath} />
		</div>
	);
}
