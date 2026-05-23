import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  Terminal, 
  Zap, 
  ChevronLeft,
  Server,
  Cpu,
  ShieldCheck,
  MessageSquare,
  Send,
  BarChart3,
  CheckCircle2,
  Info
} from 'lucide-react';
import axios from 'axios';
import MouseGlow from '../components/premium/MouseGlow';

const IncidentInvestigationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: "Hello! I'm your IncidentIQ Copilot. I've analyzed this incident. How can I help you investigate further?" }
  ]);

  const fallbackData = {
    id: id || 'inc_fallback',
    timestamp: new Date().toISOString(),
    rootCause: 'Redis Cluster Memory Eviction',
    severity: 'Critical',
    affectedService: 'Order-Service',
    affectedNode: 'node-ap-08',
    status: 'Investigating',
    confidenceScore: 91,
    aiAnalysis: "IncidentIQ detected abnormal persistence failures in Redis caused by elevated memory pressure and append-only log corruption.",
    logs: [
      { time: '00:02:11', msg: 'Redis persistence timeout', level: 'error' },
      { time: '00:02:12', msg: 'Memory threshold exceeded (98%)', level: 'warn' }
    ],
    timeline: [
      { time: '00:01:55', event: 'Latency spike detected in US-EAST-1' },
      { time: '00:02:10', event: 'Redis persistence failure triggered' }
    ],
    recommendations: [
      { 
        action: 'Restart Redis replica', 
        explanation: 'Forcing a restart will trigger a clean AOF reload.', 
        impact: 'Low', 
        recovery: '2 mins' 
      }
    ],
    metrics: {
      riskScore: 87,
      recoveryProbability: 92,
      blastRadius: 'Medium',
      health: {
        cpu: 88,
        ram: 96,
        latency: 45,
        healthScore: 42
      }
    }
  };

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/incident/${id}`);
        if (res.data) {
          setIncident(res.data);
        } else {
          setIncident(fallbackData);
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to fetch incident data. Using local cache.");
        setIncident(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');

    setTimeout(() => {
      let aiResponse = "I'm analyzing that for you...";
      if (chatInput.toLowerCase().includes('cause')) {
        aiResponse = "The root cause is identified as Redis memory pressure leading to AOF corruption.";
      } else if (chatInput.toLowerCase().includes('fix')) {
        aiResponse = "I recommend restarting the Redis replica and increasing the persistence buffer.";
      }
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Initializing AI Copilot...</p>
        </div>
      </div>
    );
  }

  // Safe access wrappers
  const safeIncident = incident || fallbackData;
  const metrics = safeIncident.metrics || fallbackData.metrics;
  const health = metrics.health || fallbackData.metrics.health;
  const logs = safeIncident.logs || [];
  const recommendations = safeIncident.recommendations || [];
  const timeline = safeIncident.timeline || [];

  return (
    <div className="min-h-screen bg-background text-white selection:bg-indigo-500/30 overflow-x-hidden pb-20">
      <MouseGlow />
      
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
            </Link>
            <div className="h-6 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Activity size={20} />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter uppercase italic">IncidentIQ <span className="text-indigo-500">Copilot</span></h1>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">AI Engine Active</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {error && <span className="text-[10px] text-orange-500 font-black uppercase mr-4">{error}</span>}
             <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Incident ID:</span>
                <span className="text-xs font-mono font-bold text-indigo-400">{safeIncident.id}</span>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card !p-8 border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32" />
            <div className="flex flex-wrap items-start justify-between gap-6 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                    safeIncident.severity === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'
                  }`}>
                    {safeIncident.severity}
                  </span>
                </div>
                <h2 className="text-4xl font-black tracking-tight leading-none">{safeIncident.rootCause}</h2>
                <div className="flex items-center gap-6">
                   <span className="text-xs text-gray-400 font-bold">Node: <span className="text-white">{safeIncident.affectedNode}</span></span>
                   <span className="text-xs text-gray-400 font-bold">Service: <span className="text-white">{safeIncident.affectedService}</span></span>
                   <span className="text-xs text-gray-400 font-bold">Status: <span className="text-indigo-400">{safeIncident.status}</span></span>
                </div>
              </div>
              <div className="text-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                 <div className="text-4xl font-black text-indigo-400">{safeIncident.confidenceScore}%</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card !p-8 border-white/5"
          >
            <h3 className="text-xl font-black tracking-tight mb-4">AI Root Cause Analysis</h3>
            <p className="text-gray-400 leading-relaxed font-medium italic border-l-2 border-indigo-500/30 pl-6 py-2">
              "{safeIncident.aiAnalysis}"
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card !p-0 border-white/5 overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
               <h3 className="text-sm font-black uppercase tracking-widest">Telemetry Stream</h3>
            </div>
            <div className="p-6 font-mono text-sm bg-black/40 h-[250px] overflow-y-auto">
               {logs.map((log, i) => (
                 <div key={i} className="mb-2 flex gap-4 opacity-80">
                   <span className="text-gray-600">[{log.time}]</span>
                   <span className={`font-bold ${log.level === 'error' ? 'text-red-500' : 'text-orange-500'}`}>{log.level}:</span>
                   <span className="text-gray-300">{log.msg}</span>
                 </div>
               ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {recommendations.map((rec, i) => (
               <div key={i} className="glass-card !p-6 border-white/5">
                 <h4 className="font-bold mb-2">{rec.action}</h4>
                 <p className="text-[11px] text-gray-500 mb-4">{rec.explanation}</p>
                 <div className="text-[10px] font-black text-gray-400 uppercase">Impact: {rec.impact}</div>
               </div>
             ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="grid grid-cols-2 gap-4">
             <div className="glass-card !p-5 border-white/5">
                <div className="text-2xl font-black text-red-500">{metrics.riskScore}%</div>
                <div className="text-[10px] font-black text-gray-500 uppercase">Risk Score</div>
             </div>
             <div className="glass-card !p-5 border-white/5">
                <div className="text-2xl font-black text-green-500">{metrics.recoveryProbability}%</div>
                <div className="text-[10px] font-black text-gray-500 uppercase">Recovery</div>
             </div>
          </div>

          <div className="glass-card !p-6 border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Node Health</h3>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-[10px] font-black mb-1">
                     <span>CPU</span><span>{health.cpu}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div animate={{ width: `${health.cpu}%` }} className="h-full bg-indigo-500" />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-black mb-1">
                     <span>RAM</span><span>{health.ram}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div animate={{ width: `${health.ram}%` }} className="h-full bg-red-500" />
                  </div>
               </div>
            </div>
          </div>

          <div className="glass-card !p-6 border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Timeline</h3>
            <div className="space-y-4">
               {timeline.map((event, i) => (
                 <div key={i} className="border-l border-white/10 pl-4 py-1">
                    <div className="text-[10px] font-black text-gray-500 uppercase">{event.time}</div>
                    <div className="text-xs font-bold text-gray-300">{event.event}</div>
                 </div>
               ))}
            </div>
          </div>

          <div className="glass-card !p-0 border-indigo-500/20 flex flex-col h-[350px]">
            <div className="p-4 border-b border-white/5 bg-indigo-500/5">
               <h3 className="text-xs font-black uppercase tracking-widest">Copilot Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {chatMessages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-[11px] ${
                      msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-300 border border-white/5'
                    }`}>
                       {msg.content}
                    </div>
                 </div>
               ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5">
               <input 
                 type="text" 
                 value={chatInput}
                 onChange={(e) => setChatInput(e.target.value)}
                 placeholder="Ask Copilot..."
                 className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-[11px] focus:outline-none"
               />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentInvestigationPage;
