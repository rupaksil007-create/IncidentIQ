import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PricingCard = ({ tier, price, features, recommended, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={`glass-card relative flex flex-col p-8 ${recommended ? 'border-brand-primary/50 bg-brand-primary/[0.02]' : 'border-white/5'}`}
  >
    {recommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest">
        Most Popular
      </div>
    )}
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-2">{tier}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black">{price}</span>
        {price !== 'Custom' && <span className="text-gray-500 text-sm">/mo</span>}
      </div>
    </div>
    <div className="flex-1 space-y-4 mb-8">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Check size={12} strokeWidth={3} />
          </div>
          <span className="text-sm text-gray-400">{f}</span>
        </div>
      ))}
    </div>
    <button className={`btn-premium w-full !rounded-xl !py-3 ${recommended ? 'btn-primary' : 'btn-secondary'}`}>
      {tier === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
    </button>
  </motion.div>
);

const Pricing = () => {
  return (
    <section id="pricing" className="section-padding relative">
      <div className="container-premium">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Simple, <span className="text-indigo-500">transparent pricing.</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto">Choose the plan that fits your infrastructure needs. No hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard 
            tier="Free Hackathon"
            price="$0"
            features={[
              "Up to 1,000 logs/day",
              "Gemini 1.5 Flash access",
              "Basic RCA dashboard",
              "3-day history",
              "Community support"
            ]}
            delay={0.1}
          />
          <PricingCard 
            tier="Pro SRE"
            price="$49"
            features={[
              "Unlimited log analysis",
              "Gemini 1.5 Pro access",
              "Custom ML thresholds",
              "30-day history",
              "Priority email support",
              "Team collaboration"
            ]}
            recommended
            delay={0.2}
          />
          <PricingCard 
            tier="Enterprise"
            price="Custom"
            features={[
              "On-prem deployment",
              "Air-gapped AI support",
              "SSO & RBAC",
              "Unlimited history",
              "24/7 Dedicated SRE team",
              "Custom SLA"
            ]}
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
