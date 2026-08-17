---
title: Separated Projects
type: reference
status: active
tags: [reference, projects]
---

# Separated Projects

Four codebases that used to sit inside the `mulesoo` folder by accident of
layout, not because they are part of MuleSoo. Each is its own client project
with its own dependencies and must never be graphed, extracted, or built
together with MuleSoo — doing so only manufactures disconnected islands in the
knowledge graph, since none of them relate to MuleSoo's code.

| Project | Location |
|---|---|
| Yoyo Gym | `Desktop/Yoyo GYM/` |
| Shime Events | `Desktop/shime/` |
| Tsedi Catering | `Desktop/tsedi/` |
| Wogen | `Desktop/wogen/` |

All four were confirmed present and intact on the Desktop, separate from this
repository. `mulesoo`'s own git history was cleaned of four stale tracked
files (`tsedi/CLAUDE.md`, `tsedi/claude md`, `wogen/CLAUDE.md.pdf`,
`wogen/claude-md-extracted.txt`) that were leftovers from before the move.

MuleSoo's `.graphifyignore` explicitly excludes all four by name, along with
`sena/`, `yewogen-derash/`, `orthodox/` and `photographer/` — other
independent projects in the same parent folder.

Each of these projects, if it needs its own knowledge graph, gets its own
`/graphify .` run from inside its own folder.

## Related

- [[Issues MOC]]

---
Back to [[Issues MOC]]
