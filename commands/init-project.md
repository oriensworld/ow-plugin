---
description: Initialize project AI context, generate/update root-level and module-level CLAUDE.md indices
allowed-tools: Read(**), Write(CLAUDE.md, **/CLAUDE.md)
argument-hint: <project summary or name>
---

## Usage

`/init-project <project summary or name>`

## Objective

Initialize project AI context with "root-level concise + module-level detailed" hybrid strategy:

- Generate/update `CLAUDE.md` at repository root (high-level vision, architecture overview, module index, global specifications).
- Generate/update local `CLAUDE.md` in identified module directories (interfaces, dependencies, entry points, tests, key files etc.).
- Automatically generate Mermaid structure diagrams in root `CLAUDE.md` and add navigation breadcrumbs to each module `CLAUDE.md`.

## Orchestration Instructions

**Step 1**: Call `get-current-datetime` subagent to get current timestamp.

**Step 2**: Call `init-architect` subagent once with inputs:

- `project_summary`: $ARGUMENTS
- `current_timestamp`: (timestamp from step 1)

## Execution Strategy (adaptively determined by Agent, no user parameters needed)

- **Phase A: Repository Inventory (Lightweight)**
  Quickly count files and directories, identify module roots (package.json, pyproject.toml, go.mod, apps/*, packages/*, services/* etc.).
- **Phase B: Module Priority Scanning (Medium)**
  For each module perform targeted reading and sampling of "entry points/interfaces/dependencies/tests/data models/quality tools".
- **Phase C: Deep Supplementary Scanning (As Needed)**
  If repository is small or modules are small scale, expand reading coverage; if larger, add batch scanning for high-risk/high-value paths.
- **Coverage Metrics & Resumable Execution**
  Output "scanned files count / estimated total files, covered module percentage, ignored/skipped reasons", and list "recommended next deep-dive sub-paths". When re-running `/init-project`, perform **incremental updates** and **checkpoint resumption** based on previous index.

## Safety and Boundaries

- Only read/write documentation and indices, don't modify source code.
- Default ignore common artifacts and large binary files.
- Print "summary" in main conversation, write full text to repository.

## Output Requirements

- Print "initialization result summary" in main conversation, including:
  - Whether root-level `CLAUDE.md` was created/updated, main section overview.
  - Number of identified modules and their path list.
  - Generation/update status of each module's `CLAUDE.md`.
  - Explicitly mention "generated Mermaid structure diagram" and "added navigation breadcrumbs for N modules".
  - Coverage and main gaps.
  - If not fully read: explain "why stopping here" and list **recommended next steps** (e.g. "suggest priority supplementary scanning: packages/auth/src/controllers").
