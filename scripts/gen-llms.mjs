#!/usr/bin/env node
// Generates llms.txt from the site's own sitemap.xml + index.html. Run: node scripts/gen-llms.mjs
// Check only (no write): node scripts/gen-llms.mjs --check
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const DOMAIN = 'e7mac.com';
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const meta = (html, re) => decode((html.match(re) || [])[1] || '');

const SUMMARY = `Personal site of Mayank Sanganeria, an engineer and computer musician based in San Francisco who studied at CCRMA, Stanford. It collects the music software he builds (free browser-based practice tools and iOS/macOS apps), his publications, and links to his art and music.`;
const FACTS = `The site is a single page. Contact: hello@e7mac.com.`;

// Canonical one-liners for the sibling music apps (fleet spec, 2026-10-19).
const RELATED = [
  ['Real Ear Trainer', 'https://realeartrainer.com/', 'free online ear training — intervals, chords, scales and progressions, with lessons and scaffolded drills.'],
  ['Real Sight Reader', 'https://realsightreader.com/', 'free sight-reading practice on real piano music, with on-screen keys or a MIDI keyboard; no account.'],
  ['RealMusicTheory', 'https://realmusictheory.com/', 'free, open music-theory textbook whose harmony examples come from real repertoire by composers you choose.'],
  ['Music Ed textbook examples', 'https://textbook.realmusictheory.com/', 'playable examples from classic public-domain music-theory and orchestration textbooks.'],
  ['Playable Books', 'https://playablebook.com/', 'classic music textbooks (Fux, Rameau, Rimsky-Korsakov, Schoenberg and others) in reading editions whose examples play in the browser, beside the original scans where available.'],
  ['Jazz Changes', 'https://jazzchanges.app/', 'learn jazz standards by ear — essential recordings in listening order, what to listen for, and the chord changes.'],
  ['Music Tutor', 'https://musictutor.app/', 'MCP connector that gives Claude and ChatGPT playable notation, chords, harmony examples, sight-reading and ear-training tools.'],
  ['Whozart', 'https://whozart.com/', 'a classical-music listening quiz — hear a piece, name it, share the score.'],
  ['MIDI Memos', 'https://midimemos.com/', 'one-tap MIDI recorder for iPhone and iPad that exports .mid files to any DAW.'],
  ['PianoCam', 'https://pianocam.app/', 'iPhone studio that turns piano videos into shareable performances with falling notes and sheet music.'],
  ['RealJam', 'https://realjam.app/', 'jam over real chord changes in the browser with guided ladders for melody, harmony and time; no signup.'],
  ['GrainProc', 'https://grainproc.com/', 'live granular processor for iPhone and iPad — real-time granular delay and feedback, playable as an instrument.'],
];

function build() {
  const home = read('index.html');
  const title = meta(home, /<title>([^<]*)<\/title>/);
  const desc = meta(home, /<meta property="og:description" content="([^"]*)"/);

  // Pages: every <loc> in the sitemap (the same list search engines get).
  const locs = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const pages = locs.map((u) => {
    if (u !== `https://${DOMAIN}/`) throw new Error(`sitemap has a page this generator cannot describe: ${u}`);
    return `- [${title}](${u}): ${desc}`;
  });

  // Home-page sections: each <section id=..> with its <h2>, described by its .sublede if any.
  const sections = [...home.matchAll(/<section id="([^"]+)">([\s\S]*?)<\/section>/g)]
    .map(([, id, body]) => {
      const h2 = body.match(/<h2[^>]*>([^<]*)<\/h2>/);
      if (!h2) return null;
      const sub = body.match(/<p class="sublede">([^<]*)<\/p>/);
      return `- [${decode(h2[1])}](https://${DOMAIN}/#${id})${sub ? ': ' + decode(sub[1]) : ''}`;
    })
    .filter(Boolean);

  return [
    `# Mayank Sanganeria (e7mac)`,
    ``,
    `> ${SUMMARY}`,
    ``,
    FACTS,
    ``,
    `## Main pages`,
    ``,
    ...pages,
    ``,
    `## Sections of the home page`,
    ``,
    ...sections,
    ``,
    `## Related`,
    ``,
    `Music apps and tools he builds:`,
    ``,
    ...RELATED.map(([n, u, d]) => `- [${n}](${u}): ${d}`),
    ``,
  ].join('\n');
}

// Assertions required by the fleet llms.txt spec.
export function check(text) {
  const errs = [];
  if (!text.trim()) errs.push('empty');
  if (!text.startsWith('# ')) errs.push('does not start with "# "');
  if (!/^> .+/m.test(text)) errs.push('no "> " summary line');
  if (!/^## Related$/m.test(text)) errs.push('no "## Related" section');
  if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(text)) errs.push('contains a UUID');
  for (const bad of ['localhost', 'workers.dev', '/api/', '/admin', '/staging', '/private', '/review', '/unlisted']) {
    if (text.includes(bad)) errs.push(`contains forbidden "${bad}"`);
  }
  const related = new Set(RELATED.map(([, u]) => new URL(u).host));
  for (const [, href] of text.matchAll(/\]\(([^)]+)\)/g)) {
    const host = new URL(href).host;
    if (href.startsWith('https://') === false || (host !== DOMAIN && !related.has(host))) errs.push(`link off-domain: ${href}`);
  }
  return errs;
}

const out = fileURLToPath(new URL('llms.txt', root));
const text = build();
const errs = check(text);
if (process.argv.includes('--check')) {
  if (!existsSync(out)) errs.push('llms.txt missing — run node scripts/gen-llms.mjs');
  else if (readFileSync(out, 'utf8') !== text) errs.push('llms.txt is stale — run node scripts/gen-llms.mjs');
}
if (errs.length) { console.error('llms.txt check FAILED:\n- ' + errs.join('\n- ')); process.exit(1); }
if (!process.argv.includes('--check')) { writeFileSync(out, text); console.log(`wrote llms.txt (${text.split('\n').length - 1} lines)`); }
else console.log('llms.txt OK');
