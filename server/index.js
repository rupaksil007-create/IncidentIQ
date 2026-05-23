const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const aiService = require('./services/aiService');

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

let notifications = [
  {
    id: 'nt_01',
    type: 'critical',
    message: '🚨 Redis Persistence Failure detected on node-ap-08',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    incidentId: 'inc_01',
    read: false
  },
  {
    id: 'nt_02',
    type: 'ai',
    message: '🤖 AI: Root cause identified as Memory Pressure (98%)',
    timestamp: new Date(Date.now() - 540000).toISOString(),
    incidentId: 'inc_01',
    read: false
  },
  {
    id: 'nt_03',
    type: 'warning',
    message: '⚠️ High latency detected in US-EAST-1 gateway',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    incidentId: 'inc_02',
    read: true
  },
  {
    id: 'nt_04',
    type: 'success',
    message: '✅ Recovery initiated for Order-Service',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    incidentId: 'inc_01',
    read: true
  }
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/incident-history', (req, res) => {
  res.json(incidentHistory);
});

app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

// Simulated Dynamic Metrics
let currentMetrics = {
  systemIntegrity: 98.2,
  avgResolveTime: 14,
  clusterLoad: 42,
  activeFaults: incidentHistory.length
};

const updateMetrics = () => {
  // Fluctuations
  const loadChange = (Math.random() - 0.5) * 5; // ±2.5%
  currentMetrics.clusterLoad = Math.max(10, Math.min(99, currentMetrics.clusterLoad + loadChange));

  const integrityChange = (Math.random() - 0.5) * 0.4; // ±0.2%
  currentMetrics.systemIntegrity = Math.max(70, Math.min(100, currentMetrics.systemIntegrity + integrityChange));

  // Correlation: High load reduces integrity
  if (currentMetrics.clusterLoad > 85) {
    currentMetrics.systemIntegrity -= 0.5;
  }

  // Correlation: High faults reduce integrity
  if (currentMetrics.activeFaults > 5) {
    currentMetrics.systemIntegrity -= 1;
  }

  currentMetrics.avgResolveTime = Math.max(5, Math.min(60, currentMetrics.avgResolveTime + (Math.random() - 0.5)));
};

setInterval(updateMetrics, 5000);

app.get('/api/metrics', (req, res) => {
  currentMetrics.activeFaults = incidentHistory.length; // Sync with history
  res.json({
    ...currentMetrics,
    trends: {
      integrity: currentMetrics.systemIntegrity > 95 ? '+0.2%' : '-0.5%',
      load: currentMetrics.clusterLoad > 80 ? '+15%' : '+2%',
      resolve: '-2m',
      faults: '+1'
    }
  });
});

app.get('/api/demo-incident', (req, res) => {
  const { id } = req.params;
  
  const incidentBase = incidentHistory.find(i => i.id === id) || {
    id: id,
    timestamp: new Date().toISOString(),
    rootCause: 'Unknown System Anomaly',
    severity: 'High',
    affectedService: 'System-Kernel'
  };

  // Generate dynamic analysis and recommendations
  const logs = [
    { time: '00:02:11', msg: `${incidentBase.rootCause.split(' ')[0]} persistence timeout`, level: 'error' },
    { time: '00:02:12', msg: 'Memory threshold exceeded (98%)', level: 'warn' },
    { time: '00:02:13', msg: 'Disk sync failed: EIO: i/o error', level: 'error' },
    { time: '00:02:15', msg: `Replica degraded: node-ap-08-${incidentBase.id}`, level: 'critical' },
    { time: '00:02:20', msg: 'Resource exhaustion detected', level: 'critical' }
  ];

  const metrics = {
    riskScore: 87,
    recoveryProbability: 92,
    blastRadius: 'Medium',
    health: {
      cpu: 88,
      ram: 96,
      latency: 45,
      healthScore: 42
    }
  };

  const { analysis, recommendations } = aiService.generateIncidentAnalysis({
    ...incidentBase,
    logs,
    metrics
  });

  const mockData = {
    ...incidentBase,
    affectedNode: 'node-ap-08',
    status: 'Investigating',
    confidenceScore: 91,
    aiAnalysis: analysis,
    logs: logs,
    timeline: [
      { time: '00:01:55', event: 'Anomalous pattern detected in telemetry' },
      { time: '00:02:03', event: `${incidentBase.affectedService} reported failure` },
      { time: '00:02:10', event: 'AI investigation triggered' },
      { time: '00:02:15', event: 'Critical alert generated' },
      { time: '00:02:20', event: 'Copilot analysis complete' }
    ],
    recommendations: recommendations,
    metrics: metrics
  };

  res.json(mockData);
});

app.post('/api/ai/chat', (req, res) => {
  const { question, incident } = req.body;
  if (!question || !incident) {
    return res.status(400).json({ error: 'Question and incident data are required.' });
  }

  const answer = aiService.generateChatResponse(question, incident);
  res.json({ answer });
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
