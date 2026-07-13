import { FileNode } from '../../shared/types';
import type { LineElement } from '../utils/buildPinLinesTree';
import { LineView } from './LineView';


export function PinsLinesTree({ elements, fileNode }: { elements: LineElement[]; fileNode: FileNode }) {
	return (
		<>
			{elements.map((element) => (
				<LineElementView
					key={element.line.line}
					element={element}
					fileNode={fileNode}
				/>
			))}
		</>
	);
}

function LineElementView({ element, fileNode }: { element: LineElement; fileNode: FileNode }) {
	return (
		<div className="flex flex-col">
			<LineView
				element={element}
				fileNode={fileNode}
			/>

			<PinsLinesTree
				elements={element.children}
				fileNode={fileNode}
			/>
		</div>
	);
}
