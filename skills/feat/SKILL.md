---
name: feat
description: Classify, plan, refine, and implement feature-development requests. Use for new feature requirements, iterations on an existing feature plan, or implementation after a plan is approved.
---

# Feature Development

Read [the shared feature workflow](../../commands/feat.md) completely, then follow it with these host adaptations:

- Treat `$ARGUMENTS` as the user's current request.
- Ignore Claude-only frontmatter and slash-command syntax.
- Use the `planner` and `ui-ux-designer` skills when their specialties are required; do the work locally if skill invocation is unavailable.
- Store plans under `.claude/plan/` on Claude and `.codex/plan/` on Codex.
- Follow the host's approval and safety rules before implementation or destructive actions.
