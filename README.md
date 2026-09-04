# Akshay Merugu — Portfolio

A dark, cinematic single-page portfolio. Next.js App Router, exported as a
fully static site, deployed to GitHub Pages.

The interface is built around one idea — **Neural Terminal**: the site boots
like a system coming online, a hand-written WebGL field drifts behind
everything, and every section is reachable from a `⌘K` command palette.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
NEXT_PUBLIC_BASE_PATH=/mycv.github.io npm run build   # writes ./out
npm start                                             # serve ./out locally
```

---

## Publishing to GitHub Pages

The repository `akshaygoud1015/mycv.github.io` is a **project** page, so it is
served from `https://akshaygoud1015.github.io/mycv.github.io/` — one directory
deep. Next.js needs to know that, which is what `NEXT_PUBLIC_BASE_PATH` sets.

**One-time setup:**

1. Copy these files into the repository (replacing the old `index.html`,
   `contactme.html`, and the loose `.png` files).
2. Commit and push to `main`.
3. On GitHub: **Settings → Pages → Build and deployment → Source → GitHub
   Actions**. (Not "Deploy from a branch" — the included workflow builds the
   site and publishes it.)

Every push to `main` after that rebuilds and redeploys automatically.

**If the URL ever changes:** edit `NEXT_PUBLIC_BASE_PATH` in
`.github/workflows/deploy.yml`.

| Where the site lives | Value |
| --- | --- |
| `akshaygoud1015.github.io/mycv.github.io/` (today) | `/mycv.github.io` |
| A custom domain, or a repo renamed to `akshaygoud1015.github.io` | `` (empty) |

---

## Editing the content

**Everything you would want to change lives in one file: [`lib/data.ts`](lib/data.ts).**
Name, contact details, experience, projects, skills, education, certifications,
the headline metrics, even the boot-sequence log lines. No component needs to
be touched to update the site.

Two things worth doing when you get a moment:

- **Project repository links.** Each project in `lib/data.ts` has
  `repo: null`, so both currently link to your GitHub profile. Set it to a URL
  (`repo: 'https://github.com/akshaygoud1015/doctalk'`) and the button becomes
  "View repository" automatically.
- **The résumé PDF.** `public/akshay-merugu-resume.pdf` is the copy you sent.
  Drop a new file in at the same path to update it everywhere.

---

## How it is built

```
app/
  layout.tsx        metadata, self-hosted fonts, pre-paint boot check
  page.tsx          the whole page — hero + six sections
  globals.css       design tokens, reset, atmosphere layers
  interface.css     boot, top bar, section rail, cursor, command palette
  sections.css      hero and all section styling
  fonts/            three variable woff2 files (~110KB total)
  icon.svg          favicon
components/
  ShaderBackdrop.tsx  fullscreen GLSL field — raw WebGL, no 3D library
  NeuralField.tsx     2D canvas nodes, proximity edges, travelling pulses
  Boot.tsx            cold-start sequence, once per browser session
  Interface.tsx       top bar, scroll meter, section rail, cursor ring
  CommandPalette.tsx  ⌘K / Ctrl-K fuzzy command palette
  Pipeline.tsx        animated architecture diagram per project
  StackMatrix.tsx     filterable capability matrix
  Scramble.tsx        text that resolves out of noise
  Reveal.tsx          scroll-triggered entrance
lib/data.ts           all content
```

**No UI framework, no animation library, no 3D library.** The background is a
domain-warped fbm field written in GLSL and drawn on one triangle; the neural
graph is plain 2D canvas. Total JavaScript is roughly 118KB on first load.

### Details that matter

- **Fonts are self-hosted.** Three variable `woff2` files ship with the repo,
  so the build never calls Google Fonts and neither do your visitors.
- **`prefers-reduced-motion` is respected everywhere.** The boot sequence is
  skipped, the shader renders one settled frame, the neural field stops
  drifting, and every reveal is instant.
- **The heavy canvases stop when they are not visible** — off-screen via
  `IntersectionObserver`, and on tab blur via `visibilitychange`.
- **Keyboard.** `⌘K` / `Ctrl-K` or `/` opens the palette, `↑` `↓` move, `↵`
  runs, `esc` closes. There is a skip link, and focus is always visible.
- **Content is server-rendered.** The animated text is real text in the HTML;
  the effects take over the DOM node after mount, so search engines and screen
  readers get the finished copy.

---

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl-K` | Open the command palette |
| `/` | Open the command palette |
| `↑` `↓` | Move through results |
| `↵` | Run the selected command |
| `esc` | Close |
| any key during boot | Skip the boot sequence |
