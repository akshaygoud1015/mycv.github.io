'use client';

import { useEffect, useRef } from 'react';

/*
 * Deliberately limited to glyphs the display face actually ships. Block and
 * box-drawing characters fall back to another font and render as oversized
 * shapes at hero sizes, which reads as a broken layout rather than as noise.
 */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$@*+=/<>';

/**
 * Text that resolves out of noise, left to right.
 *
 * The real string is server-rendered as the element's children, so search
 * engines and screen readers only ever see the finished text; the effect
 * takes over the DOM node imperatively on mount and hands it back intact.
 */
export default function Scramble({
  text,
  className,
  delay = 0,
  step = 34,
  waitForBoot = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** ms between each character locking into place */
  step?: number;
  /** hold until the boot sequence has finished */
  waitForBoot?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let raf = 0;
    let timer = 0;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      const chars = Array.from(text);
      const total = chars.length * step + 420;
      const start = performance.now();

      const tick = (now: number) => {
        if (cancelled) return;
        const t = now - start;
        let out = '';
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          if (c === ' ' || c === ' ') {
            out += c;
            continue;
          }
          const lockAt = i * step;
          if (t >= lockAt + 240) {
            out += c;
          } else if (t >= lockAt - 260) {
            out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          } else {
            out += ' ';
          }
        }
        el.textContent = out;
        if (t < total) {
          raf = requestAnimationFrame(tick);
        } else {
          el.textContent = text;
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const begin = () => {
      el.textContent = '';
      timer = window.setTimeout(run, delay);
    };

    if (waitForBoot && document.documentElement.dataset.booted !== 'true') {
      const onBooted = () => begin();
      document.addEventListener('nt:booted', onBooted, { once: true });
      return () => {
        cancelled = true;
        document.removeEventListener('nt:booted', onBooted);
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }

    begin();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      el.textContent = text;
    };
  }, [text, delay, step, waitForBoot]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
