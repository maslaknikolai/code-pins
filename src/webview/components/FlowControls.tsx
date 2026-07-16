import { ControlButton, Controls, useReactFlow } from '@xyflow/react';
import { useFitViewWithinField } from '../hooks/useFitViewWithinField';

/** Replaces the built-in zoom/fitView buttons so each one can show its hotkey. */
export function FlowControls() {
	const { zoomIn, zoomOut } = useReactFlow();
	const fitViewWithinField = useFitViewWithinField();

	return (
		<Controls showZoom={false} showFitView={false}>
			<ControlButton onClick={() => zoomIn()} title="Zoom in (+)">
				<span className="font-mono text-xs">+</span>
			</ControlButton>

			<ControlButton onClick={() => zoomOut()} title="Zoom out (-)">
				<span className="font-mono text-xs">−</span>
			</ControlButton>

			<ControlButton onClick={fitViewWithinField} title="Fit into view (A)">
				<span className="font-mono text-xs">A</span>
			</ControlButton>
		</Controls>
	);
}
