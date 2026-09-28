import React, { useState } from 'react';
import { PageRoute } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/SimpleEnquiryForms';
import { WhatsAppFloat } from './components/WhatsAppFloat';

import { Home } from './pages/Home';
import { VisaPage } from './pages/VisaPage';
import { CarRentalPage } from './pages/CarRentalPage';
import { MercedesChauffeurPage } from './pages/MercedesChauffeurPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { MakePaymentPage } from './pages/MakePaymentPage';
import { AdminPage } from './pages/AdminPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

function getRouteFromPath(): PageRoute {
  if (typeof window === 'undefined') return 'home';
  const clean = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (clean === 'admin') return 'admin';
  if (clean === 'make-payment' || clean === 'payment') return 'make-payment';
  if (clean === 'uae-visit-visa' || clean === 'visa') return 'uae-visit-visa';
  if (clean === 'car-rental' || clean === 'cars') return 'car-rental';
  if (clean === 'mercedes-chauffeur' || clean === 'chauffeur') return 'mercedes-chauffeur';
  if (clean === 'about') return 'about';
  if (clean === 'contact') return 'contact';
  if (clean === 'terms') return 'terms';
  if (clean === 'privacy') return 'privacy';
  return 'home';
}

export default function App() {
  const [route, setRouteState] = useState<PageRoute>(() => getRouteFromPath());

  const setRoute = (newRoute: PageRoute) => {
    setRouteState(newRoute);
    if (typeof window !== 'undefined') {
      const targetPath = newRoute === 'home' ? '/' : `/${newRoute}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  };

  React.useEffect(() => {
    const handlePopState = () => {
      setRouteState(getRouteFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO Page Titles
  React.useEffect(() => {
    const titleMap: Record<PageRoute, string> = {
      'home': 'Zone Tourism LLC & Hotwheels Car Rental | Visa & Car Rental Dubai',
      'uae-visit-visa': 'UAE & International Visa Services | Zone Tourism LLC',
      'car-rental': 'Self-Drive Car Rental Dubai | Hotwheels Car Rental LLC',
      'chauffeur': 'Chauffeur Driven Services Dubai | Hotwheels Car Rental LLC',
      'mercedes-chauffeur': 'Mercedes Chauffeur Service Dubai | Hotwheels Car Rental LLC',
      'about': 'About Us | Zone Tourism LLC & Hotwheels Car Rental LLC',
      'contact': 'Contact Us | Zone Tourism LLC & Hotwheels Car Rental LLC',
      'make-payment': 'Official Payment Details | Zone Tourism LLC & Hotwheels Car Rental LLC',
      'terms': 'Terms & Conditions | Zone Tourism LLC & Hotwheels Car Rental LLC',
      'privacy': 'Privacy Policy | Zone Tourism LLC & Hotwheels Car Rental LLC',
      'admin': 'Admin Portal | Zone Tourism LLC & Hotwheels Car Rental LLC'
    };
    document.title = titleMap[route] || 'Zone Tourism LLC & Hotwheels Car Rental | Visa & Car Rental Dubai';
  }, [route]);

  // Unified Quick Enquiry / Quote Modal State (Phase 1)
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryModalType, setEnquiryModalType] = useState<'visa' | 'car-rental'>('visa');
  const [enquiryDestination, setEnquiryDestination] = useState<string | undefined>(undefined);
  const [enquiryVehicleType, setEnquiryVehicleType] = useState<string | undefined>(undefined);

  const handleOpenEnquiry = (type: 'visa' | 'car-rental' = 'visa', destinationOrVehicle?: string) => {
    setEnquiryModalType(type);
    if (type === 'visa') {
      setEnquiryDestination(destinationOrVehicle);
      setEnquiryVehicleType(undefined);
    } else {
      setEnquiryVehicleType(destinationOrVehicle);
      setEnquiryDestination(undefined);
    }
    setIsEnquiryModalOpen(true);
  };

  const handleOpenVisaApp = (visaTypeId?: string) => {
    setRoute('uae-visit-visa');
    setTimeout(() => {
      const el = document.getElementById('visa-online-application-portal');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const renderPage = () => {
    switch (route) {
      case 'home':
        return (
          <Home 
            setRoute={setRoute} 
            onOpenVisaApp={handleOpenVisaApp} 
            onOpenEnquiry={handleOpenEnquiry}
          />
        );
      case 'uae-visit-visa':
        return (
          <VisaPage 
            currentRoute={route} 
            setRoute={setRoute} 
            onOpenVisaApp={handleOpenVisaApp}
            onOpenEnquiry={handleOpenEnquiry}
          />
        );
      case 'car-rental':
      case 'chauffeur':
        return <CarRentalPage currentRoute={route} setRoute={setRoute} onOpenEnquiry={handleOpenEnquiry} />;
      case 'mercedes-chauffeur':
        return <MercedesChauffeurPage currentRoute={route} setRoute={setRoute} onOpenEnquiry={handleOpenEnquiry} />;
      case 'about':
        return <AboutPage currentRoute={route} setRoute={setRoute} onOpenVisaApp={() => handleOpenVisaApp()} />;
      case 'make-payment':
        return <MakePaymentPage currentRoute={route} setRoute={setRoute} onOpenEnquiry={handleOpenEnquiry} />;
      case 'admin':
        return <AdminPage currentRoute={route} setRoute={setRoute} />;
      case 'contact':
        return <ContactPage currentRoute={route} setRoute={setRoute} />;
      case 'terms':
        return <TermsPage currentRoute={route} setRoute={setRoute} />;
      case 'privacy':
        return <PrivacyPage currentRoute={route} setRoute={setRoute} />;
      default:
        return (
          <Home 
            setRoute={setRoute} 
            onOpenVisaApp={handleOpenVisaApp} 
            onOpenEnquiry={handleOpenEnquiry}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#0A2540] font-sans antialiased selection:bg-[#0B4DA2] selection:text-white overflow-x-hidden w-full max-w-full">
      {/* Header */}
      <Header 
        currentRoute={route} 
        setRoute={setRoute} 
        onOpenVisaApp={handleOpenVisaApp}
        onOpenEnquiry={handleOpenEnquiry}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer 
        setRoute={setRoute} 
        onOpenVisaApp={() => handleOpenVisaApp()} 
        onOpenEnquiry={handleOpenEnquiry}
      />

      {/* Single Phase 1 Quick Enquiry Modal (Visa Enquiry & Car Rental Enquiry) */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        initialType={enquiryModalType}
        initialDestination={enquiryDestination}
        initialVehicleType={enquiryVehicleType}
      />

      {/* Visible Floating WhatsApp and Mobile Call Actions */}
      <WhatsAppFloat />
    </div>
  );
}
