import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { 
  Building2, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft,
  ShieldCheck,
  Car,
  Inbox
} from 'lucide-react';
import { AdminCarManagement } from '../components/AdminCarManagement';
import { AdminEnquiryManagement } from '../components/AdminEnquiryManagement';
import { AdminBankManagement } from '../components/AdminBankManagement';

interface AdminPageProps {
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ setRoute }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('hwz_admin_token'));
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Admin Section Navigation: 'enquiries' (PostgreSQL leads), 'fleet' (Car Rental Fleet CRUD), 'bank' (Official Bank Accounts)
  const [activeAdminSection, setActiveAdminSection] = useState<'enquiries' | 'fleet' | 'bank'>(() => {
    const saved = localStorage.getItem('hwz_admin_last_tab');
    if (saved === 'fleet' || saved === 'enquiries' || saved === 'bank') return saved;
    return 'fleet'; // Default to fleet for car rental management
  });

  const handleSelectTab = (tab: 'enquiries' | 'fleet' | 'bank') => {
    setActiveAdminSection(tab);
    localStorage.setItem('hwz_admin_last_tab', tab);
  };

  const [notification, setNotification] = useState<{ message: string; isError: boolean } | null>(null);

  const showToast = (message: string, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // 1. Admin Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const json = await res.json();
      if (json.success && json.token) {
        setToken(json.token);
        localStorage.setItem('hwz_admin_token', json.token);
        setPasswordInput('');
      } else {
        setLoginError(json.error || 'Invalid admin credentials. Access denied.');
      }
    } catch (err) {
      setLoginError('Could not reach backend server. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
      }
    } catch (e) {
      // Ignore
    } finally {
      setToken(null);
      localStorage.removeItem('hwz_admin_token');
    }
  };

  useEffect(() => {
    if (token) {
      fetch('/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
        }
      }).catch(() => {
        // Continue
      });
    }
  }, [token]);

  // If not logged in, render Admin Authentication Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A2540] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6 border border-slate-100">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#0B4DA2]/10 rounded-2xl flex items-center justify-center mx-auto text-[#0B4DA2] border border-[#0B4DA2]/20">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0A2540] tracking-tight font-serif">
              Backend Admin
            </h1>
            <p className="text-xs text-slate-500">
              Authorized access to manage fleet, enquiries, and official payment bank details
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2]"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-500">Default Access Key: </span>
              <code className="text-xs font-bold text-[#0B4DA2] bg-white px-2 py-0.5 rounded border border-slate-200">admin123</code>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Admin</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRoute('home')}
              className="text-xs font-medium text-slate-500 hover:text-[#0B4DA2] transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      
      {/* Admin Top Bar */}
      <header className="bg-[#0A2540] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B4DA2] flex items-center justify-center text-white shrink-0">
              {activeAdminSection === 'fleet' ? <Car className="w-5 h-5" /> : activeAdminSection === 'bank' ? <Building2 className="w-5 h-5" /> : <Inbox className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Zone Tourism & Hotwheels Car Rental Admin
              </h2>
              <p className="text-[11px] text-slate-400">
                Persistent PostgreSQL Database Management & Configuration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRoute(activeAdminSection === 'fleet' ? 'car-rental' : activeAdminSection === 'bank' ? 'make-payment' : 'home')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>View Live Page</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => handleSelectTab('fleet')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminSection === 'fleet'
                ? 'bg-[#0B4DA2] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Car Rental Fleet CRUD</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('enquiries')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminSection === 'enquiries'
                ? 'bg-[#0B4DA2] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Enquiries & Leads</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('bank')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminSection === 'bank'
                ? 'bg-[#0B4DA2] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Official Bank Details</span>
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div 
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 shadow-md animate-in fade-in ${
              notification.isError 
                ? 'bg-red-50 border border-red-200 text-red-800' 
                : 'bg-[#0B4DA2]/10 border border-[#0B4DA2]/30 text-[#0B4DA2]'
            }`}
          >
            {notification.isError ? (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#0B4DA2] shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* ACTIVE SECTION 1: ENQUIRIES & LEADS MANAGEMENT (POSTGRESQL) */}
        {activeAdminSection === 'enquiries' && (
          <AdminEnquiryManagement token={token} showToast={showToast} />
        )}

        {/* ACTIVE SECTION 2: FLEET MANAGEMENT */}
        {activeAdminSection === 'fleet' && (
          <AdminCarManagement token={token} showToast={showToast} />
        )}

        {/* ACTIVE SECTION 3: OFFICIAL BANK DETAILS (POSTGRESQL CRUD) */}
        {activeAdminSection === 'bank' && (
          <AdminBankManagement 
            token={token} 
            showToast={showToast} 
            onNavigateToLivePayment={() => setRoute('make-payment')}
          />
        )}

      </main>
    </div>
  );
};
