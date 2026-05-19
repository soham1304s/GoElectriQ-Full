import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  Car,
  Zap,
  Activity,
  ArrowRight,
  User as UserIcon,
  Phone,
  MapPin,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import UserLayout from './UserLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import * as authService from '../../services/authService.js';

const ApplicationStatusPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('driver');
  const [data, setData] = useState({
    driver: null,
    cab: null,
    charging: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStatuses = async () => {
      try {
        const [driverRes, cabRes, chargingRes] = await Promise.all([
          authService.getDriverStatus().catch(() => ({ success: false })),
          authService.getCabStatus().catch(() => ({ success: false })),
          authService.getChargingStatus().catch(() => ({ success: false }))
        ]);

        setData({
          driver: driverRes.success ? driverRes.data : null,
          cab: cabRes.success ? cabRes.data : null,
          charging: chargingRes.success ? chargingRes.data : []
        });

        // Set initial tab based on what's available
        if (!driverRes.data && cabRes.data) setActiveTab('cab');
        else if (!driverRes.data && !cabRes.data && chargingRes.data?.length > 0) setActiveTab('charging');
        
      } catch (error) {
        console.error('Error fetching all statuses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAllStatuses();
    } else {
      setLoading(false);
    }
  }, [user]);

  const StatusBadge = ({ status, isApproved }) => {
    const s = isApproved ? 'verified' : (status || 'pending').toLowerCase();
    const colors = {
      verified: 'bg-green-500/10 text-emerald-500 border-emerald-500/20',
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      approved: 'bg-green-500/10 text-emerald-500 border-emerald-500/20',
    };
    return (
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[s] || colors.pending}`}>
        {isApproved ? 'Verified' : s}
      </span>
    );
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mb-6"
          />
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Syncing Applications...</p>
        </div>
      </UserLayout>
    );
  }

  const renderDriverTab = () => {
    const driver = data.driver;
    if (!driver) return <EmptyState type="Driver Partner" link="/partner/driver" />;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <StatusHeader 
          title="Driver Onboarding" 
          status={driver.status} 
          isApproved={driver.isApproved} 
          reason={driver.rejectionReason}
          icon={UserIcon}
        />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#022c22] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Activity size={16} /> Profile Details
            </h4>
            <div className="space-y-4">
              <DetailItem label="Identity" value={driver.name} />
              <DetailItem label="Communication" value={driver.email} />
              <DetailItem label="Secure Line" value={driver.phone} />
              <DetailItem label="License Auth" value={driver.licenseNumber} />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#022c22] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Car size={16} /> Vehicle Assignment
            </h4>
            <div className="space-y-4">
              <DetailItem label="Model" value={driver.vehicleDetails?.vehicleModel} />
              <DetailItem label="Plate Number" value={driver.vehicleDetails?.vehicleNumber} />
              <DetailItem label="Protocol" value={driver.vehicleDetails?.vehicleType} />
              <DetailItem label="Submission" value={new Date(driver.createdAt).toLocaleDateString()} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderCabTab = () => {
    const cab = data.cab;
    if (!cab) return <EmptyState type="Cab Partner" link="/partner/cab" />;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <StatusHeader 
          title="Fleet Partnership" 
          status={cab.status} 
          isApproved={cab.isApproved} 
          reason={cab.rejectionReason}
          icon={Car}
        />
        
        <div className="bg-white dark:bg-[#022c22] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <Activity size={16} /> Asset Details
          </h4>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
            <DetailItem label="Fleet Owner" value={cab.ownerName} />
            <DetailItem label="Contact Matrix" value={cab.phone} />
            <DetailItem label="Vehicle Model" value={cab.vehicleModel} />
            <DetailItem label="EV Tier" value={cab.evType} />
            <DetailItem label="Submission Date" value={new Date(cab.createdAt).toLocaleDateString()} />
          </div>
        </div>
      </motion.div>
    );
  };

  const renderChargingTab = () => {
    const enquiries = data.charging;
    if (!enquiries || enquiries.length === 0) return <EmptyState type="Charging Installation" link="/charging" />;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {enquiries.map((enq, idx) => (
          <div key={enq._id} className="bg-white dark:bg-[#022c22] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <StatusBadge status={enq.status} />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Charging Protocol #{idx + 1}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(enq.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <DetailItem label="Location" value={enq.city} />
              <DetailItem label="Protocol Type" value={enq.enquiryType} />
              <DetailItem label="Identity" value={enq.name} />
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Requirement Matrix</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{enq.message}</p>
            </div>
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Application Hub</h1>
            <p className="text-slate-500 font-medium">Monitor your integration protocols across the XYZ network.</p>
          </div>
          
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            {[
              { id: 'driver', label: 'Driver', icon: UserIcon },
              { id: 'cab', label: 'Cab', icon: Car },
              { id: 'charging', label: 'Charging', icon: Zap }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-emerald-500'
                }`}
              >
                <tab.icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'driver' && renderDriverTab()}
            {activeTab === 'cab' && renderCabTab()}
            {activeTab === 'charging' && renderChargingTab()}
          </AnimatePresence>
        </div>
      </div>
    </UserLayout>
  );
};

const StatusHeader = ({ title, status, isApproved, reason, icon: Icon }) => (
  <div className="bg-[#022c22] p-10 rounded-[3.5rem] text-white relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${isApproved ? 'bg-green-500' : 'bg-emerald-600'}`}>
        <Icon size={40} />
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
          <h2 className="text-3xl font-black tracking-tight">{title}</h2>
          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            isApproved ? 'bg-green-500/20 text-emerald-400 border-emerald-500/20' : 'bg-white/10 text-white border-white/10'
          }`}>
            {isApproved ? 'Verified' : status.toUpperCase()}
          </span>
        </div>
        <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
          {isApproved 
            ? 'Your protocol has been verified. Welcome to the network.' 
            : status === 'rejected' 
              ? `Remediation required. Reason: ${reason || 'Document mismatch.'}`
              : 'Our secure audit team is currently verifying your transmitted documents.'}
        </p>
      </div>
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{value || 'Pending Synchronization'}</p>
  </div>
);

const EmptyState = ({ type, link }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center bg-white dark:bg-[#022c22] rounded-[3.5rem] border border-dashed border-slate-200 dark:border-slate-800">
    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8">
      <Activity size={32} className="text-slate-300" />
    </div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">No {type} Protocol Found.</h3>
    <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium">Initiate your integration with the XYZ grid to monitor status here.</p>
    <button
      onClick={() => window.location.href = link}
      className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
    >
      Initiate Now <ArrowRight size={16} />
    </button>
  </motion.div>
);

export default ApplicationStatusPage;
