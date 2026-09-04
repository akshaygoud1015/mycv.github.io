'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sections, contact } from '@/lib/data';

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  group: 'Navigate' | 'Links' | 'System';
  keys?: string;
  run: () => void;
};

/** Subsequence fuzzy match. Returns a score, or -1 when it does not match. */
function score(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qi = 0;
  let s = 0;
  let streak = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      streak += 1;
      s += streak * 2 + (ti === 0 || t[ti - 1] === ' ' ? 6 : 0);
      qi += 1;
    } else {
      streak = 0;
    }
  }
  return qi === q.length ? s : -1;
}

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const go = useCallback(
    (id: string) => {
      onClose();
      const el = document.getElementById(id);
      if (!el) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    },
    [onClose]
  );

  const copy = useCallback(async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* clipboard unavailable — the address is on screen anyway */
      }
      document.body.removeChild(ta);
    }
    setFlash(`${what} copied to clipboard`);
    window.setTimeout(() => setFlash(null), 1600);
  }, []);

  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const commands: Cmd[] = useMemo(() => {
    const nav: Cmd[] = sections.map((s) => ({
      id: `nav-${s.id}`,
      label: s.human,
      hint: `${s.index} · ${s.code}`,
      group: 'Navigate',
      run: () => go(s.id),
    }));

    const links: Cmd[] = [
      {
        id: 'copy-email',
        label: 'Copy email address',
        hint: contact.email,
        group: 'Links',
        run: () => {
          // Stay open just long enough for the confirmation to be read.
          copy(contact.email, 'Email');
          window.setTimeout(onClose, 1100);
        },
      },
      {
        id: 'mail',
        label: 'Send an email',
        hint: contact.email,
        group: 'Links',
        run: () => {
          onClose();
          window.location.href = `mailto:${contact.email}`;
        },
      },
      {
        id: 'github',
        label: 'Open GitHub',
        hint: contact.githubHandle,
        group: 'Links',
        run: () => {
          onClose();
          window.open(contact.github, '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        hint: contact.linkedinHandle,
        group: 'Links',
        run: () => {
          onClose();
          window.open(contact.linkedin, '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'resume',
        label: 'Open résumé (PDF)',
        hint: 'akshay-merugu-resume.pdf',
        group: 'Links',
        run: () => {
          onClose();
          window.open(`${base}/${contact.resume}`, '_blank', 'noopener,noreferrer');
        },
      },
    ];

    const sys: Cmd[] = [
      {
        id: 'replay',
        label: 'Replay boot sequence',
        hint: 'reload',
        group: 'System',
        run: () => {
          try {
            sessionStorage.removeItem('nt.booted');
          } catch {
            /* nothing to clear */
          }
          window.location.reload();
        },
      },
      {
        id: 'top',
        label: 'Return to top',
        hint: 'home',
        group: 'System',
        run: () => {
          onClose();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      },
    ];

    return [...nav, ...links, ...sys];
  }, [go, copy, onClose, base]);

  const results = useMemo(() => {
    if (!q.trim()) return commands;
    return commands
      .map((c) => ({
        c,
        s: Math.max(score(q, c.label), score(q, c.hint ?? '') - 4, score(q, c.group) - 8),
      }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c);
  }, [q, commands]);

  useEffect(() => setSel(0), [q]);

  useEffect(() => {
    if (!open) {
      setQ('');
      setSel(0);
      return;
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSel((s) => (results.length ? (s + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSel((s) => (results.length ? (s - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        results[sel]?.run();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, sel, onClose]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-sel="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  if (!open) return null;

  let lastGroup = '';

  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cmdk-scrim" onClick={onClose} />
      <div className="cmdk-panel">
        <div className="cmdk-field">
          <span className="cmdk-prompt mono">›</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sections, links, commands…"
            aria-label="Search commands"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="mono">esc</kbd>
        </div>

        <ul className="cmdk-list" ref={listRef}>
          {results.length === 0 && (
            <li className="cmdk-empty mono">no matching command</li>
          )}
          {results.map((c, i) => {
            const head = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <li key={c.id}>
                {head && <div className="cmdk-group tag">{head}</div>}
                <button
                  type="button"
                  className="cmdk-item"
                  data-sel={i === sel ? 'true' : 'false'}
                  onMouseMove={() => setSel(i)}
                  onClick={() => c.run()}
                >
                  <span className="cmdk-item-label">{c.label}</span>
                  {c.hint && <span className="cmdk-item-hint mono">{c.hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="cmdk-foot mono">
          {flash ? (
            <span className="cmdk-flash">{flash}</span>
          ) : (
            <>
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> move
              </span>
              <span>
                <kbd>↵</kbd> run
              </span>
              <span>
                <kbd>esc</kbd> close
              </span>
              <span className="cmdk-foot-end">{results.length} commands</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
