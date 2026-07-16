import { ControlButton, Controls, useReactFlow } from '@xyflow/react';

/** Replaces the built-in zoom/fitView buttons so each one can show its hotkey. */
export function FlowControls() {
	const { zoomIn, zoomOut, fitView } = useReactFlow();

	return (
		<Controls showZoom={false} showFitView={false}>
			<ControlButton onClick={() => zoomIn()} title="Zoom in (+)">
				<span className="font-mono text-xs">+</span>
			</ControlButton>

			<ControlButton onClick={() => zoomOut()} title="Zoom out (-)">
				<span className="font-mono text-xs">−</span>
			</ControlButton>

			<ControlButton onClick={() => fitView()} title="Fit into view (A)">
				<span className="font-mono text-xs">A</span>
			</ControlButton>
		</Controls>
	);
}
