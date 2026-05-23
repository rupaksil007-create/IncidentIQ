import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Shield, Search } from 'lucide-react';

const Hero = ({ onStart, onWatchDemo }) => {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      <div className="container-premium">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.0: AI-Engine Redesigned
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            <span className="text-gradient">AI finds outages</span> <br />
            <span className="text-indigo-500 text-glow">before engineers panic.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed"
          >
            The world's first predictive incident management platform that analyzes system telemetry and logs to pinpoint root causes in milliseconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <button onClick={onStart} className="btn-premium btn-primary !px-10 !py-5 !text-lg !rounded-2xl group">
              Start Analyzing Now
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={onWatchDemo} className="btn-premium btn-secondary !px-10 !py-5 !text-lg !rounded-2xl">
              Watch Intelligence Demo
            </button>
          </motion.div>

          {/* Floating Visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative w-full max-w-5xl mx-auto"
          >
            <div className="glass-card !p-2 !rounded-[32px] border-white/10 shadow-2xl relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 blur-[60px] rounded-full" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-[60px] rounded-full" />
              
              <div className="bg-[#0a0a0a] rounded-[24px] overflow-hidden border border-white/5 aspect-[16/9] relative group">
                {/* Mock UI Preview */}
                <div className="absolute inset-0 p-8 flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <Zap size={24} className="text-brand-primary" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-gray-500 uppercase">Current Analysis</div>
                        <div className="text-xl font-bold">incident_report_0x4F.log</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold">CRITICAL</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 flex-1">
                    <div className="col-span-2 glass-card !p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold">Root Cause Identification</h4>
                        <div className="text-[10px] font-mono text-indigo-400">98.4% Confidence</div>
                      </div>
                      <div className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-[10px] text-indigo-300/80 leading-relaxed overflow-hidden relative">
                         <div className="animate-pulse mb-2 opacity-50">&gt; ANALYZING CLUSTER_EVENT_LOG...</div>
                         <div className="mb-2">&gt; DETECTED: Redis OOM at node-04</div>
                         <div className="mb-2">&gt; CORRELATING: Latency spikes in CheckoutService</div>
                         <div className="mb-2">&gt; TRACING: Dependency chain affected (Payment, Inventory)</div>
                         <div className="text-white">&gt; ROOT CAUSE FOUND: Memory leak in cache-invalidation-service</div>
                         <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="glass-card !p-4 !rounded-2xl border-white/5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                          <Shield size={20} />
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase">Security</div>
                          <div className="text-xs font-bold text-green-500">Encrypted</div>
                        </div>
                      </div>
                      <div className="glass-card !p-4 !rounded-2xl border-white/5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                          <Search size={20} />
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase">Monitoring</div>
                          <div className="text-xs font-bold text-white">14 Services</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none" 
                  style={{ 
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', 
                    backgroundSize: '24px 24px' 
                  }} 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
