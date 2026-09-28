import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { FileText, Car, ShieldCheck, Sparkles, Phone, Send, CreditCard } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/travelData';
import { WhatsAppOfficialIcon } from './WhatsAppFloat';

interface HeroProps {
  setRoute: (route: PageRoute) => void;
  onOpenVisaApp?: (visaTypeId?: string) => void;
  onOpenEnquiry?: (type?: 'visa' | 'car-rental') => void;
}

export const Hero: React.FC<HeroProps> = ({ setRoute, onOpenEnquiry }) => {
  const [whatsappNumber, setWhatsappNumber] = useState<string>(COMPANY_CONFIG.whatsappNumber || '');
  const [phone, setPhone] = useState<string>(COMPANY_CONFIG.phone || '');

  // Fetch dynamic WhatsApp & Phone if configured by admin
  useEffect(() => {
    fetch('/api/company-info/public')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          if (json.data.whatsappNumbers && json.data.whatsappNumbers.length > 0 && json.data.whatsappNumbers[0]) {
            setWhatsappNumber(json.data.whatsappNumbers[0]);
          }
          if (json.data.phones && json.data.phones.length > 0 && json.data.phones[0]) {
            setPhone(json.data.phones[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const cleanWaNumber = (whatsappNumber || COMPANY_CONFIG.whatsappNumber || '971555586359').replace(/\D/g, '') || '971555586359';
  const cleanPhone = (phone || COMPANY_CONFIG.phone || '+97142226182').replace(/\s+/g, '');

  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Hello Zone Tourism & Hotwheels Car Rental, I would like to inquire about visa services and car rental in Dubai.'
  )}`;

  return (
    <section id="homepage-hero" className="relative bg-[#0A2540] text-white overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* Clean Dubai Travel + Premium Car Background Visual */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2400"
          alt="Dubai Travel and Luxury Car Fleet"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Multi-layered luxury navy gradient overlay for maximum contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540] via-[#0A2540]/90 to-[#0A2540]/75" />
        <div className="absolute inset-0 bg-[#0A2540]/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Content (Simple, Clear & High Contrast) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              Visa Services & Car Rental in Dubai
            </h1>

            {/* Sub-heading */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
              UAE visa assistance, international visa services, self-drive rentals and chauffeur-driven vehicles — all in one place.
            </p>

            {/* 4 Direct User Actions: WhatsApp Us | Call Us | Send an Enquiry | Make a Payment */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {/* 1. WhatsApp Us */}
              <a
                id="hero-btn-whatsapp"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#19a752] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[46px]"
                title="Chat on Official WhatsApp"
              >
                <WhatsAppOfficialIcon className="w-4 h-4 shrink-0" />
                <span>WhatsApp Us</span>
              </a>

              {/* 2. Call Us */}
              {cleanPhone ? (
                <a
                  id="hero-btn-call"
                  href={`tel:${cleanPhone}`}
                  className="py-3 px-3 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-[#0A2540] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[46px]"
                  title={`Call ${phone}`}
                >
                  <Phone className="w-4 h-4 text-[#0B4DA2] shrink-0" />
                  <span>Call Us</span>
                </a>
              ) : (
                <button
                  onClick={() => setRoute('contact')}
                  className="py-3 px-3 rounded-xl bg-white hover:bg-slate-100 text-[#0A2540] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[46px]"
                >
                  <Phone className="w-4 h-4 text-[#0B4DA2] shrink-0" />
                  <span>Call Us</span>
                </button>
              )}

              {/* 3. Send an Enquiry */}
              <button
                id="hero-btn-enquiry"
                type="button"
                onClick={() => {
                  if (onOpenEnquiry) {
                    onOpenEnquiry();
                  } else {
                    setRoute('contact');
                  }
                }}
                className="py-3 px-3 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[46px]"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Send Enquiry</span>
              </button>

              {/* 4. Make a Payment */}
              <button
                id="hero-btn-payment"
                type="button"
                onClick={() => setRoute('make-payment')}
                className="py-3 px-3 rounded-xl bg-[#C9A227] hover:bg-[#B89220] active:bg-[#a37f19] text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[46px]"
              >
                <CreditCard className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Make a Payment</span>
              </button>
            </div>
          </div>

          {/* Clean Dubai Travel + Premium Luxury Car Visual Frame */}
          <div className="lg:col-span-5 hidden sm:block">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0A2540]/80 backdrop-blur-xs group">
              <img
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200"
                alt="Dubai Travel and Luxury Mercedes Vehicle Fleet"
                className="w-full h-72 sm:h-80 lg:h-96 object-cover object-center block transition-transform duration-500 group-hover:scale-103"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

