import { Coords } from '../../shared/types';

/** Last viewport center reported by the webview, in flow coordinates — new nodes land there. */
export class ViewportCenterState {
	private center: Coords | undefined;

	getCenter(): Coords | undefined {
		return this.center;
	}

	setCenter(center: Coords): void {
		this.center = center;
	}
}
