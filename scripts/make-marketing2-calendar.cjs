/* MuleSoo — Marketing 2: the project-led 365-day calendar.
 *
 * The first calendar (marketing/Social-Calendar) sells the *agency*: pillars,
 * opinions, know-how. This one sells the *work* — every post is anchored to a
 * real thing we built, named, with its live URL where one exists. It is the
 * portfolio, sliced into a year of posts.
 *
 * The honesty rule that shaped the whole file: no invented numbers. Not one
 * post claims "+300% bookings" or "47 clients". Every proof line is a
 * *capability* taken from that project's own README or CLAUDE.md — things a
 * reader can go and verify by opening the live site. Projects still in build
 * (Sena, Yewogen Derash, DR. Hospital) say so on the face of the post. An
 * agency caught inflating one number loses the other eleven projects with it.
 *
 * Rotation: 7 pillars × 12 projects = 84 unique pairs, and 84 is coprime-free
 * against 365 in the useful way — each (project, pillar) pair comes round 4–5
 * times a year, so each carries 5 written variants and nothing repeats inside
 * ~12 weeks.
 *
 * Run: node scripts/make-marketing2-calendar.cjs [--start 2026-09-01]
 * Out: marketing2/  (CSV master + 5 per-platform markdowns)
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'marketing2');
const POSTS = path.join(OUT, 'Posts');
fs.mkdirSync(POSTS, { recursive: true });

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const START = new Date(arg('--start', '2026-09-01') + 'T00:00:00Z');
const DAYS = 365;

const SITE = 'mulesoo.com';
const WA = 'wa.me/27688529333';

// ── Platforms ────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { key: 'linkedin',  name: 'LinkedIn',  max: 1300 },
  { key: 'instagram', name: 'Instagram', max: 900 },
  { key: 'facebook',  name: 'Facebook',  max: 900 },
  { key: 'tiktok',    name: 'TikTok',    max: 2200 },
  { key: 'x',         name: 'X',         max: 260 },
];

const { PILLARS, PROJECTS } = require('./marketing2-projects.cjs');

if (PROJECTS.length !== 12) throw new Error(`expected 12 projects, got ${PROJECTS.length}`);

// ── Helpers ──────────────────────────────────────────────────────────────────
const pick = (arr, i) => arr[i % arr.length];
const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const iso = (d) => d.toISOString().slice(0, 10);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
/** Inline-mention name. "YoYo Gym — AI Membership Platform" inside a sentence
 *  that already uses an em dash reads as two dashes fighting; drop the suffix. */
/** "a gym" / "an event planning business" — the audience field carries no
 *  article so each template can place the right one. */
const aud = (p) => (/^[aeiou]/i.test(p.audience) ? 'an ' : 'a ') + p.audience;

const shortName = (p) => p.name.split(' — ')[0].replace(/ \(.*\)$/, '');

/** Present tense is reserved for work that is actually live. */
const verb = (p) => (p.state === 'live' ? 'built' : 'building');
const liveLine = (p) =>
  p.state === 'live' ? `See it: ${p.url}` : `Still in build — follow along: ${SITE}`;

const tagStr = (p, n) => p.tags.slice(0, n).map((t) => `#${t}`).join(' ');

/** Hard cap that never cuts a word in half or strands a dangling link. */
function clamp(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]$/, '') + '…';
}

// ── Copy builders ────────────────────────────────────────────────────────────
// Each returns the five platform posts for one (pillar, project, variant).
// Variant 0–4: the same idea told five structurally different ways, so the
// pair coming round every twelve weeks never reads like a repeat.

function spotlight(p, v) {
  const magic = pick(p.magic, v);
  const get = pick(p.gets, v);
  const opens = [
    `We ${verb(p)} ${p.name}.`,
    `Project file: ${p.name}.`,
    `This is ${p.name}, for ${p.sector}.`,
    `${p.emoji} ${p.name} — one of ours.`,
    `Let me show you ${p.name}.`,
  ];
  const open = opens[v % opens.length];

  return {
    linkedin: `${open}

In one line: ${p.is}.

The part that matters — ${magic}.

What the owner ends up with: ${get}.

${liveLine(p)}

${tagStr(p, 3)}`,

    instagram: `${p.emoji} ${open}

${cap(p.is)}.

✨ ${magic}
✅ ${get}

${liveLine(p)}

${tagStr(p, 6)}`,

    facebook: `${open}

It is ${p.is}.

The thing people notice first: ${magic}.

If you run ${aud(p)} and this sounds like your week — we should talk. ${SITE}`,

    tiktok: `POV: you run ${aud(p)}. ${p.emoji}

We ${verb(p)} ${p.name}.

It does one thing brilliantly: ${magic}.

Full build on ${SITE}

${tagStr(p, 5)}`,

    x: clamp(`${open} ${cap(p.is)}.\n\n${p.url}`, 260),
  };
}

function problem(p, v) {
  const pain = pick(p.pains, v);
  const magic = pick(p.magic, v);
  return {
    linkedin: `${pain}

That was the brief behind ${p.name}.

We ${verb(p)} it around one idea: ${magic}.

${cap(p.is)}.

${liveLine(p)}

${tagStr(p, 3)}`,

    instagram: `${pain} 😮‍💨

So we ${verb(p)} ${p.name}.

${cap(magic)}.

${liveLine(p)}

${tagStr(p, 6)}`,

    facebook: `${pain}

Every ${p.audience} we have spoken to says a version of that sentence.

${p.name} exists to end it — ${magic}.

${liveLine(p)}`,

    tiktok: `Tell me you run ${aud(p)} without telling me. 👇

"${pain}"

That is why we ${verb(p)} ${p.name} — ${magic}.

${SITE}

${tagStr(p, 5)}`,

    x: clamp(`${pain}\n\nSo we ${verb(p)} ${shortName(p)}.\n\n${p.url}`, 260),
  };
}

function funny(p, v) {
  const joke = pick(p.jokes, v);
  const second = pick(p.jokes, v + 2);
  return {
    linkedin: `${joke}

Behind the joke there is a real system: ${p.name} — ${p.is}.

Humour is just the shortest way to describe a problem everyone running ${aud(p)} already has.

${liveLine(p)}

${tagStr(p, 3)}`,

    instagram: `${joke} 😂

(${p.name}. Yes, it is real.)

${liveLine(p)}

${tagStr(p, 6)}`,

    facebook: `${joke}

True story from building ${p.name} — ${p.is}.

${second}

${liveLine(p)}`,

    tiktok: `${joke} 💀

Not a joke though — ${p.name} actually does this.

${second}

${SITE}

${tagStr(p, 5)}`,

    x: clamp(`${joke}\n\n— from building ${shortName(p)}`, 260),
  };
}

function howto(p, v) {
  const lesson = pick(p.teach, v);
  const lesson2 = pick(p.teach, v + 1);
  const lesson3 = pick(p.teach, v + 3);
  return {
    linkedin: `Something ${p.name} taught us:

${lesson}

Two more from the same build:

• ${lesson2}
• ${lesson3}

All three are in the live product, not in a slide deck. ${liveLine(p)}

${tagStr(p, 3)}`,

    instagram: `Lesson from building ${p.name} ${p.emoji}

📌 ${lesson}

Save this one — it applies far beyond this one project.

${tagStr(p, 6)}`,

    facebook: `A free lesson from building ${p.name}:

${lesson}

It sounds small. It is the difference between a system that works and one that quietly loses you money.

More of how we build: ${SITE}`,

    tiktok: `Free game from a real build 🧠

${lesson}

Learned it building ${p.name}.

${SITE}

${tagStr(p, 5)}`,

    x: clamp(`${lesson}\n\n— learned building ${shortName(p)}`, 260),
  };
}

function proof(p, v) {
  const gets = p.gets;
  const state = p.state === 'live' ? 'Live now.' : 'In active build — nothing here is launched yet.';
  return {
    linkedin: `What ${p.name} actually does — not adjectives, features:

• ${gets[0]}
• ${gets[1]}
• ${gets[2]}

${state} ${liveLine(p)}

No invented statistics on this page. Open it and check for yourself.

${tagStr(p, 3)}`,

    instagram: `${p.emoji} ${p.name} — what you actually get:

✅ ${gets[0]}
✅ ${gets[1]}
✅ ${gets[2]}

${state}

${liveLine(p)}

${tagStr(p, 6)}`,

    facebook: `People ask what "${p.name}" really means. Plainly:

✅ ${gets[0]}
✅ ${gets[1]}
✅ ${gets[2]}

${state} ${liveLine(p)}`,

    tiktok: `Three things ${p.name} does that a normal ${p.audience} setup cannot 👇

1. ${gets[0]}
2. ${gets[1]}
3. ${gets[2]}

${state}

${SITE}

${tagStr(p, 5)}`,

    x: clamp(`${p.name}:\n• ${gets[0]}\n• ${gets[1]}\n\n${p.url}`, 260),
  };
}

function behind(p, v) {
  const b = pick(p.behind, v);
  const b2 = pick(p.behind, v + 1);
  return {
    linkedin: `Under the bonnet of ${p.name}:

${b}

${b2}

None of this is visible to the client, and all of it is why the thing keeps working in month nine.

${liveLine(p)}

${tagStr(p, 3)}`,

    instagram: `Behind the build 🔧 ${p.name}

${b}

The boring decisions are the ones that hold.

${tagStr(p, 6)}`,

    facebook: `A look behind ${p.name}:

${b}

${b2}

We build the invisible parts properly. That is the whole difference between a demo and a system you can run a business on.`,

    tiktok: `Behind the build 🔧

${p.name}: ${b}

The unglamorous decisions are the ones that save you in month nine.

${SITE}

${tagStr(p, 5)}`,

    x: clamp(`${shortName(p)} — under the bonnet:\n\n${b}`, 260),
  };
}

function offer(p, v) {
  const get = pick(p.gets, v);
  const magic = pick(p.magic, v + 1);
  const ask = p.state === 'live'
    ? `Same system, your brand, your sector.`
    : `Early partners get it first, at build pricing.`;
  return {
    linkedin: `${p.offer}

We ${verb(p)} ${p.name} for exactly that — ${magic}.

${ask}

Tell us what your week looks like and we will tell you honestly whether software fixes it: ${SITE}/contact

${tagStr(p, 3)}`,

    instagram: `${p.offer} ${p.emoji}

We ${verb(p)} ${p.name} to solve it — you get ${get}.

${ask}

📩 ${SITE}/contact
💬 ${WA}

${tagStr(p, 6)}`,

    facebook: `${p.offer}

That is precisely why ${p.name} exists — ${magic}.

${ask} Message us and we will tell you straight whether this is worth it for your business.

📩 ${SITE}/contact  ·  💬 ${WA}`,

    tiktok: `${p.offer} ${p.emoji}

We already ${verb(p)} it once — ${p.name}.

${ask}

${SITE}

${tagStr(p, 5)}`,

    x: clamp(`${p.offer}\n\nWe ${verb(p)} ${p.name} for exactly this.\n\n${SITE}/contact`, 260),
  };
}

const BUILDERS = {
  SPOTLIGHT: spotlight, PROBLEM: problem, FUNNY: funny,
  HOWTO: howto, PROOF: proof, BEHIND: behind, OFFER: offer,
};

// ── The card hook ────────────────────────────────────────────────────────────
// Written for the image, not lifted from a caption. The portrait card carries
// one line at ~60px; a truncated LinkedIn opener looks like a mistake there.
function imageHook(pillar, p, v) {
  switch (pillar) {
    case 'SPOTLIGHT': return `We ${verb(p)} ${p.name}.`;
    case 'PROBLEM':   return pick(p.pains, v);
    case 'FUNNY':     return pick(p.jokes, v);
    case 'HOWTO':     return pick(p.teach, v);
    case 'PROOF':     return cap(pick(p.gets, v)) + '.';
    case 'BEHIND':    return pick(p.behind, v);
    case 'OFFER':     return p.offer;
    default:          return p.is;
  }
}

// ── Build the year ───────────────────────────────────────────────────────────
const rows = [];
for (let d = 0; d < DAYS; d++) {
  const date = new Date(START.getTime() + d * 86400000);
  const pillar = PILLARS[d % PILLARS.length];
  const project = PROJECTS[d % PROJECTS.length];
  const variant = Math.floor(d / (PILLARS.length * PROJECTS.length)); // 0–4
  const copy = BUILDERS[pillar.key](project, variant);
  const hook = imageHook(pillar.key, project, variant);

  for (const pf of PLATFORMS) {
    const text = clamp(copy[pf.key].trim(), pf.max);
    rows.push({
      date: iso(date),
      day_number: d + 1,
      day_of_week: DOW[date.getUTCDay()],
      week: Math.floor(d / 7) + 1,
      pillar: pillar.key,
      project: project.name,
      project_key: project.key,
      project_url: project.url,
      project_state: project.state,
      platform: pf.name,
      post_text: text,
      characters: text.length,
      image_hook: hook,
      image_kicker: project.chip,
      accent: project.accent,
    });
  }
}

// ── CSV ──────────────────────────────────────────────────────────────────────
const HEADERS = [
  'date', 'day_number', 'day_of_week', 'week', 'pillar', 'project', 'project_key',
  'project_url', 'project_state', 'platform', 'post_text', 'characters',
  'image_hook', 'image_kicker', 'accent',
];
const csvCell = (v) => {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = [HEADERS.join(',')]
  .concat(rows.map((r) => HEADERS.map((h) => csvCell(r[h])).join(',')))
  .join('\r\n');
fs.writeFileSync(path.join(OUT, 'MuleSoo-Marketing2-365.csv'), '﻿' + csv, 'utf8');

// ── Per-platform markdown ────────────────────────────────────────────────────
for (const pf of PLATFORMS) {
  const mine = rows.filter((r) => r.platform === pf.name);
  const lines = [
    `# MuleSoo — ${pf.name}: 365 project-led posts`,
    '',
    `Every post below names something we actually built. Live URLs are real; projects still`,
    `in build say so on the post. There are no invented statistics anywhere in this file.`,
    '',
    `Start date: ${iso(START)} · ${mine.length} posts · max ${pf.max} characters`,
    '',
    '---',
    '',
  ];
  for (const r of mine) {
    lines.push(
      `### Day ${r.day_number} — ${r.date} (${r.day_of_week})`,
      `**${r.pillar}** · ${r.project}${r.project_state === 'building' ? ' _(in build)_' : ''} · ${r.characters} chars`,
      '',
      '```',
      r.post_text,
      '```',
      ''
    );
  }
  fs.writeFileSync(path.join(POSTS, `${pf.name}-365.md`), lines.join('\n'), 'utf8');
}

// ── Report ───────────────────────────────────────────────────────────────────
const perProject = new Map();
for (const r of rows) perProject.set(r.project, (perProject.get(r.project) || 0) + 1);
const over = rows.filter((r) => {
  const pf = PLATFORMS.find((x) => x.name === r.platform);
  return r.characters > pf.max;
});

console.log(`\n  marketing2/ — ${DAYS} days from ${iso(START)}\n`);
console.log(`  ${rows.length} posts across ${PLATFORMS.length} platforms`);
console.log(`  ${PROJECTS.length} projects, each appearing ${DAYS / PROJECTS.length | 0}–${Math.ceil(DAYS / PROJECTS.length)} days\n`);
for (const [name, n] of [...perProject].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(4)} posts   ${name}`);
}
console.log(`\n  over-length posts: ${over.length}`);
if (over.length) { console.error('  LENGTH OVERFLOW'); process.exit(1); }
console.log(`  → marketing2/MuleSoo-Marketing2-365.csv`);
console.log(`  → marketing2/Posts/*.md\n`);
