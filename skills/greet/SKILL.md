---
name: greet
description: Greet the user and optionally show system information through the OW MCP server. Use when the user says hello, requests a personalized greeting, or combines a greeting with a system check.
---

# Greet Skill

When invoked, do the following:

1. Greet the user by name when one is provided in the request; otherwise greet generically.
2. Call the `get_system_info` tool from the ow-server MCP server to retrieve system details
3. Present the greeting along with the system info in a clean format

If the MCP tool is unavailable, just greet the user and note that the MCP server isn't connected.
