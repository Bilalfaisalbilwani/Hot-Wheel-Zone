import React, { useState } from 'react';
import { PageRoute } from '../types';
import { PageHeader } from '../components/PageHeader';
import { COMPANY_CONFIG } from '../data/travelData';
import { 
  Building2, 
  Car, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Users, 
  ArrowRight,
  Globe, 
  Clock, 
  Sparkles, 
  CreditCard,
  FileCheck,
  ChevronDown,
  Compass,
  Star,
  Shield,
  HelpCircle,
  TrendingUp,
  Headphones
} from 'lucide-react';
import { WhatsAppOfficialIcon } from '../components/WhatsAppFloat';

interface AboutPageProps {
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
  onOpenVisaApp?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ currentRoute, setRoute }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const whatsappUrl = `https://wa.me/${(COMPANY_CONFIG.whatsappNumber || '923315424466').replace(/\D/g, '')}?text=${encodeURIComponent('Hello Zone Tourism & Hotwheels Car Rental team, I would like to learn more about your services.')}`;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is the relationship between Zone Tourism LLC and Hotwheels Car Rental LLC?",
      a: "Zone Tourism LLC and Hotwheels Car Rental LLC operate as unified sister companies registered under Dubai commercial regulations. Zone Tourism LLC specializes in UAE entry visit visas, outbound visa consulting, and tourist logistics, while Hotwheels Car Rental LLC provides premium self-drive car rentals and executive Mercedes-Benz chauffeur services across Dubai and the UAE."
    },
    {
      q: "Where is your physical office located in Dubai?",
      a: "Our head office is centrally located at Office 204, Al Rigga Road, Deira, Dubai (conveniently situated right beside Union Metro Station Exit 2). Visitors are welcome for passport verifications, cash/card settlements, and in-person travel consultations."
    },
    {
      q: "How do I book a Mercedes Chauffeur or Self-Drive vehicle?",
      a: "You can browse our fleet directly online with HD walkaround videos, submit an online booking form, or connect instantly with our dispatch team on WhatsApp (+92 331 5424466 or +971 55 558 6359). Chauffeur reservations are confirmed immediately with flight tracking for airport transfers."
    },
    {
      q: "What payment methods do you accept for visa and rental services?",
      a: "We accept official bank transfers to our corporate accounts at Emirates NBD and Habib Bank AG Zurich (with verifiable IBANs), major credit/debit cards (Visa, MasterCard, American Express), and cash/card payments at our Dubai office counter."
    },
    {
      q: "How fast are UAE visit visas processed through Zone Tourism LLC?",
      a: "Standard UAE 30-day and 60-day tourist visas are typically processed within 24 to 48 hours upon document submission. We also offer an Express Visa processing service for urgent travelers requiring same-day issuance subject to UAE Immigration approvals."
    },
    {
      q: "Are all rental vehicles insured and maintained?",
      a: "Yes. Every vehicle in the Hotwheels Car Rental fleet is RTA-registered, comprehensively insured, sanitized before each handover, and backed by 24/7 Dubai roadside assistance."
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 space-y-12 sm:space-y-16">
      {/* Page Header */}
      <PageHeader
        title="About Our Company"
        subtitle="Zone Tourism LLC & Hotwheels Car Rental LLC — Premier UAE Visa Facilitation & Luxury Fleet Mobility in Dubai."
        currentRoute={currentRoute}
        setRoute={setRoute}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-20">

        {/* 1. Master Corporate Story & Introduction Banner */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Established 2009 in Dubai, UAE</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A2540] tracking-tight font-serif leading-tight">
                Two Specialized Divisions, One Uncompromising Standard of Excellence
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Headquartered in the heart of Deira, Dubai, <strong>ZONE TOURISM LLC</strong> and <strong>HOTWHEELS CAR RENTAL LLC</strong> were founded to deliver dependable, transparent, and seamless travel logistics to international visitors, corporate institutions, and UAE residents.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Whether expediting high-priority UAE visit visas through official immigration channels or dispatching our flagship Mercedes-Benz VIP chauffeur fleet for royal delegations and airport arrivals, our client-first ethos ensures reliability at every stage.
              </p>

              {/* Verified Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#0B4DA2] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#0A2540]">DET Licensed</div>
                    <div className="text-[10px] text-slate-500">Tourism Authority</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-[#C9A227] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#0A2540]">RTA Compliant</div>
                    <div className="text-[10px] text-slate-500">Fleet Operations</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#0A2540]">Official Banking</div>
                    <div className="text-[10px] text-slate-500">Emirates NBD & HBZ</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=900"
                  alt="Dubai Skyline and Corporate Zone Tourism Office"
                  className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
                    Deira Headquarters • Dubai
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Zone Tourism LLC & Hotwheels Car Rental
                  </h3>
                  <p className="text-xs text-slate-200 mt-0.5">
                    Union Metro Station (Exit 2), Al Rigga Road, Dubai, UAE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Key Metrics & Impact Counters */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B4DA2] flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">15+ Years</div>
            <div className="text-xs text-slate-500 font-medium">Serving UAE Travelers (Est. 2009)</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C9A227] flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">60,000+</div>
            <div className="text-xs text-slate-500 font-medium">Visas Issued & Processed</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Car className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">500+</div>
            <div className="text-xs text-slate-500 font-medium">Fleet Vehicles & Luxury Vans</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Headphones className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">24 / 7</div>
            <div className="text-xs text-slate-500 font-medium">Direct WhatsApp Support Desk</div>
          </div>
        </section>

        {/* 3. Deep Dive into the Two Operating Entities */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#0B4DA2] uppercase tracking-wider bg-[#0B4DA2]/10 px-3 py-1 rounded-full">
              Dual Operating Divisions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
              Specialized Service Divisions Tailored to Your Needs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Explore the core competencies and specialized services offered across our travel and automotive divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Entity 1: Zone Tourism LLC */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B4DA2]/30 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0B4DA2]/5 rounded-bl-full pointer-events-none" />
              
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0B4DA2] text-white flex items-center justify-center font-bold shadow-md">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-[#0B4DA2] uppercase tracking-wider block">
                      Travel & Immigration Logistics
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0A2540]">
                      Zone Tourism LLC
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Zone Tourism LLC manages high-volume UAE entry documentation and outbound leisure travel. We work with verified immigration platforms to guarantee compliance, avoid unexpected fines, and deliver prompt tourist visa issuances.
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Core Specializations:
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0B4DA2] shrink-0 mt-0.5" />
                      <span><strong>UAE Tourist Visas:</strong> 30 Days & 60 Days Single and Multiple Entry with express same-day expediting.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0B4DA2] shrink-0 mt-0.5" />
                      <span><strong>Document Verification:</strong> Pre-submission passport and photo compliance checks to ensure zero rejection rates.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0B4DA2] shrink-0 mt-0.5" />
                      <span><strong>Outbound Visa Consultation:</strong> Expert guidance for Schengen Area, United Kingdom, USA, Canada, and China.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0B4DA2] shrink-0 mt-0.5" />
                      <span><strong>Tourism Packages:</strong> Desert safari adventures, Dubai city tours, luxury yacht charters, and hotel reservations.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRoute('uae-visit-visa');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Apply for UAE Visa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Entity 2: Hotwheels Car Rental LLC */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/10 rounded-bl-full pointer-events-none" />
              
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center font-bold shadow-md">
                    <Car className="w-7 h-7 text-[#C9A227]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-[#C9A227] uppercase tracking-wider block">
                      Fleet Mobility & Luxury Chauffeur
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0A2540]">
                      Hotwheels Car Rental LLC
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hotwheels Car Rental LLC offers a modern fleet of budget-friendly city hatchbacks, spacious 7-seater MPVs, rugged SUVs, and flagship Mercedes-Benz VIP chauffeur vehicles with professional English-speaking drivers.
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Core Specializations:
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                      <span><strong>Flexible Self-Drive:</strong> Daily, Weekly, and Monthly plans with zero hidden fees and competitive corporate discounts.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                      <span><strong>Mercedes VIP Chauffeur:</strong> Mercedes-Benz V-Class, Vito, S-Class, and E-Class for executive roadshows and VIP transfers.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                      <span><strong>Airport Transfers (DXB & DWC):</strong> Flight tracking, meet & greet service, and baggage assistance with flight-delay tolerance.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                      <span><strong>Corporate Long-Term Leasing:</strong> Dedicated fleet management solutions for enterprises, hotels, and travel agencies.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRoute('car-rental');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0A2540] hover:bg-[#12375C] text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Browse Car Rental Fleet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* 4. Why Choose Us / Trust Pillars */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#0B4DA2] uppercase tracking-wider bg-[#0B4DA2]/10 px-3 py-1 rounded-full">
              Our Core Promises
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
              The Zone & Hotwheels Quality Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0A2540]">100% Genuine Licenses</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fully registered corporate entities with the Dubai Department of Economy and Tourism (DET) and Dubai Roads and Transport Authority (RTA).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A227]/15 text-[#C9A227] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0A2540]">Official UAE Banking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct corporate settlements via Emirates NBD, Habib Bank AG Zurich, and Commercial Bank of Dubai with instant verifiable IBANs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0A2540]">Guaranteed Response Time</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated WhatsApp dispatch desks answering quotations, document questions, and roadside assistance in real-time.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0A2540]">HD Video Walkarounds</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every vehicle in our catalog features detailed photo galleries and HD walkaround video previews so you know exactly what you book.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Physical Headquarters & Deira Office Section */}
        <section className="bg-[#0A2540] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider">
                Physical Office in Dubai
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
                Visit Our Deira Headquarters in Person
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                We welcome visitors at our physical corporate location. Located near Union Metro Station (Exit 2) along Al Rigga Road in Deira, our team is available for in-person consultations, passport verifications, cash/card payments, and rental fleet inspections.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-200 pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <span>{COMPANY_CONFIG.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <a href="tel:+97142226182" className="hover:underline font-mono">+971 4 222 6182</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <a href="mailto:info@zonetourism.ae" className="hover:underline">info@zonetourism.ae</a>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href={COMPANY_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#b08d1f] text-[#0A2540] font-bold text-xs sm:text-sm transition-colors inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm transition-colors inline-flex items-center gap-2"
                >
                  <WhatsAppOfficialIcon className="w-4 h-4 text-white" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-white font-bold text-base border-b border-white/10 pb-3 flex items-center justify-between">
                <span>Working Hours & Coordinates</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-medium">Open 6 Days</span>
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">Tourism License:</span>
                  <span className="font-semibold text-white">Commercial Tourism, Dubai</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">Fleet Operations:</span>
                  <span className="font-semibold text-white">RTA-Compliant Car Rental</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">Office Working Hours:</span>
                  <span className="font-semibold text-white">Mon – Sat: 9:00 AM – 9:00 PM</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">WhatsApp Desk:</span>
                  <span className="font-semibold text-emerald-400">24/7 Support Active</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">Metro Proximity:</span>
                  <span className="font-semibold text-white">Union Metro Station (Exit 2)</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* 6. Frequently Asked Questions (FAQ) Accordion */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#0B4DA2] uppercase tracking-wider bg-[#0B4DA2]/10 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear answers regarding our Dubai visa processing, car rental terms, and Mercedes VIP chauffeur services.
            </p>
          </div>

          <div className="max-w-4xl mx-auto divide-y divide-slate-200/80">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-[#0A2540] hover:text-[#0B4DA2] transition-colors py-1 cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-[#0B4DA2]' : ''}`} />
                </button>
                {openFaq === idx && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6 animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
