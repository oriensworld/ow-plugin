// @ts-nocheck
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

try {
  const rawInput = fs.readFileSync(0, "utf8");
  const input = rawInput.trim() ? JSON.parse(rawInput) : {};
  const dataDirectory =
    process.env.PLUGIN_DATA ||
    process.env.CLAUDE_PLUGIN_DATA ||
    path.join(os.homedir(), ".ow-plugin");

  fs.mkdirSync(dataDirectory, { recursive: true });
  fs.appendFileSync(
    path.join(dataDirectory, "events.jsonl"),
    `${JSON.stringify({
      timestamp: new Date().toISOString(),
      event: input.hook_event_name || "unknown",
      tool: input.tool_name || null,
    })}\n`,
    "utf8",
  );

  // Side-effect-only hooks must leave stdout empty for cross-client compatibility.
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[ow-plugin] Hook failed: ${message}\n`);
  process.exitCode = 1;
}
