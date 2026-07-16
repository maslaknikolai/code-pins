import { ControlButton, Controls, useReactFlow } from '@xyflow/react';
import { useFitViewToggle } from '../hooks/useFitViewToggle';

/** Replaces the built-in zoom/fitView buttons so each one can show its hotkey. */
export function FlowControls() {
	const { zoomIn, zoomOut } = useReactFlow();
	const toggleFitView = useFitViewToggle();

	return (
		<Controls showZoom={false} showFitView={false}>
			<ControlButton onClick={() => zoomIn()} title="Zoom in (+)">
				<span className="font-mono text-xs">+</span>
			</ControlButton>

			<ControlButton onClick={() => zoomOut()} title="Zoom out (-)">
				<span className="font-mono text-xs">−</span>
			</ControlButton>

			<ControlButton onClick={toggleFitView} title="Fit into view, again to undo (F)">
				<span className="font-mono text-xs">F</span>
			</ControlButton>
		</Controls>
	);
}
