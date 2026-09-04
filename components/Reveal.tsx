'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Adds the `.in` class the first time the element enters the viewport.
 * Children are server-rendered — this only toggles a class.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article' | 'header' | 'p';
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as 'div';

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`rv ${className}`}
      style={delay ? ({ '--d': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
