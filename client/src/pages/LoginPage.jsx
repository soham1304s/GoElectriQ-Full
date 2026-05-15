import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { 
  Eye, 
  EyeOff, 
  Loader, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail,
  User,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../components/auth/AuthLayout';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const isGoogleOAuthConfigured =
  googleClientId &&
  googleClientId !== 'YOUR_GOOGLE_CLIENT_ID' &&
  !googleClientId.toLowerCase().includes('your_google_client_id');

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin, loginWithGoogle, user } = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) navigate('/user/dashboard');
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess('');
    setLoading(true);
    try {
      const result = await authLogin(identifier, password);
      if (result.success) {
        setSuccess('Access granted. Initializing session...');
        setTimeout(() => navigate('/user/dashboard'), 1000);
      } else {
        if (result.message && result.message.toLowerCase().includes('admin')) {
          setError('Admin detected. Redirecting...');
          setTimeout(() => navigate('/admin/login'), 1500);
        } else {
          setError(result.message || 'Invalid credentials. Please try again.');
        }
      }
    } catch (err) {
      setError('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const result = await loginWithGoogle(credentialResponse?.credential);
      if (result.success) {
        setSuccess('Identity verified. Redirecting...');
        setTimeout(() => navigate('/user/dashboard'), 1000);
      } else {
        setError(result.message || 'Google authentication failed.');
      }
    } catch (err) {
      setError('Federated login error. Please try standard login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your GoElectriQ account"
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-3 mb-6"
          >
            <AlertCircle className="text-rose-500 shrink-0" size={18} />
            <p className="text-xs font-semibold text-rose-600">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-center gap-3 mb-6"
          >
            <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
            <p className="text-xs font-semibold text-green-600">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email or Phone</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              {identifier.includes('@') ? <Mail size={18} /> : <User size={18} />}
            </div>
            <input
              type="text"
              placeholder="Enter your email or phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-sm font-medium transition-all outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <Link to="/forgot-password" size="sm" className="text-[11px] font-bold text-green-600 hover:text-green-700 transition-colors">Forgot?</Link>
          </div>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-sm font-medium transition-all outline-none"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {isGoogleOAuthConfigured && (
        <>
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <span className="relative px-4 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Social Access</span>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed.')}
              theme="outline"
              shape="pill"
              width="100%"
            />
          </div>
        </>
      )}

      <p className="mt-8 text-center text-sm text-slate-500">
        Don't have an account? 
        <Link to="/register" className="text-green-600 font-bold hover:underline ml-1.5">Create Account</Link>
      </p>
    </AuthLayout>
  );
}
