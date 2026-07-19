---
name: git-rollback
description: Inspect Git history and prepare or execute a safe branch rollback using revert or reset. Use when the user asks to return a branch to an earlier commit, tag, or reflog state.
---

# Git Rollback

Read [the shared rollback workflow](../../commands/git-rollback.md) completely before acting.

Treat `$ARGUMENTS` as the user's requested options and ignore Claude-only frontmatter. Default to dry-run analysis and prefer `git revert` for shared history. A reset, checkout that discards work, or force push requires explicit authorization and exact target verification under the host's destructive-action rules.
