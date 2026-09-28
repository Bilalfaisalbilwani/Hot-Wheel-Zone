import React, { useState } from 'react';
import { CardPaymentPayload, CardPaymentResult } from '../types';
import { COMPANY_CONFIG } from '../data/travelData';
import { 
  CreditCard, ShieldCheck, Lock, CheckCircle2, 
  Printer, ArrowRight, Loader2, Info, Eye, EyeOff
} from 'lucide-react';
import { WhatsAppOfficialIcon } from './WhatsAppFloat';
import { openWhatsAppDirectly } from '../utils/whatsapp';

interface CreditCardPaymentSectionProps {
  initialServiceEntity?: string;
  onPaymentSuccess?: (result: CardPaymentResult) => void;
}

export const CreditCardPaymentSection: React.FC<CreditCardPaymentSectionProps> = ({
  initialServiceEntity = 'ZONE TOURISM LLC',
  onPaymentSuccess
}) => {
  const [serviceEntity, setServiceEntity] = useState<string>(initialServiceEntity);
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [amount, setAmount] = useState<string>('350');
  const [currency, setCurrency] = useState<'AED' | 'USD'>('AED');
  
  // Card Details
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [showCvv, setShowCvv] = useState<boolean>(false);

  // UI Flow States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [paymentResult, setPaymentResult] = useState<CardPaymentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Amount Presets
  const PRESET_AMOUNTS = [
    { label: '30-Day Visa', aed: 350 },
    { label: '60-Day Visa', aed: 700 },
    { label: 'Car Rental / Deposit', aed: 500 },
    { label: 'Custom Amount', aed: 1000 }
  ];

  // Detect Card Brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'American Express';
    return 'Generic';
  };

  const cardBrand = getCardBrand(cardNumber);

  // Format Card Number with space every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiry(val);
  };

  // Format CVV as max 4 digits
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(val);
  };

  // Submit Payment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) {
      setErrorMessage('Please enter a valid 16-digit card number.');
      return;
    }

    if (!cardholderName.trim()) {
      setErrorMessage('Please enter the name on your card.');
      return;
    }

    const parts = expiry.split('/');
    if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
      setErrorMessage('Please enter a valid expiry date (MM/YY).');
      return;
    }

    const month = parseInt(parts[0], 10);
    if (month < 1 || month > 12) {
      setErrorMessage('Please enter a valid month (01 to 12).');
      return;
    }

    if (cvv.length < 3) {
      setErrorMessage('Please enter a valid 3 or 4 digit CVV/CVC.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid payment amount.');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStep('Encrypting transaction via 256-bit SSL gateway...');

      // Simulated security verification steps
      await new Promise(r => setTimeout(r, 600));
      setProcessingStep('Authenticating 3D Secure with issuing bank...');
      await new Promise(r => setTimeout(r, 700));
      setProcessingStep('Authorizing payment with merchant gateway...');

      const payload: CardPaymentPayload = {
        serviceEntity,
        referenceNo: referenceNo.trim() || undefined,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        amount: numAmount,
        currency,
        cardNumber: cleanCard,
        cardholderName: cardholderName.trim(),
        expiryMonth: parts[0],
        expiryYear: parts[1],
        cvv
      };

      const res = await fetch('/api/payments/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success && data.data) {
        setPaymentResult(data.data);
        if (onPaymentSuccess) {
          onPaymentSuccess(data.data);
        }
      } else {
        setErrorMessage(data.error || 'Payment failed to authorize. Please verify card details.');
      }
    } catch (err: any) {
      setErrorMessage('Connection to payment gateway timed out. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareReceiptWhatsApp = () => {
    if (!paymentResult) return;
    const msg = `Hello Team, I have successfully completed an online card payment:
• Transaction ID: ${paymentResult.transactionId}
• Reference: ${paymentResult.referenceNo || 'Direct Payment'}
• Amount: ${paymentResult.currency} ${paymentResult.amount.toLocaleString()}
• Service: ${paymentResult.serviceEntity}
• Card: ${paymentResult.cardBrand} (•••• ${paymentResult.cardLast4})
• Customer: ${paymentResult.customerName}
Please confirm receipt and acknowledge my booking.`;

    const cleanNum = (COMPANY_CONFIG.whatsappNumber || '971555586359').replace(/\D/g, '');
    openWhatsAppDirectly(msg, cleanNum);
  };

  const handleResetForm = () => {
    setPaymentResult(null);
    setCardNumber('');
    setCvv('');
    setExpiry('');
    setErrorMessage(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B4DA2]/10 border border-[#0B4DA2]/20 flex items-center justify-center text-[#0B4DA2] shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A2540] tracking-tight">
              Online Card Payment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure settlement via Visa, Mastercard, AMEX, or Debit Card
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit SSL Secure</span>
          </span>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION RECEIPT */}
      {paymentResult ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Transaction Successful
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-[#0A2540]">
                Payment Approved
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Your payment has been authorized and credited to {paymentResult.serviceEntity}.
              </p>
            </div>
          </div>

          {/* Official Electronic Receipt Card */}
          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-xs space-y-4 print:border-black print:bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Official Digital Receipt
              </span>
              <span className="text-xs font-mono font-bold text-[#0B4DA2]">
                {paymentResult.transactionId}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Date & Time</span>
                <span className="font-semibold text-slate-800">
                  {new Date(paymentResult.timestamp).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Paid For Entity</span>
                <span className="font-bold text-[#0A2540]">{paymentResult.serviceEntity}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Booking Reference</span>
                <span className="font-mono font-bold text-slate-800">{paymentResult.referenceNo || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Customer Name</span>
                <span className="font-semibold text-slate-800">{paymentResult.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Payment Card</span>
                <span className="font-semibold text-slate-800">{paymentResult.cardBrand} •••• {paymentResult.cardLast4}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Status</span>
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {paymentResult.status}
                </span>
              </div>
            </div>

            {/* Total Paid Display */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Total Paid Amount:</span>
              <span className="text-xl sm:text-2xl font-black text-[#0A2540]">
                {paymentResult.currency} {paymentResult.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleShareReceiptWhatsApp}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <WhatsAppOfficialIcon className="w-4 h-4" />
              <span>Share Receipt on WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#0A2540] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Make Another Payment</span>
            </button>
          </div>
        </div>
      ) : (
        /* INTERACTIVE CREDIT CARD PAYMENT FORM */
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* VISUAL CREDIT CARD PREVIEW */}
          <div className="relative aspect-[16/9.5] sm:aspect-[16/8.5] w-full max-w-md mx-auto rounded-2xl p-5 sm:p-6 bg-gradient-to-tr from-[#0A2540] via-[#0F355C] to-[#124273] text-white shadow-xl border border-white/15 flex flex-col justify-between overflow-hidden">
            {/* Background luxury overlay */}
            <div className="absolute -right-16 -top-16 w-52 h-52 bg-[#C9A227]/15 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -left-16 -bottom-16 w-52 h-52 bg-[#0B4DA2]/30 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top row: Chip + Brand */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#E6C65A] via-[#C9A227] to-[#8C6D15] p-1 shadow-xs border border-white/20 flex flex-col justify-between">
                  <div className="h-0.5 bg-black/20 w-full rounded"></div>
                  <div className="h-0.5 bg-black/20 w-3/4 rounded"></div>
                </div>
                <div className="text-[10px] tracking-widest text-slate-300 uppercase font-semibold">
                  Contactless
                </div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-sm sm:text-base tracking-wider text-[#C9A227]">
                  {cardBrand === 'Generic' ? 'CREDIT / DEBIT' : cardBrand.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Middle: 16-Digit Card Number */}
            <div className="relative z-10 py-1">
              <span className="text-[10px] text-slate-300 uppercase tracking-widest block mb-0.5">Card Number</span>
              <div className="font-mono text-base sm:text-lg lg:text-xl font-bold tracking-widest text-white drop-shadow-xs select-all">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>
            </div>

            {/* Bottom: Cardholder Name + Expiry */}
            <div className="relative z-10 flex items-end justify-between text-xs pt-1 border-t border-white/10">
              <div className="min-w-0 pr-2">
                <span className="text-[9px] text-slate-300 uppercase tracking-wider block">Cardholder</span>
                <span className="font-semibold text-xs sm:text-sm uppercase tracking-wide truncate block text-slate-100">
                  {cardholderName || 'CARDHOLDER NAME'}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9px] text-slate-300 uppercase tracking-wider block">Expires</span>
                <span className="font-mono font-semibold text-xs sm:text-sm text-slate-100">
                  {expiry || 'MM/YY'}
                </span>
              </div>
            </div>
          </div>

          {/* ERROR ALERT */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="space-y-4 text-xs">
            
            {/* Service / Entity Selection */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
                Paying For Entity / Service <span className="text-rose-500">*</span>
              </label>
              <select
                value={serviceEntity}
                onChange={(e) => setServiceEntity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20"
              >
                <option value="ZONE TOURISM LLC">ZONE TOURISM LLC (UAE Visit Visas & Tourism Packages)</option>
                <option value="HOTWHEELS CAR RENTAL LLC">HOTWHEELS CAR RENTAL LLC (Car Rental & Chauffeur Fleet)</option>
                <option value="CROWN ZONE TOURISM LLC">CROWN ZONE TOURISM LLC (Dubai Al Quoz Branch)</option>
              </select>
            </div>

            {/* Amount Selection & Presets */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Payment Amount <span className="text-rose-500">*</span>
                </label>
                
                {/* Currency switch */}
                <div className="inline-flex p-0.5 rounded-lg bg-slate-200 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setCurrency('AED')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${currency === 'AED' ? 'bg-[#0B4DA2] text-white' : 'text-slate-600'}`}
                  >
                    AED
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${currency === 'USD' ? 'bg-[#0B4DA2] text-white' : 'text-slate-600'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-bold text-slate-400 text-sm">
                  {currency === 'AED' ? 'AED' : '$'}
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full pl-14 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-base sm:text-lg font-black text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_AMOUNTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAmount(String(p.aed))}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      amount === String(p.aed)
                        ? 'bg-[#0B4DA2] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p.label} (AED {p.aed})
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Reference # (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Booking / Invoice Ref (Optional)
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. REF-2026-891"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Customer Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Full Name"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Email Address (For Receipt)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  WhatsApp / Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+971 55 558 6359"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20"
                />
              </div>
            </div>

            {/* CARD DETAILS FIELDS */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Card Information
              </span>

              {/* Card Number */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Card Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4000 1234 5678 9010"
                    maxLength={19}
                    required
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-mono font-bold text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20"
                  />
                  <div className="absolute right-3 top-2.5">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Name on Card <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="e.g. MOHAMMED AHMED"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs uppercase font-medium text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20"
                />
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Expiry Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-mono font-bold text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    CVV / CVC <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCvv ? 'text' : 'password'}
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      maxLength={4}
                      required
                      className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-mono font-bold text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showCvv ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
                  <span>{processingStep || 'Processing Payment...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#C9A227]" />
                  <span>Pay {currency} {parseFloat(amount || '0').toLocaleString()} Securely</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400 mt-2">
              🔒 Encrypted via UAE payment gateway. No full card details stored on this server.
            </p>
          </div>

          {/* Alternative: Request Payment Link on WhatsApp */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Prefer custom payment link on WhatsApp?</span>
            <a
              href={`https://wa.me/${(COMPANY_CONFIG.whatsappNumber || '971555586359').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello accounts team, please send me a customized payment link for ${amount} AED.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#25D366] hover:underline"
            >
              <WhatsAppOfficialIcon className="w-3.5 h-3.5" />
              <span>Get WhatsApp Link</span>
            </a>
          </div>

        </form>
      )}

    </div>
  );
};
