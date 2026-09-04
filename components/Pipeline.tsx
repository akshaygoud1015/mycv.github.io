'use client';

import { useEffect, useRef } from 'react';

/**
 * A project's architecture, drawn as a signal path.
 *
 * Each stage lights in sequence and a pulse runs the spine — the animation
 * only starts once the diagram is actually on screen, and never runs at all
 * under reduced-motion (where it renders as a plain, fully-lit diagram).
 */
export default function Pipeline({
  steps,
  label,
}: {
  steps: readonly { step: string; detail: string }[];
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.run = 'true';
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.run = 'true';
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="pipe" ref={ref} data-run="false" role="list" aria-label={label}>
      <div className="pipe-spine" aria-hidden="true">
        <i className="pipe-pulse" />
      </div>
      <ol className="pipe-steps">
        {steps.map((s, i) => (
          <li
            key={s.step}
            role="listitem"
            style={{ '--i': i } as React.CSSProperties}
          >
            <span className="pipe-node" aria-hidden="true" />
            <span className="pipe-step mono">{s.step}</span>
            <span className="pipe-detail mono">{s.detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
