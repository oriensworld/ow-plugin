---
name: init-project
description: Inventory a repository and generate layered AI-facing project and module documentation. Use when initializing or refreshing repository context, architecture indexes, module maps, and coverage reports.
---

# Initialize Project Context

Read [the shared initialization workflow](../../commands/init-project.md) completely before acting.

Treat `$ARGUMENTS` as the project summary and ignore Claude-only frontmatter. Use `get-current-datetime` and `init-architect` when available. On Claude, write `CLAUDE.md` and `.claude/index.json`; on Codex, write `AGENTS.md` and `.codex/index.json`. Do not modify source code. Preserve existing guidance and update it incrementally.
