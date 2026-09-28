import React from 'react';
import { PageRoute } from '../types';
import { Hero } from '../components/Hero';
import { TrustSection } from '../components/TrustSection';
import { FileText, Globe, Car, ShieldCheck, ArrowRight } from 'lucide-react';

interface HomeProps {
  setRoute: (route: PageRoute) => void;
  onOpenVisaApp?: (visaTypeId?: string) => void;
  onOpenEnquiry?: (type?: 'visa' | 'car-rental') => void;
}

export const Home: React.FC<HomeProps> = ({ setRoute, onOpenVisaApp, onOpenEnquiry }) => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section */}
      <Hero setRoute={setRoute} onOpenEnquiry={onOpenEnquiry} />

      {/* 2. Main Services Section — Exactly 4 Clear Service Boxes */}
      <section id="main-services" className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-bold uppercase tracking-wider">
            Our Offerings
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
            Main Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Service 1: UAE Visa Services */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#0B4DA2]/40 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center font-bold transition-transform group-hover:scale-105">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-2 py-0.5 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] text-[10px] font-extrabold uppercase tracking-wide">
                  Zone Tourism
                </div>
                <h3 className="text-lg font-extrabold text-[#0A2540] group-hover:text-[#0B4DA2] transition-colors">
                  UAE Visa Services
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Visit visa assistance and related services.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRoute('uae-visit-visa')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#F5F7FA] hover:bg-[#0B4DA2] text-[#0B4DA2] hover:text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer min-h-[44px]"
              >
                <span>View UAE Visas</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Service 2: International Visa Services */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#0B4DA2]/40 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center font-bold transition-transform group-hover:scale-105">
                <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-2 py-0.5 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] text-[10px] font-extrabold uppercase tracking-wide">
                  Zone Tourism
                </div>
                <h3 className="text-lg font-extrabold text-[#0A2540] group-hover:text-[#0B4DA2] transition-colors">
                  International Visa Services
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Visa assistance for Schengen, UK, USA, China and other destinations.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRoute('uae-visit-visa')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#F5F7FA] hover:bg-[#0B4DA2] text-[#0B4DA2] hover:text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer min-h-[44px]"
              >
                <span>View Visa Services</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Service 3: Self Drive Car Rental */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#0B4DA2]/40 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center font-bold transition-transform group-hover:scale-105">
                <Car className="w-6 h-6 text-[#0B4DA2]" />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-2 py-0.5 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] text-[10px] font-extrabold uppercase tracking-wide">
                  Hotwheels Rentals
                </div>
                <h3 className="text-lg font-extrabold text-[#0A2540] group-hover:text-[#0B4DA2] transition-colors">
                  Self Drive Car Rental
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Daily, weekly and monthly rental options.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRoute('car-rental')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#F5F7FA] hover:bg-[#0B4DA2] text-[#0B4DA2] hover:text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer min-h-[44px]"
              >
                <span>View Self-Drive Fleet</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Service 4: Chauffeur Driven Cars */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#0A2540]/40 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center font-bold transition-transform group-hover:scale-105">
                <ShieldCheck className="w-6 h-6 text-[#0A2540]" />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wide">
                  With Driver
                </div>
                <h3 className="text-lg font-extrabold text-[#0A2540] group-hover:text-[#0B4DA2] transition-colors">
                  Chauffeur Driven Cars
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Airport transfers, hourly hire, daily hire and inter-emirate transfers.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRoute('mercedes-chauffeur')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#F5F7FA] hover:bg-[#0B4DA2] text-[#0B4DA2] hover:text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer min-h-[44px]"
              >
                <span>Chauffeur Booking</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Genuine Trust Section — "Why Choose Zone Tourism & Hotwheels?" */}
      <TrustSection 
        setRoute={setRoute} 
        onOpenVisaApp={() => onOpenVisaApp && onOpenVisaApp()} 
      />
    </div>
  );
};


