# MuleSoo — Marketing 2

A second, self-contained marketing system. **It does not touch `marketing/`** — that folder and
its 365-day agency calendar are untouched and still valid. The two run side by side.

**What makes this one different:** every single post names a real project. `marketing/` sells the
agency's thinking; this one sells the twelve systems we have actually built, each with its live URL.
And every daily image carries the founder's portrait in a circular frame, so the post reads as a
person speaking rather than a brand announcing.

---

## What is in here

| Path | What it is |
|---|---|
| `MuleSoo-Marketing2-Playbook.pdf` | **The document to hand to people.** Portfolio and marketing plan in one: the twelve systems, what each does, what it costs in Rand, and the posting routine. |
| `PDF/` | Twelve monthly PDFs. Each day shows **the picture beside the caption** for all five platforms. This is the file you actually work from. |
| `Images/YYYY-MM/` | 365 designed 1080×1080 post cards, one per day, with the founder's circular portrait. ~40 MB total. |
| `Posts/*.md` | The same 1,825 captions as plain markdown, one file per platform, for copy-paste. |
| `MuleSoo-Marketing2-365.csv` | The master file. Import into Buffer, Later, Metricool or a spreadsheet. |

Calendar runs **1 September 2026 → 31 August 2027**. 365 days × 5 platforms = **1,825 posts**.

---

## The daily routine

1. Open this month's PDF in `PDF/` and find today.
2. Post the picture shown on that page — its file name is printed underneath, and the same image
   is in `Images/`, sorted by month.
3. Copy the caption for the platform you are on. It is already the right length for that platform.
4. Publish, then reply to every comment within the hour. That is where the actual work is.

Four minutes a day.

---

## The twelve projects

Each appears roughly every twelve days, cycled through seven post types so nothing repeats.

| Project | Status | Live at |
|---|---|---|
| MuleSoo Digital Services | live | mulesoo.com |
| Habesha Celebration Events | live | habeshaeventsplanner.netlify.app |
| YoYo Gym — AI Membership Platform | live | yoyogym.vercel.app |
| X-Boss Photography Studio | live | xbossphotography.vercel.app |
| Shime Events & Planning | live | shimeeventplaning.vercel.app |
| Tsedi Catering & Events | live | tsedicatering.vercel.app |
| TSI AI Booking Assistant | live | mulesoo.com/services/chatbot |
| Pretoria Kidane Mihret Church Platform | live | mulesoo.com/portfolio |
| MuleSoo Guides & Digital Store | live | mulesoo.com/store |
| Sena — AI Front Desk Receptionist | **in build** | — |
| Yewogen Derash (ወገን ደራሽ) | **in build** | — |
| DR. Hospital — AI Clinic System | **in build** | — |

---

## The two rules

**No invented numbers.** There is not one fabricated statistic anywhere in this system — no
"+300% bookings", no "47 happy clients". Every claim is a capability a reader can verify by
opening the live site. An agency caught inflating one number loses the credibility of the other
eleven projects with it.

**In-build means in build.** Sena, Yewogen Derash and DR. Hospital are flagged `IN BUILD`
everywhere they appear. Never post them as launched. "We are building this — early partners
welcome" outperforms a fake launch, and it is the only version you can defend when somebody asks
for a live link.

---

## Rebuilding

Order matters — the images read the CSV, and the PDFs read both.

```bash
node scripts/make-marketing2-calendar.cjs      # CSV + Posts/*.md      (instant)
node scripts/make-marketing2-images.cjs        # 365 cards             (~4 min)
node scripts/make-marketing2-pdf.cjs           # 12 monthly PDFs       (~2 min)
node scripts/make-marketing2-playbook.cjs      # the playbook PDF      (~20 s)
```

All project copy lives in one place: **`scripts/marketing2-projects.cjs`**. Edit a project there
and both the posts and the playbook update together — they cannot drift apart.

Useful flags:

- `--start 2027-01-01` on the calendar to move the whole year.
- `--limit 5` on the images to proof the design without waiting out 365 renders.
- `--preview` on either PDF script to write a PNG of the layout, since a layout fault in a PDF is
  invisible until somebody opens it.

Both PDF scripts need Chrome (set `CHROME_PATH` if it is not in the usual place) and the brand
fonts in `assets/fonts/`. The portrait is `assets/founder/founder-portrait.jpg` — swap that file
to change the face on all 365 cards.
