---
description: Manage Git worktrees, create in ../.ow/project-name/ directory alongside project, supports smart defaults, IDE integration and content migration
allowed-tools: Read(**), Exec(git worktree add, git worktree list, git worktree remove, git worktree prune, git branch, git checkout, git rev-parse, git stash, git cp, detect-ide, open-ide, which, command, basename, dirname)
argument-hint: <add|list|remove|prune|migrate> [path] [-b <branch>] [-o|--open] [--track] [--guess-remote] [--detach] [--checkout] [--lock] [--migrate-from <source-path>] [--migrate-stash]
# examples:
#   - /git-worktree add feature-ui                     # Create new branch 'feature-ui' from main/master
#   - /git-worktree add feature-ui -o                  # Create worktree and open directly in IDE
#   - /git-worktree add hotfix -b fix/login -o         # Create new branch 'fix/login' with path 'hotfix'
#   - /git-worktree migrate feature-ui --from main     # Migrate uncommitted content from main to feature-ui
#   - /git-worktree migrate feature-ui --stash         # Migrate current stash to feature-ui
---

# Claude Command: Git Worktree

Manage Git worktrees with smart defaults, IDE integration and content migration, using structured `../.ow/project-name/` paths.

Execute commands directly and provide concise results.

---

## Usage

```bash
# Basic operations
/git-worktree add <path>                           # Create new branch named <path> from main/master
/git-worktree add <path> -b <branch>               # Create new branch with specified name
/git-worktree add <path> -o                        # Create and open directly in IDE
/git-worktree list                                 # Show all worktree status
/git-worktree remove <path>                        # Remove specified worktree
/git-worktree prune                                # Clean invalid worktree records

# Content migration
/git-worktree migrate <target> --from <source>     # Migrate uncommitted content
/git-worktree migrate <target> --stash             # Migrate stash content
```

### Options

| Option             | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `add [<path>]`     | Add new worktree at `../.ow/project-name/<path>`          |
| `migrate <target>` | Migrate content to specified worktree                     |
| `list`             | List all worktrees and their status                       |
| `remove <path>`    | Remove worktree at specified path                         |
| `prune`            | Clean invalid worktree references                         |
| `-b <branch>`      | Create new branch and checkout to worktree                |
| `-o, --open`       | Open directly in IDE after creation (skip prompt)        |
| `--from <source>`  | Specify migration source path (migrate only)             |
| `--stash`          | Migrate current stash content (migrate only)             |
| `--track`          | Set new branch to track corresponding remote branch       |
| `--guess-remote`   | Automatically guess remote branch for tracking           |
| `--detach`         | Create worktree with detached HEAD                       |
| `--checkout`       | Checkout immediately after creation (default behavior)   |
| `--lock`           | Lock worktree after creation                             |

---

## What This Command Does

1. **Environment Check**
   - Verify Git repository via `git rev-parse --is-inside-work-tree`
   - Detect if in main repository or existing worktree, perform intelligent path calculation

2. **Smart Path Management**
   - Use worktree detection to automatically calculate project name from main repository path
   - Create worktree in structured `../.ow/project-name/<path>` directory
   - Properly handle main repository and worktree execution contexts

```bash
# Core path calculation logic for worktree detection
get_main_repo_path() {
  local git_common_dir=$(git rev-parse --git-common-dir 2>/dev/null)
  local current_toplevel=$(git rev-parse --show-toplevel 2>/dev/null)

  # Detect if in worktree
  if [[ "$git_common_dir" != "$current_toplevel/.git" ]]; then
    # In worktree, derive main repository path from git-common-dir
    dirname "$git_common_dir"
  else
    # In main repository
    echo "$current_toplevel"
  fi
}

MAIN_REPO_PATH=$(get_main_repo_path)
PROJECT_NAME=$(basename "$MAIN_REPO_PATH")
WORKTREE_BASE="$MAIN_REPO_PATH/../.ow/$PROJECT_NAME"

# Always use absolute paths to prevent nesting issues
ABSOLUTE_WORKTREE_PATH="$WORKTREE_BASE/<path>"
```

**Key Fix**: When creating new worktrees from within existing worktrees, always use absolute paths to prevent path nesting issues like `../.ow/project/.ow/project/path`.

3. **Worktree Operations**
   - **add**: Create new worktree using smart branch/path defaults
   - **list**: Display all worktrees with branch and status information
   - **remove**: Safely delete worktree and cleanup references
   - **prune**: Clean orphaned worktree records

4. **Smart Defaults**
   - **Branch creation**: Use path name to create new branch when `-b` not specified
   - **Base branch**: Create new branches from main/master branch
   - **Path resolution**: Use branch name as path when path not specified
   - **IDE integration**: Auto-detect and prompt for IDE opening

5. **Content Migration**
   - Migrate uncommitted changes between worktrees
   - Apply stash content to target worktree
   - Safety checks to prevent conflicts

6. **Safety Features**
   - **Path conflict protection**: Check if directory already exists before creation
   - **Branch checkout validation**: Ensure branch is not in use elsewhere
   - **Absolute path enforcement**: Prevent nested `.ow` directory creation within worktrees
   - **Cleanup on removal**: Clean both directory and git references
   - **Clear status reporting**: Display worktree location and branch status

7. **Environment File Handling**
   - **Auto-detection**: Scan `.gitignore` file for environment variable file patterns
   - **Smart copying**: Copy `.env` and `.env.*` files listed in `.gitignore`
   - **Exclusion logic**: Skip template files like `.env.example`
   - **Permission protection**: Maintain original file permissions and timestamps
   - **User feedback**: Provide clear status information for copied environment files

```bash
# Environment file copying implementation
copy_environment_files() {
    local main_repo="$MAIN_REPO_PATH"
    local target_worktree="$ABSOLUTE_WORKTREE_PATH"
    local gitignore_file="$main_repo/.gitignore"
    
    # Check if .gitignore exists
    if [[ ! -f "$gitignore_file" ]]; then
        return 0
    fi
    
    local copied_count=0
    
    # Detect .env files
    if [[ -f "$main_repo/.env" ]] && grep -q "^\.env$" "$gitignore_file"; then
        cp "$main_repo/.env" "$target_worktree/.env"
        echo "Copied .env"
        ((copied_count++))
    fi
    
    # Detect .env.* pattern files (exclude .env.example)
    for env_file in "$main_repo"/.env.*; do
        if [[ -f "$env_file" ]] && [[ "$(basename "$env_file")" != ".env.example" ]]; then
            local filename=$(basename "$env_file")
            if grep -q "^\.env\.\*$" "$gitignore_file"; then
                cp "$env_file" "$target_worktree/$filename"
                echo "Copied $filename"
                ((copied_count++))
            fi
        fi
    done
    
    if [[ $copied_count -gt 0 ]]; then
        echo "Copied $copied_count environment files from .gitignore"
    fi
}
```

---

## Enhanced Features

### IDE Integration

- **Auto-detection**: VS Code -> Cursor -> WebStorm -> Sublime Text -> Vim
- **Smart prompting**: Ask whether to open in IDE after worktree creation
- **Direct opening**: Use `-o` flag to skip prompt and open directly
- **Custom configuration**: Configure via git config

### Content Migration System

```bash
# Migrate uncommitted changes
/git-worktree migrate feature-ui --from main
/git-worktree migrate hotfix --from ../other-worktree

# Migrate stash content
/git-worktree migrate feature-ui --stash
```

**Migration Flow**:

1. Verify source has uncommitted content
2. Ensure target worktree is clean
3. Display changes about to be migrated
4. Safely migrate using git commands
5. Confirm results and suggest next steps

---

## Examples

```bash
# Basic usage
/git-worktree add feature-ui                       # Create new branch 'feature-ui' from main/master
/git-worktree add feature-ui -b my-feature         # Create new branch 'my-feature' with path 'feature-ui'
/git-worktree add feature-ui -o                    # Create and open directly in IDE

# Content migration scenarios
/git-worktree add feature-ui -b feature/new-ui     # Create new feature worktree
/git-worktree migrate feature-ui --from main       # Migrate uncommitted changes
/git-worktree migrate hotfix --stash               # Migrate stash content

# Management operations
/git-worktree list                                 # View all worktrees
/git-worktree remove feature-ui                    # Remove unneeded worktree
/git-worktree prune                                # Clean invalid references
```

**Example Output**:

```
Worktree created at ../.ow/project-name/feature-ui
Copied .env
Copied .env.local
Copied 2 environment files from .gitignore
Open ../.ow/project-name/feature-ui in IDE? [y/n]: y
Opening ../.ow/project-name/feature-ui in VS Code...
```

---

## Directory Structure

```
parent-directory/
├── your-project/            # Main project
│   ├── .git/
│   └── src/
└── .ow/                     # Worktree management
    └── your-project/        # Project worktrees
        ├── feature-ui/      # Feature branch
        ├── hotfix/          # Fix branch
        └── debug/           # Debug worktree
```

---

## Configuration

### IDE Configuration

- Supports VS Code, Cursor, WebStorm, Sublime Text, Vim
- Configure custom IDE via git config
- Priority-based auto-detection selection

### Custom IDE Settings

```bash
# Configure custom IDE
git config worktree.ide.custom.sublime "subl %s"
git config worktree.ide.preferred "sublime"

# Control auto-detection
git config worktree.ide.autodetect true  # Default
```

---

## Notes

- **Performance**: Worktrees share `.git` directory, saving disk space
- **Safety**: Path conflict protection and branch checkout validation
- **Migration**: Limited to uncommitted changes; use `git cherry-pick` for committed content
- **IDE Requirements**: Command-line tools must be in PATH
- **Cross-platform**: Supports Windows, macOS, Linux
- **Environment files**: Auto-copy environment files listed in `.gitignore` to new worktrees
- **File exclusion**: Template files like `.env.example` remain only in main repository

---
