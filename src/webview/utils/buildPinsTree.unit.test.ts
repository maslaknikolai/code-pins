import * as assert from 'assert';
import { type Pin } from '../../shared/types';
import { buildPinsTree, type PinsTreeNode } from './buildPinsTree';

suite('buildPinsTree', () => {
	test('single pin stays a plain pin node with all its lines', () => {
		const pin: Pin = {
			id: 'a',
			pinPath: 'src/a.ts:3:4',
			symbolName: 'method',
			lines: [
				{ line: 0, text: 'class A {' },
				{ line: 3, text: 'method() {' },
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
			pinPath: 'src/a.ts:3:4',
			symbolName: 'x',
			lines: [
				{ line: 0, text: 'class A {' },
				{ line: 3, text: 'x' },
			],
		};
		const b: Pin = {
			id: 'b',
			pinPath: 'src/a.ts:13:4',
			symbolName: 'y',
			lines: [
				{ line: 10, text: 'class B {' },
				{ line: 13, text: 'y' },
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
			pinPath: 'src/a.ts:3:4',
			symbolName: 'first',
			lines: [
				{ line: 0, text: 'class A {' },
				{ line: 3, text: 'first() {' },
			],
		};
		const b: Pin = {
			id: 'b',
			pinPath: 'src/a.ts:7:4',
			symbolName: 'second',
			lines: [
				{ line: 0, text: 'class A {' },
				{ line: 7, text: 'second() {' },
			],
		};

		const expected: PinsTreeNode[] = [
			{
				type: 'group',
				lineNumber: 0,
				sharedLines: [{ line: 0, text: 'class A {' }],
				children: [
					{ type: 'pin', pin: a, lines: [{ line: 3, text: 'first() {' }] },
					{ type: 'pin', pin: b, lines: [{ line: 7, text: 'second() {' }] },
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});

	test('consecutive shared scope lines collapse into one flat group', () => {
		const a: Pin = {
			id: 'a',
			pinPath: 'src/a.ts:5:8',
			symbolName: 'x',
			lines: [
				{ line: 0, text: 'class A {' },
				{ line: 3, text: 'method() {' },
				{ line: 5, text: 'x' },
			],
		};
		const b: Pin = {
			id: 'b',
			pinPath: 'src/a.ts:8:8',
			symbolName: 'y',
			lines: [
				{ line: 0, text: 'class A {' },
				{ line: 3, text: 'method() {' },
				{ line: 8, text: 'y' },
			],
		};

		const expected: PinsTreeNode[] = [
			{
				type: 'group',
				lineNumber: 0,
				sharedLines: [
					{ line: 0, text: 'class A {' },
					{ line: 3, text: 'method() {' },
				],
				children: [
					{ type: 'pin', pin: a, lines: [{ line: 5, text: 'x' }] },
					{ type: 'pin', pin: b, lines: [{ line: 8, text: 'y' }] },
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});

	test('pin pinned ON the shared line owns it instead of a plain shared line', () => {
		const method: Pin = {
			id: 'method',
			pinPath: 'src/a.ts:3:4',
			symbolName: 'method',
			lines: [
				{ line: 0, text: 'class A {' },
				{ line: 3, text: 'method() {' },
			],
		};
		const deeper: Pin = {
			id: 'deeper',
			pinPath: 'src/a.ts:5:8',
			symbolName: 'x',
			lines: [
				{ line: 0, text: 'class A {' },
				{ line: 3, text: 'method() {' },
				{ line: 5, text: 'x' },
			],
		};

		const expected: PinsTreeNode[] = [
			{
				type: 'group',
				lineNumber: 0,
				sharedLines: [{ line: 0, text: 'class A {' }],
				children: [
					{
						type: 'group',
						lineNumber: 3,
						sharedLines: [],
						children: [
							{ type: 'pin', pin: method, lines: [{ line: 3, text: 'method() {' }] },
							{ type: 'pin', pin: deeper, lines: [{ line: 5, text: 'x' }] },
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
			pinPath: 'src/menu.tsx:9:12',
			symbolName: 'addTab',
			lines: [
				{ line: 0, text: 'component {' },
				{ line: 7, text: 'useMemo(() => [' },
				{ line: 9, text: 'addTab({' },
			],
		};
		const earlier: Pin = {
			id: 'earlier',
			pinPath: 'src/menu.tsx:4:11',
			symbolName: 'addTab',
			lines: [
				{ line: 0, text: 'component {' },
				{ line: 4, text: 'const {addTab} = methods()' },
			],
		};

		const expected: PinsTreeNode[] = [
			{
				type: 'group',
				lineNumber: 0,
				sharedLines: [{ line: 0, text: 'component {' }],
				children: [
					{ type: 'pin', pin: earlier, lines: [{ line: 4, text: 'const {addTab} = methods()' }] },
					{
						type: 'pin',
						pin: later,
						lines: [
							{ line: 7, text: 'useMemo(() => [' },
							{ line: 9, text: 'addTab({' },
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
			pinPath: 'src/a.ts:3:10',
			symbolName: 'f',
			lines: [{ line: 3, text: 'const x = f(g)' }],
		};
		const b: Pin = {
			id: 'b',
			pinPath: 'src/a.ts:3:12',
			symbolName: 'g',
			lines: [{ line: 3, text: 'const x = f(g)' }],
		};

		const expected: PinsTreeNode[] = [
			{
				type: 'group',
				lineNumber: 3,
				sharedLines: [],
				children: [
					{ type: 'pin', pin: a, lines: a.lines },
					{ type: 'pin', pin: b, lines: b.lines },
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});
});
