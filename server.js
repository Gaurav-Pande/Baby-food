// server.js
const express = require('express');
const { CosmosClient } = require('@azure/cosmos');

// For local CosmosDB emulator, you may need to disable TLS validation (for self-signed certs)
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('Warning: TLS certificate validation is disabled for local CosmosDB emulator. Do not use this in production!');
}
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// CosmosDB config (emulator)
const endpoint = "https://localhost:8081/";
const key = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="; // Default emulator key
const client = new CosmosClient({ endpoint, key });
const databaseId = "nutritot";
const containerId = "analysisResults";

// Ensure DB/container exist
async function ensureDb() {
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  await database.containers.createIfNotExists({ id: containerId });
}
ensureDb();

// MCP-style endpoint: store analysis result
app.post('/analyze', async (req, res) => {
  try {
    const analysis = req.body;
    const { resource } = await client
      .database(databaseId)
      .container(containerId)
      .items.create(analysis);
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MCP-style endpoint: get analysis history
app.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId;
    const query = userId
      ? { query: "SELECT * FROM c WHERE c.userId = @userId", parameters: [{ name: "@userId", value: userId }] }
      : { query: "SELECT * FROM c" };
    const { resources } = await client
      .database(databaseId)
      .container(containerId)
      .items.query(query)
      .fetchAll();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('MCP server running on http://localhost:3001'));
