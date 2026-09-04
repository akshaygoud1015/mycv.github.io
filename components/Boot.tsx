'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { bootLines } from '@/lib/data';

const DURATION = 2100;

/**
 * Cold start. The site comes online rather than simply appearing.
 *
 * Runs once per browser session (sessionStorage), is skippable with any key,
 * click, or scroll, and is bypassed entirely under reduced-motion. An inline
 * script in the document head hides this overlay before first paint when the
 * session has already booted, so there is never a flash.
 */
export default function Boot() {
  const [lines, setLines] = useState(0);
  const [pct, setPct] = useState(0);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;

    try {
      sessionStorage.setItem('nt.booted', '1');
    } catch {
      /* private mode — the boot simply replays next visit */
    }

    document.documentElement.dataset.booted = 'true';
    document.body.dataset.locked = 'false';
    document.dispatchEvent(new CustomEvent('nt:booted'));

    setPct(100);
    setLines(bootLines.length);
    setClosing(true);
    window.setTimeout(() => setGone(true), 700);
  }, []);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let already = false;
    try {
      already = sessionStorage.getItem('nt.booted') === '1';
    } catch {
      already = false;
    }

    if (already || reduced) {
      document.documentElement.dataset.booted = 'true';
      document.body.dataset.locked = 'false';
      document.dispatchEvent(new CustomEvent('nt:booted'));
      finished.current = true;
      setGone(true);
      return;
    }

    document.body.dataset.locked = 'true';

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Ease-out so the meter sprints then settles — reads like real work.
      const eased = 1 - Math.pow(1 - t, 2.2);
      setPct(Math.round(eased * 100));
      setLines(Math.min(bootLines.length, Math.floor(t * bootLines.length) + 1));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(tick);

    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    window.addEventListener('wheel', skip, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('wheel', skip);
      document.body.dataset.locked = 'false';
    };
  }, [finish]);

  if (gone) return null;

  return (
    <div className={`boot${closing ? ' boot-out' : ''}`} aria-hidden="true">
      <div className="boot-inner">
        <ul className="boot-log mono">
          {bootLines.map((l, i) => (
            <li key={l.text} data-on={i < lines ? 'true' : 'false'}>
              <span className="boot-caret">›</span>
              <span className="boot-text">{l.text}</span>
              <span className={`boot-tag boot-tag-${l.tag}`}>
                {l.tag === 'ok' ? 'ok' : '··'}
              </span>
            </li>
          ))}
        </ul>

        <div className="boot-meter">
          <div className="boot-bar">
            <i style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
          <span className="boot-pct mono">
            {String(pct).padStart(3, '0')}%
          </span>
        </div>

        <p className="boot-hint mono">press any key to skip</p>
      </div>
    </div>
  );
}
