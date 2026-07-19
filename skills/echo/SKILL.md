---
name: echo
description: Echo a message through the OW MCP server to verify round-trip tool connectivity. Use when the user asks to echo text, test the OW server, or confirm that the plugin MCP connection works.
---

# Echo

Call the `echo` tool from the `ow-server` MCP server with the message supplied by the user.

If the user supplies no message, use `Hello from ow-plugin!`. Present the returned text without adding unrelated detail. If the tool is unavailable, report that the OW MCP server is not connected.
