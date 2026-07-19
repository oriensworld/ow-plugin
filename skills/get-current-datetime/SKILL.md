---
name: get-current-datetime
description: Return an accurate current local timestamp in a requested format. Use when another workflow needs the current date or time for documentation, filenames, changelogs, or indexes.
---

# Current Date and Time

Read [the shared timestamp behavior](../../agents/get-current-datetime.md), ignoring Claude-only tool metadata and Bash-only assumptions.

Use a platform-native command or trusted runtime clock. Default to `yyyy-MM-dd HH:mm:ss`. When the caller requests raw output, return only the timestamp without a label or Markdown formatting.
