---
name: git-clean-branches
description: Find merged or stale Git branches and clean them with protected-branch safeguards. Use when the user wants to audit, preview, or delete local or remote branches.
---

# Clean Git Branches

Read [the shared branch-cleanup workflow](../../commands/git-cleanBranches.md) completely before acting.

Treat `$ARGUMENTS` as the user's requested options and ignore Claude-only frontmatter. Default to a read-only preview. Do not delete local or remote branches without explicit authorization, and re-check the exact branch list immediately before deletion. Follow the host's destructive-action and approval rules even when the shared workflow is less restrictive.
