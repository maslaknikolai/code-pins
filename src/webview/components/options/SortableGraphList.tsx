import { closestCenter, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAtom } from 'jotai';
import { WebviewMessageType } from '../../../shared/messages';
import { allGraphsAtom } from '../../atoms';
import { sendToExtension } from '../../utils/vscodeApi';
import { GraphListItem } from './GraphListItem';

export function SortableGraphList() {
	const [graphs, setGraphs] = useAtom(allGraphsAtom);

	// Distance threshold keeps plain clicks (switch graph, row buttons) working.
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

	const onDragEnd = ({ active, over }: DragEndEvent) => {
		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = graphs.findIndex((graph) => graph.id === active.id);
		const newIndex = graphs.findIndex((graph) => graph.id === over.id);
		const reordered = arrayMove(graphs, oldIndex, newIndex);

		setGraphs(reordered);
		sendToExtension({
			type: WebviewMessageType.ReorderGraphs,
			ids: reordered.map((graph) => graph.id),
		});
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
			onDragEnd={onDragEnd}
		>
			<SortableContext items={graphs.map((graph) => graph.id)} strategy={verticalListSortingStrategy}>
				{graphs.map((graph) => (
					<GraphListItem
						key={graph.id}
						graph={graph}
					/>
				))}
			</SortableContext>
		</DndContext>
	);
}
