import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('decisions.db');

// Initialize DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS decisions (
    id TEXT PRIMARY KEY,
    dilemma TEXT NOT NULL,
    method TEXT NOT NULL,
    analysis TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/decisions', (req, res) => {
    try {
      const stmt = db.prepare('SELECT id, dilemma, method, createdAt FROM decisions ORDER BY createdAt DESC');
      const decisions = stmt.all();
      res.json(decisions);
    } catch (error) {
      console.error('Error fetching decisions:', error);
      res.status(500).json({ error: 'Failed to fetch decisions' });
    }
  });

  app.get('/api/decisions/:id', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM decisions WHERE id = ?');
      const decision = stmt.get(req.params.id);
      if (decision) {
        res.json(decision);
      } else {
        res.status(404).json({ error: 'Decision not found' });
      }
    } catch (error) {
      console.error('Error fetching decision:', error);
      res.status(500).json({ error: 'Failed to fetch decision' });
    }
  });

  app.delete('/api/decisions/:id', (req, res) => {
    try {
      const stmt = db.prepare('DELETE FROM decisions WHERE id = ?');
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting decision:', error);
      res.status(500).json({ error: 'Failed to delete decision' });
    }
  });

  app.post('/api/decisions', async (req, res) => {
    const { dilemma, method, analysis } = req.body;

    if (!dilemma || !method || !analysis) {
      return res.status(400).json({ error: 'Dilemma, method, and analysis are required' });
    }

    try {
      const id = uuidv4();
      const stmt = db.prepare('INSERT INTO decisions (id, dilemma, method, analysis) VALUES (?, ?, ?, ?)');
      stmt.run(id, dilemma, method, analysis);

      res.json({ id, dilemma, method, analysis });
    } catch (error) {
      console.error('Error saving analysis:', error);
      res.status(500).json({ error: 'Failed to save analysis' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
