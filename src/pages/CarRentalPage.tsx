import React from 'react';
import { PageRoute } from '../types';
import { PageHeader } from '../components/PageHeader';
import { CarRentalSection } from '../components/CarRentalSection';
import { SimpleEnquirySection } from '../components/SimpleEnquiryForms';
import { COMPANY_CONFIG } from '../data/travelData';
import { ShieldAlert, MessageSquare, Phone } from 'lucide-react';

interface CarRentalPageProps {
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
  onOpenEnquiry?: (type: 'visa' | 'car-rental', item?: string) => void;
}

export const CarRentalPage: React.FC<CarRentalPageProps> = ({ currentRoute, setRoute, onOpenEnquiry }) => {
  const isChauffeurRoute = currentRoute === 'chauffeur';
  const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    isChauffeurRoute
      ? 'Hello Hotwheels Car Rental, I would like to get a quote for Chauffeur Driven service in Dubai.'
      : 'Hello Hotwheels Car Rental, I would like to rent a car in Dubai.'
  )}`;

  return (
    <div>
      <PageHeader
        title={isChauffeurRoute ? "Chauffeur Driven Cars in Dubai" : "Car Rental in Dubai & UAE"}
        subtitle={
          isChauffeurRoute
            ? "Executive chauffeur-driven vehicles, Mercedes VIP fleet, DXB airport transfers, and hourly hire across Dubai and the Emirates."
            : "Explore our fleet of self-drive models and chauffeur-driven vehicles — sedans, SUVs, luxury cars, and 7-seaters."
        }
        currentRoute={currentRoute}
        setRoute={setRoute}
      />

      <CarRentalSection 
        onOpenEnquiry={onOpenEnquiry}
        showAll={true} 
        initialServiceType={isChauffeurRoute ? 'CHAUFFEUR DRIVEN' : 'SELF DRIVE'}
        onNavigateToMercedes={() => setRoute('mercedes-chauffeur')}
      />

      {/* Quick Car Rental Enquiry Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <SimpleEnquirySection 
          initialType="car-rental" 
          title="Car Rental Enquiry"
          subtitle="Self Drive and Chauffeur Driven service enquiries for Hotwheels Car Rental LLC."
        />
      </section>

      {/* Security Deposit & Rental Terms */}
      <section className="py-12 sm:py-14 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/15 text-[#8A6D0B] text-[11px] font-bold uppercase tracking-wider">
              Rental Requirements
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0A2540] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#C9A227] shrink-0" />
              Security Deposit Required — All Rentals
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              A refundable security deposit is mandatory for all vehicle rentals in accordance with Hotwheels Car Rental LLC standard policy. Security deposits are fully refunded upon vehicle return and inspection.
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1.5 pt-1">
              <li><span className="font-semibold text-[#0A2540]">Security Deposit:</span> Required on all rentals, authorized or deposited prior to vehicle handover.</li>
              <li><span className="font-semibold text-[#0A2540]">Driving Credentials:</span> Valid UAE driving license (residents) or International Driving Permit + home country license (visitors).</li>
              <li><span className="font-semibold text-[#0A2540]">Identification:</span> Passport copy and valid UAE entry stamp/visit visa for international guests; Emirates ID for UAE residents.</li>
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Team on WhatsApp</span>
              </a>
              <a
                href="tel:+97142226182"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#0A2540] font-semibold text-xs sm:text-sm transition-all shadow-xs"
              >
                <Phone className="w-4 h-4 text-[#0B4DA2]" />
                <span>Dubai, United Arab Emirates: +971 4 222 6182</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
