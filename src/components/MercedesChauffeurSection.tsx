import React, { useState, useEffect } from 'react';
import { COMPANY_CONFIG } from '../data/travelData';
import { MERCEDES_FLEET, CHAUFFEUR_SERVICE_OPTIONS } from '../data/carInventory';
import { FleetVehicle, ChauffeurServiceOption } from '../types';
import { 
  Users, Briefcase, Phone, Send, 
  Plane, Clock, Calendar, Building2, Sparkles,
  Car, ArrowRight, ShieldCheck, Filter, Info, CheckCircle2,
  Play, Film, Eye, Image as ImageIcon, Video, Maximize
} from 'lucide-react';
import { WhatsAppOfficialIcon } from './WhatsAppFloat';
import { useCurrency } from '../context/CurrencyContext';
import { CarVideoModal } from './CarVideoModal';

interface MercedesChauffeurSectionProps {
  onOpenEnquiry?: (type: 'visa' | 'car-rental', item?: string) => void;
  showAllVehicles?: boolean;
}

export const MercedesChauffeurSection: React.FC<MercedesChauffeurSectionProps> = ({
  onOpenEnquiry
}) => {
  const { currency, setCurrency } = useCurrency();
  const [activeRentalMode, setActiveRentalMode] = useState<'chauffeur' | 'self-drive'>('chauffeur');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [mercedesList, setMercedesList] = useState<FleetVehicle[]>(MERCEDES_FLEET);
  const [selectedMediaVehicle, setSelectedMediaVehicle] = useState<FleetVehicle | null>(null);
  const [mediaMode, setMediaMode] = useState<'photo' | 'video'>('photo');

  const handleOpenMedia = (vehicle: FleetVehicle, mode: 'photo' | 'video' = 'photo') => {
    setSelectedMediaVehicle(vehicle);
    setMediaMode(mode);
  };

  // Fetch live Mercedes vehicles from database if available
  useEffect(() => {
    let isMounted = true;
    const fetchMercedesFromDb = async () => {
      try {
        const res = await fetch('/api/cars');
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          const dbMercedes = json.data
            .filter((c: any) => c.isMercedesChauffeur || String(c.make).toLowerCase().includes('mercedes'))
            .map((c: any) => ({
              id: c.id,
              makeModel: `${c.make} ${c.model}`,
              category: c.category,
              serviceType: 'CHAUFFEUR DRIVEN' as const,
              serviceAssignment: (c.serviceType || 'Both') as any,
              brand: 'Mercedes-Benz' as const,
              seats: Number(c.seats) || 5,
              luggageCapacity: c.luggage || '3 Bags',
              image: c.image,
              gallery: c.gallery || c.images,
              videoUrl: c.videoUrl || c.video || undefined,
              dailyRateAED: c.dailyPriceAED || c.dailyPrice,
              weeklyRateAED: c.weeklyPriceAED || c.weeklyPrice,
              monthlyRateAED: c.monthlyPriceAED || c.monthlyPrice,
              isQuoteOnly: Boolean(c.getQuoteOption),
              description: c.description || '',
              chauffeurServices: [
                'Airport Transfer',
                'Hourly Hire',
                'Full-Day Chauffeur',
                'Corporate Transfer'
              ] as ChauffeurServiceOption[]
            }));
          if (dbMercedes.length > 0) {
            setMercedesList(dbMercedes);
          }
        }
      } catch (e) {
        // Fallback to static inventory
      }
    };
    fetchMercedesFromDb();
    return () => {
      isMounted = false;
    };
  }, []);

  const phoneTel = COMPANY_CONFIG.phone ? `tel:${COMPANY_CONFIG.phone.replace(/\s+/g, '')}` : '#contact';

  // Filter vehicles based on active rental mode & chauffeur service filter
  const displayedVehicles = mercedesList.filter((vehicle) => {
    if (activeRentalMode === 'self-drive') {
      // Must have Self Drive provision (assigned to Self Drive or Both)
      const hasSelfDrive = vehicle.serviceAssignment === 'Self Drive' || vehicle.serviceAssignment === 'Both';
      return hasSelfDrive;
    }

    // Chauffeur Mode:
    const isChauffeur = vehicle.serviceAssignment === 'Chauffeur Driven' || vehicle.serviceAssignment === 'Both' || vehicle.serviceType === 'CHAUFFEUR DRIVEN';
    if (!isChauffeur) return false;

    if (selectedService === 'all') return true;
    return vehicle.chauffeurServices?.includes(selectedService as ChauffeurServiceOption);
  });

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'airport-transfer':
        return <Plane className="w-4 h-4 text-[#0B4DA2]" />;
      case 'hourly-hire':
        return <Clock className="w-4 h-4 text-[#C9A227]" />;
      case 'full-day-chauffeur':
        return <Calendar className="w-4 h-4 text-[#0B4DA2]" />;
      case 'corporate-transfer':
        return <Building2 className="w-4 h-4 text-[#C9A227]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#C9A227]" />;
    }
  };

  const formatPrice = (rateInAED?: number) => {
    if (!rateInAED) return 'Custom Quote';
    if (currency === 'USD') {
      return `$${Math.round(rateInAED / 3.6725).toLocaleString()}`;
    }
    return `AED ${rateInAED.toLocaleString()}`;
  };

  const buildWhatsAppChauffeurQuoteLink = (vehicle: FleetVehicle, serviceName?: string) => {
    const serviceDetail = serviceName && serviceName !== 'all' ? ` for ${serviceName}` : '';
    const text = `Hello Hotwheels Car Rental, I would like to get a quote on WhatsApp for Mercedes Chauffeur Service (With Driver): ${vehicle.makeModel}${serviceDetail}. Please share the transfer rate and availability.`;
    return `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const buildWhatsAppSelfDriveLink = (vehicle: FleetVehicle) => {
    const rateText = vehicle.dailyRateAED ? ` (Daily: ${formatPrice(vehicle.dailyRateAED)})` : '';
    const text = `Hello Hotwheels Car Rental, I would like to inquire about Self Drive rental for: ${vehicle.makeModel}${rateText} under your Mercedes inventory. Please confirm availability.`;
    return `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const generalWhatsAppUrl = `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Hello Hotwheels Car Rental, I would like to get a quote on WhatsApp for Mercedes Chauffeur Service (Airport Transfer, Hourly Hire, Full-Day, or Corporate) in Dubai.'
  )}`;

  return (
    <section className="py-10 sm:py-12 bg-white" id="mercedes-chauffeur">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] text-[11px] font-bold uppercase tracking-wider">
            HOTWHEELS CAR RENTAL LLC • VIP CHAUFFEUR
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
            Mercedes Chauffeur Service
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Executive Mercedes-Benz fleet provided <strong className="text-[#0A2540] font-bold">with professional chauffeur</strong> for airport transfers, corporate delegations, hourly hire, and full-day luxury travel across Dubai and the UAE.
          </p>
        </div>

        {/* 1. RENTAL MODE TOGGLE: Chauffeur Service (With Driver) vs Self Drive Provision */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/90 shadow-inner max-w-md w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setActiveRentalMode('chauffeur');
                setSelectedService('all');
              }}
              className={`flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeRentalMode === 'chauffeur'
                  ? 'bg-[#0A2540] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0A2540] hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span>Chauffeur Service (With Driver)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRentalMode('self-drive');
                setSelectedService('all');
              }}
              className={`flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeRentalMode === 'self-drive'
                  ? 'bg-[#0B4DA2] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0A2540] hover:bg-slate-200/60'
              }`}
            >
              <Car className="w-4 h-4 shrink-0" />
              <span>Self Drive Provision</span>
            </button>
          </div>
        </div>

        {/* 2. SERVICES BAR: Airport Transfer | Hourly Hire | Full-Day Chauffeur | Corporate Transfer */}
        {activeRentalMode === 'chauffeur' ? (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#0B4DA2]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#0A2540]">
                  Chauffeur Services:
                </h3>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Airport Transfer | Hourly Hire | Full-Day Chauffeur | Corporate Transfer
                </span>
              </div>
              {selectedService !== 'all' && (
                <button
                  onClick={() => setSelectedService('all')}
                  className="text-xs font-semibold text-[#0B4DA2] hover:underline cursor-pointer text-left"
                >
                  Reset Filter (Show all models)
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CHAUFFEUR_SERVICE_OPTIONS.map((srv) => {
                const isSelected = selectedService === srv.title;
                return (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedService(isSelected ? 'all' : srv.title)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A2540] border-[#0A2540] text-white shadow-xs ring-2 ring-[#0B4DA2]/30'
                        : 'bg-[#F8FAFC] border-slate-200/90 hover:border-[#0B4DA2]/40 hover:bg-slate-50 text-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-white/10' : 'bg-[#0B4DA2]/10'
                        }`}>
                          {getServiceIcon(srv.id)}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          isSelected ? 'text-[#C9A227]' : 'text-slate-400'
                        }`}>
                          {isSelected ? 'Selected' : 'Option'}
                        </span>
                      </div>
                      <div>
                        <h4 className={`font-bold text-xs sm:text-[13px] ${isSelected ? 'text-white' : 'text-[#0A2540] group-hover:text-[#0B4DA2]'} transition-colors`}>
                          {srv.title}
                        </h4>
                        <span className={`text-[10px] block font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {srv.subtitle}
                        </span>
                      </div>
                      <p className={`text-[11px] line-clamp-2 leading-relaxed ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                        {srv.description}
                      </p>
                    </div>
                    <div className={`pt-2.5 mt-2 border-t flex items-center justify-between text-[11px] ${
                      isSelected ? 'border-white/15' : 'border-slate-200/70'
                    }`}>
                      <span className={isSelected ? 'text-[#C9A227] font-semibold text-[10px]' : 'text-slate-500 font-medium text-[10px]'}>
                        {isSelected ? 'Click to deselect' : 'Filter by service'}
                      </span>
                      <ArrowRight className={`w-3 h-3 ${isSelected ? 'text-[#C9A227]' : 'text-slate-400'} group-hover:translate-x-0.5 transition-transform`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Informative Banner for Self-Drive Provision */
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#0B4DA2] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#0A2540]">
                Mercedes Self Drive Provision (Subject to Inventory Availability)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whenever inventory permits, selected Mercedes-Benz models (including Mercedes V-Class, Vito, E-Class, C-Class, and G-Class) can be booked on self-drive rental. Requires valid UAE license or International Driving Permit + refundable security deposit.
              </p>
            </div>
          </div>
        )}

        {/* Currency Switcher & Fleet Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-[17px] font-bold text-[#0A2540] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>
                {activeRentalMode === 'chauffeur' ? 'Mercedes Chauffeur Fleet' : 'Mercedes Self Drive Fleet'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] border border-[#0B4DA2]/20 font-bold">
                {displayedVehicles.length} Models
              </span>
            </h3>
          </div>

          {activeRentalMode === 'self-drive' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500">Currency:</span>
              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs">
                <button
                  type="button"
                  onClick={() => setCurrency('AED')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-xs ${
                    currency === 'AED'
                      ? 'bg-[#0B4DA2] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="United Arab Emirates Dirham"
                >
                  AED
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-xs ${
                    currency === 'USD'
                      ? 'bg-[#0B4DA2] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="United States Dollar ($)"
                >
                  USD ($)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* VEHICLE CARDS GRID: V-Class, Vito, S-Class, E-Class, C-Class, G-Class, Maybach */}
        {displayedVehicles.length === 0 ? (
          <div className="text-center py-16 bg-[#F8FAFC] rounded-2xl border border-slate-200 space-y-4">
            <Car className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No vehicles match this filter</h3>
              <p className="text-xs text-slate-500">Try choosing a different service or reset filters to view all Mercedes models.</p>
            </div>
            <button
              onClick={() => {
                setActiveRentalMode('chauffeur');
                setSelectedService('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#0B4DA2] text-white font-semibold text-xs hover:bg-[#083B7D] transition-colors cursor-pointer"
            >
              Show All Mercedes Vehicles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {displayedVehicles.map((car) => {
              const isSelfDriveAvailable = car.serviceAssignment === 'Both' || car.serviceAssignment === 'Self Drive';
              const activeServiceFilter = selectedService !== 'all' ? selectedService : undefined;

              return (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  {/* 1. CAR IMAGE CONTAINER (CLEAN IMAGE DISPLAY + CLICK TO OPEN POPUP) */}
                  <div 
                    className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden group/img cursor-pointer"
                    onClick={() => handleOpenMedia(car, 'photo')}
                    title={`Click to view ${car.makeModel} photos & HD video`}
                  >
                    <img
                      src={car.image}
                      alt={car.makeModel}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap pointer-events-none z-10">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                        activeRentalMode === 'chauffeur'
                          ? 'bg-[#0A2540] text-[#C9A227]'
                          : 'bg-[#0B4DA2] text-white'
                      }`}>
                        {activeRentalMode === 'chauffeur' ? 'WITH DRIVER' : 'SELF DRIVE'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/95 text-[#0A2540] shadow-xs backdrop-blur-xs">
                        {car.category}
                      </span>
                      {activeRentalMode === 'chauffeur' && isSelfDriveAvailable && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#0B4DA2]/90 text-white shadow-xs backdrop-blur-xs">
                          Self-Drive Available
                        </span>
                      )}
                    </div>

                    {/* Clean Hover Overlay Indicator */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3">
                      <div className="px-4 py-2 rounded-xl bg-white text-[#0A2540] text-xs font-bold shadow-xl flex items-center gap-2 transform translate-y-2 group-hover/img:translate-y-0 transition-transform backdrop-blur-sm border border-slate-200">
                        <Eye className="w-3.5 h-3.5 text-[#0B4DA2]" />
                        <span>View VIP Photos {car.videoUrl ? '& Video' : ''}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 pointer-events-none z-10">
                      <span className="px-2 py-0.5 rounded-md bg-black/65 text-[#C9A227] font-semibold text-[10px] border border-white/20 backdrop-blur-xs">
                        Mercedes-Benz VIP
                      </span>
                    </div>
                  </div>

                  {/* 2. CARD CONTENT */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="space-y-2.5">
                      {/* Make & Model */}
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
                          {car.category} • Mercedes-Benz VIP
                        </span>
                        <h3 
                          onClick={() => handleOpenMedia(car, 'photo')}
                          className="text-base sm:text-[17px] font-bold text-[#0A2540] hover:text-[#C9A227] leading-snug tracking-tight cursor-pointer transition-colors"
                          title="Click to view VIP photos & video"
                        >
                          {car.makeModel}
                        </h3>
                      </div>

                      {/* Description */}
                      {car.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {car.description}
                        </p>
                      )}

                      {/* Capacity Specs */}
                      <div className="flex items-center gap-3 py-1.5 px-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-[#0B4DA2] shrink-0" />
                          <span>{car.seats} Seats</span>
                        </div>
                        {car.luggageCapacity && (
                          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3 font-medium">
                            <Briefcase className="w-3.5 h-3.5 text-[#0A2540] shrink-0" />
                            <span className="truncate">{car.luggageCapacity}</span>
                          </div>
                        )}
                      </div>

                      {/* Supported Chauffeur Service Types */}
                      {activeRentalMode === 'chauffeur' && car.chauffeurServices && car.chauffeurServices.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Services Available:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {car.chauffeurServices.map((srv, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                                  selectedService === srv
                                    ? 'bg-[#0B4DA2] text-white font-bold border-[#0B4DA2]'
                                    : 'bg-slate-100 text-slate-700 border-slate-200/80'
                                }`}
                              >
                                {srv}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pricing Display */}
                      {activeRentalMode === 'chauffeur' ? (
                        /* Chauffeur vehicles: Do NOT show confusing fixed prices; transfer prices vary by route & schedule */
                        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">
                                Chauffeur Transfer Rate
                              </span>
                              <div className="text-xs sm:text-[13px] font-bold text-[#0A2540]">
                                Quote Based on Route & Hours
                              </div>
                            </div>
                            <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/70">
                              Instant Quote
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Self Drive Mode: Clear Daily / Weekly Rates */
                        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">Self Drive Rate</span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-base sm:text-lg font-bold text-[#0A2540] tracking-tight">
                                  {car.dailyRateAED ? formatPrice(car.dailyRateAED) : 'Upon Request'}
                                </span>
                                {car.dailyRateAED ? (
                                  <span className="text-xs text-slate-500 font-medium">/ day</span>
                                ) : null}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-[10px] font-semibold">
                              Deposit Required
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fast Booking & Enquiry Buttons */}
                    <div className="pt-2">
                      {activeRentalMode === 'chauffeur' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={buildWhatsAppChauffeurQuoteLink(car, activeServiceFilter)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer"
                          >
                            <WhatsAppOfficialIcon className="w-4 h-4 shrink-0" />
                            <span className="truncate">WhatsApp Quote</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenEnquiry) {
                                onOpenEnquiry('car-rental', `${car.makeModel} (Mercedes Chauffeur - With Driver)`);
                              }
                            }}
                            className="py-2.5 px-3 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white font-bold text-xs transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
                          >
                            <Send className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Enquire</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={buildWhatsAppSelfDriveLink(car)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer"
                          >
                            <WhatsAppOfficialIcon className="w-4 h-4 shrink-0" />
                            <span className="truncate">WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenEnquiry) {
                                onOpenEnquiry('car-rental', `${car.makeModel} (Mercedes Self Drive)`);
                              }
                            }}
                            className="py-2.5 px-3 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white font-bold text-xs transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
                          >
                            <Send className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Enquire</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Direct Quote Banner */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0A2540] text-white border border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A227]" />
              <span>Need a Custom Mercedes Chauffeur Quote?</span>
            </h4>
            <p className="text-xs text-slate-300 max-w-xl">
              Airport transfers (DXB / DWC), hourly hire, full-day chauffeur service, or corporate delegation transfers across Dubai & Abu Dhabi. Instant quote response on WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <WhatsAppOfficialIcon className="w-4 h-4" />
              <span>Get Quote on WhatsApp</span>
            </a>
            <a
              href={phoneTel}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 border border-white/15 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#C9A227]" />
              <span>{COMPANY_CONFIG.phone ? `Call: ${COMPANY_CONFIG.phone}` : 'Call Chauffeur Desk'}</span>
            </a>
          </div>
        </div>

        {/* Media & Video Player Modal */}
        <CarVideoModal
          isOpen={!!selectedMediaVehicle}
          onClose={() => setSelectedMediaVehicle(null)}
          initialMode={mediaMode}
          car={selectedMediaVehicle ? {
            make: selectedMediaVehicle.brand || 'Mercedes-Benz',
            model: selectedMediaVehicle.makeModel,
            category: selectedMediaVehicle.category,
            image: selectedMediaVehicle.image,
            gallery: selectedMediaVehicle.gallery || selectedMediaVehicle.images,
            videoUrl: selectedMediaVehicle.videoUrl || selectedMediaVehicle.video || '',
            dailyPriceAED: selectedMediaVehicle.dailyRateAED,
            seats: selectedMediaVehicle.seats,
            luggage: selectedMediaVehicle.luggageCapacity,
            description: selectedMediaVehicle.description,
            isMercedesChauffeur: true,
            serviceType: selectedMediaVehicle.serviceType
          } : null}
          onOpenEnquiry={onOpenEnquiry}
        />

      </div>
    </section>
  );
};
