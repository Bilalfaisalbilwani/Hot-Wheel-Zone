import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { PageHeader } from '../components/PageHeader';
import { COMPANY_CONFIG } from '../data/travelData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Instagram, 
  Navigation
} from 'lucide-react';
import { WhatsAppOfficialIcon } from '../components/WhatsAppFloat';

interface ContactPageProps {
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ currentRoute, setRoute }) => {
  const [companyData, setCompanyData] = useState({
    address: COMPANY_CONFIG.address,
    phones: COMPANY_CONFIG.phones,
    whatsappNumber: COMPANY_CONFIG.whatsappNumber,
    whatsappDisplay: COMPANY_CONFIG.whatsappDisplay,
    email: COMPANY_CONFIG.email,
    googleMapsUrl: COMPANY_CONFIG.googleMapsUrl,
    googleMapsEmbed: COMPANY_CONFIG.googleMapsEmbed,
    social: COMPANY_CONFIG.social
  });

  useEffect(() => {
    fetch('/api/company-info/public')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setCompanyData(prev => ({
            ...prev,
            address: json.data.address || prev.address,
            phones: (json.data.phones && json.data.phones.length > 0) ? json.data.phones : prev.phones,
            whatsappNumber: (json.data.whatsappNumbers && json.data.whatsappNumbers[0]) ? json.data.whatsappNumbers[0] : prev.whatsappNumber,
            whatsappDisplay: (json.data.whatsappNumbers && json.data.whatsappNumbers[0]) ? json.data.whatsappNumbers[0] : prev.whatsappDisplay,
            email: json.data.email || (json.data.emails && json.data.emails[0]) || prev.email,
            googleMapsUrl: json.data.googleMapsUrl || prev.googleMapsUrl,
            googleMapsEmbed: json.data.googleMapsEmbed || prev.googleMapsEmbed,
            social: json.data.social ? { ...prev.social, ...json.data.social } : prev.social
          }));
        }
      })
      .catch(() => {});
  }, []);

  const cleanWaNumber = (companyData.whatsappNumber || COMPANY_CONFIG.whatsappNumber || '971555586359').replace(/\D/g, '') || '971555586359';
  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent('Hello Zone Tourism & Hotwheels Car Rental, I have an inquiry.')}`;

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-20 space-y-8 sm:space-y-10">
      <PageHeader
        title="Contact Us"
        subtitle="Official contact details for Zone Tourism LLC and Hotwheels Car Rental LLC in Dubai, UAE."
        currentRoute={currentRoute}
        setRoute={setRoute}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* DIRECT CONTACT DIRECTORY & INTERACTIVE GOOGLE MAP (BALANCED 2-COLUMN LAYOUT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: CORE CONTACT DETAILS (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Card 1: Office Address */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center shrink-0 font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Office Location
                </span>
                <h4 className="text-sm font-extrabold text-[#0A2540]">Dubai Head Office</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {companyData.address}
                </p>
              </div>
            </div>

            {/* Card 2: Dubai, United Arab Emirates Contact */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center shrink-0 font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Direct Line
                </span>
                <h4 className="text-sm font-extrabold text-[#0A2540]">Dubai, United Arab Emirates</h4>
                <div className="mt-1.5 space-y-1">
                  <a
                    href="tel:+97142226182"
                    className="block text-sm font-bold text-[#0B4DA2] hover:underline font-mono transition-colors"
                  >
                    +971 4 222 6182
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3: WhatsApp Desk */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0 font-bold">
                  <WhatsAppOfficialIcon className="w-5 h-5 text-[#25D366]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Direct Messaging
                  </span>
                  <h4 className="text-sm font-extrabold text-[#0A2540]">WhatsApp Desk</h4>
                  <p className="text-xs font-bold text-[#0A2540] mt-0.5">
                    {companyData.whatsappDisplay || companyData.whatsappNumber}
                  </p>
                </div>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors min-h-[42px]"
              >
                <WhatsAppOfficialIcon className="w-4 h-4 text-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Card 4: Official Email */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center shrink-0 font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Email Channel
                </span>
                <h4 className="text-sm font-extrabold text-[#0A2540]">Official Inquiries</h4>
                <a 
                  href={`mailto:${companyData.email}`} 
                  className="text-xs font-bold text-[#0B4DA2] hover:underline block mt-0.5 truncate"
                >
                  {companyData.email}
                </a>
              </div>
            </div>

            {/* Card 5: Official Instagram */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <a
                href={companyData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] group-hover:bg-[#0B4DA2] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Social Media
                    </span>
                    <h4 className="text-sm font-extrabold text-[#0A2540] group-hover:text-[#0B4DA2] transition-colors">
                      Instagram
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      @zonetourism.ae
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0B4DA2] transition-colors shrink-0" />
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: GOOGLE MAPS CARD (7 COLS) */}
          <div className="lg:col-span-7">
            <section className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-4">
              
              {/* Map Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4DA2] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Office Location</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#0A2540]">
                    Google Maps
                  </h3>
                </div>

                <a
                  href={companyData.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white text-xs font-bold transition-colors shadow-xs w-full sm:w-auto min-h-[38px]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Embedded Google Maps Container */}
              <div className="w-full flex-1 min-h-[380px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-slate-200 relative bg-[#F5F7FA]">
                {companyData.googleMapsEmbed ? (
                  <iframe
                    title="Zone Tourism LLC & Hotwheels Car Rental LLC - Dubai Office Map"
                    src={companyData.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full absolute inset-0"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                    <MapPin className="w-8 h-8 text-[#0B4DA2]" />
                    <p className="font-semibold text-sm text-[#0A2540]">{companyData.address}</p>
                    <a
                      href={companyData.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#0B4DA2] hover:underline font-bold"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                )}
              </div>

              {/* Address Verification Footer Bar */}
              <div className="pt-2 text-slate-500 text-xs flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0B4DA2] shrink-0" />
                <span className="truncate">Near Union Metro Station, Exit 2, Deira, Dubai</span>
              </div>

            </section>
          </div>

        </div>

      </div>
    </div>
  );
};
