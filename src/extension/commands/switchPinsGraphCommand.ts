import * as vscode from 'vscode';
import { deletePinsGraph } from '../storage/deletePinsGraph';
import { saveActivePinsGraph } from '../storage/saveActivePinsGraph';
import { refreshGraphPanelTitle } from '../actions/refreshGraphPanelTitle';
import { showGraphPanel } from '../actions/showGraphPanel';
import { AppCtx } from '../types';

const NEW_GRAPH_LABEL = '$(add) New graph…';

const RENAME_BUTTON: vscode.QuickInputButton = {
	iconPath: new vscode.ThemeIcon('edit'),
	tooltip: 'Rename graph',
};

const DELETE_BUTTON: vscode.QuickInputButton = {
	iconPath: new vscode.ThemeIcon('trash'),
	tooltip: 'Delete graph',
};

/**
 * QuickPick over stored graphs: pick to switch, `+` to create, per-item buttons
 * rename/delete (the picker reopens after either).
 */
export function switchPinsGraphCommand(appCtx: AppCtx): void {
	const { pinsGraphsState, activePinsGraphState } = appCtx;
	const quickPick = vscode.window.createQuickPick();
	quickPick.placeholder = 'Switch graph';

	const activePinsGraphName = activePinsGraphState.getGraphName();
	const names = pinsGraphsState.getGraphNames();

	if (!names.includes(activePinsGraphName)) {
		names.unshift(activePinsGraphName);
	}

	quickPick.items = [
		...names.map((name) => ({
			label: name,
			description: name === activePinsGraphName ? 'active' : undefined,
			buttons: [RENAME_BUTTON, DELETE_BUTTON],
		})),
		{ label: NEW_GRAPH_LABEL, alwaysShow: true },
	];

	quickPick.onDidAccept(async () => {
		const picked = quickPick.selectedItems[0];
		if (!picked) {
			return;
		}
		quickPick.hide();

		let name = picked.label;
		if (name === NEW_GRAPH_LABEL) {
			const input = await vscode.window.showInputBox({ prompt: 'New graph name' });
			if (!input) {
				return;
			}
			name = input;
		}

		saveActivePinsGraph(appCtx);
		activePinsGraphState.setGraph(name, pinsGraphsState.getGraph(name) ?? []);

		showGraphPanel(appCtx);
	});

	quickPick.onDidTriggerItemButton(async ({ item, button }) => {
		quickPick.hide();

		if (button === RENAME_BUTTON) {
			const newName = await vscode.window.showInputBox({
				prompt: `Rename graph "${item.label}"`,
				value: item.label
			});

			if (newName && newName !== item.label) {
				const isActive = activePinsGraphState.getGraphName() === item.label;

				if (isActive) {
					saveActivePinsGraph(appCtx);
				}

				await pinsGraphsState.saveGraph(newName, pinsGraphsState.getGraph(item.label) ?? []);
				await pinsGraphsState.deleteGraph(item.label);

				if (isActive) {
					activePinsGraphState.setGraph(newName, activePinsGraphState.getFileNodes());
					await pinsGraphsState.setActiveGraphName(newName);
				}
			}
		}

		if (button === DELETE_BUTTON) {
			const confirmed = await vscode.window.showWarningMessage(
				`Delete graph "${item.label}"?`,
				{ modal: true },
				'Delete'
			);
			if (confirmed === 'Delete') {
				await deletePinsGraph(pinsGraphsState, activePinsGraphState, item.label);
			}
		}

		refreshGraphPanelTitle(appCtx);
		switchPinsGraphCommand(appCtx);
	});

	quickPick.onDidHide(() => quickPick.dispose());

	quickPick.show();
}
