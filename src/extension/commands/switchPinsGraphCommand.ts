import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import { deletePinsGraph, saveActivePinsGraph } from '../graph/activePinsGraphStorage';
import { GraphPanel } from '../panel/graph-panel';
import { PinsGraphsStore } from '../pins-graphs-store';

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
export function switchPinsGraphCommand({
	pinsGraphsStore,
	fileNodesStore,
	graphPanel,
}: {
	pinsGraphsStore: PinsGraphsStore;
	fileNodesStore: FileNodesStore;
	graphPanel: GraphPanel;
}): void {
	const quickPick = vscode.window.createQuickPick();
	quickPick.placeholder = 'Switch graph';

	const activeName = pinsGraphsStore.getActiveGraphName();
	const names = pinsGraphsStore.getGraphNames();

	if (!names.includes(activeName)) {
		names.unshift(activeName);
	}

	quickPick.items = [
		...names.map((name) => ({
			label: name,
			description: name === activeName ? 'active' : undefined,
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

		saveActivePinsGraph(pinsGraphsStore, fileNodesStore);
		await pinsGraphsStore.setActiveGraphName(name);
		fileNodesStore.setFileNodes(pinsGraphsStore.getGraph(name) ?? []);

		graphPanel.show();
	});

	quickPick.onDidTriggerItemButton(async ({ item, button }) => {
		quickPick.hide();

		if (button === RENAME_BUTTON) {
			const newName = await vscode.window.showInputBox({
				prompt: `Rename graph "${item.label}"`,
				value: item.label
			});

			if (newName && newName !== item.label) {
				const isActive = pinsGraphsStore.getActiveGraphName() === item.label;

				if (isActive) {
					saveActivePinsGraph(pinsGraphsStore, fileNodesStore);
				}

				await pinsGraphsStore.saveGraph(newName, pinsGraphsStore.getGraph(item.label) ?? []);
				await pinsGraphsStore.deleteGraph(item.label);

				if (isActive) {
					await pinsGraphsStore.setActiveGraphName(newName);
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
				await deletePinsGraph(pinsGraphsStore, fileNodesStore, item.label);
			}
		}

		graphPanel.refreshTitle();
		switchPinsGraphCommand({ pinsGraphsStore, fileNodesStore, graphPanel });
	});

	quickPick.onDidHide(() => quickPick.dispose());

	quickPick.show();
}
