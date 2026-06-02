# Personal Site Consolidation — Design

**Date:** 2026-06-02
**Owner:** Mayank Sanganeria (e7mac)
**Status:** Approved for planning

## Problem

Three overlapping web presences exist for the same person:

1. **`e7mac.com`** — old Django/Heroku portfolio (CCRMA/Stanford era, ~2012). Sections: Projects, Publications, Experiments, Performances, Compositions, Recordings. Runs on the deprecated Heroku `cedar` stack; the web dyno had been scaled to 0 (cause of the "application error" page — fixed by `heroku ps:scale web=1`, kept alive only until cutover).
2. **`mayanks.art`** — Squarespace artist site (subscription expired, live site shows "Website Expired"). Sections recovered via Wayback (2021 capture): Music, Compositions, Performances, Digital Art, Visual Art, Publications, Software. About: "b. 1986, HK. I make music, art & technology … Currently based in San Francisco."
3. **`e7mac.github.io`** — a recently hand-built static "Music tools" hub (cream/clay theme) linking to Real Ear Trainer, Real Sight Reader, and Music Ed. This is the seed of the new site.

**Goal:** Consolidate (1) and (2) into a single static personal site, served free via Cloudflare, reachable at both domains. Retire Heroku and Squarespace.

## Decisions (from brainstorming)

- **Purpose:** Personal homepage *plus* the music-tools hub.
- **Content:** Short bio/about · music tools hub · music/recordings · digital & visual art · publications · software/projects · links/social/contact.
- **Structure:** Hub landing page + a few richer subpages.
- **Domains:** Both `e7mac.com` and `mayanks.art` serve the same site, **no redirect** (both canonical).
- **Hosting:** **Cloudflare Pages**, deployed from the `e7mac.github.io` GitHub repo, with both custom domains attached.
- **Build tooling:** **Plain HTML + a single shared CSS file.** No framework, no build step. Header/footer markup duplicated per page.

## Architecture

Static files served directly by Cloudflare Pages. No server, no database, no build.

```
e7mac.github.io/            (repo root = Pages output dir)
├── index.html              # Hub: about + tools + highlights + links
├── music/index.html        # Compositions, performances, recordings (embeds/links)
├── art/index.html          # Digital art + visual art galleries
├── software/index.html     # Apps & projects (bent.fm, GrainProc, tools, …)
├── publications/index.html # List of publications
├── assets/
│   ├── style.css           # Single shared stylesheet (extracted from current index.html)
│   └── img/                # Art images + thumbnails (from Squarespace export)
├── favicon.svg             # Existing
├── robots.txt              # Existing (update for new pages)
└── sitemap.xml             # Existing (regenerate for all pages)
```

Each page is a complete HTML document that links `assets/style.css` and repeats a shared header (brand + nav) and footer. Clean URLs via directory `index.html` files (`/music`, `/art`, …).

### Components (each independently understandable)

- **Shared stylesheet (`assets/style.css`):** the design tokens + component styles currently inlined in `index.html`, lifted into one file. Single source of truth for theme (cream `--bg`, clay `--clay`, Inter + serif). Pages depend on it; changing it restyles the whole site without touching page markup.
- **Header/nav partial (copied markup):** brand mark + links to the 5 pages. Duplicated by hand (acceptable at this scale). If it ever drifts painfully, that is the signal to revisit Eleventy.
- **Hub page (`index.html`):** about blurb, the existing 3 tool cards, highlight links into subpages, social links. Evolution of the current file.
- **Subpage = section:** `/music`, `/art`, `/software`, `/publications` each own one content domain, reuse header/footer/CSS, and embed or link external media (SoundCloud, video, app stores/sites). No shared state between pages.

## Content sources & data flow

| Page | Primary source | Notes |
|---|---|---|
| About (hub) | Fresh copy blending both bios | Engineer + computer musician + artist, SF |
| Music tools (hub) | Existing `index.html` cards | Already built — carry over verbatim |
| `/music` | Old e7mac.com + mayanks.art | SoundCloud / video embeds + links |
| `/art` | mayanks.art (Squarespace) | **Needs image export — user action** |
| `/software` | Apps + tools + old Projects | bent.fm, GrainProc, RealEarTrainer, etc. |
| `/publications` | Both portfolios | Static list, links to papers |
| Links/social | mayanks.art + e7mac.com | Instagram, SoundCloud, GitHub, email |

**Content recovery status:**
- Text/structure: recovered (Wayback + live old site). ✅
- Art images: **pending** — user to export from Squarespace (Settings → Advanced → Import/Export → Export WordPress XML) and/or download originals from the media library. Until then, `/art` ships with placeholders or is omitted from nav.

## Deployment & cutover

1. Build the static site in the `e7mac.github.io` repo on a branch; PR/merge to `main`.
2. Create a **Cloudflare Pages** project connected to the GitHub repo (production branch `main`, no build command, output dir = root). GitHub Pages can remain as a free staging mirror or be turned off.
3. Attach **both** custom domains in Pages: `e7mac.com` (+ `www`) and `mayanks.art` (+ `www`). Cloudflare provisions TLS automatically.
4. Update Cloudflare DNS: point both apex + www records at the Pages project (CNAME/ALIAS to `*.pages.dev`). This replaces the current `e7mac.com → herokudns.com` ALIAS (the source of the 525: Cloudflare → Heroku origin had no cert).
5. Verify both domains serve the new site over HTTPS (200, valid cert, all pages reachable).
6. **Retire:** `heroku ps:scale web=0 -a e7mac` then delete the app; cancel/let-lapse Squarespace.

## Error handling / edge cases

- **404:** add `404.html`; Cloudflare Pages serves it automatically.
- **Old inbound links** (e.g. `/projects/`, `/compositions/` from the Django site): add a `_redirects` file mapping legacy paths to the new pages so existing links/SEO don't break.
- **Missing art images:** `/art` degrades to placeholders or is hidden from nav until images land — never ships broken image tags.
- **TLS:** handled entirely by Cloudflare Pages (no more manual Heroku certs).

## Testing / verification

- Local: open each page in a browser; check nav, responsive layout, no broken links/images (`<a>`/`<img>` audit).
- Pre-cutover: preview via the `*.pages.dev` URL.
- Post-cutover: `curl -I` both apex domains + `www` → expect `200`, valid cert; spot-check every page and the `_redirects` legacy paths.
- Lighthouse pass on the hub page (perf/SEO/a11y) as a sanity check.

## Out of scope (YAGNI)

- Static-site generator / framework / build pipeline (revisit only if hand-maintained nav becomes painful).
- Blog/CMS, comments, analytics dashboards.
- Recreating the old Django dynamic features (experiments app, etc.) — link to live apps instead.
- Pixel-perfect recreation of the Squarespace design — adopt the existing clean cream/clay system instead.

## Open items before/while implementing

- [ ] User exports art images from Squarespace (gates the `/art` gallery).
- [ ] Confirm exact external links (SoundCloud, Instagram, paper URLs, app URLs).
- [ ] Decide whether GitHub Pages stays on as a mirror or is disabled after Cloudflare Pages goes live.
