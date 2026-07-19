---
name: git-worktree
description: Create, list, migrate, remove, or prune structured Git worktrees. Use when the user wants parallel branch workspaces or needs to manage existing worktrees.
---

# Git Worktree

Read [the shared worktree workflow](../../commands/git-worktree.md) completely before acting.

Treat `$ARGUMENTS` as the user's requested operation and ignore Claude-only frontmatter. Resolve paths absolutely, verify they stay within the intended worktree area, preserve environment files safely, and obtain explicit approval before removals or migrations that can overwrite data. Use platform-native path handling on Windows, macOS, and Linux.
