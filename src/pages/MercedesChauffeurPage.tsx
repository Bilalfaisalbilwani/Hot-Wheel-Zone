import React from 'react';
import { PageRoute } from '../types';
import { COMPANY_CONFIG } from '../data/travelData';
import { PageHeader } from '../components/PageHeader';
import { MercedesChauffeurSection } from '../components/MercedesChauffeurSection';
import { SimpleEnquirySection } from '../components/SimpleEnquiryForms';
import { 
  Phone, MessageSquare, Sparkles, 
  Clock, Car, CreditCard, ShieldCheck, CheckCircle2 
} from 'lucide-react';

interface MercedesChauffeurPageProps {
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
  onOpenEnquiry?: (type: 'visa' | 'car-rental', item?: string) => void;
}

export const MercedesChauffeurPage: React.FC<MercedesChauffeurPageProps> = ({
  currentRoute,
  setRoute,
  onOpenEnquiry
}) => {
  const phoneTel = COMPANY_CONFIG.phone ? `tel:${COMPANY_CONFIG.phone.replace(/\s+/g, '')}` : '#contact';
  const whatsappUrl = COMPANY_CONFIG.whatsappNumber
    ? `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
        'Hello Hotwheels Car Rental, I would like to inquire about your Mercedes Chauffeur Services in Dubai.'
      )}`
    : '#contact';

  return (
    <div>
      {/* Premium Unified Page Header */}
      <PageHeader
        title="Mercedes Chauffeur Service in Dubai"
        currentRoute={currentRoute}
        setRoute={setRoute}
      />

      {/* Main Mercedes Chauffeur Fleet Section */}
      <MercedesChauffeurSection 
        onOpenEnquiry={onOpenEnquiry}
      />

      {/* Quick Mercedes Chauffeur Enquiry Form Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <SimpleEnquirySection 
          initialType="car-rental"
          title="Mercedes Chauffeur Service Enquiry"
          subtitle="Select your dates, pickup terminal/address, and choose Mercedes-Benz V-Class, Vito, S-Class, or other luxury models. Dispatch coordinates directly via WhatsApp."
        />
      </section>

      {/* Payment Information Banner */}
      <section className="py-8 sm:py-10 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#0B4DA2]/10 border border-[#0B4DA2]/20 flex items-center justify-center text-[#0B4DA2] shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-[#0A2540]">
                  Need to Settle a Chauffeur Service Payment?
                </h4>
                <p className="text-xs text-slate-600">
                  Direct UAE corporate bank transfer to HOTWHEELS CAR RENTAL LLC or secure online payment options.
                </p>
              </div>
            </div>
            <button
              onClick={() => setRoute('make-payment')}
              className="px-4 py-2.5 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white font-semibold text-xs transition-colors shadow-xs shrink-0 cursor-pointer flex items-center gap-2"
            >
              <span>View Bank Details / Make Payment</span>
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Hotwheels Mercedes Chauffeur Section */}
      <section className="py-12 sm:py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] text-[11px] font-bold uppercase tracking-wider">
              The Hotwheels Standard
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
              Why Choose Mercedes Chauffeur with Us?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We cater to high-profile executives, government delegations, and discerning families with impeccable hospitality standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B4DA2]/10 flex items-center justify-center text-[#0B4DA2]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-[#0A2540] text-sm sm:text-base">Executive Mercedes Fleet</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Featuring the Mercedes-Benz V-Class, Vito Tourer, S-Class, and executive sedans and SUVs, maintained for smooth, premium transportation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B4DA2]/10 flex items-center justify-center text-[#0B4DA2]">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-[#0A2540] text-sm sm:text-base">4 Chauffeur Services (With Driver)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose from Airport Transfer, Hourly Hire, Full-Day Chauffeur, and Corporate Transfer tailored to your schedule.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B4DA2]/10 flex items-center justify-center text-[#0B4DA2]">
                <Car className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-[#0A2540] text-sm sm:text-base">Self-Drive Availability</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                While Mercedes is chauffeur-driven by default, self-drive options appear whenever inventory is explicitly available for self-drive hire.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
