import type { Guide } from '../buildGuide';

export const claudeCodeMcpMaster: Guide = {
  title: 'Claude Code MCP Master Guide',
  subtitle: 'Supercharge Claude Code with MCP — connect tools, data and automations like a pro.',
  tagline: 'Turn your AI assistant into a connected powerhouse that acts, not just talks.',
  accent: [0, 255, 136],
  chapters: [
    {
      title: 'What Is MCP?',
      intro: 'MCP — the Model Context Protocol — is how AI assistants safely connect to the outside world: your files, databases, APIs and tools. Master it, and Claude Code stops guessing and starts doing.',
      sections: [
        {
          heading: 'The simple idea',
          body: [
            'On its own, an AI can only talk. MCP gives it hands: a standard way to plug in “servers” that let it read your data, call your tools, and take real actions — all through one consistent protocol.',
            'Think of MCP as a universal adapter. Instead of custom wiring for every tool, everything speaks the same language, so adding a new capability is plug-and-play.',
          ],
        },
        {
          heading: 'Why it matters',
          bullets: [
            'Give the AI live access to your data and tools',
            'Automate real tasks, not just draft text',
            'Reuse the same connectors across projects',
            'Keep control: you decide exactly what it can touch',
          ],
        },
      ],
    },
    {
      title: 'How MCP Works',
      sections: [
        {
          heading: 'The three pieces',
          bullets: [
            'Host: the app running the AI (e.g. Claude Code)',
            'Client: the connection the host opens to a server',
            'Server: the tool that exposes data or actions (files, database, API…)',
          ],
        },
        {
          heading: 'What a server offers',
          body: [
            'An MCP server can expose tools (actions the AI can call), resources (data it can read), and prompts (ready-made instructions). The AI discovers these automatically and uses them when helpful.',
          ],
          callout: 'You never hand the AI raw keys. The server sits in the middle and only exposes the specific actions you allow — that boundary is what keeps it safe.',
        },
      ],
    },
    {
      title: 'Set Up Your First Server',
      sections: [
        {
          heading: 'Step by step',
          steps: [
            'Pick a ready-made server (filesystem, GitHub, database…)',
            'Add it to your Claude Code MCP configuration',
            'Provide only the access it needs (a folder, a token)',
            'Restart and confirm the new tools appear',
            'Ask Claude Code to use one — e.g. “list my project files”',
          ],
        },
        {
          heading: 'Start small',
          body: [
            'Begin with the filesystem server so the AI can read and edit your project directly. Once that feels natural, add one more connector at a time.',
          ],
        },
      ],
    },
    {
      title: 'Connect Tools & Data',
      sections: [
        {
          heading: 'High-value connectors',
          bullets: [
            'Filesystem — read and edit your project',
            'GitHub — issues, pull requests, repos',
            'Database (Postgres/Supabase) — query real data',
            'Web fetch/search — pull in live information',
            'Your own API — trigger actions in your app',
          ],
        },
        {
          heading: 'Combine them',
          body: [
            'The magic is in chaining: read a database record, generate a document, then commit it to GitHub — all in one instruction. Connected tools let the AI complete whole workflows, not single steps.',
          ],
        },
      ],
    },
    {
      title: 'Real Workflows',
      sections: [
        {
          heading: 'Examples you can copy',
          bullets: [
            '“Summarise today’s new database signups and email me a report”',
            '“Open a GitHub issue for every TODO in the codebase”',
            '“Fetch these docs and rewrite our FAQ page”',
            '“Generate invoices from this month’s orders”',
          ],
          callout: 'Write workflows as plain outcomes. The clearer the goal, the better the AI chooses which connected tools to use to reach it.',
        },
      ],
    },
    {
      title: 'Build Your Own Server',
      sections: [
        {
          heading: 'When to build one',
          body: [
            'When no existing connector fits — for example, your own booking system or CRM — you can build a small MCP server that exposes exactly the actions you want the AI to perform.',
          ],
        },
        {
          heading: 'The essentials',
          steps: [
            'Define the tools (name, description, inputs)',
            'Implement each tool as a simple function',
            'Return clear, structured results',
            'Expose read-only resources where useful',
            'Test with the AI and tighten the descriptions',
          ],
        },
      ],
    },
    {
      title: 'Security & Best Practices',
      sections: [
        {
          heading: 'Stay safe',
          bullets: [
            'Grant the least access needed — a folder, not the whole disk',
            'Use scoped tokens you can revoke',
            'Keep destructive actions behind explicit confirmation',
            'Log what the AI does through each server',
            'Never expose secrets in tool outputs',
          ],
        },
      ],
    },
    {
      title: 'Level Up',
      intro: 'MCP turns Claude Code from a clever assistant into an operator that works inside your real systems. Master a few connectors and you can automate hours of work a day.',
      sections: [
        {
          heading: 'Your next moves',
          bullets: [
            'Add one connector this week and build one real workflow',
            'Template your favourite workflows as reusable prompts',
            'Package a custom server for your own product',
            'Offer MCP automation as a paid service to clients',
          ],
          callout: 'Businesses will pay well for someone who can wire AI into their real tools. MCP is that skill — and you now have the map.',
        },
      ],
    },
  ],
};
