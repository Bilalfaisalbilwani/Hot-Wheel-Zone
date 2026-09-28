import React, { useState, useEffect } from 'react';
import { CompanyBankAccount } from '../types';
import { 
  Building2, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Info, 
  Globe, 
  CreditCard,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface AdminBankManagementProps {
  token: string;
  showToast: (message: string, isError?: boolean) => void;
  onNavigateToLivePayment?: () => void;
}

interface BankDetailsData {
  primaryAccount: CompanyBankAccount;
  secondaryAccount?: CompanyBankAccount;
}

const DEFAULT_PRIMARY_ACCOUNT: CompanyBankAccount = {
  companyAccountName: 'ZONE TOURISM LLC',
  bankName: 'Emirates NBD',
  accountNumber: '1014347702901',
  iban: 'AE79 0260 0010 1434 7702 901',
  swiftCode: '',
  currency: 'AED',
  branchName: 'Dubai Branch',
  country: 'United Arab Emirates',
  instructions: 'For Visa Services, International Tour Packages, and Travel Inquiries.'
};

const DEFAULT_SECONDARY_ACCOUNT: CompanyBankAccount = {
  companyAccountName: 'HOTWHEELS CAR RENTALS',
  bankName: 'Habib Bank AG Zurich',
  accountNumber: '02-02-08-020311-105-0573857',
  iban: 'AE03 0290 8902 1050 0573 857',
  swiftCode: 'HBZUAEADXXX',
  currency: 'AED',
  branchName: 'Sharjah Branch',
  country: 'United Arab Emirates',
  instructions: 'For Car Rental, VIP Chauffeur services, and corporate fleet bookings.'
};

export const AdminBankManagement: React.FC<AdminBankManagementProps> = ({ 
  token, 
  showToast,
  onNavigateToLivePayment 
}) => {
  const [bankData, setBankData] = useState<BankDetailsData>({
    primaryAccount: DEFAULT_PRIMARY_ACCOUNT,
    secondaryAccount: DEFAULT_SECONDARY_ACCOUNT
  });
  const [activeTab, setActiveTab] = useState<'primary' | 'secondary'>('primary');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [testCopiedIban, setTestCopiedIban] = useState(false);

  // Fetch bank details from persistent PostgreSQL database
  const fetchBankDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/bank-details', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setBankData({
          primaryAccount: {
            ...DEFAULT_PRIMARY_ACCOUNT,
            ...json.data.primaryAccount
          },
          secondaryAccount: {
            ...DEFAULT_SECONDARY_ACCOUNT,
            ...(json.data.secondaryAccount || {})
          }
        });
        setHasUnsavedChanges(false);
      } else {
        showToast(json.error || 'Failed to parse bank details.', true);
      }
    } catch (err) {
      console.error('Error fetching bank details:', err);
      showToast('Error loading bank details from PostgreSQL database.', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBankDetails();
    }
  }, [token]);

  // Handle field update in local state
  const handleFieldChange = (
    accountKey: 'primary' | 'secondary',
    field: keyof CompanyBankAccount,
    value: string
  ) => {
    setHasUnsavedChanges(true);
    setBankData(prev => {
      if (accountKey === 'primary') {
        return {
          ...prev,
          primaryAccount: {
            ...prev.primaryAccount,
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          secondaryAccount: {
            ...(prev.secondaryAccount || DEFAULT_SECONDARY_ACCOUNT),
            [field]: value
          }
        };
      }
    });
  };

  // Format IBAN input automatically
  const handleIbanChange = (accountKey: 'primary' | 'secondary', rawValue: string) => {
    // Strip non-alphanumeric and convert to uppercase
    const cleaned = rawValue.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    handleFieldChange(accountKey, 'iban', cleaned);
  };

  // Format SWIFT code
  const handleSwiftChange = (accountKey: 'primary' | 'secondary', rawValue: string) => {
    const cleaned = rawValue.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    handleFieldChange(accountKey, 'swiftCode', cleaned);
  };

  // Save bank details to PostgreSQL via PUT /api/admin/bank-details
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/bank-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bankData)
      });

      const json = await res.json();
      if (json.success && json.data) {
        setBankData({
          primaryAccount: {
            ...DEFAULT_PRIMARY_ACCOUNT,
            ...json.data.primaryAccount
          },
          secondaryAccount: {
            ...DEFAULT_SECONDARY_ACCOUNT,
            ...(json.data.secondaryAccount || {})
          }
        });
        setHasUnsavedChanges(false);
        showToast('Official bank details saved to PostgreSQL! Live payment page is updated immediately.');
      } else {
        showToast(json.error || 'Failed to save bank details.', true);
      }
    } catch (err) {
      console.error('Error saving bank details:', err);
      showToast('Network error while persisting bank details to database.', true);
    } finally {
      setIsSaving(false);
    }
  };

  const currentAccount = activeTab === 'primary' 
    ? bankData.primaryAccount 
    : (bankData.secondaryAccount || DEFAULT_SECONDARY_ACCOUNT);

  const isConfigured = (val?: string) => {
    if (!val) return false;
    const cleaned = val.trim();
    if (!cleaned) return false;
    const lower = cleaned.toLowerCase();
    if (lower.includes('invoice') || lower.includes('admin') || lower.includes('placeholder') || lower.includes('pending')) {
      return false;
    }
    return true;
  };

  const handleTestCopyIban = (iban?: string) => {
    if (iban && isConfigured(iban)) {
      navigator.clipboard.writeText(iban);
      setTestCopiedIban(true);
      setTimeout(() => setTestCopiedIban(false), 2000);
    }
  };

  const isPrimaryConfigured = isConfigured(bankData.primaryAccount.bankName) || isConfigured(bankData.primaryAccount.iban);
  const isSecondaryConfigured = isConfigured(bankData.secondaryAccount?.bankName) || isConfigured(bankData.secondaryAccount?.iban);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0B4DA2]/10 text-[#0B4DA2] border border-[#0B4DA2]/20 uppercase tracking-wider">
                PostgreSQL Cloud SQL Database
              </span>
              {hasUnsavedChanges && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                  Unsaved Changes
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A2540] tracking-tight">
              Official Bank Details Management
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage and securely persist official corporate bank accounts for <strong>Zone Tourism LLC</strong> (Visa/Tours) and <strong>Hotwheels Car Rental LLC</strong> (Fleet/Chauffeur).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            {onNavigateToLivePayment && (
              <button
                type="button"
                onClick={onNavigateToLivePayment}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#0B4DA2]" />
                <span>View Live Payment Page</span>
              </button>
            )}

            <button
              type="button"
              onClick={fetchBankDetails}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl bg-[#0B4DA2]/10 hover:bg-[#0B4DA2]/20 text-[#0B4DA2] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Reload Database</span>
            </button>
          </div>
        </div>

        {/* Corporate Entity Account Tabs */}
        <div className="pt-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Select Corporate Account to Edit:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1.5 bg-[#F5F7FA] rounded-2xl border border-slate-200">
            
            {/* Primary Account Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('primary')}
              className={`p-4 rounded-xl text-left transition-all flex items-start justify-between cursor-pointer border ${
                activeTab === 'primary'
                  ? 'bg-white text-[#0A2540] border-[#0B4DA2] shadow-sm ring-1 ring-[#0B4DA2]'
                  : 'bg-transparent text-slate-600 border-transparent hover:bg-white/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#0A2540]">Primary Account</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B4DA2] text-white">
                    Visa & Tours
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-800">
                  {bankData.primaryAccount.companyAccountName || 'ZONE TOURISM LLC'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isPrimaryConfigured ? (
                    <span className="text-[#0B4DA2] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#0B4DA2] inline" />
                      {bankData.primaryAccount.bankName ? `${bankData.primaryAccount.bankName} (${bankData.primaryAccount.currency})` : 'Configured'}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">
                      Pending official bank entry
                    </span>
                  )}
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Secondary Account Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('secondary')}
              className={`p-4 rounded-xl text-left transition-all flex items-start justify-between cursor-pointer border ${
                activeTab === 'secondary'
                  ? 'bg-white text-[#0A2540] border-[#0B4DA2] shadow-sm ring-1 ring-[#0B4DA2]'
                  : 'bg-transparent text-slate-600 border-transparent hover:bg-white/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#0A2540]">Secondary Account</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A227] text-white">
                    Car Rental & Fleet
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-800">
                  {bankData.secondaryAccount?.companyAccountName || 'HOTWHEELS CAR RENTAL LLC'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isSecondaryConfigured ? (
                    <span className="text-[#0B4DA2] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#0B4DA2] inline" />
                      {bankData.secondaryAccount?.bankName ? `${bankData.secondaryAccount.bankName} (${bankData.secondaryAccount.currency})` : 'Configured'}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">
                      Pending official bank entry
                    </span>
                  )}
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#C9A227]/10 text-[#C9A227] flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* Main Grid: Editor Form + Real-Time Customer View Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Bank Account Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center font-bold text-xs">
                {activeTab === 'primary' ? '1' : '2'}
              </div>
              <div>
                <h4 className="font-extrabold text-[#0A2540] text-base">
                  Editing: {activeTab === 'primary' ? 'Zone Tourism LLC (Primary)' : 'Hotwheels Car Rental LLC (Secondary)'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  All fields are stored persistently in Cloud SQL PostgreSQL
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {currentAccount.currency || 'AED'}
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Policy Notice */}
            <div className="p-3.5 rounded-xl bg-[#0B4DA2]/5 border border-[#0B4DA2]/20 text-xs text-[#0A2540] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#0B4DA2] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Privacy & Verification Rule:</span> Fields left blank will automatically display <em>"Provided on Official Invoice"</em> on the public website, preventing the display of fake or unverified account data.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 1. Company Account Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Beneficiary Company / Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentAccount.companyAccountName}
                  onChange={(e) => handleFieldChange(activeTab, 'companyAccountName', e.target.value)}
                  placeholder="e.g. ZONE TOURISM LLC or HOTWHEELS CAR RENTAL LLC"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2]"
                />
              </div>

              {/* 2. Bank Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={currentAccount.bankName}
                  onChange={(e) => handleFieldChange(activeTab, 'bankName', e.target.value)}
                  placeholder="e.g. Emirates NBD, Abu Dhabi Commercial Bank, Mashreq"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2]"
                />
              </div>

              {/* 3. Account Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={currentAccount.accountNumber}
                  onChange={(e) => handleFieldChange(activeTab, 'accountNumber', e.target.value)}
                  placeholder="e.g. 10123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2]"
                />
              </div>

              {/* 4. Currency */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Account Currency
                </label>
                <select
                  value={currentAccount.currency || 'AED'}
                  onChange={(e) => handleFieldChange(activeTab, 'currency', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] bg-white cursor-pointer"
                >
                  <option value="AED">AED - United Arab Emirates Dirham</option>
                  <option value="USD">USD - United States Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              {/* 5. IBAN */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    IBAN (International Bank Account Number)
                  </label>
                  {currentAccount.iban && (
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {currentAccount.iban.length} chars {currentAccount.iban.startsWith('AE') ? '(UAE Format)' : ''}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={currentAccount.iban}
                  onChange={(e) => handleIbanChange(activeTab, e.target.value)}
                  placeholder="AE..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Standard UAE IBAN starts with AE followed by 21 digits (23 characters total).
                </p>
              </div>

              {/* 6. SWIFT Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  SWIFT / BIC Code
                </label>
                <input
                  type="text"
                  value={currentAccount.swiftCode}
                  onChange={(e) => handleSwiftChange(activeTab, e.target.value)}
                  placeholder="e.g. EBILAEAD"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2]"
                />
              </div>

              {/* 7. Branch Name / City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Branch Name / City
                </label>
                <input
                  type="text"
                  value={currentAccount.branchName || ''}
                  onChange={(e) => handleFieldChange(activeTab, 'branchName', e.target.value)}
                  placeholder="e.g. Dubai Main Branch"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2]"
                />
              </div>

              {/* 8. Country */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Country of Bank
                </label>
                <input
                  type="text"
                  value={currentAccount.country || 'United Arab Emirates'}
                  onChange={(e) => handleFieldChange(activeTab, 'country', e.target.value)}
                  placeholder="United Arab Emirates"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2]"
                />
              </div>

              {/* 9. Account Instructions / Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Account Purpose & Customer Instructions
                </label>
                <textarea
                  rows={2}
                  value={currentAccount.instructions || ''}
                  onChange={(e) => handleFieldChange(activeTab, 'instructions', e.target.value)}
                  placeholder="e.g. For Visa Services, International Tour Packages, and Travel Inquiries."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2]"
                />
              </div>

            </div>

            {/* Actions Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={fetchBankDetails}
                disabled={isLoading || isSaving}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Discard / Revert
              </button>

              <button
                type="submit"
                id="save-bank-details-btn"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Bank Details to Database</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT COLUMN: Live Customer Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B4DA2] animate-pulse"></span>
              <h4 className="font-extrabold text-[#0A2540] text-sm uppercase tracking-wider">
                Live Customer View Preview
              </h4>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              Matches /make-payment
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            This preview renders in real-time as you type, demonstrating how customers see the bank details and copy IBAN on the public website.
          </p>

          {/* Customer View Card */}
          <div className="bg-[#F5F7FA] rounded-2xl p-5 border border-slate-200/80 space-y-4">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0B4DA2]/10 flex items-center justify-center text-[#0B4DA2]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    {activeTab === 'primary' ? 'Primary Account' : 'Secondary Account'}
                  </span>
                  <span className="text-xs font-extrabold text-[#0A2540]">
                    {currentAccount.companyAccountName || (activeTab === 'primary' ? 'ZONE TOURISM LLC' : 'HOTWHEELS CAR RENTAL LLC')}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0B4DA2]/10 text-[#0B4DA2] border border-[#0B4DA2]/20">
                {currentAccount.currency || 'AED'}
              </span>
            </div>

            {/* Fields Table */}
            <div className="space-y-2.5 text-xs">
              
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Bank Name</span>
                <span className={`font-bold ${isConfigured(currentAccount.bankName) ? 'text-[#0A2540]' : 'text-slate-400 italic'}`}>
                  {isConfigured(currentAccount.bankName) ? currentAccount.bankName : 'Provided on Official Invoice'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Account Number</span>
                <span className={`font-bold ${isConfigured(currentAccount.accountNumber) ? 'text-[#0A2540] font-mono' : 'text-slate-400 italic'}`}>
                  {isConfigured(currentAccount.accountNumber) ? currentAccount.accountNumber : 'Provided on Official Invoice'}
                </span>
              </div>

              {/* IBAN Box */}
              <div className="p-3 rounded-xl bg-[#0B4DA2]/5 border border-[#0B4DA2]/20 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#0A2540] uppercase tracking-wider">IBAN</span>
                  <span className="text-[10px] text-[#0B4DA2] font-semibold">UAE Standard</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`text-xs font-extrabold break-all ${
                    isConfigured(currentAccount.iban) ? 'font-mono text-[#0A2540]' : 'text-slate-400 italic font-sans'
                  }`}>
                    {isConfigured(currentAccount.iban) ? currentAccount.iban : 'Provided on Official Invoice'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTestCopyIban(currentAccount.iban)}
                    disabled={!isConfigured(currentAccount.iban)}
                    className="px-3 py-1.5 rounded-lg bg-[#0B4DA2] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    {testCopiedIban ? (
                      <>
                        <Check className="w-3 h-3 text-[#C9A227]" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy IBAN (Live Test)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">SWIFT / BIC</span>
                <span className={`font-bold ${isConfigured(currentAccount.swiftCode) ? 'text-[#0A2540] font-mono' : 'text-slate-400 italic'}`}>
                  {isConfigured(currentAccount.swiftCode) ? currentAccount.swiftCode : 'Provided on Official Invoice'}
                </span>
              </div>

              {currentAccount.branchName && (
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Branch</span>
                  <span className="font-bold text-[#0A2540]">{currentAccount.branchName}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Country</span>
                <span className="font-bold text-[#0A2540]">{currentAccount.country || 'United Arab Emirates'}</span>
              </div>

              {currentAccount.instructions && (
                <div className="pt-2 text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                  <span className="font-bold block text-slate-700 mb-0.5">Instructions / Purpose:</span>
                  <span>{currentAccount.instructions}</span>
                </div>
              )}

            </div>

          </div>

          {/* Customer Notice Info */}
          <div className="p-3.5 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 text-xs text-slate-800 leading-relaxed">
            <span className="font-bold block text-slate-900 mb-1">Customer Wire Notice:</span>
            <em>"Please mention your booking/reference number when making the payment and share the payment receipt with our team for confirmation."</em>
          </div>

        </div>

      </div>

    </div>
  );
};
