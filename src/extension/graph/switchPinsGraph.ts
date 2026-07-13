import * as vscode from 'vscode';
import { FileNodesStore } from '../file-nodes-store';
import {
	deletePinsGraph,
	getActivePinsGraphName,
	getPinsGraphNames,
	renamePinsGraph,
	setActivePinsGraph,
} from './activePinsGraphStorage';

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
 * rename/delete (the picker reopens after either). Returns the picked name,
 * undefined on cancel.
 */
export function switchPinsGraph(
	context: vscode.ExtensionContext,
	store: FileNodesStore
): Promise<string | undefined> {
	return new Promise((resolve) => {
		const quickPick = vscode.window.createQuickPick();
		quickPick.placeholder = 'Switch graph';

		const activeName = getActivePinsGraphName(context);
		const names = getPinsGraphNames(context);
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

		// Input boxes and modals hide the picker, so every branch below settles first
		// and lets onDidHide resolve only plain cancels.
		let settled = false;

		quickPick.onDidAccept(async () => {
			const picked = quickPick.selectedItems[0];
			if (!picked) {
				return;
			}
			settled = true;
			quickPick.hide();

			let name = picked.label;
			if (name === NEW_GRAPH_LABEL) {
				const input = await vscode.window.showInputBox({ prompt: 'New graph name' });
				if (!input) {
					resolve(undefined);
					return;
				}
				name = input;
			}
			await setActivePinsGraph(context, store, name);
			resolve(name);
		});

		quickPick.onDidTriggerItemButton(async ({ item, button }) => {
			settled = true;
			quickPick.hide();
			const name = item.label;

			if (button === RENAME_BUTTON) {
				const newName = await vscode.window.showInputBox({ prompt: `Rename graph "${name}"`, value: name });
				if (newName && newName !== name) {
					await renamePinsGraph(context, store, name, newName);
				}
			}

			if (button === DELETE_BUTTON) {
				const confirmed = await vscode.window.showWarningMessage(
					`Delete graph "${name}"?`,
					{ modal: true },
					'Delete'
				);
				if (confirmed === 'Delete') {
					await deletePinsGraph(context, store, name);
				}
			}

			resolve(await switchPinsGraph(context, store));
		});

		quickPick.onDidHide(() => {
			quickPick.dispose();
			if (!settled) {
				settled = true;
				resolve(undefined);
			}
		});

		quickPick.show();
	});
}
