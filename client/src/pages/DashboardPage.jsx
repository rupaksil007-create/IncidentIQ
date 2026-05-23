import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Zap, 
  ChevronRight,
  RefreshCw,
  Search,
  Bell,
  Settings,
  LayoutDashboard,
  Database,
  Server,
  Cpu,
  Shield,
  Search as SearchIcon,
  X,
  User,
  LogOut,
  Moon,
  Sun,
  Key,
  ToggleLeft,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import MouseGlow from '../components/premium/MouseGlow';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';

// --- Sub-components ---

const StatCard = ({ icon, label, value, trend, colorClass }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card !p-6 relative group border-white/5"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity -mr-8 -mt-8 ${colorClass}`} />
    <div className="flex items-center gap-4 mb-4">
      <div className="p-2.5 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
        {icon}
      </div>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        {trend}
      </span>
    </div>
  </motion.div>
);

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const SettingsModal = ({ isOpen, onClose, settings, setSettings }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass-card w-full max-w-lg !p-0 overflow-hidden border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Settings size={20} className="text-indigo-500" /> System Preferences
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Moon size={20} />
              </div>
              <div>
                <div className="text-sm font-bold">Ultra Dark Mode</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">Optimized for OLED displays</div>
              </div>
            </div>
            <div className="w-12 h-6 bg-indigo-500 rounded-full relative p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full ml-auto" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Key size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">Gemini API Key</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">Stored locally in session</div>
              </div>
            </div>
            <input 
              type="password" 
              placeholder="••••••••••••••••" 
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <ToggleLeft size={20} />
              </div>
              <div>
                <div className="text-sm font-bold">Demo Mode</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">Use simulated analysis when API fails</div>
              </div>
            </div>
            <div 
              onClick={() => setSettings({...settings, demoMode: !settings.demoMode})}
              className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${settings.demoMode ? 'bg-indigo-500' : 'bg-white/10'}`}
            >
              <motion.div 
                animate={{ x: settings.demoMode ? 24 : 0 }}
                className="w-4 h-4 bg-white rounded-full" 
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end">
          <button onClick={onClose} className="btn-premium btn-primary !py-2.5 !px-6 !text-xs !rounded-xl">
            Save Configuration
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProfileMenu = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute top-16 right-0 z-[100] w-64 glass-card !p-2 border-white/10 shadow-2xl"
      >
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-primary to-cyan-500 flex items-center justify-center font-black text-xs">
            {user.initials}
          </div>
          <div>
            <div className="text-sm font-bold">{user.name}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">{user.role || 'Site Reliability Engineer'}</div>
          </div>
        </div>
        <div className="p-2 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white">
            <User size={16} /> My Account
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white text-red-400 hover:text-red-300"
          >
            <LogOut size={16} /> Log Out & Termination
          </button>
        </div>
      </motion.div>
    </>
  );
};

const AnalysisPanel = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="glass-card h-full flex flex-col items-center justify-center text-center border-white/5 min-h-[500px]">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" size={24} />
        </div>
        <h3 className="text-2xl font-black mb-3 tracking-tight text-gradient">AI Intelligence Scanning...</h3>
        <p className="text-gray-400 max-w-xs text-sm">Our Gemini-powered engine is correlating telemetry data and system logs.</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="glass-card h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-white/5 bg-transparent min-h-[500px]">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8">
          <Terminal size={32} className="text-gray-600" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-glow">Awaiting Telemetry</h3>
        <p className="text-gray-400 max-w-xs text-sm">Upload system logs or trigger a diagnostic scan to start AI Root Cause Analysis.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card h-full overflow-y-auto custom-scrollbar border-white/10"
    >
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            AI Intelligence Report
          </div>
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            {analysis.isMock ? 'Local Fallback Mode' : 'Gemini-1.5-Flash'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase">Confidence</span>
          <span className="text-lg font-black text-green-500">{analysis.confidence}%</span>
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4">Core Root Cause</h4>
        <h2 className="text-3xl font-black text-white mb-6 leading-none tracking-tighter">{analysis.rootCause || "Indeterminate"}</h2>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative text-gray-300 leading-relaxed bg-black/60 p-6 rounded-xl border border-white/5 italic text-sm">
            <TypewriterText text={analysis.explanation || "No detailed explanation available."} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 group hover:bg-red-500/10 transition-colors">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2 block">Incident Severity</span>
          <span className="text-xl font-black text-red-500 tracking-tight">{analysis.severity || "Unknown"}</span>
        </div>
        <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 group hover:bg-indigo-500/10 transition-colors">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 block">Primary System</span>
          <span className="text-xl font-black text-indigo-500 tracking-tight">{analysis.affectedService || "Global Stack"}</span>
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Failure Propagation Timeline</h4>
        <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
          {analysis.timeline?.map((event, i) => (
            <div key={i} className="flex gap-6 group">
              <div className="relative z-10 w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center group-hover:scale-125 transition-transform">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-indigo-400 block mb-1">{event.timestamp}</span>
                <p className="text-sm text-gray-300 font-medium">{event.event}</p>
              </div>
            </div>
          )) || <p className="text-xs text-gray-600">No timeline data available.</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="text-green-500" size={18} />
            <h4 className="text-sm font-black text-green-500 uppercase tracking-widest">Immediate Mitigation</h4>
          </div>
          <p className="text-sm text-green-100/70 leading-relaxed font-medium">{analysis.suggestedFix || "Manual inspection required."}</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="text-brand-primary" size={18} />
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Strategic Prevention</h4>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed font-medium">{analysis.prevention || "Standard resilience patterns recommended."}</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Multi-Tab Views ---

const OverviewTab = ({ logs, setLogs, handleAnalyze, loading, analysis, history, runDemo }) => (
  <div className="space-y-10">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-black mb-2 tracking-tighter">System Intelligence</h1>
        <p className="text-gray-500 text-sm font-medium">Real-time predictive analysis across your infrastructure.</p>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={runDemo}
          className="btn-premium btn-secondary !px-6 !py-3 !text-xs !rounded-xl !bg-indigo-500/10 !text-indigo-400 !border-indigo-500/20 group"
        >
          <Zap size={14} className="group-hover:scale-125 transition-transform" /> 
          Run Demo Diagnostic
        </button>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-12 lg:col-span-5 space-y-8">
        <div className="glass-card border-white/5 !p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
              <Terminal size={18} className="text-indigo-500" /> Log Stream Input
            </h3>
          </div>
          <div className="relative group mb-6">
             <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
             <textarea 
               value={logs}
               onChange={(e) => setLogs(e.target.value)}
               placeholder="Paste raw telemetry logs here..."
               className="relative w-full h-80 bg-black/60 border border-white/5 rounded-2xl p-6 text-[11px] font-mono text-indigo-300/60 resize-none focus:outline-none focus:border-indigo-500/50 transition-all custom-scrollbar"
             />
          </div>
          <button 
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="btn-premium btn-primary w-full !py-5 !text-sm !rounded-2xl shadow-indigo-500/20 active:scale-[0.98]"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
            {loading ? 'Processing Intelligence...' : 'Analyze Root Cause'}
          </button>
        </div>

        <div className="glass-card border-white/5 !p-8">
          <h3 className="text-[10px] font-black uppercase tracking-widest mb-6">Recent Analysis History</h3>
          <div className="space-y-3">
             {history.map((item, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{item.rootCause}</span>
                    <span className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-600 group-hover:text-white transition-all group-hover:translate-x-1" />
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7">
        <ErrorBoundary>
          <AnalysisPanel analysis={analysis} loading={loading} />
        </ErrorBoundary>
      </div>
    </div>
  </div>
);

const ActiveFaultsTab = ({ history }) => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-black mb-2 tracking-tighter">Active Fault Explorer</h1>
      <p className="text-gray-500 text-sm font-medium">Correlated system anomalies requiring attention.</p>
    </div>
    
    <div className="grid gap-6">
      {history.map((incident, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card !p-8 flex items-center justify-between border-white/5 hover:border-white/10 transition-all group"
        >
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${incident.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${incident.severity === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                  {incident.severity}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID: {incident.id}</span>
              </div>
              <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{incident.rootCause}</h3>
              <p className="text-sm text-gray-500 font-medium">Affected Service: <span className="text-white">{incident.affectedService}</span></p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-gray-400 mb-2">{new Date(incident.timestamp).toLocaleString()}</div>
            <button className="btn-premium btn-secondary !py-2 !px-5 !text-[10px] !rounded-lg border-white/10 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              Investigate Node
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const SystemNodesTab = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-black mb-2 tracking-tighter">Cluster Node Topology</h1>
      <p className="text-gray-500 text-sm font-medium">Real-time health status of your infrastructure nodes.</p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card !p-6 flex flex-col items-center text-center gap-4 group cursor-pointer hover:bg-white/[0.05] transition-all"
        >
          <div className="relative">
             <Server size={32} className={`${i % 7 === 0 ? 'text-red-500' : 'text-green-500'} group-hover:scale-110 transition-transform`} />
             <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${i % 7 === 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          </div>
          <div>
            <div className="text-xs font-black tracking-tight mb-1">node-ap-0{i+1}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">US-EAST-1A</div>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <div className={`h-full ${i % 7 === 0 ? 'w-[98%] bg-red-500' : 'w-[45%] bg-indigo-500'}`} />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const LogStreamTab = () => {
  const [stream, setStream] = useState([]);
  
  useEffect(() => {
    const logs = [
      "INFO: Connection established to database-v2",
      "WARN: Slow query detected in auth_service (450ms)",
      "DEBUG: Cache invalidation triggered for user_7721",
      "ERROR: Failed to write to telemetry buffer",
      "INFO: Node 0xAF reported healthy status",
      "ALERT: Potential OOM signature detected in log_stream_a"
    ];
    
    const interval = setInterval(() => {
      setStream(prev => [
        `[${new Date().toLocaleTimeString()}] ${logs[Math.floor(Math.random() * logs.length)]}`,
        ...prev.slice(0, 19)
      ]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2 tracking-tighter">Live Intelligence Stream</h1>
        <p className="text-gray-500 text-sm font-medium">Real-time correlated telemetry data flowing through the system.</p>
      </div>
      
      <div className="glass-card !p-8 bg-black/60 font-mono text-xs border-white/5 min-h-[600px] overflow-hidden">
        <div className="flex items-center gap-2 mb-6 text-indigo-400 font-bold uppercase tracking-widest">
           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
           Live Streaming Telemetry...
        </div>
        <div className="space-y-3">
          {stream.map((log, i) => (
            <motion.div
              key={log + i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`pb-2 border-b border-white/[0.02] ${log.includes('ERROR') ? 'text-red-400' : log.includes('WARN') ? 'text-orange-400' : 'text-gray-400'}`}
            >
              {log}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Page ---

const DashboardPage = () => {
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settings, setSettings] = useState({ demoMode: true });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    window.location.href = '/';
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/incident-history');
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const performLocalAnalysis = (rawLogs) => {
    const logStr = rawLogs.toLowerCase();
    let result = {
      rootCause: "Anomalous Pattern Detected",
      confidence: 65,
      affectedService: "Infrastructure Core",
      severity: "Medium",
      explanation: "Local heuristics detected an unusual pattern in the log stream that matches known failure signatures.",
      timeline: [{ timestamp: "T-0", event: "Pattern matching sequence initiated" }],
      suggestedFix: "Review system metrics for the identified timeframe.",
      prevention: "Implement more granular logging for this service.",
      isMock: true
    };

    if (logStr.includes('redis')) {
      result = {
        ...result,
        rootCause: "Redis Persistence Failure",
        confidence: 88,
        affectedService: "Cache Cluster",
        severity: "High",
        explanation: "Frequent Redis connection errors or latency spikes detected. Likely due to snapshotting failures or memory pressure.",
        suggestedFix: "Check Redis memory usage and background save status.",
        timeline: [
          { timestamp: "0m", event: "Redis connection timeout" },
          { timestamp: "1m", event: "Cache lookup fallback to primary DB" }
        ]
      };
    } else if (logStr.includes('oom') || logStr.includes('memory')) {
      result = {
        ...result,
        rootCause: "Resource Exhaustion (OOM)",
        confidence: 92,
        affectedService: "Application Node",
        severity: "Critical",
        explanation: "The process was terminated by the kernel OOM killer. High memory usage detected prior to crash.",
        suggestedFix: "Increase node memory limits or optimize application heap usage."
      };
    } else if (logStr.includes('timeout') || logStr.includes('latency')) {
      result = {
        ...result,
        rootCause: "Upstream Service Timeout",
        confidence: 82,
        affectedService: "API Gateway",
        severity: "High",
        explanation: "Increased latency in upstream dependencies causing a cascading timeout in the gateway layer.",
        suggestedFix: "Implement circuit breaking and adjust request timeouts."
      };
    }

    return result;
  };

  const handleAnalyze = async (manualLogs) => {
    const logsToAnalyze = manualLogs || logs;
    if (!logsToAnalyze || logsToAnalyze.trim().length < 10) {
      showToast("Insufficient log data for analysis", "error");
      return;
    }
    
    setLoading(true);
    setAnalysis(null);
    showToast("Initializing AI Root Cause Analysis...", "info");

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        logs: logsToAnalyze,
        context: "Infrastructure: Kubernetes Cluster, Cloud: AWS"
      }, { timeout: 15000 });
      
      if (response.data && response.data.rootCause) {
        setAnalysis(response.data);
        showToast("AI Analysis Complete", "success");
        fetchHistory();
      } else {
        throw new Error("Malformed AI response");
      }
    } catch (err) {
      console.error("Analysis failure:", err);
      
      if (settings.demoMode) {
        showToast("API unavailable. Running intelligent local analysis.", "info");
        setTimeout(() => {
          const mockResult = performLocalAnalysis(logsToAnalyze);
          setAnalysis(mockResult);
          setLoading(false);
          showToast("Local Heuristic Analysis Complete", "success");
          setHistory(prev => [{
            id: 'mock_' + Math.random().toString(36).substr(2, 4),
            timestamp: new Date().toISOString(),
            rootCause: mockResult.rootCause,
            severity: mockResult.severity,
            affectedService: mockResult.affectedService
          }, ...prev]);
        }, 1500);
      } else {
        showToast("Analysis failed. Please check your API configuration.", "error");
        setLoading(false);
      }
    } finally {
      if (!settings.demoMode) setLoading(false);
    }
  };

  const runDemo = () => {
    const demoLogs = `
[2024-05-23 14:01:05] WARN: Redis memory usage at 88%
[2024-05-23 14:02:11] ALERT: Redis memory usage at 95%
[2024-05-23 14:04:45] ERROR: Connection timeout on redis-primary:6379
[2024-05-23 14:05:01] FATAL: OrderService crashed due to Redis connection failure
[2024-05-23 14:05:12] SYSTEM: Node node-01-ap-south-1 reported OOM Killer for pid 4452 (redis-server)
    `;
    setLogs(demoLogs);
    handleAnalyze(demoLogs);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background relative selection:bg-indigo-500/30">
      <MouseGlow />
      
      <AnimatePresence mode="wait">
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 gap-10 shrink-0 relative z-10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href='/'}>
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black tracking-tighter">IncidentIQ</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Intelligence' },
            { id: 'incidents', icon: <AlertTriangle size={18} />, label: 'Active Faults' },
            { id: 'systems', icon: <Server size={18} />, label: 'System Nodes' },
            { id: 'logs', icon: <Terminal size={18} />, label: 'Log Stream' },
            { id: 'alerts', icon: <Bell size={18} />, label: 'Notification' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                showToast(`Switched to ${item.label}`, "info");
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                activeTab === item.id ? 'bg-white/10 text-white font-bold' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`${activeTab === item.id ? 'text-indigo-400' : 'group-hover:text-white'}`}>
                {item.icon}
              </div>
              <span className="text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="glass-card !p-5 !rounded-[24px] border-white/5 bg-white/[0.02] group">
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-3 group-hover:text-indigo-300 transition-colors">Enterprise Plan</p>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              className="h-full bg-indigo-500" 
            />
          </div>
          <div className="flex justify-between items-center">
             <p className="text-[10px] text-gray-500 font-bold uppercase">Token Quota</p>
             <p className="text-[10px] text-white font-bold">750/1000</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between shrink-0 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-6 flex-1">
            <SearchIcon size={18} className="text-gray-600" />
            <input 
              type="text" 
              placeholder="Query telemetry, logs, or node status..." 
              className="bg-transparent border-none outline-none text-sm text-gray-400 w-full max-w-xl font-medium"
            />
          </div>
          <div className="flex items-center gap-6 relative">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-xl hover:bg-white/5 text-gray-500 transition-all hover:text-white active:scale-95"
            >
              <Settings size={20} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-primary to-cyan-500 p-[1.5px] shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/30 transition-all active:scale-95"
              >
                <div className="h-full w-full rounded-[10px] bg-black flex items-center justify-center text-[10px] font-black tracking-tighter">
                  {user.initials}
                </div>
              </button>
              <AnimatePresence>
                {isProfileOpen && (
                  <ProfileMenu 
                    user={user} 
                    isOpen={isProfileOpen} 
                    onClose={() => setIsProfileOpen(false)} 
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Tab Rendering */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                      icon={<Activity size={20} />} 
                      label="System Integrity" 
                      value="98.2%" 
                      trend="+0.4%" 
                      colorClass="bg-green-500"
                    />
                    <StatCard 
                      icon={<AlertTriangle size={20} />} 
                      label="Active Faults" 
                      value={history.length.toString()} 
                      trend="+2" 
                      colorClass="bg-red-500"
                    />
                    <StatCard 
                      icon={<Clock size={20} />} 
                      label="Avg Resolve" 
                      value="14m" 
                      trend="-4m" 
                      colorClass="bg-indigo-500"
                    />
                    <StatCard 
                      icon={<Cpu size={20} />} 
                      label="Cluster Load" 
                      value="42%" 
                      trend="+12%" 
                      colorClass="bg-indigo-500"
                    />
                  </div>
                  
                  <OverviewTab 
                    logs={logs}
                    setLogs={setLogs}
                    handleAnalyze={handleAnalyze}
                    loading={loading}
                    analysis={analysis}
                    history={history}
                    runDemo={runDemo}
                  />
                </motion.div>
              )}
              
              {activeTab === 'incidents' && (
                <motion.div
                  key="incidents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ActiveFaultsTab history={history} />
                </motion.div>
              )}

              {activeTab === 'systems' && (
                <motion.div
                  key="systems"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <SystemNodesTab />
                </motion.div>
              )}

              {activeTab === 'logs' && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <LogStreamTab />
                </motion.div>
              )}

              {activeTab === 'alerts' && (
                <motion.div
                  key="alerts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-4xl font-black mb-2 tracking-tighter">Notification Center</h1>
                      <p className="text-gray-500 text-sm font-medium">Critical system notifications and audit logs.</p>
                    </div>
                    <div className="glass-card !p-8">
                       <p className="text-gray-500 italic">No new notifications. Everything looks clear.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
