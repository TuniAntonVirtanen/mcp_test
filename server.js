import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();
app.use(express.json());

// Basic health check route for web browsers & Render pinging
app.get("/", (req, res) => {
  res.send("MCP Server is running live!");
});

// Create fresh server instances or handle tool definitions
const createMcpServer = () => {
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

  return server;
};

// Streamable HTTP endpoint handler
app.post("/mcp", async (req, res) => {
  try {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("MCP Error:", err);
    res.status(500).json({ error: "Internal MCP Server Error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`MCP server listening on port ${port}`);
});