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

- **Purpose:** Personal homepage with the **music-tools hub as the highlight**.
- **Structure:** **Single scrolling page, no subpages.**
- **Content (one page, in order):** about/bio → **music tools (highlighted)** → software/apps list → publications list → links/social.
- **Art & music are links, not galleries:** digital/visual art → **Instagram**; music/compositions/performances → **SoundCloud**. No image export or media hosting needed.
- **Domains:** Both `e7mac.com` and `mayanks.art` serve the same site, **no redirect** (both canonical).
- **Hosting:** **Cloudflare Pages**, deployed from the `e7mac.github.io` GitHub repo, with both custom domains attached.
- **Build tooling:** **Plain HTML + CSS.** No framework, no build step. (Single page → CSS stays inline in `index.html`, as it is today.)
- **GitHub Pages:** **disabled** once Cloudflare Pages is live.

## Architecture

A single static HTML page served directly by Cloudflare Pages. No server, no database, no build, no subpages.

```
e7mac.github.io/        (repo root = Pages output dir)
├── index.html          # The entire site: about + tools + software + publications + links
├── 404.html            # Simple not-found page
├── _redirects          # Legacy path redirects (old Django URLs → /)
├── favicon.svg         # Existing
├── robots.txt          # Existing
└── sitemap.xml         # Existing (single URL)
```

`index.html` evolves directly from the current file: same cream/clay theme, inline CSS (acceptable for one page), Inter + serif type. Content is organized into stacked `<section>`s with anchor links.

### Sections (within the single page)

Each section is a self-contained block of static markup; reordering or editing one does not affect the others.

- **About:** short bio blending both identities — engineer & computer musician (CCRMA/Stanford) + "music, art & technology," SF-based. Fresh copy, not the 2012 text.
- **Music tools (highlight):** the existing three cards — Real Ear Trainer, Real Sight Reader, Music Ed — carried over verbatim, given visual prominence as the centerpiece.
- **Software / projects:** a card or list of apps — bent.fm, GrainProc, PianoCam, Practica, Stave, etc. — each linking to its site/store. Sourced from current projects + old e7mac.com "Projects."
- **Publications:** a simple static list with links to papers (from both old portfolios).
- **Links / social:** Instagram (art), SoundCloud (music), GitHub, email. These carry the art/music content by reference rather than rehosting it.

## Content sources & data flow

| Section | Source | Notes |
|---|---|---|
| About | Fresh copy blending both bios | Engineer + computer musician + artist, SF |
| Music tools | Existing `index.html` cards | Carry over verbatim |
| Software/projects | Current apps + old e7mac.com Projects | Link out to each |
| Publications | Both old portfolios | Static list of links |
| Links/social | mayanks.art + e7mac.com | Instagram, SoundCloud, GitHub, email |

All content is recoverable for free (Wayback + live old site + known app URLs). **No Squarespace export required** — art and music live behind Instagram/SoundCloud links.

## Deployment & cutover

1. Build the single page in the `e7mac.github.io` repo on a branch; PR/merge to `main`.
2. Create a **Cloudflare Pages** project connected to the GitHub repo (production branch `main`, **no build command**, output dir = root).
3. Attach **both** custom domains in Pages: `e7mac.com` (+ `www`) and `mayanks.art` (+ `www`). Cloudflare provisions TLS automatically.
4. Update Cloudflare DNS: point both apex + `www` records at the Pages project. This replaces the current `e7mac.com → herokudns.com` ALIAS (the source of the 525: Cloudflare → Heroku origin had no cert).
   - **`e7mac.com`** is already a Cloudflare zone — just repoint its records.
   - **`mayanks.art`** is registered at **GoDaddy** (not Squarespace; Squarespace was only the website builder) and currently uses GoDaddy nameservers. **No domain transfer needed** — add `mayanks.art` as a Cloudflare zone and switch its nameservers to Cloudflare at GoDaddy. (Cloudflare Registrar does **not** support `.art`, so transferring registration to Cloudflare is not an option; a later transfer, if ever wanted, would go to Porkbun/Namecheap. Out of scope here.) Domain is paid through 2026-11-04; the expired Squarespace plan does not affect it.
5. Verify both domains serve the new site over HTTPS (200, valid cert).
6. **Retire:** `heroku ps:scale web=0 -a e7mac` then delete the app; cancel/let-lapse Squarespace; **disable GitHub Pages** for the repo.

## Error handling / edge cases

- **404:** `404.html`; Cloudflare Pages serves it automatically.
- **Old inbound links** (e.g. `/projects/`, `/compositions/`, `/performances/` from the Django site): `_redirects` maps legacy paths → `/` (or the relevant anchor) so existing links/SEO don't break.
- **External link rot:** Instagram/SoundCloud/app links open in context; no broken local assets since nothing is rehosted.
- **TLS:** handled entirely by Cloudflare Pages (no more manual Heroku certs).

## Testing / verification

- Local: open `index.html`; check every section renders, nav anchors jump correctly, responsive layout, no broken links (`<a>` audit), no broken images.
- Pre-cutover: preview via the `*.pages.dev` URL.
- Post-cutover: `curl -I` both apex domains + `www` → expect `200`, valid cert; click through all external links; verify `_redirects` legacy paths land sensibly.
- Lighthouse pass on the page (perf/SEO/a11y) as a sanity check.

## Out of scope (YAGNI)

- Subpages, static-site generator, framework, or build pipeline (revisit only if the single page outgrows itself).
- Rehosting art images or audio — linked via Instagram/SoundCloud instead.
- Blog/CMS, comments, analytics dashboards.
- Recreating old Django dynamic features — link to live apps instead.
- Pixel-perfect recreation of the Squarespace design — adopt the existing cream/clay system.

## Open items before/while implementing

- [ ] Confirm exact external URLs: Instagram handle, SoundCloud profile, app/project links, publication links, contact email.
- [ ] Final about-section copy.
