import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '../utils/cn';

/** Marquee speed: ms per pixel of overflow, so long and short lines slide equally fast. */
const MS_PER_PX = 10;
const MIN_DURATION_MS = 500;

/**
 * The sliding part of a marquee line. The keyframes (animate-marquee-x) shift by
 * the overflow amount; the duration is set here from the measured overflow, giving
 * a constant speed. The caller controls when the animation runs via className.
 */
export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || !el.parentElement) {
			return;
		}
		const parent = el.parentElement;

		const updateDuration = () => {
			const overflow = Math.max(0, el.scrollWidth - parent.clientWidth);
			el.style.animationDuration = `${Math.max(MIN_DURATION_MS, overflow * MS_PER_PX)}ms`;
		};

		updateDuration();
		const observer = new ResizeObserver(updateDuration);
		observer.observe(el);
		observer.observe(parent);
		return () => observer.disconnect();
	}, []);

	return (
		<span ref={ref} className={cn('inline-block min-w-full', className)}>
			{children}
		</span>
	);
}
