import type { ExtensionToWebviewMessage, GraphNode } from '../types';

declare function acquireVsCodeApi(): {
	postMessage(message: unknown): void;
	getState(): unknown;
	setState(state: unknown): void;
};

const vscode = acquireVsCodeApi();

const canvas = document.getElementById('canvas') as HTMLDivElement;
const svg = document.getElementById('arrows') as unknown as SVGSVGElement;
const SVG_NS = 'http://www.w3.org/2000/svg';

let nodes: GraphNode[] = [];
/** Set during a drag so pointerup doesn't count as a line click. */
let dragMoved = false;

window.addEventListener('message', (event: MessageEvent<ExtensionToWebviewMessage>) => {
	if (event.data.type === 'setState') {
		nodes = event.data.nodes;
		render();
	}
});

vscode.postMessage({ type: 'ready' });

function render(): void {
	canvas.querySelectorAll('.node').forEach((el) => el.remove());
	for (const node of nodes) {
		canvas.appendChild(createNodeElement(node));
	}
	drawArrows();
}

function createNodeElement(node: GraphNode): HTMLElement {
	const el = document.createElement('div');
	el.className = `node ${node.kind}`;
	el.style.left = `${node.x}px`;
	el.style.top = `${node.y}px`;
	el.dataset.id = node.id;

	const header = document.createElement('div');
	header.className = 'header';
	const dir = document.createElement('span');
	dir.className = 'path';
	dir.textContent = node.filePath.slice(0, node.filePath.length - node.fileName.length);
	const name = document.createElement('span');
	name.textContent = node.fileName;
	header.append(dir, name);
	el.appendChild(header);

	for (const line of node.lines) {
		const lineEl = document.createElement('div');
		lineEl.className = 'line';
		lineEl.style.paddingLeft = `${8 + line.indent * 14}px`;
		fillLineText(lineEl, line.text, node);
		lineEl.title = `${node.filePath}:${line.line + 1}`;
		lineEl.addEventListener('click', () => {
			if (!dragMoved) {
				vscode.postMessage({ type: 'openLocation', file: node.filePath, line: line.line });
			}
		});
		el.appendChild(lineEl);
	}

	makeDraggable(el, node);
	return el;
}

function fillLineText(lineEl: HTMLElement, text: string, node: GraphNode): void {
	if (node.kind !== 'declaration' || !node.highlightWord || !text.includes(node.highlightWord)) {
		lineEl.textContent = text;
		return;
	}
	const parts = text.split(node.highlightWord);
	parts.forEach((part, i) => {
		if (i > 0) {
			const mark = document.createElement('span');
			mark.className = 'hl';
			mark.textContent = node.highlightWord;
			lineEl.appendChild(mark);
		}
		lineEl.appendChild(document.createTextNode(part));
	});
}

function makeDraggable(el: HTMLElement, node: GraphNode): void {
	el.addEventListener('pointerdown', (event: PointerEvent) => {
		if (event.button !== 0) {
			return;
		}
		const startX = event.clientX;
		const startY = event.clientY;
		const origX = node.x;
		const origY = node.y;
		// No pointer capture: it would retarget pointerup to the node element
		// and suppress click events on the lines inside it.

		const onMove = (moveEvent: PointerEvent): void => {
			const dx = moveEvent.clientX - startX;
			const dy = moveEvent.clientY - startY;
			if (!dragMoved && Math.abs(dx) < 4 && Math.abs(dy) < 4) {
				return;
			}
			dragMoved = true;
			node.x = Math.max(0, origX + dx);
			node.y = Math.max(0, origY + dy);
			el.style.left = `${node.x}px`;
			el.style.top = `${node.y}px`;
			drawArrows();
		};
		const onUp = (): void => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
			if (dragMoved) {
				vscode.postMessage({ type: 'moveNode', id: node.id, x: node.x, y: node.y });
			}
			// Let the click event (which fires after pointerup) see dragMoved first.
			setTimeout(() => {
				dragMoved = false;
			}, 0);
		};
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	});
}

interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

function drawArrows(): void {
	svg.innerHTML = '';
	const defs = document.createElementNS(SVG_NS, 'defs');
	defs.innerHTML =
		'<marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
		'<path d="M0,0 L10,5 L0,10 z" fill="var(--vscode-editorLineNumber-foreground, #888)"/></marker>';
	svg.appendChild(defs);

	for (const ref of nodes) {
		if (ref.kind !== 'reference') {
			continue;
		}
		const decl = nodes.find((n) => n.kind === 'declaration' && n.definitionKey === ref.definitionKey);
		if (!decl) {
			continue;
		}
		const from = rectOf(ref.id);
		const to = rectOf(decl.id);
		if (!from || !to) {
			continue;
		}
		const start = edgePoint(from, center(to));
		const end = edgePoint(to, center(from));
		const line = document.createElementNS(SVG_NS, 'line');
		line.setAttribute('x1', String(start.x));
		line.setAttribute('y1', String(start.y));
		line.setAttribute('x2', String(end.x));
		line.setAttribute('y2', String(end.y));
		line.setAttribute('class', 'arrow-line');
		line.setAttribute('marker-end', 'url(#arrowhead)');
		svg.appendChild(line);
	}
}

function rectOf(id: string): Rect | undefined {
	const el = canvas.querySelector<HTMLElement>(`.node[data-id="${id}"]`);
	if (!el) {
		return undefined;
	}
	return { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
}

function center(rect: Rect): { x: number; y: number } {
	return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
}

/** Point on the rectangle border along the line from its center toward `toward`. */
function edgePoint(rect: Rect, toward: { x: number; y: number }): { x: number; y: number } {
	const c = center(rect);
	const dx = toward.x - c.x;
	const dy = toward.y - c.y;
	if (dx === 0 && dy === 0) {
		return c;
	}
	const scaleX = dx !== 0 ? rect.w / 2 / Math.abs(dx) : Infinity;
	const scaleY = dy !== 0 ? rect.h / 2 / Math.abs(dy) : Infinity;
	const scale = Math.min(scaleX, scaleY);
	return { x: c.x + dx * scale, y: c.y + dy * scale };
}
