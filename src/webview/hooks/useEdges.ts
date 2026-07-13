import { MarkerType, type Edge } from '@xyflow/react';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { flowNodesAtom, selectedPinAtom } from '../atoms';
import { FLOATING_EDGE_TYPE } from '../components/FloatingEdge';
import { checkIsSameSymbol } from '../utils/checkIsSameSymbol';

const SELECTED_EDGE_COLOR = 'var(--vscode-focusBorder, #007fd4)';

/** a pin points at the node holding the pin its definition lives on. */
export function useEdges(): Edge[] {
	const nodes = useAtomValue(flowNodesAtom);
	const selectedPin = useAtomValue(selectedPinAtom);

	return useMemo(() => {
		const result: Edge[] = [];
		for (const { data } of nodes) {
			for (const pin of data.fileNode.pins) {
				// Pins whose definition is themselves (plain declarations) draw no arrow.
				if (!pin.symbolDefinitionPath || pin.symbolDefinitionPath === pin.pinPath) {
					continue;
				}
				const definitionNode = nodes.find(
					(n) =>
						n.data.fileNode.filePath !== data.fileNode.filePath &&
						n.data.fileNode.pins.some((p) => p.pinPath === pin.symbolDefinitionPath)
				);
				if (definitionNode) {
					const isSelected = Boolean(selectedPin && checkIsSameSymbol(selectedPin, pin));
					result.push({
						id: pin.id,
						type: FLOATING_EDGE_TYPE,
						source: data.fileNode.filePath,
						target: definitionNode.id,
						style: isSelected ? { stroke: SELECTED_EDGE_COLOR, strokeWidth: 2 } : undefined,
						markerEnd: isSelected
							? { type: MarkerType.ArrowClosed, color: SELECTED_EDGE_COLOR }
							: { type: MarkerType.ArrowClosed },
					});
				}
			}
		}
		return result;
	}, [nodes, selectedPin]);
}
