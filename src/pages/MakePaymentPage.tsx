import React, { useState, useEffect } from 'react';
import { PageRoute, CompanyBankAccount } from '../types';
import { PageHeader } from '../components/PageHeader';
import { PAYMENT_CONFIG, COMPANY_BANK_ACCOUNTS } from '../data/paymentConfig';
import { COMPANY_CONFIG } from '../data/travelData';
import { 
  Building2, 
  CreditCard, 
  Copy, 
  Check, 
  ShieldCheck, 
  Info, 
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageSquare,
  FileCheck,
  Send,
  ExternalLink,
  HelpCircle,
  X
} from 'lucide-react';
import { WhatsAppOfficialIcon } from '../components/WhatsAppFloat';

interface MakePaymentPageProps {
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
  onOpenEnquiry?: (type?: 'visa' | 'car-rental') => void;
}

type EntityCategory = 'zoneTourism' | 'hotwheels' | 'crownZone';

export const MakePaymentPage: React.FC<MakePaymentPageProps> = ({ 
  currentRoute, 
  setRoute 
}) => {
  // Accounts list (defaults to verified COMPANY_BANK_ACCOUNTS)
  const [allAccounts, setAllAccounts] = useState<CompanyBankAccount[]>(COMPANY_BANK_ACCOUNTS);
  
  // Category tabs:
  // 1. ZONE TOURISM LLC (Emirates NBD & Commercial Bank of Dubai)
  // 2. HOTWHEELS CAR RENTALS (Habib Bank AG Zurich – Sharjah Branch)
  // 3. CROWN ZONE TOURISM LLC (Dubai Al Quoz Branch)
  const [selectedCategory, setSelectedCategory] = useState<EntityCategory>('zoneTourism');
  
  // Selected bank account ID inside current category
  const [selectedAccountId, setSelectedAccountId] = useState<string>('zone-enbd');
  
  // Copy states
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Card Payment Modal state
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [cardBookingRef, setCardBookingRef] = useState<string>('');
  const [cardCustomerName, setCardCustomerName] = useState<string>('');
  const [cardAmount, setCardAmount] = useState<string>('');

  // Fetch updated configuration from server if available
  useEffect(() => {
    fetch('/api/payment-config')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.bankTransfer?.accounts && json.bankTransfer.accounts.length > 0) {
          setAllAccounts(json.bankTransfer.accounts);
        }
      })
      .catch(() => {
        // Fallback to static configuration
      });
  }, []);

  // Filter accounts for selected category
  const categoryAccounts = allAccounts.filter(acc => acc.category === selectedCategory);

  // Get active account with solid fallback
  const currentAccount: CompanyBankAccount = 
    categoryAccounts.find(acc => acc.id === selectedAccountId) || 
    categoryAccounts[0] || 
    allAccounts[0] || 
    COMPANY_BANK_ACCOUNTS[0];

  // When category changes, auto-select first account of that category
  const handleCategoryChange = (cat: EntityCategory) => {
    setSelectedCategory(cat);
    const firstAcc = allAccounts.find(acc => acc.category === cat);
    if (firstAcc?.id) {
      setSelectedAccountId(firstAcc.id);
    }
  };

  const handleCopy = (text: string, fieldId: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => {
        setCopiedField(null);
      }, 2500);
    }
  };

  const whatsappNumber = PAYMENT_CONFIG.bankTransfer.supportWhatsApp || COMPANY_CONFIG.whatsappNumber;

  // WhatsApp link for sharing payment receipt
  const shareReceiptWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello Zone Tourism & Hotwheels Car Rental team, I have completed the bank transfer payment for my booking (Account: ${currentAccount?.companyAccountName || 'ZONE TOURISM LLC'} - ${currentAccount?.bankName || 'Bank'}). Please find attached my payment receipt for confirmation.`
  )}`;

  // WhatsApp link for requesting card payment link
  const requestCardLinkWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello, I would like to pay by credit/debit card for my confirmed booking.${cardBookingRef ? ` Reference: ${cardBookingRef}.` : ''}${cardCustomerName ? ` Name: ${cardCustomerName}.` : ''}${cardAmount ? ` Amount: AED ${cardAmount}.` : ''} Please share the secure card payment link.`
  )}`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Make a Payment"
        subtitle="Official settlement information for UAE visit visas, tour packages, and car rental services."
        currentRoute={currentRoute}
        setRoute={setRoute}
      />

      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

          {/* =========================================================
              THE BASIC PAYMENT FLOW (Customer Enquiry → Confirmation)
              ========================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-bold text-[#0B4DA2] uppercase tracking-wider bg-[#0B4DA2]/10 px-2.5 py-0.5 rounded-full">
                Simple 4-Step Settlement Process
              </span>
              <span className="text-xs text-slate-500 font-medium">
                No complicated automatic system • Direct confirmation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0B4DA2] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0A2540]">Customer Enquiry</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Submit requirement for Visa, Tour, or Car Rental.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0B4DA2] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0A2540]">Price Confirmation</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Our team confirms final price, reference & availability.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-[#0A2540] text-white flex items-start gap-3 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-[#C9A227] text-[#0A2540] flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Bank Transfer or Card</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                    Settle securely via official bank transfer or card link.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0A2540]">Payment Confirmation</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Share receipt on WhatsApp for instant verified dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              PAYMENT METHODS GRID: BANK TRANSFER & CARD PAYMENT
              ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ---------------------------------------------------------
                1. OFFICIAL BANK TRANSFER SECTION (Col 7)
                --------------------------------------------------------- */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
              
              {/* Section Header */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#0B4DA2]/10 border border-[#0B4DA2]/20 flex items-center justify-center text-[#0B4DA2] shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A2540] tracking-tight">
                    Bank Transfer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct settlement to official company bank accounts in the UAE.
                  </p>
                </div>
              </div>

              {/* Company Entity Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Select Company Entity:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                  {/* Entity 1: ZONE TOURISM LLC */}
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('zoneTourism')}
                    className={`p-3 rounded-xl text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer min-h-[58px] ${
                      selectedCategory === 'zoneTourism'
                        ? 'bg-[#0B4DA2] text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/60 active:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold">ZONE TOURISM LLC</span>
                      {selectedCategory === 'zoneTourism' && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </div>
                    <span className={`text-[10px] mt-0.5 ${selectedCategory === 'zoneTourism' ? 'text-blue-100' : 'text-slate-500'}`}>
                      Visas & Tours
                    </span>
                  </button>

                  {/* Entity 2: HOTWHEELS CAR RENTALS */}
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('hotwheels')}
                    className={`p-3 rounded-xl text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer min-h-[58px] ${
                      selectedCategory === 'hotwheels'
                        ? 'bg-[#0B4DA2] text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/60 active:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold">HOTWHEELS CAR RENTALS</span>
                      {selectedCategory === 'hotwheels' && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </div>
                    <span className={`text-[10px] mt-0.5 ${selectedCategory === 'hotwheels' ? 'text-blue-100' : 'text-slate-500'}`}>
                      Fleet & Chauffeur
                    </span>
                  </button>

                  {/* Entity 3: CROWN ZONE TOURISM LLC */}
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('crownZone')}
                    className={`p-3 rounded-xl text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer min-h-[58px] ${
                      selectedCategory === 'crownZone'
                        ? 'bg-[#0B4DA2] text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/60 active:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold">CROWN ZONE TOURISM</span>
                      {selectedCategory === 'crownZone' && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </div>
                    <span className={`text-[10px] mt-0.5 ${selectedCategory === 'crownZone' ? 'text-blue-100' : 'text-slate-500'}`}>
                      Al Quoz Branch
                    </span>
                  </button>
                </div>
              </div>

              {/* Sub-Tabs if Category has multiple banks */}
              {categoryAccounts.length > 1 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Choose Bank Account:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setSelectedAccountId(acc.id || '')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                          selectedAccountId === acc.id
                            ? 'border-[#0B4DA2] bg-[#0B4DA2]/10 text-[#0B4DA2] shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{acc.bankName}</span>
                        {selectedAccountId === acc.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#0B4DA2] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Bank Account Details Display:
                  - Company / Account Name
                  - Bank Name
                  - Account Number
                  - IBAN (with Copy IBAN)
                  - SWIFT Code
                  - Currency */}
              <div className="bg-[#F8FAFC] rounded-2xl p-5 sm:p-6 border border-slate-200/90 space-y-4 text-sm">
                
                {/* 1. Company / Account Name */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500">Company / Account Name</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#0A2540] text-sm sm:text-base">
                      {currentAccount.companyAccountName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentAccount.companyAccountName, 'accountName')}
                      title="Copy Account Title"
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      {copiedField === 'accountName' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 2. Bank Name */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500">Bank Name</span>
                  <span className="font-bold text-[#0A2540]">
                    {currentAccount.bankName}
                  </span>
                </div>

                {/* Branch Name if available */}
                {currentAccount.branchName && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200/80">
                    <span className="text-xs font-semibold text-slate-500">Branch</span>
                    <span className="font-bold text-[#0A2540]">
                      {currentAccount.branchName}
                    </span>
                  </div>
                )}

                {/* 3. Account Number */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-[#0A2540] text-sm sm:text-base tracking-wide select-all">
                      {currentAccount.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentAccount.accountNumber, 'accNum')}
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === 'accNum' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 4. IBAN Box with Copy IBAN button */}
                <div className="p-4 rounded-xl bg-white border-2 border-[#0B4DA2]/25 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#0A2540]">
                      IBAN
                    </span>
                    <span className="text-[10px] font-bold text-[#0B4DA2] bg-[#0B4DA2]/10 px-2.5 py-0.5 rounded-full border border-[#0B4DA2]/20">
                      UAE Standard
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <span className="font-mono font-black text-sm sm:text-base tracking-wider text-[#0A2540] break-all select-all">
                      {currentAccount.iban}
                    </span>

                    {/* Copy IBAN Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(currentAccount.iban, 'iban')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer min-h-[42px]"
                    >
                      {copiedField === 'iban' ? (
                        <>
                          <Check className="w-4 h-4 text-[#C9A227]" />
                          <span>Copied IBAN!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy IBAN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 5. SWIFT Code */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500">SWIFT Code</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-[#0A2540]">
                      {currentAccount.swiftCode || 'HBZUAEADXXX'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentAccount.swiftCode || 'HBZUAEADXXX', 'swift')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                      title="Copy SWIFT Code"
                    >
                      {copiedField === 'swift' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 6. Currency */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-500">Currency</span>
                  <span className="font-extrabold text-[#0A2540]">
                    {currentAccount.currency || 'AED'} (United Arab Emirates Dirham)
                  </span>
                </div>

              </div>

              {/* Exact Note requested:
                  "Please mention your booking/reference number when making the payment and share the payment receipt with our team for confirmation." */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-slate-700 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Important Payment Instructions:
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    Please mention your booking/reference number when making the payment and share the payment receipt with our team for confirmation.
                  </p>
                </div>
              </div>

              {/* Action Button: "Share Payment Receipt on WhatsApp" */}
              <div className="pt-1">
                <a
                  href={shareReceiptWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#19a752] text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <WhatsAppOfficialIcon className="w-5 h-5 shrink-0" />
                  <span>Share Payment Receipt on WhatsApp</span>
                </a>
              </div>

            </div>

            {/* ---------------------------------------------------------
                2. CREDIT / DEBIT CARD PAYMENT SECTION (Col 5)
                "Pay Securely by Card" provision for authorized payment gateway
                --------------------------------------------------------- */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
              
              {/* Card Section Header */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#0B4DA2]/10 border border-[#0B4DA2]/20 flex items-center justify-center text-[#0B4DA2] shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A2540] tracking-tight">
                    Credit / Debit Card
                  </h3>
                  <p className="text-xs text-slate-500">
                    Authorized UAE Payment Gateway facility.
                  </p>
                </div>
              </div>

              {/* Supported Card Brands Visual Banner */}
              <div className="p-4 rounded-2xl bg-[#0A2540] text-white space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    256-Bit SSL Encrypted
                  </span>
                  <span className="text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded text-slate-300">
                    Gateway Ready
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white">
                    Authorized Card Payment Facility
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Card payments are handled strictly through our authorized payment gateway with 3D Secure authentication.
                  </p>
                </div>

                {/* Card Badges */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-white text-[#0A2540] font-black text-[10px] tracking-wider">
                    VISA
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-[#EB001B] font-black text-[10px] tracking-wider">
                    Mastercard
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-[#006FCF] font-black text-[10px] tracking-wider">
                    AMEX
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/20 text-white font-bold text-[10px]">
                    Apple Pay
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/20 text-white font-bold text-[10px]">
                    Google Pay
                  </span>
                </div>
              </div>

              {/* Booking Reference Prompt */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Booking Reference Number (Optional):
                  </label>
                  <input
                    type="text"
                    value={cardBookingRef}
                    onChange={(e) => setCardBookingRef(e.target.value)}
                    placeholder="e.g. ZT-2026-9041 or HW-CAR-882"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] focus:border-[#0B4DA2]"
                  />
                  <p className="text-[11px] text-slate-500">
                    Mentioned on your quotation or booking summary from our team.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Customer Name:
                  </label>
                  <input
                    type="text"
                    value={cardCustomerName}
                    onChange={(e) => setCardCustomerName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] focus:border-[#0B4DA2]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Amount (AED):
                  </label>
                  <input
                    type="number"
                    value={cardAmount}
                    onChange={(e) => setCardAmount(e.target.value)}
                    placeholder="Confirmed Price in AED"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] focus:border-[#0B4DA2]"
                  />
                </div>
              </div>

              {/* Exact Requested Button:
                  "Pay Securely by Card" */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCardModal(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-extrabold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#C9A227]" />
                  <span>Pay Securely by Card</span>
                </button>

                <p className="text-center text-[11px] text-slate-500">
                  Direct dispatch of authorized payment gateway link to your WhatsApp or Email.
                </p>
              </div>

              {/* Gateway Structure Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0B4DA2] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong className="text-[#0A2540] font-semibold">Security Commitment: </strong>
                  We do not store or capture card details. All transactions are routed directly through authorized banking gateway infrastructure.
                </p>
              </div>

            </div>

          </div>

          {/* Direct Support Assistance */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm sm:text-base font-bold text-[#0A2540]">
                Need Payment Verification or an Official Corporate Invoice?
              </h4>
              <p className="text-xs text-slate-600">
                Our finance and accounts team in Dubai is available 24/7 to issue VAT invoices and verify bank transfers.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={shareReceiptWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <WhatsAppOfficialIcon className="w-4 h-4" />
                <span>Contact Accounts</span>
              </a>
              <button
                type="button"
                onClick={() => setRoute('contact')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Office Location
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          AUTHORIZED CARD PAYMENT GATEWAY MODAL
          (Seamless provision for merchant account link)
          ========================================================= */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#0B4DA2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#0A2540]">
                    Authorized Card Payment Gateway
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Secure Merchant Settlement
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Selected Entity:</span>
                  <span className="font-bold text-[#0A2540]">
                    {selectedCategory === 'hotwheels' 
                      ? 'HOTWHEELS CAR RENTALS' 
                      : selectedCategory === 'crownZone' 
                        ? 'CROWN ZONE TOURISM LLC' 
                        : 'ZONE TOURISM LLC'}
                  </span>
                </div>
                {cardBookingRef && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Reference:</span>
                    <span className="font-mono font-bold text-[#0B4DA2]">{cardBookingRef}</span>
                  </div>
                )}
                {cardCustomerName && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Customer:</span>
                    <span className="font-bold text-slate-800">{cardCustomerName}</span>
                  </div>
                )}
                {cardAmount && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Confirmed Amount:</span>
                    <span className="font-extrabold text-emerald-700 text-sm">AED {cardAmount}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  As per our security standards, card transactions are processed through our <strong>authorized payment gateway</strong> with 3D Secure verification.
                </p>
                <p>
                  To complete your payment, click below to receive your customized merchant payment link on WhatsApp or by email:
                </p>
              </div>
            </div>

            {/* Actions inside modal */}
            <div className="space-y-2.5 pt-2">
              <a
                href={requestCardLinkWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCardModal(false)}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <WhatsAppOfficialIcon className="w-4 h-4 shrink-0" />
                <span>Get Merchant Payment Link on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
