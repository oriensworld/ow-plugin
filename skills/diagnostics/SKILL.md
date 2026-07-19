---
name: diagnostics
description: Diagnose the OW plugin by checking MCP connectivity and testing its tools. Use when the plugin appears unavailable, system information fails, echo fails, or the user asks to verify the installation.
---

# OW Plugin Diagnostics

Read [the shared diagnostic procedure](../../agents/diagnostics.md), ignoring Claude-only agent metadata.

Call `get_system_info`, then call `echo` with `ow-plugin diagnostic test`. Report pass or fail for manifest discovery, each MCP tool, and any returned error. Keep the report concise and do not hide partial failures.
