import React, { createContext, useContext, useState } from 'react';

export type SupportedCurrency = 'AED' | 'USD';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateFromAED: number; // Conversion multiplier from base AED
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    rateFromAED: 1.0
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateFromAED: 0.2723 // Official UAE central bank peg ~3.6725 AED per USD
  }
};

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  formatPrice: (amountInAED: number, showCode?: boolean) => string;
  convertPrice: (amountInAED: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    const saved = localStorage.getItem('zone_currency_pref');
    if (saved && (saved === 'AED' || saved === 'USD')) {
      return saved as SupportedCurrency;
    }
    return 'AED';
  });

  const setCurrency = (newCurr: SupportedCurrency) => {
    setCurrencyState(newCurr);
    localStorage.setItem('zone_currency_pref', newCurr);
  };

  const convertPrice = (amountInAED: number): number => {
    const config = CURRENCIES[currency] || CURRENCIES.AED;
    return Math.round(amountInAED * config.rateFromAED);
  };

  const formatPrice = (amountInAED: number, showCode = true): string => {
    const config = CURRENCIES[currency] || CURRENCIES.AED;
    const converted = convertPrice(amountInAED);
    
    if (currency === 'AED') {
      return `AED ${amountInAED.toLocaleString()}`;
    }
    
    return showCode 
      ? `${config.symbol}${converted.toLocaleString()} ${currency}`
      : `${config.symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencySelector: React.FC<{ className?: string; variant?: 'pill' | 'select' }> = ({ className = '', variant = 'pill' }) => {
  const { currency, setCurrency } = useCurrency();

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold ${className}`}>
        <button
          type="button"
          onClick={() => setCurrency('AED')}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            currency === 'AED'
              ? 'bg-[#0B4DA2] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Set currency to AED"
        >
          AED
        </button>
        <button
          type="button"
          onClick={() => setCurrency('USD')}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            currency === 'USD'
              ? 'bg-[#0B4DA2] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Set currency to USD"
        >
          USD
        </button>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
        className="bg-slate-100 hover:bg-slate-200 text-[#0A2540] text-xs font-bold py-1.5 px-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] cursor-pointer transition-colors"
        aria-label="Select Display Currency"
      >
        <option value="AED">AED (د.إ)</option>
        <option value="USD">USD ($)</option>
      </select>
    </div>
  );
};
