---
description: Echo a message back. Use to test that the plugin MCP server is connected and working.
allowed-tools: Exec(echo)
argument-hint: [message]
# examples:
#   - /echo                     # Echo default greeting
#   - /echo Hello World         # Echo custom message
---

# Echo Command

Echo the text provided via "$ARGUMENTS" by calling the `echo` tool from the ow-server MCP server.

If no arguments provided, echo "Hello from ow-plugin!".
Present the result cleanly.
