---
name: sysinfo
description: Retrieve and display machine information through the OW MCP server. Use when the user asks for system details, machine status, platform, architecture, memory, uptime, or Node.js version.
---

# System Information

Call the `get_system_info` tool from the `ow-server` MCP server and present its result in a compact table. Preserve the server's timestamp and units. If the tool is unavailable, report that the OW MCP server is not connected.
