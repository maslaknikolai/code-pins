import { FileNode } from '../../shared/types';
import type { LineElement } from '../utils/buildPinsTree';
import { LineView } from './LineView';

/** Renders the shared-scope line tree built by buildPinsTree. */
export function PinsTree({ elements, fileNode }: { elements: LineElement[]; fileNode: FileNode }) {
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
		<div className="flex flex-col gap-2">
			<LineView
				element={element}
				fileNode={fileNode}
			/>

			<PinsTree
				elements={element.children}
				fileNode={fileNode}
			/>
		</div>
	);
}
