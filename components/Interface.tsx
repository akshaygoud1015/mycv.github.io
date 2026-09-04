'use client';

import { useEffect, useRef, useState } from 'react';
import { sections, contact, profile } from '@/lib/data';
import CommandPalette from './CommandPalette';

/**
 * The persistent chrome: top bar, scroll meter, section rail, custom cursor,
 * and the command palette. One client island, one scroll listener, one
 * pointer listener — shared by everything that needs them.
 */
export default function Interface() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [clock, setClock] = useState('');

  const ring = useRef<HTMLDivElement>(null);

  // ---- command palette hotkeys -------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.dataset.locked = open ? 'true' : 'false';
  }, [open]);

  // ---- scroll: progress meter + active section ---------------------
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);

      const line = window.scrollY + window.innerHeight * 0.35;
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= line) idx = i;
      }
      setActive(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // ---- live clock (UTC) --------------------------------------------
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, '0');
      setClock(
        `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`
      );
    };
    fmt();
    const id = window.setInterval(fmt, 1000);
    return () => window.clearInterval(id);
  }, []);

  // ---- custom cursor -----------------------------------------------
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const r = ring.current;
    if (!r) return;

    document.documentElement.classList.add('has-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const soft = { x: pos.x, y: pos.y };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest('a, button, input, [data-cursor]');
      r.dataset.on = interactive ? 'true' : 'false';
    };

    const loop = () => {
      soft.x += (pos.x - soft.x) * 0.16;
      soft.y += (pos.y - soft.y) * 0.16;
      r.style.transform = `translate3d(${soft.x}px, ${soft.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onDown = () => (r.dataset.press = 'true');
    const onUp = () => (r.dataset.press = 'false');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <>
      {/* scroll meter */}
      <div className="meter" aria-hidden="true">
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* top bar */}
      <header className="bar">
        <div className="bar-in">
          <button className="mark" onClick={() => jump('index')} aria-label="Back to top">
            <span className="mark-glyph mono">AM</span>
            <span className="mark-meta mono">
              <b>{profile.name}</b>
              <em>{profile.role}</em>
            </span>
          </button>

          <div className="bar-right">
            <span className="bar-clock mono" aria-hidden="true">
              <i className="live" />
              {clock}
            </span>
            <a
              className="bar-link mono"
              href={`${base}/${contact.resume}`}
              target="_blank"
              rel="noreferrer"
            >
              résumé
            </a>
            <button className="kbtn mono" onClick={() => setOpen(true)}>
              <span>Search</span>
              <kbd>⌘</kbd>
              <kbd>K</kbd>
            </button>
          </div>
        </div>
      </header>

      {/* section rail */}
      <nav className="rail" aria-label="Section navigation">
        <ul>
          {sections.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => jump(s.id)}
                data-on={i === active ? 'true' : 'false'}
                aria-current={i === active ? 'true' : undefined}
              >
                <span className="rail-i mono">{s.index}</span>
                <span className="rail-tick" aria-hidden="true" />
                <span className="rail-name mono">{s.code}</span>
                <span className="sr">{s.human}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* trailing cursor ring — the native cursor stays visible */}
      <div className="cursor" aria-hidden="true">
        <div ref={ring} className="cursor-ring" data-on="false" data-press="false" />
      </div>

      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
