import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, RefreshCw, CheckCircle2, Shield, Search } from 'lucide-react';
import axios from 'axios';

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
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

const DemoModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('idle'); // idle, loading, results
  const [analysis, setAnalysis] = useState(null);

  const startDemo = async () => {
    setStep('loading');
    try {
      const { data } = await axios.get('http://localhost:5000/api/demo-incident');
      const response = await axios.post('http://localhost:5000/api/analyze', {
        logs: data.logs,
        context: data.context
      });
      setAnalysis(response.data);
      setStep('results');
    } catch (err) {
      console.error(err);
      // Fallback mock data
      setTimeout(() => {
        setAnalysis({
          rootCause: "Redis Cluster Memory Eviction",
          confidence: 94,
          affectedService: "Order-Processing-Service",
          severity: "Critical",
          explanation: "The Redis instance reached its maximum memory limit (maxmemory policy set to 'noeviction'), causing write operations to fail and crashing the dependent payment microservice.",
          timeline: [
            { timestamp: "14:02:11", event: "Memory usage exceeded 90% threshold" },
            { timestamp: "14:04:45", event: "Redis write operations latency spike (+400ms)" },
            { timestamp: "14:05:12", event: "OOM killer invoked on Redis primary node" },
            { timestamp: "14:05:30", event: "Service failure cascade detected" }
          ],
          suggestedFix: "Increase Redis memory allocation and change eviction policy to 'volatile-lru'.",
          prevention: "Implement horizontal scaling for Redis and set up proactive memory alerts at 75% usage."
        });
        setStep('results');
      }, 2000);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startDemo();
    } else {
      setStep('idle');
      setAnalysis(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-4xl !p-0 overflow-hidden border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={18} />
            </div>
            <h3 className="text-xl font-bold">Interactive AI Demo</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="min-h-[500px] flex flex-col">
          {step === 'loading' && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" size={32} />
              </div>
              <h4 className="text-2xl font-black mb-4">Gemini is analyzing telemetry...</h4>
              <p className="text-gray-400 max-w-sm">Correlating logs, tracing dependency chains, and pinpointing the root cause in real-time.</p>
            </div>
          )}

          {step === 'results' && analysis && (
            <div className="flex-1 p-8 grid md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="space-y-8">
                <div>
                  <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest inline-block mb-4">
                    AI Intelligence Report
                  </div>
                  <h2 className="text-3xl font-black text-white mb-4 leading-none tracking-tighter">{analysis.rootCause}</h2>
                  <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-sm text-gray-300 leading-relaxed italic">
                    <TypewriterText text={analysis.explanation} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1 block">Severity</span>
                    <span className="text-lg font-black text-red-500">{analysis.severity}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1 block">Confidence</span>
                    <span className="text-lg font-black text-indigo-500">{analysis.confidence}%</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/10">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="text-green-500" size={18} />
                    <h4 className="text-sm font-black text-green-500 uppercase tracking-widest">Suggested Fix</h4>
                  </div>
                  <p className="text-sm text-green-100/70 font-medium">{analysis.suggestedFix}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Failure Propagation Timeline</h4>
                  <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                    {analysis.timeline?.map((event, i) => (
                      <div key={i} className="flex gap-6">
                        <div className="relative z-10 w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-indigo-400 block mb-1">{event.timestamp}</span>
                          <p className="text-sm text-gray-300 font-medium">{event.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="text-brand-primary" size={18} />
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Prevention</h4>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">{analysis.prevention}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-between items-center">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Interactive Simulation Mode</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-premium btn-secondary !py-2 !px-6 !text-xs !rounded-xl">
              Close Demo
            </button>
            <button onClick={() => window.location.href='/dashboard'} className="btn-premium btn-primary !py-2 !px-6 !text-xs !rounded-xl">
              Try with your logs
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DemoModal;
