import * as assert from 'assert';
import { type Pin } from '../../shared/types';
import { buildPinsTree, type LineElement } from './buildPinsTree';

suite('buildPinsTree', () => {
	test('single pin becomes a chain of its lines, pin on the last one', () => {
		const pin: Pin = {
			id: 'a',
			pinPath: 'src/a.ts:3:4',
			symbolName: 'method',
			lines: [
				{ line: 0, text: 'class A {' },
				{ line: 3, text: 'method() {' },
			],
		};

		const expected: LineElement[] = [
			{
				line: { line: 0, text: 'class A {' },
				pins: [],
				children: [
					{ line: { line: 3, text: 'method() {' }, pins: [pin], children: [] },
				],
			},
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

		const expected: LineElement[] = [
			{
				line: { line: 0, text: 'class A {' },
				pins: [],
				children: [{ line: { line: 3, text: 'x' }, pins: [a], children: [] }],
			},
			{
				line: { line: 10, text: 'class B {' },
				pins: [],
				children: [{ line: { line: 13, text: 'y' }, pins: [b], children: [] }],
			},
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});

	test('shared scope line appears once, both pins hang below it', () => {
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

		const expected: LineElement[] = [
			{
				line: { line: 0, text: 'class A {' },
				pins: [],
				children: [
					{ line: { line: 3, text: 'first() {' }, pins: [a], children: [] },
					{ line: { line: 7, text: 'second() {' }, pins: [b], children: [] },
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});

	test('consecutive shared scope lines nest, each appearing once', () => {
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

		const expected: LineElement[] = [
			{
				line: { line: 0, text: 'class A {' },
				pins: [],
				children: [
					{
						line: { line: 3, text: 'method() {' },
						pins: [],
						children: [
							{ line: { line: 5, text: 'x' }, pins: [a], children: [] },
							{ line: { line: 8, text: 'y' }, pins: [b], children: [] },
						],
					},
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});

	test('pin pinned ON the shared line sits on that element, deeper pin below', () => {
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

		const expected: LineElement[] = [
			{
				line: { line: 0, text: 'class A {' },
				pins: [],
				children: [
					{
						line: { line: 3, text: 'method() {' },
						pins: [method],
						children: [{ line: { line: 5, text: 'x' }, pins: [deeper], children: [] }],
					},
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([method, deeper]), expected);
		assert.deepStrictEqual(buildPinsTree([deeper, method]), expected);
	});

	test('children render in source order, not the order pins were added in', () => {
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

		const expected: LineElement[] = [
			{
				line: { line: 0, text: 'component {' },
				pins: [],
				children: [
					{ line: { line: 4, text: 'const {addTab} = methods()' }, pins: [earlier], children: [] },
					{
						line: { line: 7, text: 'useMemo(() => [' },
						pins: [],
						children: [{ line: { line: 9, text: 'addTab({' }, pins: [later], children: [] }],
					},
				],
			},
		];

		assert.deepStrictEqual(buildPinsTree([later, earlier]), expected);
	});

	test('two pins on the same line share one element', () => {
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

		const expected: LineElement[] = [
			{
				line: { line: 3, text: 'const x = f(g)' },
				pins: [a, b],
				children: []
			},
		];

		assert.deepStrictEqual(buildPinsTree([a, b]), expected);
	});
});
