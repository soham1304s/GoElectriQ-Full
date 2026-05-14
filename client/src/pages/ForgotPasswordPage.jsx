import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Loader, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as authService from '../services/authService';
import AuthLayout from '../components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email node address.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Protocol failure. Unable to send reset link.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Neural link synchronization failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={success ? "Protocol Initiated" : "Recover Identity"} 
      subtitle={success ? "Check your communication node" : "Initiate key recovery sequence"}
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 mb-8"
          >
            <div className="p-2 bg-rose-100 text-rose-500 rounded-xl">
              <ShieldCheck size={16} />
            </div>
            <p className="text-xs font-black text-rose-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Node</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="name@nexus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-8 py-5 bg-slate-50 rounded-[1.5rem] border-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-5 bg-[#022c22] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader className="animate-spin" size={18} />
                <span>Transmitting...</span>
              </div>
            ) : (
              <>
                Send Reset Link
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Remembered Key? <Link to="/login" className="text-emerald-600 hover:text-emerald-700 ml-1">Establish Link</Link>
          </p>
        </form>
      ) : (
        <div className="space-y-8 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <div className="p-6 bg-emerald-50 text-emerald-500 rounded-[2rem] border border-emerald-100">
              <CheckCircle size={48} />
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-600 leading-relaxed">
              A synchronization link has been sent to <span className="text-slate-900">{email}</span>. 
              Please verify within 30 minutes.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">💡 Pro Tip</p>
              <p className="text-xs text-slate-600">If the node signal doesn't appear, check your spam or junk sector.</p>
            </div>
          </div>

          <button 
            onClick={() => setSuccess(false)}
            className="w-full py-5 border-2 border-slate-100 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
          >
            <ArrowLeft size={18} />
            Retry Protocol
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
