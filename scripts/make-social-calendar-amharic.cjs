/* MuleSoo — የአማርኛ ማህበራዊ ሚዲያ መርሃ ግብር (365 days × 5 platforms).
 *
 * The Amharic sibling of make-social-calendar.cjs. Same architecture — a
 * hand-written pool (scripts/amharic-calendar/content.cjs) rotated across the
 * year with the same 7-pillar weekly rhythm — but the copy is written directly
 * in Amharic, not translated. The English edition is untouched.
 *
 * Run: node scripts/make-social-calendar-amharic.cjs
 * Out: marketing/Social-Calendar-Amharic/  (master CSV + one MD per platform)
 */
const fs = require('fs');
const path = require('path');
const { PROBLEMS, LESSONS, MYTHS, BEHIND, PROMO, HUMAN, PROOF, CTAS, TAGS } = require('./amharic-calendar/content.cjs');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'marketing', 'Social-Calendar-Amharic');
fs.mkdirSync(OUT, { recursive: true });

const YEAR = 2026;
const DAYS = 365;

const PLATFORMS = [
  { key: 'linkedin', name: 'LinkedIn', maxLen: 1200, emoji: false, tags: 3 },
  { key: 'instagram', name: 'Instagram', maxLen: 800, emoji: true, tags: 7 },
  { key: 'facebook', name: 'Facebook', maxLen: 800, emoji: true, tags: 3 },
  { key: 'tiktok', name: 'TikTok', maxLen: 2200, emoji: true, tags: 5, short: true },
  { key: 'x', name: 'X', maxLen: 260, emoji: false, tags: 2 },
];

// Same weekly rhythm as the English calendar — day 1 is PROBLEM, day 3 PROOF.
const PILLARS = ['PROBLEM', 'EDUCATE', 'PROOF', 'MYTH', 'BEHIND', 'PROMO', 'HUMAN'];
const POOLS = { PROBLEM: PROBLEMS, EDUCATE: LESSONS, MYTH: MYTHS, BEHIND: BEHIND, PROMO: PROMO, HUMAN: HUMAN };

const stripEmoji = (s) =>
  s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').replace(/[ \t]+\n/g, '\n').replace(/  +/g, ' ').trim();

const firstSentence = (s) => {
  const m = s.match(/^.+?[።!?]/u);
  return m ? m[0] : s;
};

function compose(pillar, platform, occurrence, dayNum) {
  let hook, body;
  if (pillar === 'PROOF') {
    hook = PROOF.hook;
    body = PROOF.body;
  } else {
    const pool = POOLS[pillar];
    const idx = (occurrence + PLATFORMS.findIndex((p) => p.key === platform.key) * 2) % pool.length;
    [hook, body] = pool[idx];
  }

  const cta = CTAS[(dayNum + PLATFORMS.findIndex((p) => p.key === platform.key)) % CTAS.length];
  const tags = [...TAGS.core, ...TAGS.extra].slice(0, platform.tags).join(' ');

  let text;
  if (platform.key === 'x') {
    // 260 chars: hook + body if it fits, else hook alone; site + two tags.
    const tail = `\n\nmulesoo.com ${tags}`;
    text = `${hook}\n${body}${tail}`;
    if ([...text].length > platform.maxLen) text = `${hook}\n${firstSentence(body)}${tail}`;
    if ([...text].length > platform.maxLen) text = `${hook}${tail}`;
  } else if (platform.short) {
    // TikTok: caption is read aloud over the video — keep it tight.
    text = `${hook}\n${firstSentence(body)}\n\nሙሉውን በመገለጫችን ሊንክ ያገኙታል።\n\n${tags}`;
  } else {
    text = `${hook}\n\n${body}\n\n${cta}\n\n${tags}`;
  }

  if (!platform.emoji) text = stripEmoji(text);
  return text;
}

// ── Build the year ───────────────────────────────────────────────────────────
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const rows = [];
for (let day = 1; day <= DAYS; day++) {
  const date = new Date(Date.UTC(YEAR, 0, day));
  const iso = date.toISOString().slice(0, 10);
  const pillar = PILLARS[(day - 1) % 7];
  const occurrence = Math.floor((day - 1) / 7);

  for (const platform of PLATFORMS) {
    const text = compose(pillar, platform, occurrence, day);
    const chars = [...text].length;
    rows.push({
      date: iso,
      dow: DOW[date.getUTCDay()],
      day,
      platform: platform.name,
      pillar,
      needsRealResult: pillar === 'PROOF' ? 'yes' : '',
      chars,
      overLimit: chars > platform.maxLen ? 'OVER' : '',
      text,
    });
  }
}

const over = rows.filter((r) => r.overLimit);
if (over.length) {
  console.error(`OVER LIMIT: ${over.length} posts exceed their platform cap — first: day ${over[0].day} ${over[0].platform} (${over[0].chars})`);
  process.exit(1);
}

// ── Master CSV ───────────────────────────────────────────────────────────────
const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;
fs.writeFileSync(
  path.join(OUT, 'MuleSoo-Social-Calendar-Amharic-365.csv'),
  ['date,day_of_week,day_number,platform,pillar,needs_real_result,characters,over_limit,post_text']
    .concat(rows.map((r) => [r.date, r.dow, r.day, r.platform, r.pillar, r.needsRealResult, r.chars, r.overLimit, r.text].map(csvCell).join(',')))
    .join('\n')
);

// ── One markdown per platform ────────────────────────────────────────────────
for (const platform of PLATFORMS) {
  const mine = rows.filter((r) => r.platform === platform.name);
  const md = [
    `# MuleSoo — ${platform.name}: 365 ቀናት (አማርኛ)`,
    '',
    `**\`PROOF\` ምልክት ያለባቸው ቀናት አብነቶች ናቸው።** ከመለጠፉ በፊት በቅንፍ ውስጥ ያለውን መስመር በእውነተኛ የደንበኛ ውጤት ይተኩ። በጭራሽ አይፍጠሩ።`,
    '',
    '---',
    '',
    ...mine.map((r) =>
      [`### ቀን ${r.day} — ${r.date} (${r.dow}) · ${r.pillar}`, '', '```', r.text, '```', ''].join('\n')
    ),
  ].join('\n');
  fs.writeFileSync(path.join(OUT, `${platform.name}-365-Amharic.md`), md);
}

console.log(`posts: ${rows.length}  (${DAYS} days × ${PLATFORMS.length} platforms)`);
for (const p of PLATFORMS) {
  const mine = rows.filter((r) => r.platform === p.name);
  const max = Math.max(...mine.map((r) => r.chars));
  console.log(`  ${p.name.padEnd(10)} max ${String(max).padStart(4)} chars (cap ${p.maxLen})`);
}
console.log(`→ marketing/Social-Calendar-Amharic/`);
