import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Menu, X, ChevronRight, Phone, CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { ZoneTourismLogo, HotwheelsLogo } from './Logos';
import { COMPANY_CONFIG } from '../data/travelData';
import { WhatsAppOfficialIcon } from './WhatsAppFloat';

interface HeaderProps {
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
  onOpenVisaApp?: (visaTypeId?: string) => void;
  onOpenEnquiry?: (type?: 'visa' | 'car-rental') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, setRoute }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phone, setPhone] = useState<string>(COMPANY_CONFIG.phone || '');
  const [whatsappNumber, setWhatsappNumber] = useState<string>(COMPANY_CONFIG.whatsappNumber || '');

  // Fetch dynamic phone/WhatsApp if set by admin/environment
  useEffect(() => {
    fetch('/api/company-info/public')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          if (json.data.phones && json.data.phones.length > 0 && json.data.phones[0]) {
            setPhone(json.data.phones[0]);
          }
          if (json.data.whatsappNumbers && json.data.whatsappNumbers.length > 0 && json.data.whatsappNumbers[0]) {
            setWhatsappNumber(json.data.whatsappNumbers[0]);
          }
        }
      })
      .catch(() => {
        // Fallback to static configuration
      });
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Exact 6-item simple header menu:
  // Home | Visa Services | Car Rental | Chauffeur Service | About Us | Contact
  const navItems: { label: string; route: PageRoute }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Visa Services', route: 'uae-visit-visa' },
    { label: 'Car Rental', route: 'car-rental' },
    { label: 'Chauffeur Service', route: 'mercedes-chauffeur' },
    { label: 'About Us', route: 'about' },
    { label: 'Contact', route: 'contact' },
  ];

  const handleNavClick = (route: PageRoute) => {
    setRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWaNumber = (whatsappNumber || COMPANY_CONFIG.whatsappNumber || '971555586359').replace(/\D/g, '') || '971555586359';

  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Hello Zone Tourism & Hotwheels Car Rental team, I would like to inquire about your services.'
  )}`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 lg:gap-3 xl:gap-6">
          {/* Dual Brand Logos:
              - Zone Tourism LLC: Main travel/visa identity
              - Hotwheels Car Rental LLC: Car-rental side */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
            {/* Primary Travel Identity: Zone Tourism LLC */}
            <button
              id="header-zone-tourism-logo"
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] rounded-lg p-0.5"
              title="ZONE TOURISM LLC (Main Travel & Visa Services)"
            >
              <ZoneTourismLogo size="md" className="h-6 sm:h-7 md:h-8.5 xl:h-9 transition-transform group-hover:scale-102" />
            </button>

            {/* Divider between identities */}
            <div className="h-4.5 sm:h-5.5 md:h-6.5 w-px bg-slate-200 shrink-0" aria-hidden="true" />

            {/* Car Rental Identity: Hotwheels Car Rental LLC */}
            <button
              id="header-hotwheels-logo"
              type="button"
              onClick={() => handleNavClick('car-rental')}
              className="flex items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] rounded-lg p-0.5"
              title="HOTWHEELS CAR RENTAL LLC (Car Rental & Fleet)"
            >
              <HotwheelsLogo size="sm" className="h-5 sm:h-6 md:h-7.5 xl:h-8 transition-transform group-hover:scale-102 opacity-95 group-hover:opacity-100" />
            </button>
          </div>

          {/* Desktop Navigation Links:
              Home | Visa Services | Car Rental | Chauffeur Service | About Us | Contact */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {navItems.map((item, idx) => {
              const isActive = currentRoute === item.route;
              return (
                <React.Fragment key={item.route}>
                  <button
                    id={`nav-link-${item.route}`}
                    type="button"
                    onClick={() => handleNavClick(item.route)}
                    className={`px-2 xl:px-2.5 py-1.5 xl:py-2 rounded-lg text-[13px] xl:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0B4DA2]/10 text-[#0B4DA2] shadow-xs'
                        : 'text-slate-700 hover:text-[#0B4DA2] hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                  {idx < navItems.length - 1 && (
                    <span className="hidden xl:inline text-slate-300 text-xs select-none mx-0.5" aria-hidden="true">
                      |
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Header Action Buttons: Admin Portal, WhatsApp, and Call Now */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* Admin Portal Button */}
            <button
              id="header-admin-btn"
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl border text-xs xl:text-sm font-bold shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] min-h-[38px] ${
                currentRoute === 'admin'
                  ? 'bg-[#0A2540] text-white border-[#0A2540]'
                  : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-[#0B4DA2] hover:border-[#0B4DA2]/40'
              }`}
              title="Admin Portal (Fleet, Enquiries & Database)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B4DA2] shrink-0" />
              <span>Admin</span>
            </button>

            {/* WhatsApp Header Button */}
            <a
              id="header-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#19a752] text-white font-bold text-xs xl:text-sm shadow-xs transition-all transform hover:scale-102 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-1 min-h-[38px]"
              title="Chat on Official WhatsApp"
            >
              <WhatsAppOfficialIcon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">WhatsApp</span>
            </a>

            {/* Call Now Header Button */}
            {phone ? (
              <a
                id="header-call-btn"
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-bold text-xs xl:text-sm shadow-xs transition-all transform hover:scale-102 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] focus:ring-offset-1 min-h-[38px]"
                title={`Call Now: ${phone}`}
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Call Now</span>
              </a>
            ) : (
              <button
                id="header-call-btn"
                type="button"
                onClick={() => handleNavClick('contact')}
                className="inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-bold text-xs xl:text-sm shadow-xs transition-all transform hover:scale-102 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] focus:ring-offset-1 min-h-[38px]"
                title="Call Now / Contact Us"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Call Now</span>
              </button>
            )}
          </div>

          {/* Mobile Right Controls: Visible WhatsApp, Call Now, Admin & Drawer Toggle */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Mobile Admin Button */}
            <button
              id="mobile-header-admin-btn"
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-bold shadow-xs cursor-pointer min-h-[36px] min-w-[36px] ${
                currentRoute === 'admin'
                  ? 'bg-[#0A2540] text-white border-[#0A2540]'
                  : 'bg-slate-50 hover:bg-slate-100 text-[#0A2540] border-slate-200'
              }`}
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 text-[#0B4DA2] shrink-0" />
              <span className="hidden min-[400px]:inline text-[11px] font-bold">Admin</span>
            </button>

            {/* Mobile WhatsApp Button */}
            <a
              id="mobile-header-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#19a752] text-white font-bold text-xs shadow-xs cursor-pointer min-h-[36px] min-w-[36px]"
              title="Chat on WhatsApp"
              aria-label="WhatsApp"
            >
              <WhatsAppOfficialIcon className="w-4 h-4 shrink-0" />
              <span className="hidden min-[480px]:inline text-[11px] sm:text-xs">WhatsApp</span>
              <span className="inline min-[480px]:hidden text-[10px]">WA</span>
            </a>

            {/* Mobile Call Now Button */}
            {phone ? (
              <a
                id="mobile-header-call-btn"
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-bold text-xs shadow-xs cursor-pointer min-h-[36px] min-w-[36px]"
                title={`Call ${phone}`}
                aria-label="Call Now"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden min-[480px]:inline text-[11px] sm:text-xs">Call</span>
              </a>
            ) : (
              <button
                id="mobile-header-call-btn"
                type="button"
                onClick={() => handleNavClick('contact')}
                className="inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-bold text-xs shadow-xs cursor-pointer min-h-[36px] min-w-[36px]"
                title="Call Us"
                aria-label="Call Now"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden min-[480px]:inline text-[11px] sm:text-xs">Call</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 transition-colors flex items-center justify-center min-w-[36px] min-h-[36px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Full screen overlay with robust z-index) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white">
          {/* Mobile Drawer Top Bar */}
          <div className="bg-[#0A2540] text-slate-100 px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wide text-white uppercase">
                Menu
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                id="close-mobile-menu-btn"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white transition-colors flex items-center justify-center min-w-[40px] min-h-[40px] cursor-pointer"
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Scrollable Navigation Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Both Brand Logos in Mobile Menu */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ZoneTourismLogo size="sm" className="h-7" />
                <div className="h-6 w-px bg-slate-300" />
                <HotwheelsLogo size="sm" className="h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Dubai, UAE
              </span>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1 flex items-center justify-between">
                <span>Navigation</span>
                <span className="text-[10px] text-slate-400 font-normal">Menu</span>
              </div>
              {navItems.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    id={`mobile-nav-${item.route}`}
                    type="button"
                    onClick={() => handleNavClick(item.route)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors min-h-[48px] cursor-pointer ${
                      isActive
                        ? 'bg-[#0B4DA2] text-white shadow-xs'
                        : 'text-slate-800 hover:bg-slate-100 active:bg-slate-200 bg-slate-50/70 border border-slate-200/60'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}

              {/* Explicit Admin Portal in Main Nav List */}
              <button
                id="mobile-nav-admin"
                type="button"
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors min-h-[48px] cursor-pointer border ${
                  currentRoute === 'admin'
                    ? 'bg-[#0A2540] text-white border-[#0A2540]'
                    : 'text-[#0A2540] bg-amber-50/80 hover:bg-amber-100/80 border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                  <span>Admin Portal</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A2540] text-white font-semibold">
                  Dashboard
                </span>
              </button>
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
                Direct Contact & Payment
              </div>

              {/* Make Payment Quick Link */}
              <button
                id="drawer-make-payment-btn"
                type="button"
                onClick={() => handleNavClick('make-payment')}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-[#0A2540] font-bold text-xs sm:text-sm flex items-center justify-between border border-slate-200 cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0B4DA2]" />
                  <span>Make a Payment (Bank Details)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Admin Portal Link */}
              <button
                id="drawer-admin-btn"
                type="button"
                onClick={() => handleNavClick('admin')}
                className="w-full px-4 py-3 rounded-xl bg-[#0A2540] hover:bg-[#081e33] text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                  <span>Admin Portal & Database</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* WhatsApp Contact Button */}
              <a
                id="drawer-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
              >
                <WhatsAppOfficialIcon className="w-4 h-4 shrink-0" />
                <span>WhatsApp Contact</span>
              </a>

              {/* Direct Phone Call */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dubai, United Arab Emirates
                </span>
                <a
                  id="drawer-call-btn"
                  href={`tel:${(phone || '+971 4 222 6182').replace(/\s+/g, '')}`}
                  className="text-xs sm:text-sm font-bold text-[#0B4DA2] hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{phone || '+971 4 222 6182'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
