import * as assert from 'assert';
import { PinKind, type Pin } from '../types';
import { buildPinsTree, type PinsTreeNode } from '../webview/utils/buildPinsTree';

suite('buildPinsTree', () => {
	test('single pin stays a plain pin node with all its lines', () => {
		const pin: Pin = {
			id: 'a',
			kind: PinKind.Reference,
			symbolName: 'method',
			lines: [
				{ line: 0, text: 'class A {', indent: 0 },
				{ line: 3, text: 'method() {', indent: 1 },
			],
		};

		const expected: PinsTreeNode[] = [
			{ type: 'pin', pin, lines: pin.lines },
		];

		assert.deepStrictEqual(buildPinsTree([pin]), expected);
	});

	test('pins in unrelated scopes stay separate', () => {
		const a: Pin = {
			id: 'a',
			kind: PinKind.Reference,
			symbolName: 'x',
			lines: [
				{ line: 0, text: 'class A {', indent: 0 },
				{ line: 3, text: 'x', indent: 1 },
			],
		};
		const b: Pin = {
			id: 'b',
			kind: PinKind.Reference,
			symbolName: 'y',
			lines: [
				{ line: 10, text: 'class B {', indent: 0 },
				{ line: 13, text: 'y', indent: 1 },
			],
		};

		const expected: PinsTreeNode[] = [
			{ type: 'pin', pin: a, lines: a.lines },
			{ type: 'pin', pin: b, lines: b.lines },
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});

	test('shared scope line is hoisted above both pins and removed from each', () => {
		const a: Pin = {
			id: 'a',
			kind: PinKind.Reference,
			symbolName: 'first',
			lines: [
				{ line: 0, text: 'class A {', indent: 0 },
				{ line: 3, text: 'first() {', indent: 1 },
			],
		};
		const b: Pin = {
			id: 'b',
			kind: PinKind.Reference,
			symbolName: 'second',
			lines: [
				{ line: 0, text: 'class A {', indent: 0 },
				{ line: 7, text: 'second() {', indent: 1 },
			],
		};

		const expected: PinsTreeNode[] = [
			{
				type: 'group',
				lineNumber: 0,
				pinnedOnSharedLine: [],
				sharedLine: { line: 0, text: 'class A {', indent: 0 },
				children: [
					{ type: 'pin', pin: a, lines: [{ line: 3, text: 'first() {', indent: 1 }] },
					{ type: 'pin', pin: b, lines: [{ line: 7, text: 'second() {', indent: 1 }] },
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});

	test('nested shared scopes collapse level by level', () => {
		const a: Pin = {
			id: 'a',
			kind: PinKind.Reference,
			symbolName: 'x',
			lines: [
				{ line: 0, text: 'class A {', indent: 0 },
				{ line: 3, text: 'method() {', indent: 1 },
				{ line: 5, text: 'x', indent: 2 },
			],
		};
		const b: Pin = {
			id: 'b',
			kind: PinKind.Reference,
			symbolName: 'y',
			lines: [
				{ line: 0, text: 'class A {', indent: 0 },
				{ line: 3, text: 'method() {', indent: 1 },
				{ line: 8, text: 'y', indent: 2 },
			],
		};

		const expected: PinsTreeNode[] = [
			{
				type: 'group',
				lineNumber: 0,
				pinnedOnSharedLine: [],
				sharedLine: { line: 0, text: 'class A {', indent: 0 },
				children: [
					{
						type: 'group',
						lineNumber: 3,
						pinnedOnSharedLine: [],
						sharedLine: { line: 3, text: 'method() {', indent: 1 },
						children: [
							{ type: 'pin', pin: a, lines: [{ line: 5, text: 'x', indent: 2 }] },
							{ type: 'pin', pin: b, lines: [{ line: 8, text: 'y', indent: 2 }] },
						],
					},
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});

	test('pin pinned ON the shared line owns it instead of a plain shared line', () => {
		const method: Pin = {
			id: 'method',
			kind: PinKind.Declaration,
			symbolName: 'method',
			lines: [
				{ line: 0, text: 'class A {', indent: 0 },
				{ line: 3, text: 'method() {', indent: 1 },
			],
		};
		const deeper: Pin = {
			id: 'deeper',
			kind: PinKind.Reference,
			symbolName: 'x',
			lines: [
				{ line: 0, text: 'class A {', indent: 0 },
				{ line: 3, text: 'method() {', indent: 1 },
				{ line: 5, text: 'x', indent: 2 },
			],
		};

		const expected: PinsTreeNode[] = [
			{
				type: 'group',
				lineNumber: 0,
				pinnedOnSharedLine: [],
				sharedLine: { line: 0, text: 'class A {', indent: 0 },
				children: [
					{
						type: 'group',
						lineNumber: 3,
						pinnedOnSharedLine: [
							{ pin: method, lines: [{ line: 3, text: 'method() {', indent: 1 }] },
						],
						sharedLine: undefined,
						children: [
							{ type: 'pin', pin: deeper, lines: [{ line: 5, text: 'x', indent: 2 }] },
						],
					},
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([method, deeper]), expected);
		assert.deepStrictEqual(buildPinsTree([deeper, method]), expected);
	});

	test('groups render in source order, not the order pins were added in', () => {
		const later: Pin = {
			id: 'later',
			kind: PinKind.Reference,
			symbolName: 'addTab',
			lines: [
				{ line: 0, text: 'component {', indent: 0 },
				{ line: 7, text: 'useMemo(() => [', indent: 1 },
				{ line: 9, text: 'addTab({', indent: 2 },
			],
		};
		const earlier: Pin = {
			id: 'earlier',
			kind: PinKind.Reference,
			symbolName: 'addTab',
			lines: [
				{ line: 0, text: 'component {', indent: 0 },
				{ line: 4, text: 'const {addTab} = methods()', indent: 1 },
			],
		};

		const expected: PinsTreeNode[] = [
			{
				type: 'group',
				lineNumber: 0,
				pinnedOnSharedLine: [],
				sharedLine: { line: 0, text: 'component {', indent: 0 },
				children: [
					{ type: 'pin', pin: earlier, lines: [{ line: 4, text: 'const {addTab} = methods()', indent: 1 }] },
					{
						type: 'pin',
						pin: later,
						lines: [
							{ line: 7, text: 'useMemo(() => [', indent: 1 },
							{ line: 9, text: 'addTab({', indent: 2 },
						],
					},
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([later, earlier]), expected);
	});

	test('two pins on the same line with nothing deeper both keep their line', () => {
		const a: Pin = {
			id: 'a',
			kind: PinKind.Reference,
			symbolName: 'f',
			lines: [{ line: 3, text: 'const x = f(g)', indent: 0 }],
		};
		const b: Pin = {
			id: 'b',
			kind: PinKind.Reference,
			symbolName: 'g',
			lines: [{ line: 3, text: 'const x = f(g)', indent: 0 }],
		};

		const expected: PinsTreeNode[] = [
			{
				type: 'group',
				lineNumber: 3,
				pinnedOnSharedLine: [
					{ pin: a, lines: a.lines },
					{ pin: b, lines: b.lines },
				],
				sharedLine: undefined,
				children: [],
			},
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});
});
