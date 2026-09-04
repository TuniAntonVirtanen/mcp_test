import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();

app.use(express.json());

const server = new McpServer({
  name: "mcp-hello-world",
  version: "1.0.0"
});

server.tool(
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

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined
  });

  res.on("close", () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`MCP server listening on port ${port}`);
});