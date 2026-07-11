import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Fragment } from 'react';
import { WebviewMessageType, type GraphNode } from '../types';
import type { PinFlowNode } from './flowNodes';
import { vscode } from './vscodeApi';

/** Custom React Flow node rendering one pinned entity. */
export function PinNode({ data }: NodeProps<PinFlowNode>) {
	const pin = data.pin;
	const dirPath = pin.filePath.slice(0, pin.filePath.length - pin.fileName.length);

	return (
		<div className={`pin ${pin.kind}`}>
			<Handle type="target" position={Position.Left} className="pin-handle" />
			<div className="header">
				<span className="path">{dirPath}</span>
				<span>{pin.fileName}</span>
				<button
					className="remove nodrag"
					title="Remove node"
					onClick={() => vscode.postMessage({ type: WebviewMessageType.RemoveNode, id: pin.id })}
				>
					×
				</button>
			</div>
			{pin.lines.map((line) => (
				<div
					key={line.line}
					className="line"
					style={{ paddingLeft: 8 + line.indent * 14 }}
					title={`${pin.filePath}:${line.line + 1}`}
					onClick={() => vscode.postMessage({ type: WebviewMessageType.OpenLocation, file: pin.filePath, line: line.line })}
				>
					<LineText pin={pin} text={line.text} />
				</div>
			))}
			<Handle type="source" position={Position.Right} className="pin-handle" />
		</div>
	);
}

/** Line text with the pinned entity highlighted in declaration nodes. */
function LineText({ pin, text }: { pin: GraphNode; text: string }) {
	if (pin.kind !== 'declaration' || !pin.highlightWord || !text.includes(pin.highlightWord)) {
		return <>{text}</>;
	}
	const parts = text.split(pin.highlightWord);
	return (
		<>
			{parts.map((part, i) => (
				<Fragment key={i}>
					{i > 0 && <span className="hl">{pin.highlightWord}</span>}
					{part}
				</Fragment>
			))}
		</>
	);
}
