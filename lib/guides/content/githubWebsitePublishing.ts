import type { Guide } from '../buildGuide';

export const githubWebsitePublishing: Guide = {
  title: 'Publish Your Website on GitHub',
  subtitle: 'Get your website online, properly, in under 30 minutes — the clean, professional way.',
  tagline: 'From files on your laptop to a live, secure website the world can visit.',
  accent: [0, 200, 255],
  chapters: [
    {
      title: 'Why GitHub',
      intro: 'GitHub is where professionals store, version and publish their websites. It is free, reliable, and connects to hosting that puts your site online automatically. Learn this once and you will never fear “going live” again.',
      sections: [
        {
          heading: 'What you get',
          bullets: [
            'A safe backup of every version of your site',
            'Free, professional hosting (GitHub Pages or Vercel/Netlify)',
            'Automatic updates every time you push changes',
            'A shareable, secure (HTTPS) link — or your own domain',
          ],
        },
      ],
    },
    {
      title: 'Git in Plain English',
      sections: [
        {
          heading: 'The only concepts you need',
          bullets: [
            'Repository (repo): a folder GitHub tracks',
            'Commit: a saved snapshot of your changes',
            'Push: send your commits up to GitHub',
            'Pull: bring the latest version down',
          ],
          callout: 'Think of commits as save points in a game. If anything breaks, you can always return to a working version — that safety net is the whole point.',
        },
        {
          heading: 'Set up once',
          steps: [
            'Create a free GitHub account',
            'Install Git on your computer',
            'Set your name and email in Git',
            'Install VS Code (it has Git built in)',
          ],
        },
      ],
    },
    {
      title: 'Create Your Repo',
      sections: [
        {
          heading: 'Two easy ways',
          steps: [
            'On GitHub, click “New repository” and name it',
            'Keep it public (needed for free GitHub Pages)',
            'Copy the repository link it gives you',
            'Or, in VS Code, use “Publish to GitHub” in one click',
          ],
        },
      ],
    },
    {
      title: 'Push Your Site',
      sections: [
        {
          heading: 'Your first upload',
          steps: [
            'Open your website folder in VS Code',
            'Initialise Git (Source Control panel → Initialise)',
            'Stage all files, write a message, and commit',
            'Connect the remote (your repo link)',
            'Push — your files now live on GitHub',
          ],
        },
        {
          heading: 'A tidy repo',
          body: [
            'Add a .gitignore so junk (like node_modules) is not uploaded, and a short README describing the site. Small habits that make you look professional.',
          ],
        },
      ],
    },
    {
      title: 'Go Live',
      sections: [
        {
          heading: 'Option A — GitHub Pages (static sites)',
          steps: [
            'In the repo, open Settings → Pages',
            'Choose your main branch as the source',
            'Wait a minute — GitHub gives you a live link',
            'Your site is now online, free, with HTTPS',
          ],
        },
        {
          heading: 'Option B — Vercel / Netlify (modern apps)',
          steps: [
            'Sign in to Vercel or Netlify with GitHub',
            'Import your repository',
            'It builds and deploys automatically',
            'Every future push re-deploys the site for you',
          ],
          callout: 'For Next.js and other modern frameworks, use Vercel or Netlify — they handle the build. GitHub Pages is perfect for plain HTML/CSS sites.',
        },
      ],
    },
    {
      title: 'Your Custom Domain',
      sections: [
        {
          heading: 'Look professional',
          steps: [
            'Buy a domain (.com or .co.za) from any registrar',
            'In your host’s settings, add the custom domain',
            'Update the domain’s DNS records as instructed',
            'Wait for it to verify, then enable HTTPS',
          ],
        },
      ],
    },
    {
      title: 'Updates & Version Control',
      sections: [
        {
          heading: 'The daily rhythm',
          steps: [
            'Make your changes locally',
            'Commit with a short, clear message',
            'Push — the live site updates automatically',
            'If something breaks, revert to a previous commit',
          ],
          callout: 'Commit small and often. A dozen tidy commits are easier to manage — and to undo — than one giant one.',
        },
      ],
    },
    {
      title: 'Go-Live Checklist',
      sections: [
        {
          heading: 'Before you share the link',
          bullets: [
            'HTTPS padlock is showing',
            'Every page loads and looks right on mobile',
            'Links and the contact form actually work',
            'Page titles and descriptions are set (SEO)',
            'A backup exists — it does, because it is on GitHub',
          ],
        },
      ],
    },
  ],
};
