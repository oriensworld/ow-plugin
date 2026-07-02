---
name: greet
description: Greet the user and show system info. Use when the user says hello or asks for a system check.
---

# Greet Skill

When invoked, do the following:

1. Greet the user by name if provided via "$ARGUMENTS", otherwise greet generically
2. Call the `get_system_info` tool from the ow-server MCP server to retrieve system details
3. Present the greeting along with the system info in a clean format

If the MCP tool is unavailable, just greet the user and note that the MCP server isn't connected.
