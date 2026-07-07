/* Generates a beginner-friendly PDF: domain → connect → free email → Google.
   Run: node scripts/guides/build-setup-guide.cjs  */
const { jsPDF } = require('jspdf');
const path = require('path');

const BLUE = [0, 200, 255], PURPLE = [123, 47, 255], GOLD = [232, 184, 75];
const INK = [24, 30, 46], BODY = [55, 62, 80], MUTED = [120, 132, 155], GREEN = [0, 160, 90];

const guide = {
  title: 'Your Domain, Email & Google',
  subtitle: 'From buying a domain to appearing on Google search — the complete beginner’s guide.',
  tagline: 'Follow it step by step. No tech experience needed.',
  chapters: [
    {
      title: 'The Big Picture',
      intro: 'You are about to turn your website into a real, professional online business. There are four simple stages. Do them in order and you cannot get lost.',
      sections: [
        { heading: 'The four stages', steps: [
          'Buy your domain (your web address, e.g. mulesoo.com)',
          'Connect the domain to your website so it goes live',
          'Set up a free professional email (you@yourdomain.com)',
          'Put your website on Google so people can find you',
        ]},
        { heading: 'What you will need', bullets: [
          'Your Vercel account (where your website already lives)',
          'A card to buy the domain (roughly R200–R350 per year)',
          'About 45–60 minutes of quiet time',
          'A phone or laptop — that is all',
        ]},
        { callout: 'Tip: do this on a laptop if you can. It is easier to copy and paste settings than on a phone.' },
      ],
    },
    {
      title: 'Stage 1 — Buy Your Domain on Vercel',
      intro: 'A domain is your address on the internet. Buying it through Vercel is the easiest path because Vercel then connects it for you automatically.',
      sections: [
        { heading: 'Step by step', steps: [
          'Go to vercel.com and log in.',
          'Open your MuleSoo project.',
          'In the top menu, click "Domains" (or Settings → Domains).',
          'In the search box, type the name you want, e.g. "mulesoo.com".',
          'Vercel shows which names are available and the yearly price.',
          'Pick the one you want (a .com or a South African .co.za is ideal).',
          'Click "Buy", enter your card details, and confirm.',
          'Done — the domain is now yours and already linked to your project.',
        ]},
        { heading: 'Choosing a good domain', bullets: [
          'Short and easy to spell (people must type it)',
          'Prefer .com — it is the most trusted worldwide',
          '.co.za is great if your customers are South African',
          'Match your brand exactly (mulesoo.com, not mule-soo-digital.com)',
          'Avoid numbers, hyphens and clever spellings',
        ]},
        { callout: 'A domain is a yearly cost, not once-off. Turn ON auto-renew so you never lose it.' },
      ],
    },
    {
      title: 'Stage 2 — Connect the Domain (Go Live)',
      intro: 'Because you bought the domain through Vercel, most of this is automatic. You are just confirming everything is switched on.',
      sections: [
        { heading: 'Step by step', steps: [
          'In your project, open "Domains" again — your new domain is listed.',
          'If it is not attached, click "Add" and type your domain, then Add.',
          'Set it as the primary domain (so your site opens there by default).',
          'Add the "www" version too and let Vercel redirect it to the main one.',
          'Wait until you see "Valid Configuration" (green) — usually a few minutes.',
          'Open your domain in a browser. Your website should load.',
          'Check for the padlock 🔒 next to the address — that means HTTPS (secure).',
        ]},
        { heading: 'What those words mean (plain English)', body: [
          'DNS is the internet’s phone book — it tells browsers where your website lives. Vercel fills it in for you.',
          'SSL / HTTPS is the padlock that makes your site secure and trusted. Vercel turns it on automatically and for free.',
        ]},
        { callout: 'If the site does not load right away, wait 10–60 minutes and refresh. New domains take a little time to spread across the internet.' },
      ],
    },
    {
      title: 'Stage 3 — Free Professional Email',
      intro: 'A personal Gmail makes a business look small. you@yourdomain.com makes you look established — and you can get it FREE.',
      sections: [
        { heading: 'The best free tool: Zoho Mail', body: [
          'Zoho Mail has a genuinely free "Forever Free" plan: a real inbox at your own domain (send and receive), for up to 5 people, that works with a domain bought on Vercel.',
          'You will do two things: prove you own the domain, and point your domain’s mail to Zoho. Both are done by adding a few small records in Vercel.',
        ]},
        { heading: 'Set it up, step by step', steps: [
          'Go to zoho.com/mail and click "Sign Up Free" — choose the Forever Free plan.',
          'Choose "Sign up with a domain you already own" and enter your domain.',
          'Zoho gives you a TXT record to verify ownership. Keep that tab open.',
          'In Vercel: open Domains → your domain → "DNS Records" → "Add".',
          'Add the TXT record from Zoho (copy the name and value exactly), Save.',
          'Back in Zoho, click "Verify" — it confirms you own the domain.',
          'Create your mailbox, e.g. hello@yourdomain.com or info@yourdomain.com.',
          'Zoho now shows MX records. In Vercel DNS, add each MX record it lists.',
          'Also add the SPF and DKIM (TXT) records Zoho gives you — these keep your emails out of spam.',
          'Wait a few minutes, then log in at mail.zoho.com (or the Zoho Mail app).',
          'Send a test email to your Gmail, and reply back, to confirm both directions work.',
        ]},
        { heading: 'Where to add records in Vercel', body: [
          'Vercel dashboard → your project → Domains → click your domain → "DNS Records" → "Add Record". Pick the type (TXT / MX), paste the Name and Value from Zoho, and Save. Add them one at a time.',
        ]},
        { heading: 'Free alternative (forwarding only)', body: [
          'If you only want to RECEIVE mail at your domain and keep sending from Gmail, Cloudflare Email Routing is free — but it needs your domain’s DNS moved to Cloudflare. For a full inbox with the least fuss on a Vercel domain, Zoho Mail is the simpler choice.',
        ]},
        { callout: 'After your email works, put it on your website: Admin → Site Content → Business email → paste the new address → Save. Now your whole site shows the professional email.' },
      ],
    },
    {
      title: 'Stage 4 — Appear on Google',
      intro: 'Google will not show a site it does not know about. You simply introduce your site to Google once, and it starts listing you.',
      sections: [
        { heading: 'Verify your site in Google Search Console', steps: [
          'Go to search.google.com/search-console and sign in with a Google account.',
          'Click "Add property" → choose "URL prefix".',
          'Type your full site address, e.g. https://yourdomain.com, and Continue.',
          'Choose the "HTML tag" verification method.',
          'It shows a code that looks like content="abc123...". Copy just the code inside the quotes.',
          'In Vercel: your project → Settings → Environment Variables.',
          'Add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION and paste that code as the value. Save.',
          'Redeploy the site (Deployments → ⋯ → Redeploy) so the code goes live.',
          'Back in Search Console, click "Verify". It should say Ownership verified.',
        ]},
        { heading: 'Submit your sitemap', body: [
          'A sitemap is a list of every page on your site — your site already builds one automatically.',
        ], steps: [
          'In Search Console, open "Sitemaps" (left menu).',
          'Type: sitemap.xml',
          'Click Submit. Google now knows all ~200+ of your pages.',
        ]},
        { heading: 'Ask Google to index your homepage', steps: [
          'In Search Console, paste your homepage URL into the top search bar ("Inspect any URL").',
          'Click "Request Indexing".',
          'Repeat for your most important pages (Services, Store, Contact).',
        ]},
        { heading: 'How long until you show up?', body: [
          'Searching your exact brand name ("MuleSoo") usually appears within a few days.',
          'Ranking for competitive searches ("web design Pretoria") takes weeks to months, and improves as you add content, get reviews, and earn links.',
        ]},
        { callout: 'Bonus: create a free Google Business Profile (business.google.com). It puts you on Google Maps and in local searches like "web design near me" — huge for local clients.' },
      ],
    },
    {
      title: 'Final Checklist & Staying Visible',
      sections: [
        { heading: 'Tick these off', bullets: [
          'Domain opens your website, with the padlock 🔒 (HTTPS)',
          '"www" version redirects to the main domain',
          'Professional email sends AND receives (you tested both)',
          'The new email is updated on your website (Admin → Site Content)',
          'Search Console says "Ownership verified"',
          'Sitemap submitted (sitemap.xml)',
          'Homepage "Request Indexing" done',
          'Domain auto-renew is ON',
        ]},
        { heading: 'Keep climbing on Google', bullets: [
          'Add fresh content regularly (portfolio pieces, guides, updates)',
          'Collect real Google reviews from happy clients',
          'Get other sites to link to you (partners, directories, socials)',
          'Keep the site fast and mobile-friendly (yours already is)',
        ]},
        { callout: 'Patience wins. Do the four stages once, keep adding real content, and Google rewards you steadily over time.' },
      ],
    },
  ],
};

// ---- render (self-contained) ----
function build() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
  const M = 20, CW = W - 2 * M;
  const T = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const F = (c) => doc.setFillColor(c[0], c[1], c[2]);

  // Cover
  F(INK); doc.rect(0, 0, W, H, 'F');
  const sl = 40;
  for (let i = 0; i < sl; i++) { const t = i / (sl - 1);
    doc.setFillColor(Math.round(BLUE[0]+(PURPLE[0]-BLUE[0])*t), Math.round(BLUE[1]+(PURPLE[1]-BLUE[1])*t), Math.round(BLUE[2]+(PURPLE[2]-BLUE[2])*t));
    doc.rect((W/sl)*i, 0, W/sl+0.5, 6, 'F'); doc.rect((W/sl)*i, H-6, W/sl+0.5, 6, 'F'); }
  doc.setFont('helvetica','bold'); doc.setFontSize(11); T(GOLD); doc.text('MULESOO DIGITAL SERVICES', M, 42);
  doc.setDrawColor(GOLD[0],GOLD[1],GOLD[2]); doc.setLineWidth(0.6); doc.line(M, 46, M+40, 46);
  doc.setFontSize(40); T([240,243,250]);
  let ty = 96; doc.splitTextToSize(guide.title, CW).forEach((l)=>{doc.text(l,M,ty); ty+=16;});
  doc.setFont('helvetica','normal'); doc.setFontSize(15); T(BLUE); ty+=4;
  doc.splitTextToSize(guide.subtitle, CW).forEach((l)=>{doc.text(l,M,ty); ty+=8;});
  doc.setFont('helvetica','italic'); doc.setFontSize(12); T(MUTED); ty+=6;
  doc.splitTextToSize(guide.tagline, CW).forEach((l)=>{doc.text(l,M,ty); ty+=6.5;});
  doc.setFont('helvetica','bold'); doc.setFontSize(12); T([240,243,250]); doc.text('A MuleSoo Beginner Guide', M, H-24);
  doc.setFont('helvetica','normal'); doc.setFontSize(9); T(MUTED); doc.text('Pretoria, South Africa', M, H-18);

  let y = M;
  const ensure = (n)=>{ if (y+n > H-22){ doc.addPage(); y=M; } };
  const para = (txt,size=10.5,color=BODY,gap=4.7)=>{ doc.setFont('helvetica','normal'); doc.setFontSize(size); T(color);
    doc.splitTextToSize(txt, CW).forEach((l)=>{ ensure(gap); doc.text(l,M,y); y+=gap; }); };

  // TOC
  doc.addPage(); y = M+4; doc.setFont('helvetica','bold'); doc.setFontSize(22); T(INK); doc.text('Contents', M, y); y+=12;
  guide.chapters.forEach((ch,i)=>{ ensure(8); doc.setFont('helvetica','bold'); doc.setFontSize(11); T(BLUE); doc.text(`${i+1}.`, M, y);
    doc.setFont('helvetica','normal'); T(INK); doc.text(ch.title, M+8, y); y+=7.5; });

  // Chapters
  guide.chapters.forEach((ch,i)=>{
    doc.addPage(); y=M; F(BLUE); doc.rect(0,0,W,3,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(10); T(BLUE); doc.text(`STAGE ${i+1}`, M, y+4); y+=12;
    doc.setFont('helvetica','bold'); doc.setFontSize(20); T(INK);
    doc.splitTextToSize(ch.title, CW).forEach((l)=>{ doc.text(l,M,y); y+=9; }); y+=2;
    if (ch.intro){ para(ch.intro, 11, MUTED, 5); y+=3; }
    ch.sections.forEach((sec)=>{
      if (sec.heading){ ensure(12); y+=3; doc.setFont('helvetica','bold'); doc.setFontSize(13); T(BLUE);
        doc.splitTextToSize(sec.heading, CW).forEach((l)=>{ ensure(6.5); doc.text(l,M,y); y+=6.5; }); y+=1; }
      (sec.body||[]).forEach((p)=>{ para(p); y+=2.5; });
      (sec.bullets||[]).forEach((b)=>{ ensure(5.4); doc.setFont('helvetica','bold'); doc.setFontSize(10.5); T(GREEN); doc.text('•', M, y);
        doc.setFont('helvetica','normal'); T(BODY); doc.splitTextToSize(b, CW-7).forEach((l,idx)=>{ if(idx>0) ensure(4.6); doc.text(l,M+6,y); y+=4.6; }); y+=1.4; });
      (sec.steps||[]).forEach((s,si)=>{ ensure(5.4); doc.setFont('helvetica','bold'); doc.setFontSize(10.5); T(BLUE); doc.text(`${si+1}.`, M, y);
        doc.setFont('helvetica','normal'); T(BODY); doc.splitTextToSize(s, CW-9).forEach((l,idx)=>{ if(idx>0) ensure(4.6); doc.text(l,M+9,y); y+=4.6; }); y+=1.6; });
      if (sec.callout){ const lines = doc.splitTextToSize(sec.callout, CW-12); const bh = lines.length*4.8+10; ensure(bh+3);
        F([255,251,240]); doc.setDrawColor(GOLD[0],GOLD[1],GOLD[2]); doc.setLineWidth(0.4); doc.roundedRect(M, y-1, CW, bh, 2,2,'FD');
        doc.setFont('helvetica','bold'); doc.setFontSize(9); T(GOLD); doc.text('TIP', M+5, y+5);
        doc.setFont('helvetica','normal'); doc.setFontSize(9.5); T([90,80,40]); let cy=y+5; lines.forEach((l)=>{ doc.text(l, M+16, cy); cy+=4.8; }); y+=bh+4; }
    });
  });

  // footers
  const pages = doc.getNumberOfPages();
  for (let p=2;p<=pages;p++){ doc.setPage(p); doc.setDrawColor(228,233,244); doc.setLineWidth(0.3); doc.line(M, H-14, W-M, H-14);
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); T(MUTED); doc.text('MuleSoo Digital Services — Setup Guide', M, H-9.5); doc.text(`${p-1}`, W-M, H-9.5, {align:'right'}); }

  const out = path.join(process.cwd(), 'MuleSoo-Domain-Email-Google-Guide.pdf');
  require('fs').writeFileSync(out, Buffer.from(doc.output('arraybuffer')));
  console.log('Saved:', out, '(' + pages + ' pages)');
}
build();
