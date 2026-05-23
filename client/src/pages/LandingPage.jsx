import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/premium/Navbar';
import MouseGlow from '../components/premium/MouseGlow';
import Hero from '../components/premium/Hero';
import Features from '../components/premium/Features';
import Pricing from '../components/premium/Pricing';
import DemoModal from '../components/premium/DemoModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen">
      <MouseGlow />
      <Navbar />
      
      <AnimatePresence>
        {isDemoOpen && (
          <DemoModal 
            isOpen={isDemoOpen} 
            onClose={() => setIsDemoOpen(false)} 
          />
        )}
      </AnimatePresence>

      <main>
        <Hero 
          onStart={handleStart} 
          onWatchDemo={() => setIsDemoOpen(true)}
        />
        
        <Features />

        <Pricing />

        {/* Enterprise Trust Section */}
        <section className="py-20 border-t border-white/5">
          <div className="container-premium">
            <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-10">Trusted by modern engineering teams</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               {['Vercel', 'Linear', 'Stripe', 'Datadog', 'CrowdStrike'].map(logo => (
                 <span key={logo} className="text-2xl font-black tracking-tighter">{logo}</span>
               ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding border-t border-white/5 bg-brand-primary/[0.01]">
          <div className="container-premium text-center">
             <h2 className="text-5xl font-black mb-8 tracking-tighter">Ready to stabilize your <span className="text-indigo-500">production?</span></h2>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={handleStart}
                  className="btn-premium btn-primary !px-10 !py-4 !text-lg !rounded-2xl"
                >
                  Start Analyzing For Free
                </button>
                <button 
                  onClick={() => setIsDemoOpen(true)}
                  className="btn-premium btn-secondary !px-10 !py-4 !text-lg !rounded-2xl"
                >
                  See Gemini In Action
                </button>
             </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-white/5">
          <div className="container-premium flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black tracking-tighter">IncidentIQ</span>
              <span className="text-xs text-gray-600">© 2026. All rights reserved.</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <button onClick={() => window.open('https://github.com', '_blank')} className="hover:text-white transition-colors">Documentation</button>
              <button className="hover:text-white transition-colors">API Status</button>
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
