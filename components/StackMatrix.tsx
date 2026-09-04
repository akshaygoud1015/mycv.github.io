'use client';

import { useMemo, useState } from 'react';
import { skills } from '@/lib/data';

/**
 * The capability matrix. Typing filters every domain at once and reports
 * what survived — the skills list behaves like a queryable index rather
 * than a wall of tags.
 */
export default function StackMatrix() {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  const total = useMemo(
    () => skills.reduce((n, g) => n + g.items.length, 0),
    []
  );

  const matches = useMemo(() => {
    if (!query) return total;
    return skills.reduce(
      (n, g) => n + g.items.filter((i) => i.toLowerCase().includes(query)).length,
      0
    );
  }, [query, total]);

  return (
    <div className="matrix">
      <div className="matrix-bar">
        <div className="matrix-field">
          <span className="mono matrix-prompt">grep</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="filter capabilities…"
            aria-label="Filter skills"
            spellCheck={false}
            autoComplete="off"
            className="mono"
          />
          {q && (
            <button className="matrix-clear mono" onClick={() => setQ('')} aria-label="Clear filter">
              clear
            </button>
          )}
        </div>
        <p className="matrix-count mono" aria-live="polite">
          <span className={matches === 0 ? 'zero' : 'accent'}>
            {String(matches).padStart(2, '0')}
          </span>
          <span className="matrix-sep">/</span>
          <span>{total} capabilities</span>
          <span className="matrix-sep">·</span>
          <span>{skills.length} domains</span>
        </p>
      </div>

      <ul className="matrix-rows">
        {skills.map((g) => {
          const hits = g.items.filter((i) => !query || i.toLowerCase().includes(query));
          return (
            <li
              key={g.code}
              className="matrix-row"
              data-core={g.core ? 'true' : 'false'}
              data-empty={query && hits.length === 0 ? 'true' : 'false'}
            >
              <div className="matrix-key">
                <span className="matrix-code mono">{g.code}</span>
                <h3 className="matrix-label">{g.label}</h3>
                <span className="matrix-n mono">
                  {String(hits.length).padStart(2, '0')}
                </span>
              </div>
              <ul className="matrix-items">
                {g.items.map((it) => {
                  const on = !query || it.toLowerCase().includes(query);
                  return (
                    <li key={it} className="chip mono" data-dim={on ? 'false' : 'true'}>
                      {it}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
