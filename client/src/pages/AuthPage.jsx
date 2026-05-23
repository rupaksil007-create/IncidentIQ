import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import MouseGlow from '../components/premium/MouseGlow';

const AuthPage = () => {
  const [view, setView] = useState('login'); // login, signup, verify, forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(data.token, data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      showToast('Account created! You can now log in.', 'success');
      setView('login');
    } catch (err) {
      showToast(err.response?.data?.error || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpString = otp.join('');
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp: otpString });
      showToast('Email verified! You can now log in.', 'success');
      setView('login');
    } catch (err) {
      showToast(err.response?.data?.error || 'Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
      showToast('A new 6-digit access code has been dispatched to your inbox.', 'success');
      setResendTimer(30);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to dispatch new OTP code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (index === idx ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black">
      <MouseGlow />
      
      {/* Brand Watermark */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-50">
        <Activity className="text-indigo-500" size={24} />
        <span className="text-2xl font-black tracking-tighter">IncidentIQ</span>
      </div>

      <AnimatePresence mode="wait">
        {view === 'login' && (
          <motion.div 
            key="login"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-[400px] z-10"
          >
            <div className="glass-card !p-10 border-white/10 shadow-2xl">
              <div className="mb-10">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome back</h2>
                <p className="text-gray-500 text-sm font-medium">Log in to your SRE workstation.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Work Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Workstation Password</label>
                    <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400">Forgot?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700"
                      placeholder="••••••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="btn-premium btn-primary w-full !py-4 !text-sm !rounded-xl shadow-indigo-500/20 group"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : (
                    <span className="flex items-center gap-2">
                      Initialize Station <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  New to IncidentIQ?{' '}
                  <button onClick={() => setView('signup')} className="text-white font-bold hover:underline">Deploy Account</button>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'signup' && (
          <motion.div 
            key="signup"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-[400px] z-10"
          >
            <div className="glass-card !p-10 border-white/10 shadow-2xl">
              <button onClick={() => setView('login')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 text-xs font-bold transition-colors">
                <ChevronLeft size={16} /> Back to Login
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Join the fleet</h2>
                <p className="text-gray-500 text-sm font-medium">Standardize your incident response.</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700"
                      placeholder="Commander Rupak"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Work Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Create Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="btn-premium btn-primary w-full !py-4 !text-sm !rounded-xl shadow-indigo-500/20 group"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : (
                    <span className="flex items-center gap-2">
                      Deploy Profile <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {view === 'verify' && (
          <motion.div 
            key="verify"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-[450px] z-10 text-center"
          >
            <div className="glass-card !p-12 border-white/10 shadow-2xl">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
                <Mail className="text-indigo-500" size={32} />
              </div>
              
              <h2 className="text-3xl font-black mb-4 tracking-tight">Security Check</h2>
              <p className="text-gray-500 text-sm font-medium mb-10">
                We've transmitted a 6-digit access code to <br />
                <span className="text-white font-bold">{email}</span>.
              </p>

              <form onSubmit={handleVerify} className="space-y-10">
                <div className="flex justify-center gap-3">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      name="otp"
                      maxLength="1"
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onFocus={e => e.target.select()}
                      className="w-12 h-16 bg-white/[0.03] border border-white/5 rounded-xl text-center text-2xl font-black text-indigo-400 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  ))}
                </div>

                <button 
                  disabled={loading}
                  className="btn-premium btn-primary w-full !py-4 !text-sm !rounded-xl shadow-indigo-500/20"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Authorize Station Access'}
                </button>

                <div className="flex flex-col gap-4">
                  <button 
                    type="button" 
                    disabled={resendTimer > 0 || loading}
                    onClick={handleResendOtp}
                    className={`text-xs font-bold transition-colors uppercase tracking-widest ${
                      resendTimer > 0 
                        ? 'text-indigo-500/50 cursor-not-allowed' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Transmission'}
                  </button>
                  <button type="button" onClick={() => setView('login')} className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">Change Intelligence Channel (Email)</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
