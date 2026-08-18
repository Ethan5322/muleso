import type { Guide } from '../buildGuide';

export const obsidianClaudeCode: Guide = {
  title: 'Obsidian + Claude Code',
  subtitle: "The Beginner's Master Guide",
  tagline: 'A complete, click-by-click walkthrough for setting up Obsidian from zero and connecting it to a project you already built with Claude Code.',
  accent: [123, 47, 255],
  chapters: [
    {
      title: 'Before You Start',
      intro: 'This guide assumes two things: you have never used Obsidian before, and you already have a project folder on your Desktop that you have been building with Claude Code inside the VS Code extension.',
      sections: [
        {
          heading: 'What Obsidian Is',
          body: [
            'A free app for writing and organising notes in plain text (Markdown) files, stored directly on your computer — not in the cloud, not locked into a proprietary format.',
          ],
        },
        {
          heading: 'What "Connecting" Obsidian To Claude Code Really Means',
          body: [
            'There is no special plugin or login step that links the two apps together. Instead, you point Obsidian at the same folder your project lives in. Obsidian then becomes a nice way to read, write, and organise the Markdown notes and docs in that folder — and Claude Code (in VS Code) can read those same files as context when you ask it to build things. They connect through the file system, not through an account.',
          ],
        },
        {
          heading: 'Why This Matters For You',
          callout: 'Right now you likely have a CLAUDE.md or README file that Claude Code reads for project context. Obsidian gives you a much nicer way to write, expand, and link those planning notes — project specs, feature ideas, client requirements — before handing them to Claude Code to implement.',
        },
      ],
    },
    {
      title: 'Install Obsidian',
      sections: [
        {
          heading: 'Three steps to a working install',
          steps: [
            'Go to the official website: obsidian.md — always download from the official site, never a third-party mirror',
            'Click the big "Get Obsidian" / "Download" button — it auto-detects Windows, macOS, or Linux',
            'Run the installer — Windows: open the .exe and click through (finishes in under a minute, opens automatically). Mac: open the .dmg, drag Obsidian into Applications, open it from there',
          ],
        },
        {
          heading: 'First-time Mac warning',
          callout: 'If macOS says the app is from an "unidentified developer," right-click the Obsidian icon and choose Open, then confirm. You only need to do this once.',
        },
      ],
    },
    {
      title: 'Understand "Vaults" — The 2-Minute Concept',
      sections: [
        {
          heading: 'A vault is just a folder',
          body: [
            'Everything in Obsidian revolves around one idea: a vault is just a folder on your computer. There is no special file format — a vault is a normal folder containing normal .md (Markdown) text files. Obsidian simply displays that folder nicely, with linking, search, and a graph view layered on top.',
          ],
        },
        {
          heading: 'The key fact that makes the Claude Code connection possible',
          callout: 'If you make your existing Desktop project folder into an Obsidian vault, every Markdown file in that project — including ones Claude Code creates — instantly becomes a note you can open, edit, and link inside Obsidian. Nothing needs to be copied or moved.',
        },
      ],
    },
    {
      title: 'Connect Obsidian To Your Existing Project',
      intro: 'You have two solid options. Pick based on how tidy you want things.',
      sections: [
        {
          heading: 'Option A (Recommended) — A dedicated notes subfolder inside your project',
          steps: [
            'Open File Explorer (Windows) or Finder (Mac) and go to your project on the Desktop — e.g. Desktop › mulesoo-website',
            'Create a new folder inside it named notes — right-click → New → Folder. This becomes your Obsidian vault',
            'Open Obsidian and click "Open folder as vault" (one of three buttons on first launch)',
            'Browse to and select the notes folder you just created, then Select Folder / Open',
            'Obsidian opens with an empty vault — you are connected. Any .md file you create here now lives physically inside your project folder, right next to your code',
          ],
        },
        {
          heading: 'Option B — Turn the whole project folder into the vault',
          body: [
            'Good if you want every existing Markdown file (README.md, CLAUDE.md, etc.) to instantly show up as notes in Obsidian too.',
          ],
          steps: [
            'In Obsidian, click "Open folder as vault" (also reachable any time from File → Open Vault)',
            'Select your main project folder itself — e.g. Desktop › mulesoo-website',
            'Obsidian creates a hidden .obsidian settings folder inside your project — normal, it just stores app settings and will not interfere with your code',
          ],
          callout: 'Keep Git clean: if your project is a Git repo, add a line that says .obsidian/ to your .gitignore file so Obsidian\'s settings folder never gets committed or pushed.',
        },
        {
          heading: 'Which option should you pick?',
          body: [
            'Option A (notes subfolder) is the safer, tidier choice while you are learning. You can always switch to Option B later — nothing is locked in.',
          ],
        },
      ],
    },
    {
      title: 'Obsidian Basics — Your First 10 Minutes',
      sections: [
        {
          heading: 'Create and write your first note',
          steps: [
            'Click the pencil-and-paper "New note" icon in the left sidebar, or press Ctrl+N (Windows) / Cmd+N (Mac)',
            'Click the title area and type a name, e.g. Project Overview',
            'Click into the body and start typing — it saves automatically. There is no Save button to hunt for',
          ],
        },
        {
          heading: 'Organise, link, and search',
          steps: [
            'Create a folder: right-click empty space in the sidebar → New folder — name it features or client-notes',
            'Link two notes: type [[ inside any note, search for or create another note by name, press Enter — this creates a clickable link, visualised in Graph view',
            'Search everything: click the magnifying-glass icon, or press Ctrl+Shift+F, to search across every note in your vault at once',
          ],
        },
        {
          heading: 'Everything is a plain text file',
          callout: 'Every note you create is a real .md file sitting in your notes folder (or project folder, if you chose Option B). You can open, edit, or delete it in VS Code too — Obsidian and VS Code are just two different windows onto the same files.',
        },
      ],
    },
    {
      title: 'The Actual Obsidian ↔ Claude Code Workflow',
      intro: 'This is the part that ties it together. Since Obsidian and Claude Code both read and write the same files on disk, here is a practical loop you can start using today.',
      sections: [
        {
          heading: 'The daily loop',
          bullets: [
            'Write project plans, feature specs, or client requirements as notes in Obsidian — it is much nicer for thinking and linking ideas than a plain code file',
            'When a note is ready to be built, open VS Code (with the Claude Code extension) on the same project folder',
            'Tell Claude Code: "Read notes/feature-plan.md and implement the booking form it describes" — Claude Code reads that Markdown file directly from disk',
            'When Claude Code finishes a feature, ask it to write a short summary Markdown file back into your notes folder (e.g. notes/changelog.md) — it instantly appears as a note in Obsidian, no import step needed',
            'Your existing CLAUDE.md meta-template can live in the vault too, so you can edit and refine it visually in Obsidian, then let Claude Code pick up the updated version next session',
          ],
        },
        {
          heading: 'No plugin required',
          callout: 'This file-based workflow works out of the box with zero configuration — it is the recommended starting point.',
        },
      ],
    },
    {
      title: 'Optional: Going Further',
      intro: 'Once you are comfortable with the basics above, these community plugins are worth exploring — skip this chapter for now if you just want the core workflow running.',
      sections: [
        {
          heading: 'Local REST API plugin',
          body: [
            'Lets external tools (including scripts you could run from your terminal) read and write notes in your vault over a local web address, instead of only through the Obsidian app itself. Useful later if you want to automate note-creation from a script.',
          ],
        },
        {
          heading: 'Dataview plugin',
          body: [
            'Lets you build live tables and lists that pull data from across your notes — handy for a running dashboard of client projects or feature status.',
          ],
        },
        {
          heading: 'Templater plugin',
          body: [
            'Lets you create reusable note templates (e.g. a "new client intake" template) so you do not retype the same structure every time.',
          ],
        },
        {
          heading: 'To install any community plugin',
          steps: [
            'Open Settings (gear icon, bottom-left)',
            'Community plugins → Turn on community plugins (first time only)',
            'Browse → search the plugin name → Install → Enable',
          ],
        },
      ],
    },
    {
      title: 'Quick Reference Checklist',
      sections: [
        {
          heading: 'Everything in one place',
          bullets: [
            'Download Obsidian from obsidian.md and install it',
            'Create a notes folder inside your existing Desktop project (Option A) or open the whole project as the vault (Option B)',
            'In Obsidian, click "Open folder as vault" and select that folder',
            'Add .obsidian/ to .gitignore if your project uses Git',
            'Create your first note with Ctrl+N / Cmd+N',
            'Write project plans and specs in Obsidian; point Claude Code at those .md files when you are ready to build',
            'Ask Claude Code to write summaries/changelogs back into the same folder so they show up in Obsidian automatically',
          ],
        },
      ],
    },
  ],
};
