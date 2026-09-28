import React from 'react';
import { MAIN_VISA_SERVICES, VISA_DISCLAIMER, COMPANY_CONFIG } from '../data/travelData';
import { VisaServiceItem } from '../types';
import { Clock, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import { WhatsAppOfficialIcon } from './WhatsAppFloat';

interface VisaSectionProps {
  onOpenVisaApp?: (visaTypeId?: string) => void;
  onOpenEnquiry?: (type?: 'visa' | 'car-rental', destination?: string) => void;
  showAll?: boolean;
  onViewAll?: () => void;
}

export const VisaSection: React.FC<VisaSectionProps> = ({
  onOpenVisaApp,
  showAll = true,
  onViewAll
}) => {
  const visasToDisplay = showAll ? MAIN_VISA_SERVICES : MAIN_VISA_SERVICES.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-[#F5F7FA]" id="visa-services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-bold uppercase tracking-wider">
            Zone Tourism LLC • Visa Services
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A2540] tracking-tight">
            UAE & International Visa Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Apply online directly on our website with document uploads or connect with our Dubai visa desk for assistance.
          </p>
        </div>

        {/* 5 Visa Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visasToDisplay.map((visa: VisaServiceItem) => {
            const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
              visa.whatsappMessage || `Hello Zone Tourism, I would like to inquire about ${visa.visaType}.`
            )}`;

            return (
              <div
                key={visa.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 sm:p-7 space-y-5">
                  {/* Country / Destination */}
                  <div className="space-y-1 border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Country / Destination
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#0B4DA2]">
                      {visa.destination}
                    </span>
                  </div>

                  {/* Visa Type */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Visa Type
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#0A2540]">
                      {visa.visaType}
                    </h3>
                  </div>

                  {/* Approx. Processing Time */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#0B4DA2] shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                        Approx. Processing Time
                      </span>
                      <span className="font-bold text-[#0A2540] text-xs">
                        {visa.processingTime}
                      </span>
                    </div>
                  </div>

                  {/* Basic Documents Required */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold uppercase tracking-wide text-[#0A2540] block">
                      Basic Documents Required
                    </span>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {visa.basicDocuments.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#0B4DA2] shrink-0 mt-0.5" />
                          <span className="leading-snug">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Actions: Apply / Enquire on WhatsApp (Primary) & Apply Online (Secondary) */}
                <div className="p-6 pt-0 space-y-2.5 border-t border-slate-100/80 mt-auto bg-slate-50/50">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm text-center transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <WhatsAppOfficialIcon className="w-4 h-4 shrink-0" />
                    <span>Apply / Enquire on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenVisaApp) {
                        onOpenVisaApp(visa.id);
                      } else if (onViewAll) {
                        onViewAll();
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#0B4DA2] font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                    <span>Apply Online & Upload Documents</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button if truncated */}
        {!showAll && onViewAll && (
          <div className="text-center pt-2">
            <button
              onClick={onViewAll}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-[#0A2540] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              View All Visa Services & Document Upload
            </button>
          </div>
        )}

        {/* Required Regulatory Disclaimer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start sm:items-center gap-3 text-slate-600">
          <AlertCircle className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
            <strong>Disclaimer:</strong> {VISA_DISCLAIMER}
          </p>
        </div>
      </div>
    </section>
  );
};
