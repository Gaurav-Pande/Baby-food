// Catch all unhandled promise rejections and log them
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
// server.js
const express = require('express');
const { CosmosClient } = require('@azure/cosmos');
const cors = require('cors');

// For local CosmosDB emulator, you may need to disable TLS validation (for self-signed certs)
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('Warning: TLS certificate validation is disabled for local CosmosDB emulator. Do not use this in production!');
}

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

// MCP-style endpoint: analyze ingredients (calls LLM, stores, returns result)
app.post('/analyze', async (req, res) => {
  try {
    const { ingredientsText, babyProfile, imageUrl } = req.body;
    // Call LLM (Azure OpenAI)
    const prompt = `You are a pediatric nutrition expert. Given the following food ingredients, analyze if this food is healthy for a toddler aged 1-3 years. For each ingredient, check for health concerns based on current medical guidelines and cite at least one reputable source (medical journal, WHO, AAP, PubMed, etc.) for each flagged ingredient. Summarize your reasoning and provide a final verdict with citations.\n\nIngredients: ${ingredientsText}\nBaby's age: ${babyProfile?.age} months\nAllergies: ${(babyProfile?.allergies || []).join(', ') || 'None'}\n\nFormat your answer as JSON with this structure:\n{ concerns: [ { ingredient, reason, citations: [ { title, source, url } ] } ], nutritionalInfo: { calories, protein, carbs, sugars, fat, sodium, additionalInfo }, alternatives: [ { original, suggestion, benefits } ], isHealthy: boolean }`;

    // Hardcoded Azure OpenAI endpoint and key (for dev only)
    const AZURE_OPENAI_ENDPOINT = '';
    const AZURE_OPENAI_KEY = '';
    const openaiRes = await fetch(AZURE_OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_OPENAI_KEY,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful pediatric nutrition assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 800
      })
    });
    if (!openaiRes.ok) {
      throw new Error('OpenAI API request failed');
    }
    const data = await openaiRes.json();
    let content = data.choices?.[0]?.message?.content || '';
    let jsonStart = content.indexOf('{');
    let jsonEnd = content.lastIndexOf('}');
    let analysis;
    try {
      analysis = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
    } catch (e) {
      throw new Error('Failed to parse LLM response as JSON');
    }
    // Compose full result
    const result = {
      id: require('uuid').v4(),
      timestamp: new Date().toISOString(),
      imageUrl: imageUrl || '',
      ingredients: ingredientsText.split(/,|;|\n/).map(i => i.trim()).filter(i => i.length > 0),
      ...analysis
    };
    // Respond to client immediately
    res.json(result);
    // Sanitize result for CosmosDB
    function sanitize(obj) {
      if (Array.isArray(obj)) return obj.map(sanitize);
      if (obj && typeof obj === 'object') {
        const out = {};
        for (const k in obj) {
          if (obj[k] === undefined) out[k] = null;
          else out[k] = sanitize(obj[k]);
        }
        return out;
      }
      return obj;
    }
    const safeResult = sanitize(result);
    // Store in CosmosDB in the background (fire and forget)
    client.database(databaseId).container(containerId).items.create(safeResult)
      .catch(err => {
        console.error('Failed to store analysis result in CosmosDB:', err);
        console.error('Payload:', JSON.stringify(safeResult, null, 2));
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to save a full analysis result directly (for history, etc.)
app.post('/save', async (req, res) => {
  try {
    // Sanitize result for CosmosDB
    function sanitize(obj) {
      if (Array.isArray(obj)) return obj.map(sanitize);
      if (obj && typeof obj === 'object') {
        const out = {};
        for (const k in obj) {
          if (obj[k] === undefined) out[k] = null;
          else out[k] = sanitize(obj[k]);
        }
        return out;
      }
      return obj;
    }
    const safeResult = sanitize(req.body);
    // Use upsert to avoid duplicate id errors (409)
    const { resource } = await client.database(databaseId).container(containerId).items.upsert(safeResult);
    res.json(resource);
  } catch (err) {
    console.error('Failed to save analysis result in CosmosDB:', err);
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