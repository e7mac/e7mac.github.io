# Personal Site Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single static `index.html` personal site (about + music-tools highlight + software + publications + links) and deploy it to Cloudflare Pages on both `e7mac.com` and `mayanks.art`, retiring the Heroku Django app and Squarespace.

**Architecture:** One hand-written HTML page with inline CSS, evolved from the existing `e7mac.github.io/index.html` (cream/clay theme). Stacked `<section>`s with anchor nav. No framework, no build step. Cloudflare Pages serves the repo root directly.

**Tech Stack:** Plain HTML5 + CSS (inline). Cloudflare Pages (hosting). Cloudflare DNS. No JS build, no dependencies.

**Repo:** `/Users/mayank/Developer/e7mac.github.io` (GitHub `e7mac/e7mac.github.io`).

**Verification model:** This is a static site — "tests" are a browser open + an automated external-link audit (`curl`) + HTML sanity checks, not a unit-test framework.

---

## File Structure

```
e7mac.github.io/
├── index.html          # MODIFY — the entire site (sections + inline CSS)
├── 404.html            # CREATE — simple not-found page reusing the theme
├── _redirects          # CREATE — legacy Django paths → /
├── robots.txt          # MODIFY — keep allow-all, update sitemap ref
├── sitemap.xml         # MODIFY — single canonical URL, fresh lastmod
└── favicon.svg         # unchanged
```

---

## Confirmed content values (use these literal values in the tasks below)

- About name: **Mayank Sanganeria** (handle **e7mac**)
- Instagram: `https://www.instagram.com/e7mac/`  (carries the art content)
- SoundCloud: `https://soundcloud.com/e7mac`  (carries the music content)
- GitHub: `https://github.com/e7mac`
- Contact email: `mayank.ot@gmail.com`  *(draft — confirm in Task 1)*
- Live tools (already cards in index.html): `https://realeartrainer.com`, `https://realsightreader.com`, `https://textbook.realmusictheory.com/`
- Publications: "Bit Bending — an introduction"; "GrainProc — a real-time granular synthesis interface for live performance"
- Apps to mention in Software: bent.fm, GrainProc, PianoCam, Practica, Stave *(links confirmed in Task 1)*

---

### Task 1: Confirm content inputs

**Files:** none (gather decisions before editing).

- [ ] **Step 1: Confirm the variable values with the user**

Ask the user to confirm or correct, defaulting to the values shown:

| Field | Default |
|---|---|
| Public contact email | `mayank.ot@gmail.com` |
| About copy (see Task 3 draft) | use draft as-is? |
| App links for Software section | bent.fm → `https://bent.fm` ; others → GitHub repo or App Store URL (user supplies any that exist) |
| Include Publications section? | yes |

- [ ] **Step 2: Record confirmed values inline in this plan**

Edit the "Confirmed content values" block above with any corrections so later tasks use the right literals. Commit:

```bash
cd /Users/mayank/Developer/e7mac.github.io
git add docs/superpowers/plans/2026-06-02-personal-site-consolidation.md
git commit -m "plan: record confirmed content inputs"
```

---

### Task 2: Restructure layout from single-screen to multi-section scroll

The current `index.html` centers one screenful with `body { display:flex; align-items:center }`. A multi-section page must flow top-to-bottom and add a sticky anchor nav. This task changes only the shell (CSS + header/nav + empty section wrappers); content tasks fill the sections.

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the `<style>` block layout rules**

In `index.html`, replace the `body { ... }` and `main { ... }` rules inside `<style>` with:

```css
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font-family: "Inter", -apple-system, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased; line-height: 1.6;
}
nav.top {
  position: sticky; top: 0; z-index: 10;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--faint);
  display: flex; gap: 1rem; align-items: center;
  padding: 0.7rem 1.25rem; font-size: 0.9rem;
}
nav.top a { color: var(--muted); text-decoration: none; }
nav.top a:hover { color: var(--clay); }
nav.top .spacer { flex: 1; }
main { max-width: 680px; width: 100%; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
section { margin: 0 0 3rem; scroll-margin-top: 4rem; }
section > h2.sec {
  font-family: var(--serif); font-size: 1.5rem; letter-spacing: -0.01em;
  margin: 0 0 1rem; padding-bottom: 0.3rem; border-bottom: 1px solid var(--faint);
}
.linkrow { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.linkrow a {
  text-decoration: none; color: var(--ink);
  border: 1px solid var(--faint); border-radius: 999px;
  padding: 0.45rem 0.95rem; font-size: 0.9rem; font-weight: 500;
  transition: border-color .15s ease, color .15s ease;
}
.linkrow a:hover { border-color: var(--clay-soft); color: var(--clay); }
ul.pubs { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.8rem; }
ul.pubs li { color: var(--muted); }
ul.pubs li strong { color: var(--ink); font-weight: 600; }
```

- [ ] **Step 2: Add a `--surface`/existing-token sanity check**

Confirm `:root` still defines `--bg --surface --ink --muted --faint --clay --clay-soft --shadow --serif`. They already exist in the current file — do not remove them. The `.app`/`.apps` card rules stay unchanged (reused by Music tools).

- [ ] **Step 3: Replace the `<body>` markup shell**

Replace the current `<body>...</body>` with this shell (sections are empty stubs filled in later tasks; Music-tools cards are preserved verbatim from the current file):

```html
<body>
  <nav class="top">
    <span class="mark" aria-hidden="true" style="width:28px;height:28px;font-size:0.95rem;border-radius:7px">♪</span>
    <a href="#about">About</a>
    <a href="#tools">Tools</a>
    <a href="#software">Software</a>
    <a href="#publications">Publications</a>
    <span class="spacer"></span>
    <a href="#links">Links</a>
  </nav>
  <main>
    <section id="about"><!-- Task 3 --></section>
    <section id="tools"><!-- Task 4 --></section>
    <section id="software"><!-- Task 5 --></section>
    <section id="publications"><!-- Task 6 --></section>
    <section id="links"><!-- Task 7 --></section>
    <footer style="margin-top:2rem;color:var(--muted);font-size:0.8rem">Made by e7mac.</footer>
  </main>
</body>
```

- [ ] **Step 4: Open in a browser to verify the shell**

Run: `open index.html`
Expected: sticky nav at top with working anchor links; empty page body; no console errors; cream background intact.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "refactor: multi-section scrolling layout + sticky nav"
```

---

### Task 3: About section

**Files:** Modify `index.html` (`#about`).

- [ ] **Step 1: Fill the `#about` section**

Replace `<section id="about"><!-- Task 3 --></section>` with (edit copy if Task 1 changed it):

```html
<section id="about">
  <div class="brand"><span class="mark" aria-hidden="true">♪</span></div>
  <h1>Mayank Sanganeria</h1>
  <p class="lede">
    I'm an engineer and computer musician. I build music software, and I make
    music, art, and the occasional research paper. I studied at
    <a href="https://ccrma.stanford.edu">CCRMA, Stanford</a>, and I'm based in
    San Francisco. Say hello if you'd like to collaborate.
  </p>
</section>
```

- [ ] **Step 2: Verify**

Run: `open index.html`
Expected: heading "Mayank Sanganeria", bio paragraph, clay link to CCRMA.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: about section"
```

---

### Task 4: Music tools section (the highlight)

Carry the three existing cards into `#tools` and give the section a heading. The `.apps`/`.app` markup already exists in the current file — move it intact.

**Files:** Modify `index.html` (`#tools`).

- [ ] **Step 1: Fill the `#tools` section**

Replace `<section id="tools"><!-- Task 4 --></section>` with:

```html
<section id="tools">
  <h2 class="sec">Music tools</h2>
  <p class="lede" style="margin-bottom:1.5rem">
    Free, browser-based tools for musicians — built to make practising and
    studying music a little easier.
  </p>
  <div class="apps">
    <a class="app" href="https://realeartrainer.com">
      <h2>Real Ear Trainer</h2>
      <p>Train your ear — recognise intervals, chords, and progressions by sound.</p>
      <span class="host">realeartrainer.com</span>
    </a>
    <a class="app" href="https://realsightreader.com">
      <h2>Real Sight Reader</h2>
      <p>Sight-reading practice and drills built from your own repertoire.</p>
      <span class="host">realsightreader.com</span>
    </a>
    <a class="app" href="https://textbook.realmusictheory.com/">
      <h2>Music Ed</h2>
      <p>Hear the musical examples from classic theory and orchestration textbooks, beside the score.</p>
      <span class="host">textbook.realmusictheory.com</span>
    </a>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `open index.html`
Expected: three cards with hover lift, clay host labels, matching the previous design.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: music tools section (carried from prior hub)"
```

---

### Task 5: Software / projects section

Reuse the `.apps`/`.app` card style. Use confirmed app links from Task 1; for any app without a confirmed live URL, link its name to `https://github.com/e7mac` rather than a guessed/broken URL.

**Files:** Modify `index.html` (`#software`).

- [ ] **Step 1: Fill the `#software` section**

Replace `<section id="software"><!-- Task 5 --></section>` with (swap `href`s for any confirmed in Task 1):

```html
<section id="software">
  <h2 class="sec">Software</h2>
  <p class="lede" style="margin-bottom:1.5rem">
    Apps and instruments I build for musicians.
  </p>
  <div class="apps">
    <a class="app" href="https://bent.fm">
      <h2>bent.fm</h2>
      <p>A circuit-bent FM synthesiser for iPad — chaotic, playable, AUv3.</p>
      <span class="host">bent.fm</span>
    </a>
    <a class="app" href="https://github.com/e7mac">
      <h2>GrainProc</h2>
      <p>Live granular processor — mic input through a granular delay/feedback engine.</p>
      <span class="host">github.com/e7mac</span>
    </a>
    <a class="app" href="https://github.com/e7mac">
      <h2>PianoCam</h2>
      <p>Virtual webcam with an 88-key piano overlay driven by MIDI — for teaching on Zoom/Meet.</p>
      <span class="host">github.com/e7mac</span>
    </a>
    <a class="app" href="https://github.com/e7mac">
      <h2>Practica</h2>
      <p>Practice journal — records playing, segments into takes, clusters them by piece.</p>
      <span class="host">github.com/e7mac</span>
    </a>
    <a class="app" href="https://github.com/e7mac">
      <h2>Stave</h2>
      <p>Music-literacy trainer — drills notes, intervals, harmony and rhythm from your own scores.</p>
      <span class="host">github.com/e7mac</span>
    </a>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `open index.html`
Expected: software cards render identically styled to the tools cards.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: software section"
```

---

### Task 6: Publications section

**Files:** Modify `index.html` (`#publications`).

- [ ] **Step 1: Fill the `#publications` section**

Replace `<section id="publications"><!-- Task 6 --></section>` with:

```html
<section id="publications">
  <h2 class="sec">Publications</h2>
  <ul class="pubs">
    <li><strong>Bit Bending — an introduction.</strong> Circuit bending, brought to software.</li>
    <li><strong>GrainProc.</strong> A real-time granular synthesis interface for live performance.</li>
  </ul>
</section>
```

- [ ] **Step 2: Verify**

Run: `open index.html`
Expected: two-item publication list, muted text with bold titles.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: publications section"
```

---

### Task 7: Links / social section (art → Instagram, music → SoundCloud)

**Files:** Modify `index.html` (`#links`).

- [ ] **Step 1: Fill the `#links` section**

Replace `<section id="links"><!-- Task 7 --></section>` with (use the confirmed email from Task 1):

```html
<section id="links">
  <h2 class="sec">Elsewhere</h2>
  <p class="lede" style="margin-bottom:1.25rem">
    My art lives on Instagram and my music on SoundCloud.
  </p>
  <div class="linkrow">
    <a href="https://www.instagram.com/e7mac/">Instagram — art</a>
    <a href="https://soundcloud.com/e7mac">SoundCloud — music</a>
    <a href="https://github.com/e7mac">GitHub</a>
    <a href="mailto:mayank.ot@gmail.com">Email</a>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `open index.html`
Expected: four pill links; hover turns them clay.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: links/social section"
```

---

### Task 8: Update head metadata, robots, sitemap

The `<title>`, `<meta name="description">`, and OG tags still say "Music Tools". Update them to describe the personal site, and refresh robots/sitemap.

**Files:** Modify `index.html` (`<head>`), `robots.txt`, `sitemap.xml`.

- [ ] **Step 1: Update `<head>` tags in `index.html`**

Set:

```html
<title>Mayank Sanganeria — engineer & computer musician</title>
<meta name="description" content="Mayank Sanganeria (e7mac) — engineer and computer musician. Music software, music, and art. Free browser tools: ear training, sight reading, music theory." />
<meta property="og:title" content="Mayank Sanganeria — engineer & computer musician" />
<meta property="og:description" content="Music software, music, and art. Plus free browser tools for musicians." />
```

Leave `og:url` and `canonical` as `https://e7mac.github.io/` for now; Task 10 revisits canonical after the custom domains are live.

- [ ] **Step 2: Verify robots.txt allows crawling and references the sitemap**

Read `robots.txt`. Ensure it contains:

```
User-agent: *
Allow: /
Sitemap: https://e7mac.com/sitemap.xml
```

Update it to match if different.

- [ ] **Step 3: Update sitemap.xml to a single canonical URL**

Set `sitemap.xml` contents to:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
  <url>
    <loc>https://e7mac.com/</loc>
    <lastmod>2026-06-02</lastmod>
  </url>
</urlset>
```

- [ ] **Step 4: Commit**

```bash
git add index.html robots.txt sitemap.xml
git commit -m "feat: site metadata, robots, sitemap for personal site"
```

---

### Task 9: 404 page + legacy redirects

**Files:** Create `404.html`, `_redirects`.

- [ ] **Step 1: Create `404.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Not found — Mayank Sanganeria</title>
    <style>
      body { margin:0; min-height:100vh; display:grid; place-items:center;
        background:#fcf9ee; color:#1a1a1a;
        font-family:-apple-system, system-ui, sans-serif; text-align:center; padding:2rem; }
      a { color:#d97757; }
    </style>
  </head>
  <body>
    <div>
      <h1>Not found</h1>
      <p>That page doesn't exist. <a href="/">Go home →</a></p>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Create `_redirects` (Cloudflare Pages format) for legacy Django paths**

```
/projects/        /#software   301
/projects         /#software   301
/publications/    /#publications  301
/publications     /#publications  301
/performances/    /#links      301
/compositions/    /#links      301
/experiments/     /#software   301
/music/           /#links      301
```

- [ ] **Step 3: Verify locally**

Run: `open 404.html`
Expected: centered "Not found" with a clay home link. (`_redirects` only takes effect on Cloudflare Pages — verified in Task 11.)

- [ ] **Step 4: Commit**

```bash
git add 404.html _redirects
git commit -m "feat: 404 page and legacy path redirects"
```

---

### Task 10: Full local verification (link audit)

**Files:** none (verification only).

- [ ] **Step 1: Audit every external link returns a healthy status**

Run this from the repo root:

```bash
grep -oE 'href="https?://[^"]+"' index.html | sed -E 's/href="([^"]+)"/\1/' | sort -u | \
while read u; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 15 "$u");
  echo "$code  $u";
done
```

Expected: every line `200` (or `3xx` that resolves). Any `000`/`404`/`5xx` → fix that link in the relevant section before proceeding. (`bent.fm` especially — if it doesn't resolve, change its card `href` to `https://github.com/e7mac` per Task 5's rule.)

- [ ] **Step 2: Visual pass across viewport sizes**

Run: `open index.html`
Expected: nav anchors jump to each section; layout readable at narrow (375px) and wide widths; cards reflow; no overflow.

- [ ] **Step 3: Commit any link fixes**

```bash
git add index.html
git commit -m "fix: correct external links from audit"   # only if changes were made
```

---

### Task 11: Deploy to Cloudflare Pages (manual, dashboard)

These steps run in the Cloudflare dashboard and at GitHub — they cannot be scripted here. Push first, then connect Pages.

**Files:** none (infra).

- [ ] **Step 1: Push the branch and merge to `main`**

```bash
git push origin HEAD
```
If working on a branch, open and merge a PR to `main` on GitHub.

- [ ] **Step 2: Create the Cloudflare Pages project**

In Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → select `e7mac/e7mac.github.io`. Settings:
- Production branch: `main`
- Framework preset: **None**
- Build command: *(empty)*
- Build output directory: `/` (root)

Deploy. Expected: a `https://<project>.pages.dev` URL serving the site.

- [ ] **Step 3: Verify the `.pages.dev` preview**

Run: `curl -sI https://<project>.pages.dev/ | head -1`
Expected: `HTTP/2 200`. Open it in a browser and confirm all sections + the 404 (`/nope`) + a redirect (`/projects/` → `/#software`).

- [ ] **Step 4: Attach custom domain `e7mac.com`**

Pages project → **Custom domains** → add `e7mac.com` and `www.e7mac.com`. Since `e7mac.com` is already a Cloudflare zone, accept the offered DNS (CNAME/flattened) records. Cloudflare provisions TLS automatically.

- [ ] **Step 5: Attach custom domain `mayanks.art`**

First add `mayanks.art` as a zone in Cloudflare (**Add a site**), then at **GoDaddy** change the domain's nameservers to the two Cloudflare provides. Wait for the zone to go active (minutes–hours). Then Pages → **Custom domains** → add `mayanks.art` and `www.mayanks.art`.

- [ ] **Step 6: Verify both production domains**

Run:
```bash
for h in https://e7mac.com/ https://www.e7mac.com/ https://mayanks.art/ https://www.mayanks.art/; do
  echo "$h -> $(curl -s -o /dev/null -w '%{http_code}' -L --max-time 20 "$h")";
done
```
Expected: all `200` with valid certs (no 525/526). Browser-check both apexes render the new site.

---

### Task 12: Point canonical at e7mac.com and retire old infra

Do this only after Task 11 verifies both domains serve correctly.

**Files:** Modify `index.html`.

- [ ] **Step 1: Update canonical/OG URL to the primary domain**

In `index.html` set:
```html
<link rel="canonical" href="https://e7mac.com/" />
<meta property="og:url" content="https://e7mac.com/" />
```
Commit and push:
```bash
git add index.html && git commit -m "chore: canonical → e7mac.com" && git push
```

- [ ] **Step 2: Scale down and delete the Heroku app**

```bash
export PATH="/opt/homebrew/bin:$PATH"
heroku ps:scale web=0 -a e7mac
# After confirming e7mac.com serves Cloudflare Pages (Task 11), delete it:
heroku apps:destroy e7mac --confirm e7mac
```

- [ ] **Step 3: Disable GitHub Pages for the repo**

GitHub → repo **Settings → Pages** → set Source to **None** (Cloudflare Pages now serves the domains). The repo stays as the Pages source-of-truth for Cloudflare.

- [ ] **Step 4: Let the Squarespace subscription lapse**

No action needed (already expired). Confirm no auto-renew is set. The `mayanks.art` domain stays at GoDaddy, paid through 2026-11-04, now served via Cloudflare.

- [ ] **Step 5: Final verification**

Run:
```bash
for h in https://e7mac.com/ https://mayanks.art/; do
  echo "$h -> $(curl -s -o /dev/null -w '%{http_code}' -L "$h")";
done
```
Expected: both `200`, serving the consolidated site. Heroku app gone; GitHub Pages off; Squarespace lapsed.

---

## Self-Review Notes

- **Spec coverage:** about (T3), music tools highlight (T4), software (T5), publications (T6), art→Instagram/music→SoundCloud links (T7), both domains no-redirect (T11), Cloudflare Pages + plain HTML (T2–T9), GoDaddy nameserver switch for mayanks.art (T11.5), retire Heroku/Squarespace/GitHub Pages (T12), 404 + legacy `_redirects` (T9). All spec sections map to a task.
- **Placeholders:** external links carry real values; the only "confirm" items (email, app URLs) are gated in Task 1 and defended by the Task 10 link audit (no broken links ship).
- **Consistency:** section IDs `#about #tools #software #publications #links` used identically in nav (T2), sections (T3–T7), and redirects (T9). CSS classes `.apps/.app/.sec/.linkrow/.pubs` defined in T2 and used consistently after.
