import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToSection = (id) => {
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const el = document.getElementById(id.toLowerCase());
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl"
    >
      <div className="glass-card !py-4 !px-8 flex items-center justify-between !rounded-full">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold tracking-tighter">IncidentIQ</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Intelligence', 'Security', 'Pricing'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-primary transition-all group-hover:w-full" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button 
                onClick={() => navigate('/auth')}
                className="btn-premium btn-secondary !py-2 !px-5 !text-xs"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="btn-premium btn-primary !py-2 !px-6 !text-xs !rounded-full"
              >
                Launch App
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-premium btn-primary !py-2 !px-6 !text-xs !rounded-full"
            >
              Enter Dashboard
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
