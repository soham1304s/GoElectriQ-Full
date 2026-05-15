import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { 
  Eye, 
  EyeOff, 
  Loader, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../components/auth/AuthLayout";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const isGoogleOAuthConfigured =
  googleClientId &&
  googleClientId !== "YOUR_GOOGLE_CLIENT_ID" &&
  !googleClientId.toLowerCase().includes("your_google_client_id");

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: authRegister, loginWithGoogle, user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) navigate("/user/dashboard");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!agreeTerms) return setError("Please agree to the Terms & Privacy.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const res = await authRegister(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        formData.password
      );

      if (res.success) {
        setSuccess("Account created! Redirecting to dashboard...");
        setTimeout(() => navigate("/user/dashboard"), 1000);
      } else {
        setError(res.message || "Registration failed.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const result = await loginWithGoogle(credentialResponse?.credential);
      if (result.success) {
        setSuccess("Identity verified. Redirecting...");
        setTimeout(() => navigate("/user/dashboard"), 1000);
      } else {
        setError(result.message || "Google registration failed.");
      }
    } catch (err) {
      setError("Federated login error. Please use standard registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the sustainable mobility revolution"
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-3 mb-5"
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
            className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-center gap-3 mb-5"
          >
            <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
            <p className="text-xs font-semibold text-green-600">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" name="firstName" placeholder="John" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-sm font-medium transition-all outline-none" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" name="lastName" placeholder="Doe" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-sm font-medium transition-all outline-none" required />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="email" name="email" placeholder="john@example.com" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-sm font-medium transition-all outline-none" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-sm font-medium transition-all outline-none" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-sm font-medium transition-all outline-none"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm</label>
            <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-sm font-medium transition-all outline-none" required />
          </div>
        </div>

        <div className="flex items-center gap-2 px-1">
          <input 
            type="checkbox" 
            id="terms" 
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)} 
            className="w-4 h-4 rounded border-slate-200 text-emerald-500 focus:ring-emerald-500 transition-all cursor-pointer"
          />
          <label htmlFor="terms" className="text-[11px] font-medium text-slate-500 cursor-pointer">
            I agree to the <span className="text-green-600 font-bold">Terms</span> & <span className="text-green-600 font-bold">Privacy Policy</span>
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <>
              Create Account
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {isGoogleOAuthConfigured && (
        <>
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <span className="relative px-4 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Quick Signup</span>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google signup failed.')}
              theme="outline"
              shape="pill"
              width="100%"
            />
          </div>
        </>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account? 
        <Link to="/login" className="text-green-600 font-bold hover:underline ml-1.5">Sign In</Link>
      </p>
    </AuthLayout>
  );
}
