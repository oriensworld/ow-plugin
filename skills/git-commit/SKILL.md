---
name: git-commit
description: Analyze repository changes, suggest atomic grouping, write conventional commit messages, and create Git commits. Use when the user asks to inspect changes, prepare a commit, or commit work.
---

# Git Commit

Read [the shared Git commit workflow](../../commands/git-commit.md) completely before acting.

Treat `$ARGUMENTS` as the user's requested options and ignore Claude-only frontmatter. Preserve unrelated user changes, inspect staged and unstaged changes before committing, and never amend, bypass hooks, sign off, or stage everything unless the user requested it. Follow the host's approval and safety rules.
