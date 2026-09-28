import React from 'react';
import { PageRoute } from '../types';
import { COMPANY_CONFIG } from '../data/travelData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Instagram, 
  Facebook,
  Linkedin,
  Navigation, 
  CreditCard, 
  ShieldCheck, 
  FileText,
  Building2,
  Car
} from 'lucide-react';
import { WhatsAppOfficialIcon } from './WhatsAppFloat';

// Dedicated TikTok Icon
const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.41a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3.14 15.7a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.32a8.28 8.28 0 0 0 4.77 1.52V7.4a4.85 4.85 0 0 1-1-.71z"/>
  </svg>
);

interface FooterProps {
  setRoute: (route: PageRoute) => void;
  onOpenVisaApp?: () => void;
  onOpenEnquiry?: (type?: 'visa' | 'car-rental') => void;
}

export const Footer: React.FC<FooterProps> = ({ setRoute }) => {
  const handleNav = (route: PageRoute) => {
    setRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsAppNumber = (COMPANY_CONFIG.whatsappNumber || '971555586359').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello Zone Tourism & Hotwheels Car Rental, I would like to inquire about your services.')}`;
  const displayEmail = COMPANY_CONFIG.email || 'info@zonetourism.ae';
  const displayAddress = COMPANY_CONFIG.address || 'Office 402, Al Dana Centre, Al Maktoum Road, Deira, Dubai, UAE';
  const googleMapsUrl = COMPANY_CONFIG.googleMapsUrl || 'https://maps.app.goo.gl/Bw667w3JjV5iXh9h9';

  return (
    <footer className="bg-[#0A2540] text-slate-300 pt-12 pb-8 border-t border-[#12375C]" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-Column Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 pb-10 border-b border-white/10">
          
          {/* Section 1: Companies & Social Media */}
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Corporate Entities
              </span>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0B4DA2]/30 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-[#38bdf8]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-tight">
                      Zone Tourism LLC
                    </h3>
                    <p className="text-[11px] text-slate-400">UAE & International Visa Services</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A227]/20 flex items-center justify-center shrink-0">
                    <Car className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-tight">
                      Hotwheels Car Rental LLC
                    </h3>
                    <p className="text-[11px] text-slate-400">Self-Drive & Mercedes Chauffeur</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links: Instagram, Facebook, LinkedIn, TikTok */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Connect on Social Media
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Instagram */}
                <a
                  href={COMPANY_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
                >
                  <Instagram className="w-4 h-4 text-pink-400 group-hover:text-white transition-colors" />
                  <span>Instagram</span>
                </a>

                {/* Facebook */}
                <a
                  href={COMPANY_CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-[#1877F2] border border-white/10 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
                >
                  <Facebook className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
                  <span>Facebook</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={COMPANY_CONFIG.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-[#0A66C2] border border-white/10 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
                >
                  <Linkedin className="w-4 h-4 text-sky-400 group-hover:text-white transition-colors" />
                  <span>LinkedIn</span>
                </a>

                {/* TikTok */}
                <a
                  href={COMPANY_CONFIG.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-black border border-white/10 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
                >
                  <TikTokIcon className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Contact, Address, WhatsApp & Google Maps */}
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Contact & Location
            </span>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* Office Address */}
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-white font-bold text-xs uppercase tracking-wide block">
                    Office Address
                  </span>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {displayAddress}
                  </p>
                </div>
              </div>

              {/* Google Maps Link */}
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <Navigation className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-white font-bold text-xs uppercase tracking-wide block">
                    Google Maps
                  </span>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#C9A227] hover:text-[#e0b938] hover:underline font-semibold"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Official Phone Numbers */}
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <Phone className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-white font-bold text-xs uppercase tracking-wide block">
                    Official Phone Numbers
                  </span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <a
                      href="tel:+97142226182"
                      className="text-white hover:text-[#C9A227] font-mono text-xs sm:text-sm font-semibold transition-colors"
                    >
                      +971 4 222 6182 (Landline)
                    </a>
                    <a
                      href="tel:+971555586359"
                      className="text-white hover:text-[#C9A227] font-mono text-xs sm:text-sm font-semibold transition-colors"
                    >
                      +971 55 558 6359 (Mobile)
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <WhatsAppOfficialIcon className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-white font-bold text-xs uppercase tracking-wide block">
                    WhatsApp
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-semibold"
                  >
                    <span>+971 55 558 6359 (Direct WhatsApp Chat)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-white font-bold text-xs uppercase tracking-wide block">
                    Email
                  </span>
                  <a
                    href={`mailto:${displayEmail}`}
                    className="text-slate-200 hover:text-white font-mono text-xs sm:text-sm transition-colors block"
                  >
                    {displayEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Legal & Make a Payment */}
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Online Payment
              </span>
              <button 
                type="button"
                onClick={() => handleNav('make-payment')} 
                className="w-full py-3.5 px-4 rounded-xl bg-[#C9A227] hover:bg-[#b08d20] text-slate-950 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <CreditCard className="w-4 h-4" />
                <span>Make a Payment</span>
              </button>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Legal Policies
              </span>
              <div className="space-y-2">
                <button 
                  type="button"
                  onClick={() => handleNav('privacy')} 
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs sm:text-sm transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Privacy Policy</span>
                  </div>
                  <span className="text-xs text-slate-400">View</span>
                </button>

                <button 
                  type="button"
                  onClick={() => handleNav('terms')} 
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs sm:text-sm transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>Terms & Conditions</span>
                  </div>
                  <span className="text-xs text-slate-400">View</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <strong className="text-slate-300">Zone Tourism LLC</strong> & <strong className="text-slate-300">Hotwheels Car Rental LLC</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => handleNav('privacy')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => handleNav('terms')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => handleNav('make-payment')} 
              className="text-[#C9A227] hover:text-[#e0b938] font-bold transition-colors cursor-pointer"
            >
              Make a Payment
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
