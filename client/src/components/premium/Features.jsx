import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, BarChart3, Clock, Cpu, Database } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={`glass-card group hover:scale-[1.02] transition-all ${className}`}
  >
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 transition-colors">
      <Icon className="text-gray-400 group-hover:text-brand-primary transition-colors" size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const Features = () => {
  return (
    <section id="features" className="section-padding relative">
      <div className="container-premium">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Built for scale. <span className="text-indigo-500">Trusted by SREs.</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto">Modern infrastructure requires modern analysis. IncidentIQ brings the power of Gemini to your production stack.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Zap}
            title="Instant RCA"
            desc="Analyze millions of log lines in seconds. Gemini identifies the needle in the haystack automatically."
            className="md:col-span-2"
            delay={0.1}
          />
          <FeatureCard 
            icon={Shield}
            title="Safety First"
            desc="Enterprise-grade security. Your logs never leave your VPC with our hybrid-cloud AI adapter."
            delay={0.2}
          />
          <FeatureCard 
            icon={Clock}
            title="Predictive Alerts"
            desc="Get notified of potential failures before they impact your customers with pattern detection."
            delay={0.3}
          />
          <FeatureCard 
            icon={Database}
            title="Multi-Cloud"
            desc="Deep integration with AWS, GCP, Azure, and on-prem Kubernetes clusters."
            className="md:col-span-2"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
