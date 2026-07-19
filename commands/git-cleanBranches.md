---
description: Safely find and clean merged or stale Git branches, with dry-run mode and custom base/protected branch support
allowed-tools: "Read(**), Exec(git fetch, git config, git branch, git remote, git push, git for-each-ref, git log), Write()"
argument-hint: "[--base <branch>] [--stale <days>] [--remote] [--force] [--dry-run] [--yes]"
# examples:
#   - /git-cleanBranches --dry-run
#   - /git-cleanBranches --base release/v2.1 --stale 90
#   - /git-cleanBranches --remote --yes
---

# Claude Command: Clean Branches

This command **safely** identifies and cleans **merged** or **long-term unused (stale)** Git branches.
Runs in **read-only preview (`--dry-run`)** mode by default, requiring explicit instructions to perform deletion operations.

---

## Usage

```bash
# [Safest] Preview branches to be cleaned without performing any deletions
/git-cleanBranches --dry-run

# Clean local branches merged to main and inactive for over 90 days (requires individual confirmation)
/git-cleanBranches --stale 90

# Clean local and remote branches merged to release/v2.1 (auto-confirm)
/git-cleanBranches --base release/v2.1 --remote --yes

# [Dangerous] Force delete an unmerged local branch
/git-cleanBranches --force outdated-feature
```

### Options

- `--base <branch>`: Specify the base branch for cleanup (defaults to repository's `main`/`master`).
- `--stale <days>`: Clean branches with no commits for specified days (disabled by default).
- `--remote`: Also clean remote merged/stale branches.
- `--dry-run`: **Default behavior**. Only list branches to be deleted, don't perform any operations.
- `--yes`: Skip individual confirmation steps, directly delete all identified branches (suitable for CI/CD).
- `--force`: Use `-D` to force delete local branches (even if unmerged).

---

## What This Command Does

1. **Configuration and Safety Pre-check**
   - **Update information**: Automatically execute `git fetch --all --prune` to ensure latest branch status.
   - **Read protected branches**: Read list of branches that should not be cleaned from Git configuration (see "Configuration" below).
   - **Determine base**: Use `--base` parameter or auto-identified `main`/`master` as comparison baseline.

2. **Analysis and Identification (Find)**
   - **Merged branches**: Find local (and remote, if `--remote` specified) branches fully merged to `--base`.
   - **Stale branches**: If `--stale <days>` specified, find branches with last commit N days ago.
   - **Exclude protected branches**: Remove all configured protected branches from cleanup list.

3. **Report Preview (Report)**
   - Clearly list "merged branches to be deleted" and "stale branches to be deleted".
   - Without `--yes` parameter, **command ends here**, waiting for user confirmation before re-executing (without `--dry-run`).

4. **Execute Cleanup (Execute)**
   - **Only execute when not using `--dry-run` and user confirms** (or with `--yes`).
   - Delete identified branches one by one, unless user chooses to skip in interactive confirmation.
   - Local: `git branch -d <branch>`; Remote: `git push origin --delete <branch>`.
   - If `--force` specified, local deletion uses `git branch -D <branch>`.

---

## Configuration (Configure Once, Effective Permanently)

To prevent accidental deletion of important branches (like `develop`, `release/*`), add protection rules to the repository's Git configuration. The command will automatically read these.

```bash
# Protect develop branch
git config --add branch.cleanup.protected develop

# Protect all branches starting with release/ (wildcards)
git config --add branch.cleanup.protected 'release/*'

# View all configured protected branches
git config --get-all branch.cleanup.protected
```

---

## Best Practices

- **Prioritize `--dry-run`**: Develop the habit of previewing before executing.
- **Leverage `--base`**: When maintaining long-term `release` branches, use it to clean `feature` or `hotfix` branches merged to that release.
- **Use `--force` cautiously**: Don't force delete unless you're 100% certain an unmerged branch is useless work.
- **Team collaboration**: Notify in team channels before cleaning shared remote branches.
- **Run regularly**: Execute monthly or quarterly to keep repository clean.

---

## Notes

- Default read-only preview with configurable protected branch list.
- Supports custom base branches, suited for `release` / `develop` workflows.
- Avoids commands like `date -d` that behave differently across systems.
- Shares similar parameter design and documentation structure with `/git-commit` command.
