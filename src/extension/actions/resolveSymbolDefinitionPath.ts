import * as vscode from 'vscode';
import { buildPinPath } from '../../shared/pinPath';
import { getRelativePath } from '../utils/getRelativePath';

/** Resolves the symbol's definition and returns its location key, or undefined when the provider gives nothing. */
export async function resolveSymbolDefinitionPath(
	document: vscode.TextDocument,
	position: vscode.Position
): Promise<string | undefined> {
	const results = await vscode.commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>(
		'vscode.executeDefinitionProvider',
		document.uri,
		position
	);

	/** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
TODO
```
2722:    fetchFormDefinition = async (item: Item) => {
2723:        const itemOwnServiceId = getServiceId(item)
2724:        if (itemOwnServiceId) {
2725:            if (isWorkItem(item)) {
2726:                return this.fetchFormAndFormDataForWorkitem(item)
2727:            } else {
2728:                return this.fetchFormDefinitionForScenarioItem(item)
2729:            }
2730:        }
2731:	}

2745:    fetchFormDefinitionForScenarioItem = async (item: Item) => {
```

Resolve fetchFormAndFormDataForWorkitem on 2726 returns:
```
originSelectionRange = [2727:28 -> 2727:62)
targetRange = [2744:41 -> 2781:5)
targetSelectionRange = undefined
targetUri = URI(file:///.../interaction-state.ts)
```

Resolve definition of fetchFormAndFormDataForWorkitem on 2745 returns:
```
originSelectionRange = [2744:4 -> 2744:38)
targetRange = [2744:4 -> 2781:5)
targetSelectionRange = [2744:4 -> 2744:38)
targetUri = URI(file:///.../interaction-state.ts)
```

Ranges are different so they could not be linked

	*/
	console.log('Code Pins: resolveSymbolDefinitionPath results', results);
	const first = results?.[0];
	if (!first) {
		return undefined;
	}
	const uri = 'targetUri' in first ? first.targetUri : first.uri;
	const range = 'targetUri' in first ? (first.targetSelectionRange ?? first.targetRange) : first.range;

	return buildPinPath(getRelativePath(uri), range.start.line, range.start.character);
}
