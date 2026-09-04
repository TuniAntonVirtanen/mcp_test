import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();
app.use(express.json());

const mcpServer = new McpServer({
  name: "mcp-hello-world",
  version: "1.0.0"
});

mcpServer.tool(
  "hello_mcp",
  "Returns a distinctive message to prove that MCP is working.",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "🎉 MCP IS WORKING — 2026-HELLO"
        }
      ]
    };
  }
);

// Streamable HTTP transport manages endpoints statefully
const transport = new StreamableHTTPServerTransport({
  endpoint: "/mcp"
});

// Bind transport handlers
app.all("/mcp", async (req, res) => {
  await transport.handleRequest(req, res, req.body);
});

// Connect server to transport
await mcpServer.connect(transport);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`MCP server listening on port ${port}`);
});