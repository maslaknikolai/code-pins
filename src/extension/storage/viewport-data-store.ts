import * as vscode from 'vscode';
import { ViewSettings } from '../../shared/types';


const VIEW_SETTINGS_KEY = 'codePins.viewSettings';

export function createViewSettingsStore(workspaceState: vscode.Memento) {
	return {
		get(): ViewSettings | undefined {
			return workspaceState.get<ViewSettings | undefined>(VIEW_SETTINGS_KEY);
		},

		set(viewSettings: ViewSettings | undefined): Thenable<void> {
			return workspaceState.update(VIEW_SETTINGS_KEY, viewSettings);
		}
	};
}

export type ViewSettingsStore = ReturnType<typeof createViewSettingsStore>;
