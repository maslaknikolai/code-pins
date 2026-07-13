import type { FileFlowNode } from '../types';

export interface FileNodeGroup {
	/** Shared directory prefix — also the group's label and identity. */
	prefix: string;
	nodes: FileFlowNode[];
	/** Levels of nested groups inside — outer boxes pad more so borders don't collide. */
	nesting: number;
}

interface TrieNode {
	children: Map<string, TrieNode>;
	/** Files sitting directly in this directory. */
	nodes: FileFlowNode[];
}

/**
 * Builds nested groups from directory paths: every directory with nodes in its
 * subtree becomes a group (a single node gets one too), deepest first, so
 * `packages/x/src` gets its own outline inside the wider `packages` one.
 * Single-child directory chains collapse into one prefix.
 */
export function groupFileNodes(flowNodes: FileFlowNode[]): FileNodeGroup[] {
	const root: TrieNode = { children: new Map(), nodes: [] };

	for (const node of flowNodes) {
		const directories = node.data.fileNode.filePath.split('/').slice(0, -1);
		let current = root;
		for (const directory of directories) {
			let child = current.children.get(directory);
			if (!child) {
				child = { children: new Map(), nodes: [] };
				current.children.set(directory, child);
			}
			current = child;
		}
		current.nodes.push(node);
	}

	const groups: FileNodeGroup[] = [];
	collectGroups(root, '', groups);
	return groups;
}

function collectGroups(
	trie: TrieNode,
	prefix: string,
	out: FileNodeGroup[]
): { nodes: FileFlowNode[]; nesting: number } {
	// Collapse single-child chains without direct files: a/b/c -> one prefix.
	let current = trie;
	let currentPrefix = prefix;
	while (current.nodes.length === 0 && current.children.size === 1) {
		const [segment, child] = [...current.children.entries()][0];
		currentPrefix = currentPrefix ? `${currentPrefix}/${segment}` : segment;
		current = child;
	}

	const childResults = [...current.children.entries()].map(([segment, child]) =>
		collectGroups(child, currentPrefix ? `${currentPrefix}/${segment}` : segment, out)
	);

	const nodes = [...current.nodes, ...childResults.flatMap((result) => result.nodes)];
	const nesting = Math.max(0, ...childResults.map((result) => result.nesting));

	if (currentPrefix !== '' && nodes.length >= 1) {
		out.push({ prefix: currentPrefix, nodes, nesting });
		return { nodes, nesting: nesting + 1 };
	}
	return { nodes, nesting };
}
