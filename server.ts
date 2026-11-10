import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

import { BUSINESSES, CATEGORIES, NEIGHBOURHOODS } from './src/data/mockData';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  app.use(express.json());

  // Health and backend status endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      server: 'Orléans Local Backend Server',
      databaseId: 'ai-studio-5f58bc95-22b6-4e40-9324-aafbfa3100d9',
      projectId: 'gen-lang-client-0176321717',
      businessesCount: BUSINESSES.length,
      timestamp: new Date().toISOString()
    });
  });

  // REST API: Get directory businesses catalog from backend
  app.get('/api/businesses', (req, res) => {
    res.json({
      businesses: BUSINESSES,
      total: BUSINESSES.length
    });
  });

  // REST API: Get backend and directory statistics
  app.get('/api/stats', (req, res) => {
    res.json({
      totalBusinesses: BUSINESSES.length,
      categoriesCount: CATEGORIES.length,
      neighbourhoodsCount: NEIGHBOURHOODS.length,
      firestoreDatabaseId: 'ai-studio-5f58bc95-22b6-4e40-9324-aafbfa3100d9',
      projectId: 'gen-lang-client-0176321717',
      serverTime: new Date().toISOString()
    });
  });

  // AI-Powered Natural Language Directory Discovery via Gemini
  app.post('/api/gemini/discover', async (req, res) => {
    try {
      const { query, availableBusinesses } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query string is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          const catalogSummary = (availableBusinesses || []).map((b: any) => ({
            id: b.id,
            name: b.name,
            category: b.category,
            subcategory: b.subcategory,
            neighbourhood: b.neighbourhood,
            priceLevel: b.priceLevel,
            rating: b.rating,
            features: b.features,
            services: b.services,
            description: b.description,
          }));

          const prompt = `You are the local discovery concierge for Orléans Local, a community directory for Orléans & Ottawa.
A local resident asks: "${query}"

Here is the current directory catalog of local businesses:
${JSON.stringify(catalogSummary, null, 2)}

Strict Rules:
1. ONLY recommend businesses that exist in the provided catalog. Do NOT invent business names, addresses, or attributes.
2. Select 1 to 5 businesses that best match the user's intent.
3. Provide a warm, concise community recommendation explanation (2-3 sentences max).
4. Identify any directory filters that match the query (e.g. category, neighbourhood, priceLevel, features).

Return ONLY a valid JSON object with this exact shape:
{
  "matchedBusinessIds": string[],
  "explanation": string,
  "suggestedCategory": string | null,
  "suggestedNeighbourhood": string | null,
  "suggestedPriceLevel": string | null,
  "suggestedFeatures": string[]
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const rawText = response.text || '{}';
          const parsed = JSON.parse(rawText);
          return res.json(parsed);
        } catch (geminiError: any) {
          console.warn('Gemini API query failed or key unavailable, using smart local matcher:', geminiError?.message);
        }
      }

      // Fallback intent parser if Gemini is not configured or in preview
      const qLower = query.toLowerCase();
      const businesses = availableBusinesses || [];

      const matched = businesses.filter((b: any) => {
        const text = `${b.name} ${b.category} ${b.subcategory} ${b.description} ${b.neighbourhood} ${b.features.join(' ')} ${b.services.join(' ')} ${b.tags.join(' ')}`.toLowerCase();
        const terms = qLower.split(/\s+/).filter((t: string) => t.length > 2);
        return terms.some((term: string) => text.includes(term));
      });

      const matchedIds = matched.slice(0, 4).map((b: any) => b.id);

      let explanation = `Here are local spots in Orléans matching "${query}".`;
      if (qLower.includes('toddler') || qLower.includes('kid') || qLower.includes('children')) {
        explanation = `Found family-friendly places in Orléans with kid amenities and convenient parking.`;
      } else if (qLower.includes('leak') || qLower.includes('plumb') || qLower.includes('pipe') || qLower.includes('basement')) {
        explanation = `Found licensed emergency plumbing and drainage specialists serving Orléans homes.`;
      } else if (qLower.includes('coffee') || qLower.includes('breakfast') || qLower.includes('bakery')) {
        explanation = `Found top-rated neighbourhood roasteries and artisan sourdough bakeries nearby.`;
      }

      return res.json({
        matchedBusinessIds: matchedIds.length > 0 ? matchedIds : businesses.slice(0, 3).map((b: any) => b.id),
        explanation,
        suggestedCategory: null,
        suggestedNeighbourhood: null,
        suggestedPriceLevel: null,
        suggestedFeatures: [],
      });
    } catch (err: any) {
      console.error('Discover error:', err);
      res.status(500).json({ error: 'Failed to process discovery request' });
    }
  });

  // Vite development middleware or static production serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Orléans Local server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
