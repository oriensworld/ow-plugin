---
description: Interactive Git branch rollback to historical versions; list branches, list versions, confirm then execute reset/revert
allowed-tools: Read(**), Exec(git fetch, git branch, git tag, git log, git reflog, git checkout, git reset, git revert, git switch), Write()
argument-hint: [--branch <branch>] [--target <rev>] [--mode reset|revert] [--depth <n>] [--dry-run] [--yes]
# examples:
#   - /git-rollback                # Full interactive mode, dry-run
#   - /git-rollback --branch dev   # Select dev directly, other interactive
#   - /git-rollback --branch dev --target v1.2.0 --mode reset --yes
---

# Claude Command: Git Rollback

**Purpose**: Safely and visually rollback specified branch to an older version.
Defaults to **read-only preview (`--dry-run`)**; actual execution requires `--yes` or interactive confirmation.

---

## Usage

```bash
# Pure interactive: list branches -> select branch -> list recent 20 versions -> select target -> choose reset or revert -> double confirmation
/git-rollback

# Specify branch, other interactive
/git-rollback --branch feature/calculator

# Specify branch and target commit, execute with hard-reset in one command (dangerous)
/git-rollback --branch main --target 1a2b3c4d --mode reset --yes

# Only generate revert commit (non-destructive rollback), preview only
/git-rollback --branch release/v2.1 --target v2.0.5 --mode revert --dry-run
```

### Options

| Option                 | Description                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `--branch <branch>`    | Branch to rollback; interactive selection when omitted.                                       |
| `--target <rev>`       | Target version (commit Hash, Tag, reflog reference all work); interactive selection of recent `--depth` records when omitted. |
| `--mode reset\|revert` | `reset`: Hard rollback history; `revert`: Generate reverse commit maintaining history integrity. Asks by default. |
| `--depth <n>`          | List recent n versions in interactive mode (default 20).                                      |
| `--dry-run`            | **Enabled by default**, only preview commands to be executed.                                 |
| `--yes`                | Skip all confirmations and execute directly, suitable for CI/CD scripts.                      |

---

## Interactive Flow

1. **Sync remote** -> `git fetch --all --prune`
2. **List branches** -> `git branch -a` (local + remote, filter protected branches)
3. **Select branch** -> User input or parameter
4. **List versions** -> `git log --oneline -n <depth>` + `git tag --merged` + `git reflog -n <depth>`
5. **Select target** -> User input commit hash / tag
6. **Select mode** -> `reset` or `revert`
7. **Final confirmation** (unless `--yes`)
8. **Execute rollback**
   - `reset`: `git switch <branch> && git reset --hard <target>`
   - `revert`: `git switch <branch> && git revert --no-edit <target>..HEAD`
9. **Push suggestion** -> Prompt whether to `git push --force-with-lease` (reset) or normal `git push` (revert)

---

## Safety Guards

- **Backup**: Automatically record current HEAD in reflog before execution, can restore with `git switch -c backup/<timestamp>`.
- **Protected branches**: If protected branches like `main` / `master` / `production` are detected with `reset` mode enabled, require additional confirmation.
- **--dry-run enabled by default**: Prevent accidental operations.
- **--force prohibited**: No `--force` provided; if force push needed, manually enter `git push --force-with-lease`.

---

## Use Case Examples

| Scenario                                                      | Call Example                                                         |
| ------------------------------------------------------------- | -------------------------------------------------------------------- |
| Hot patch went live but found bug, need to return to Tag `v1.2.0` | `/git-rollback --branch release/v1 --target v1.2.0 --mode reset` |
| Operations colleague mistakenly pushed debug log commit, need reverse commit | `/git-rollback --branch main --target 3f2e7c9 --mode revert`     |
| Research historical bug, guide newcomer through branch history | `/git-rollback` (full interactive, dry-run)                        |

---

## Notes

1. **reset vs revert**
   - **reset** changes history, requires force push and may affect other collaborators, use with caution.
   - **revert** is safer, generates new commit preserving history, but adds one more record.
2. **Embedded repositories** often have large binary files; ensure LFS/submodule status is consistent before rollback.
3. If repository has CI mandatory validation enabled, rollback may automatically trigger pipelines; confirm control policies to avoid mistaken deployment of old versions.

---
