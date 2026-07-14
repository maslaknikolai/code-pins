import { useOnViewportChange, useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';
import { WebviewMessageType } from '../../shared/messages';
import { sendToExtension } from '../utils/vscodeApi';
import { Coords } from '../../shared/types';

/**
 * Keeps the extension informed of the viewport center (in flow coordinates),
 * so new nodes can be placed there. Must live inside <ReactFlow>.
 */
export function ViewportCenterReporter() {
	const { screenToFlowPosition } = useReactFlow();

	const reportCenter = () => {
		const center: Coords = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
		sendToExtension({ type: WebviewMessageType.ViewportChanged, position: center });
	};

	useEffect(reportCenter, []);
	useOnViewportChange({ onEnd: reportCenter });

	return null;
}
