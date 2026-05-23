const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Auth Routes
app.use('/api/auth', authRoutes);

// In-memory "database" for demo purposes
let incidentHistory = [
  {
    id: 'inc_01',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    rootCause: 'Redis Cluster Memory Eviction',
    severity: 'Critical',
    affectedService: 'Order-Service'
  },
  {
    id: 'inc_02',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    rootCause: 'PostgreSQL Connection Exhaustion',
    severity: 'High',
    affectedService: 'Auth-API'
  }
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/incident-history', (req, res) => {
  res.json(incidentHistory);
});

app.get('/api/demo-incident', (req, res) => {
  const demoData = {
    logs: `
[2024-05-23 14:01:05] WARN: Redis memory usage at 88%
[2024-05-23 14:02:11] ALERT: Redis memory usage at 95%
[2024-05-23 14:04:45] ERROR: Connection timeout on redis-primary:6379
[2024-05-23 14:05:01] FATAL: OrderService crashed due to Redis connection failure
[2024-05-23 14:05:12] SYSTEM: Node node-01-ap-south-1 reported OOM Killer for pid 4452 (redis-server)
    `,
    context: "Infrastructure: Kubernetes Cluster, Cloud: AWS"
  };
  res.json(demoData);
});

app.post('/api/analyze', authMiddleware, async (req, res) => {
  const { logs, context } = req.body;

  if (!logs) {
    return res.status(400).json({ error: 'Logs are required for analysis.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert SRE and System Architect. Analyze the following system logs and identify the root cause of the incident.
      Return a structured JSON response with the following fields:
      - rootCause: A clear, concise explanation of the root cause.
      - confidence: A percentage (0-100) of how certain you are.
      - affectedService: The main service or component impacted.
      - timeline: An array of events with "timestamp" and "event" description.
      - severity: "Low", "Medium", "High", or "Critical".
      - suggestedFix: Immediate action to resolve the issue.
      - prevention: Long-term recommendation to prevent recurrence.
      - explanation: A detailed explanation for a technical audience.

      Logs:
      ${logs}

      Context:
      ${context || 'No additional context provided.'}

      Return ONLY the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      
      // Add to history
      incidentHistory.unshift({
        id: `inc_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        rootCause: analysis.rootCause,
        severity: analysis.severity,
        affectedService: analysis.affectedService
      });
      if (incidentHistory.length > 10) incidentHistory.pop();

      res.json(analysis);
    } else {
      throw new Error('Could not parse AI response as JSON');
    }
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze logs.',
      details: error.message,
      fallback: {
        rootCause: 'Manual inspection required',
        confidence: 0,
        severity: 'High',
        suggestedFix: 'Review logs manually in the dashboard'
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
