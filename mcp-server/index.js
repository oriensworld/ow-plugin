import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import os from "node:os";

const server = new McpServer({
  name: "ow-server",
  version: "0.1.0",
});

server.tool("get_system_info", "Returns basic system information to prove the MCP server is running", {}, async () => {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            hostname: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            nodeVersion: process.version,
            uptime: `${Math.floor(os.uptime() / 60)} minutes`,
            freeMemory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        ),
      },
    ],
  };
});

server.tool(
  "echo",
  "Echoes back whatever message you send — useful for testing round-trip communication",
  { message: z.string().describe("The message to echo back") },
  async ({ message }) => {
    return {
      content: [{ type: "text", text: `Echo: ${message}` }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
