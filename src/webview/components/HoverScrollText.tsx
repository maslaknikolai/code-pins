import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Text wider than its container is simply clipped; hovering scrubs it like a
 * magnifier strip: the cursor's horizontal position within the container maps
 * 0..100% onto the hidden overflow, so left edge = start, right edge = end.
 */
export function HoverScrollText({ children }: { children: ReactNode }) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const el = ref.current;
		const parent = el?.parentElement;
		if (!el || !parent) {
			return;
		}

		const onMouseMove = (event: MouseEvent) => {
			const rect = parent.getBoundingClientRect();
			const styles = getComputedStyle(parent);
			const contentWidth = parent.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
			const overflow = Math.max(0, el.scrollWidth - contentWidth);
			if (overflow === 0) {
				el.style.transform = '';
				return;
			}
			const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
			el.style.transform = `translateX(${-ratio * overflow}px)`;
		};

		const onMouseLeave = () => {
			el.style.transform = '';
		};

		parent.addEventListener('mousemove', onMouseMove);
		parent.addEventListener('mouseleave', onMouseLeave);
		return () => {
			parent.removeEventListener('mousemove', onMouseMove);
			parent.removeEventListener('mouseleave', onMouseLeave);
		};
	}, []);

	return (
		<span ref={ref} className="inline-block min-w-full">
			{children}
		</span>
	);
}
