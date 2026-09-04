'use client';

import { useEffect, useRef } from 'react';

/**
 * Fullscreen GLSL backdrop — a domain-warped fbm field drifting behind the
 * whole page. Written against raw WebGL1 (no three.js): one quad, one
 * fragment shader, a handful of uniforms.
 *
 * Renders at a fraction of device resolution and lets the browser scale it
 * up; the field is soft enough that nobody can tell, and it keeps the cost
 * near zero on integrated GPUs.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uScroll;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = ROT * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.028;

  // Two rounds of domain warping: the field folds into itself and drifts.
  vec2 q = vec2(
    fbm(uv * 1.55 + t),
    fbm(uv * 1.55 + vec2(3.2, 1.7) - t)
  );

  vec2 r = vec2(
    fbm(uv * 1.85 + 2.7 * q + vec2(1.7, 9.2) + t * 1.25),
    fbm(uv * 1.85 + 2.7 * q + vec2(8.3, 2.8) - t * 1.05)
  );

  float f = fbm(uv * 1.7 + 2.2 * r);

  vec3 deep   = vec3(0.015, 0.015, 0.030);
  vec3 violet = vec3(0.360, 0.300, 0.860);
  vec3 ion    = vec3(0.235, 0.870, 0.745);

  vec3 col = deep;
  col = mix(col, violet * 0.30, smoothstep(0.34, 0.96, f));
  col = mix(col, ion * 0.24, smoothstep(0.52, 1.05, length(r)) * 0.5);

  // Cursor presence — a soft double-radius bloom that follows the pointer.
  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  float d = length(uv - m);
  col += ion * 0.050 * exp(-d * 3.6);
  col += violet * 0.036 * exp(-d * 1.6);

  // A slow horizontal sweep, like a sensor pass.
  float sweep = exp(-pow((uv.y - sin(uTime * 0.075) * 0.85) * 5.5, 2.0));
  col += ion * 0.016 * sweep;

  // Vignette, then dim as the visitor scrolls into the written content.
  float vig = 1.0 - 0.92 * pow(length(uv * vec2(0.60, 1.0)), 2.1);
  col *= clamp(vig, 0.0, 1.0);
  col *= mix(1.0, 0.40, clamp(uScroll, 0.0, 1.0));

  // Ordered-ish dither kills banding in the very dark ranges.
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.007;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function ShaderBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false,
      }) as WebGLRenderingContext | null) ?? null;
    } catch {
      gl = null;
    }

    // No WebGL: the CSS atmosphere layers already carry the look.
    if (!gl) {
      canvas.style.display = 'none';
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      canvas.style.display = 'none';
      return;
    }

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.style.display = 'none';
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uScroll = gl.getUniformLocation(prog, 'uScroll');

    // Render scale: deliberately low. The field is soft; nobody sees pixels.
    const SCALE = 0.5;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.floor(window.innerWidth * dpr * SCALE));
      h = Math.max(1, Math.floor(window.innerHeight * dpr * SCALE));
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
      gl!.uniform2f(uRes, w, h);
    };
    resize();

    // Pointer is eased toward the real cursor so the bloom trails slightly.
    const target = { x: w * 0.5, y: h * 0.62 };
    const eased = { x: target.x, y: target.y };

    const onPointer = (e: PointerEvent) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * SCALE;
      target.x = e.clientX * dpr;
      target.y = (window.innerHeight - e.clientY) * dpr;
    };

    let scrollN = 0;
    const onScroll = () => {
      scrollN = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9));
    };
    onScroll();

    let raf = 0;
    let running = true;
    const start = performance.now();

    const frame = (now: number) => {
      if (!running) return;
      const t = (now - start) / 1000;

      eased.x += (target.x - eased.x) * 0.045;
      eased.y += (target.y - eased.y) * 0.045;

      gl!.uniform1f(uTime, reduced ? 12 : t);
      gl!.uniform2f(uMouse, eased.x, eased.y);
      gl!.uniform1f(uScroll, scrollN);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      // Reduced motion: draw a single settled frame, then stop.
      if (reduced) return;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    const onLost = (e: Event) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
      canvas.style.opacity = '0';
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('webglcontextlost', onLost);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl?.deleteProgram(prog);
      gl?.deleteShader(vs);
      gl?.deleteShader(fs);
      gl?.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={ref} className="gl" aria-hidden="true" />;
}
