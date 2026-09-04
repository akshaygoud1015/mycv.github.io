'use client';

import { useEffect, useRef } from 'react';

/**
 * The neural field: drifting nodes, proximity edges, and signal pulses that
 * propagate from node to node along those edges. Plain 2D canvas, no library.
 *
 * The cursor is a participant — nearby nodes lean toward it, brighten, and
 * wire themselves into the graph while it is close.
 */

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** 0..1 excitation, decays every frame, spikes when a pulse arrives */
  e: number;
  nb: number[];
};

type Pulse = {
  from: number;
  to: number;
  t: number;
  speed: number;
};

const LINK = 132; // px: max edge length
const CURSOR = 190; // px: cursor influence radius

export default function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area, capped so phones stay smooth.
      const count = Math.round(
        Math.min(118, Math.max(34, (w * h) / 13500))
      );

      nodes = Array.from({ length: count }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.1, 0.1),
        r: rand(0.8, 2.0),
        e: 0,
        nb: [],
      }));
      pulses = [];
    };

    build();

    const mouse = { x: -9999, y: -9999, active: false };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active =
        mouse.x > -80 && mouse.x < w + 80 && mouse.y > -80 && mouse.y < h + 80;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    /** Rebuild the adjacency list — cheap, and only a few times a second. */
    const relink = () => {
      for (const n of nodes) n.nb.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < LINK * LINK) {
            nodes[i].nb.push(j);
            nodes[j].nb.push(i);
          }
        }
      }
    };
    relink();

    const spawnPulse = () => {
      if (pulses.length > 7 || nodes.length === 0) return;
      const from = Math.floor(Math.random() * nodes.length);
      const nb = nodes[from].nb;
      if (!nb.length) return;
      pulses.push({
        from,
        to: nb[Math.floor(Math.random() * nb.length)],
        t: 0,
        speed: rand(0.011, 0.022),
      });
    };

    let raf = 0;
    let running = true;
    let lastRelink = 0;
    let lastSpawn = 0;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      if (now - lastRelink > 260) {
        relink();
        lastRelink = now;
      }
      if (!reduced && now - lastSpawn > 420) {
        spawnPulse();
        lastSpawn = now;
      }

      // ---- integrate ------------------------------------------------
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;

          if (mouse.active) {
            const dx = mouse.x - n.x;
            const dy = mouse.y - n.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < CURSOR * CURSOR && d2 > 1) {
              const d = Math.sqrt(d2);
              const pull = (1 - d / CURSOR) * 0.055;
              n.x += (dx / d) * pull * 6;
              n.y += (dy / d) * pull * 6;
              n.e = Math.max(n.e, (1 - d / CURSOR) * 0.85);
            }
          }

          // Wrap with a margin so nodes never pop at the edge.
          if (n.x < -40) n.x = w + 40;
          if (n.x > w + 40) n.x = -40;
          if (n.y < -40) n.y = h + 40;
          if (n.y > h + 40) n.y = -40;
        }
        n.e *= 0.955;
      }

      // ---- edges ----------------------------------------------------
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (const j of a.nb) {
          if (j <= i) continue;
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > LINK) continue;

          const falloff = 1 - d / LINK;
          const heat = Math.max(a.e, b.e);
          const alpha = falloff * 0.15 + heat * falloff * 0.42;
          if (alpha < 0.012) continue;

          ctx.strokeStyle =
            heat > 0.12
              ? `rgba(95,231,200,${alpha.toFixed(3)})`
              : `rgba(150,158,196,${(alpha * 0.72).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // ---- cursor tether --------------------------------------------
      if (mouse.active && !reduced) {
        for (const n of nodes) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d > CURSOR) continue;
          const a = (1 - d / CURSOR) * 0.3;
          ctx.strokeStyle = `rgba(124,108,247,${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      // ---- pulses ---------------------------------------------------
      if (!reduced) {
        for (let k = pulses.length - 1; k >= 0; k--) {
          const p = pulses[k];
          const a = nodes[p.from];
          const b = nodes[p.to];
          if (!a || !b) {
            pulses.splice(k, 1);
            continue;
          }
          p.t += p.speed;

          if (p.t >= 1) {
            b.e = 1;
            // Hop onward through the graph, so signal actually travels.
            const nb = b.nb.filter((x) => x !== p.from);
            if (nb.length && Math.random() < 0.82) {
              p.from = p.to;
              p.to = nb[Math.floor(Math.random() * nb.length)];
              p.t = 0;
            } else {
              pulses.splice(k, 1);
            }
            continue;
          }

          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;

          const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
          g.addColorStop(0, 'rgba(95,231,200,0.85)');
          g.addColorStop(0.4, 'rgba(95,231,200,0.22)');
          g.addColorStop(1, 'rgba(95,231,200,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(210,255,244,0.95)';
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ---- nodes ----------------------------------------------------
      for (const n of nodes) {
        const lit = n.e;
        if (lit > 0.08) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 14 * lit + 4);
          g.addColorStop(0, `rgba(95,231,200,${(lit * 0.42).toFixed(3)})`);
          g.addColorStop(1, 'rgba(95,231,200,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 14 * lit + 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = lit > 0.1
          ? `rgba(174,246,229,${(0.5 + lit * 0.5).toFixed(3)})`
          : 'rgba(163,170,205,0.42)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + lit * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      if (reduced) return;
      if (running) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onResize = () => {
      build();
      relink();
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    // Stop drawing entirely once the hero is off screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting) {
          if (!running) {
            running = true;
            raf = requestAnimationFrame(draw);
          }
        } else {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="neural" aria-hidden="true" />;
}
