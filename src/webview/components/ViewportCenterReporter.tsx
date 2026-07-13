import { useOnViewportChange, useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';
import { WebviewMessageType } from '../../shared/messages';
import { sendToExtension } from '../utils/vscodeApi';

/**
 * Keeps the extension informed of the viewport center (in flow coordinates),
 * so new nodes can be placed there. Must live inside <ReactFlow>.
 */
export function ViewportCenterReporter() {
	const { screenToFlowPosition } = useReactFlow();

	const reportCenter = () => {
		const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
		sendToExtension({ type: WebviewMessageType.ViewportChanged, x: center.x, y: center.y });
	};

	useEffect(reportCenter, []);
	useOnViewportChange({ onEnd: reportCenter });

	return null;
}
