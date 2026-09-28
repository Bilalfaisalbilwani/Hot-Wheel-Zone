import { InventoryVehicle, CorporateRate, FleetVehicle } from '../types';

export const CORPORATE_RATES_METADATA = {
  title: "HOTWHEEL CAR RENTAL LLC CORPORATE VEHICLE RATE LIST",
  validity: "10 Sep 2026 – 30 Sep 2026",
  mileageLongTerm: "2500 kms or 2500 kms/Month"
};

// =========================================================================
// CHAUFFEUR SERVICE OPTIONS
// =========================================================================
export const CHAUFFEUR_SERVICE_OPTIONS = [
  {
    id: 'airport-transfer',
    title: 'Airport Transfer',
    subtitle: 'DXB, DWC & UAE Airports',
    description: 'Airport arrival and departure transfers across Dubai (DXB/DWC) and UAE airports.',
    idealFor: 'Airport arrivals, departures & hotel transfers'
  },
  {
    id: 'hourly-hire',
    title: 'Hourly Hire',
    subtitle: 'Flexible As-Directed Service',
    description: 'Dedicated vehicle with driver for multiple stops, business roadshows, shopping, and city transport.',
    idealFor: 'Executive meetings, multi-stop schedules & shopping trips'
  },
  {
    id: 'full-day-chauffeur',
    title: 'Full-Day Chauffeur',
    subtitle: 'Full Day Dedicated Service',
    description: 'All-day private vehicle with driver for scheduled itineraries and daily travel.',
    idealFor: 'Corporate delegations, tourist day trips & full-day events'
  },
  {
    id: 'corporate-transfer',
    title: 'Corporate Transfer',
    subtitle: 'DIFC, DWTC & Business Hubs',
    description: 'Executive transportation with driver for corporate clients, business executives, delegations, and conferences.',
    idealFor: 'Corporate meetings, conferences & business travel'
  }
] as const;

// =========================================================================
// ADMIN / CONTENT MANAGER FLEET CATALOG
// Easily add new vehicles or edit rates here.
// Supports both 'SELF DRIVE' and 'CHAUFFEUR DRIVEN' across:
// - 'Sedan' | 'SUV' | 'Luxury' | '7-Seater / MPV'
// Service Assignment: 'Self Drive' | 'Chauffeur Driven' | 'Both'
// =========================================================================
export const FLEET_CATALOG: FleetVehicle[] = [
  // --- SELF DRIVE : SEDAN ---
  {
    id: 'sd-nissan-sentra',
    makeModel: 'Nissan Sentra 2.0L',
    brand: 'Nissan',
    category: 'Sedan',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '2 Large Bags',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=900',
    videoUrl: '/videos/nissan_sentra_tour.mp4',
    transmission: 'Automatic',
    dailyRateAED: 85,
    weeklyRateAED: 500,
    monthlyRateAED: 1700,
    description: 'Nissan Sentra sedan available for self-drive rental in Dubai with cruise control, Bluetooth, and fuel-efficient engine.'
  },
  {
    id: 'sd-chevrolet-malibu',
    makeModel: 'Chevrolet Malibu Turbo',
    brand: 'Other',
    category: 'Sedan',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '3 Large Bags',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=900',
    videoUrl: '/videos/chevrolet_malibu_tour.mp4',
    transmission: 'Automatic',
    dailyRateAED: 80,
    weeklyRateAED: 450,
    monthlyRateAED: 1500,
    description: 'Chevrolet Malibu mid-size sedan for daily, weekly, or monthly self-drive hire with turbo engine and spacious interior.'
  },
  {
    id: 'sd-nissan-sunny',
    makeModel: 'Nissan Sunny 1.6L',
    brand: 'Nissan',
    category: 'Sedan',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '2 Bags',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=900',
    videoUrl: '/videos/nissan_sentra_tour.mp4',
    transmission: 'Automatic',
    dailyRateAED: 90,
    weeklyRateAED: 550,
    monthlyRateAED: 1550,
    description: 'Nissan Sunny economical sedan for city driving and corporate rental with high fuel efficiency and dual A/C.'
  },
  {
    id: 'sd-kia-forte',
    makeModel: 'Kia Forte GT-Line',
    brand: 'Kia',
    category: 'Sedan',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '2 Bags',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    transmission: 'Automatic',
    dailyRateAED: 130,
    weeklyRateAED: 700,
    monthlyRateAED: 1500,
    description: 'Kia Forte compact sedan available on self-drive rental with Apple CarPlay and sporty design.'
  },
  {
    id: 'sd-mitsubishi-attrage',
    makeModel: 'Mitsubishi Attrage',
    brand: 'Other',
    category: 'Sedan',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '2 Bags',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    transmission: 'Automatic',
    dailyRateAED: 70,
    weeklyRateAED: 400,
    monthlyRateAED: 1150,
    description: 'Mitsubishi Attrage compact economy sedan for daily, weekly, or monthly hire with lowest fuel consumption.'
  },
  {
    id: 'sd-mitsubishi-mirage',
    makeModel: 'Mitsubishi Mirage',
    brand: 'Other',
    category: 'Sedan',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '2 Bags',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    transmission: 'Automatic',
    dailyRateAED: 65,
    weeklyRateAED: 350,
    monthlyRateAED: 1000,
    description: 'Mitsubishi Mirage budget hatchback/sedan for economical city commuting and budget rental in Dubai.'
  },

  // --- SELF DRIVE & CHAUFFEUR : MERCEDES-BENZ C-CLASS ---
  {
    id: 'mb-c-class',
    makeModel: 'Mercedes-Benz C-Class',
    brand: 'Mercedes-Benz',
    category: 'Sedan',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Both',
    seats: 5,
    luggageCapacity: '2 Large Bags',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    transmission: 'Automatic',
    dailyRateAED: 350,
    weeklyRateAED: 2100,
    monthlyRateAED: 6500,
    description: 'Mercedes-Benz C-Class available for self drive and chauffeur driven service with ambient lighting and premium leather interior.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Corporate Transfer']
  },

  // --- SELF DRIVE : SUV ---
  {
    id: 'sd-nissan-rogue',
    makeModel: 'Nissan Rogue',
    brand: 'Nissan',
    category: 'SUV',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '4 Large Bags',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    transmission: 'Automatic',
    dailyRateAED: 130,
    weeklyRateAED: 850,
    monthlyRateAED: 2200,
    description: 'Nissan Rogue crossover SUV available on daily, weekly, or monthly self-drive with all-wheel drive.'
  },
  {
    id: 'sd-nissan-murano',
    makeModel: 'Nissan Murano',
    brand: 'Nissan',
    category: 'SUV',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '4 Large Bags',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    transmission: 'Automatic',
    dailyRateAED: 140,
    weeklyRateAED: 900,
    monthlyRateAED: 2300,
    description: 'Nissan Murano mid-size SUV for comfortable family and business travel with leather seating and panoramic roof.'
  },
  {
    id: 'sd-kia-soul',
    makeModel: 'Kia Soul',
    brand: 'Kia',
    category: 'SUV',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '3 Bags',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    transmission: 'Automatic',
    dailyRateAED: 100,
    weeklyRateAED: 600,
    monthlyRateAED: 1300,
    description: 'Kia Soul crossover available for self-drive city rental with modern infotainment system.'
  },

  // --- SELF DRIVE : LUXURY ---
  {
    id: 'sd-audi-a6',
    makeModel: 'Audi A6',
    brand: 'Audi',
    category: 'Luxury',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '3 Large Bags',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    transmission: 'Automatic',
    dailyRateAED: 450,
    weeklyRateAED: 2700,
    monthlyRateAED: 8500,
    description: 'Audi A6 executive sedan available for self-drive hire with Quattro drive and virtual cockpit.'
  },
  {
    id: 'sd-bmw-5-series',
    makeModel: 'BMW 5 Series',
    brand: 'BMW',
    category: 'Luxury',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 5,
    luggageCapacity: '3 Large Bags',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    transmission: 'Automatic',
    dailyRateAED: 480,
    weeklyRateAED: 2900,
    monthlyRateAED: 9000,
    description: 'BMW 5 Series luxury sedan available for self-drive rental with M-Sport package and head-up display.'
  },

  // --- SELF DRIVE : 7-SEATER / MPV ---
  {
    id: 'sd-nissan-armada',
    makeModel: 'Nissan Armada',
    brand: 'Nissan',
    category: '7-Seater / MPV',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 7,
    luggageCapacity: '5 Large Bags',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    transmission: 'Automatic',
    dailyRateAED: 280,
    weeklyRateAED: 1850,
    monthlyRateAED: 7000,
    description: 'Nissan Armada 7-seater full-size SUV for family and group travel with robust V8 power and tri-zone cooling.'
  },
  {
    id: 'sd-mitsubishi-xpander',
    makeModel: 'Mitsubishi Xpander',
    brand: 'Other',
    category: '7-Seater / MPV',
    serviceType: 'SELF DRIVE',
    serviceAssignment: 'Self Drive',
    seats: 7,
    luggageCapacity: '3 Bags',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    transmission: 'Automatic',
    dailyRateAED: 160,
    weeklyRateAED: 980,
    monthlyRateAED: 2900,
    description: 'Mitsubishi Xpander 7-seater multi-purpose vehicle with versatile folding seats.'
  },

  // =========================================================================
  // --- MERCEDES-BENZ CHAUFFEUR & SELF-DRIVE FLEET ---
  // Mercedes is Chauffeur Driven by default.
  // =========================================================================
  {
    id: 'cd-mercedes-v-class',
    makeModel: 'Mercedes-Benz V-Class',
    brand: 'Mercedes-Benz',
    category: '7-Seater / MPV',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Both',
    seats: 7,
    luggageCapacity: '6 Large Bags',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    transmission: 'Automatic',
    dailyRateAED: 750,
    weeklyRateAED: 4500,
    monthlyRateAED: 14000,
    description: 'Luxury Mercedes-Benz V-Class 7-seater MPV with professional chauffeur for airport transfers, corporate delegations, and family trips. Also available for Self Drive upon inventory availability.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Full-Day Chauffeur', 'Corporate Transfer']
  },
  {
    id: 'cd-mercedes-vito',
    makeModel: 'Mercedes-Benz Vito',
    brand: 'Mercedes-Benz',
    category: '7-Seater / MPV',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Both',
    seats: 8,
    luggageCapacity: '7 Large Bags',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    transmission: 'Automatic',
    dailyRateAED: 650,
    weeklyRateAED: 3900,
    monthlyRateAED: 12000,
    description: 'Spacious Mercedes-Benz Vito Tourer 8-seater luxury van with chauffeur for DXB airport transfers, group travel, and events. Also available for Self Drive upon inventory availability.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Full-Day Chauffeur', 'Corporate Transfer']
  },
  {
    id: 'cd-mercedes-s-class',
    makeModel: 'Mercedes-Benz S-Class',
    brand: 'Mercedes-Benz',
    category: 'Luxury',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Chauffeur Driven',
    seats: 4,
    luggageCapacity: '3 Large Bags',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    transmission: 'Automatic',
    dailyRateAED: 1200,
    weeklyRateAED: 7200,
    monthlyRateAED: 22000,
    description: 'Flagship Mercedes-Benz S-Class executive VIP sedan with professional driver for corporate executives, VIP transfers, and events.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Full-Day Chauffeur', 'Corporate Transfer']
  },
  {
    id: 'cd-mercedes-e-class',
    makeModel: 'Mercedes-Benz E-Class',
    brand: 'Mercedes-Benz',
    category: 'Luxury',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Both',
    seats: 4,
    luggageCapacity: '3 Large Bags',
    image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    transmission: 'Automatic',
    dailyRateAED: 550,
    weeklyRateAED: 3300,
    monthlyRateAED: 10500,
    description: 'Mercedes-Benz E-Class executive sedan with chauffeur for airport transfers, DIFC corporate rides, and hourly hire. Also available for Self Drive upon inventory availability.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Full-Day Chauffeur', 'Corporate Transfer']
  },
  {
    id: 'cd-mercedes-c-class',
    makeModel: 'Mercedes-Benz C-Class',
    brand: 'Mercedes-Benz',
    category: 'Luxury',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Both',
    seats: 5,
    luggageCapacity: '3 Bags',
    image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    transmission: 'Automatic',
    dailyRateAED: 490,
    weeklyRateAED: 2950,
    monthlyRateAED: 9200,
    description: 'Mercedes-Benz C-Class executive sedan for airport transfers and city meetings with professional chauffeur. Also available for Self Drive upon inventory availability.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Full-Day Chauffeur', 'Corporate Transfer']
  },
  {
    id: 'cd-mercedes-g63',
    makeModel: 'Mercedes-Benz G-Class / GLE',
    brand: 'Mercedes-Benz',
    category: 'SUV',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Both',
    seats: 5,
    luggageCapacity: '4 Large Bags',
    image: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    transmission: 'Automatic',
    dailyRateAED: 1600,
    weeklyRateAED: 9600,
    monthlyRateAED: 28000,
    description: 'Mercedes-Benz luxury SUV for chauffeur service with driver, also available for self-drive hire upon availability.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Full-Day Chauffeur', 'Corporate Transfer']
  },
  {
    id: 'cd-mercedes-maybach',
    makeModel: 'Mercedes-Maybach S-Class',
    brand: 'Mercedes-Benz',
    category: 'Luxury',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Chauffeur Driven',
    seats: 4,
    luggageCapacity: '3 Large Bags',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=900',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    transmission: 'Automatic',
    dailyRateAED: 2200,
    weeklyRateAED: 13200,
    monthlyRateAED: 38000,
    description: 'Ultra-exclusive Mercedes-Maybach VIP luxury chauffeur service for royal delegations, VIP guests, and high-profile executives.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Full-Day Chauffeur', 'Corporate Transfer']
  },

  // --- OTHER CHAUFFEUR VEHICLES ---
  {
    id: 'cd-cadillac-escalade',
    makeModel: 'Cadillac Escalade',
    brand: 'Cadillac',
    category: 'Luxury',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Chauffeur Driven',
    seats: 7,
    luggageCapacity: '6 Large Bags',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=900',
    transmission: 'Automatic',
    dailyRateAED: 1100,
    weeklyRateAED: 6600,
    monthlyRateAED: 20000,
    description: 'Cadillac Escalade luxury SUV for VIP and executive chauffeur travel with driver.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Full-Day Chauffeur', 'Corporate Transfer']
  },
  {
    id: 'cd-lexus-es',
    makeModel: 'Lexus ES',
    brand: 'Other',
    category: 'Sedan',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Chauffeur Driven',
    seats: 5,
    luggageCapacity: '3 Bags',
    image: 'https://images.unsplash.com/photo-1550355191-aa80b1b94e21?auto=format&fit=crop&q=80&w=900',
    transmission: 'Automatic',
    dailyRateAED: 380,
    weeklyRateAED: 2280,
    monthlyRateAED: 7000,
    description: 'Lexus ES luxury sedan for chauffeur transfers with driver and business travel.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Corporate Transfer']
  },
  {
    id: 'cd-range-rover-vogue',
    makeModel: 'Range Rover',
    brand: 'Other',
    category: 'SUV',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Chauffeur Driven',
    seats: 5,
    luggageCapacity: '4 Large Bags',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=900',
    transmission: 'Automatic',
    dailyRateAED: 1300,
    weeklyRateAED: 7800,
    monthlyRateAED: 24000,
    description: 'Range Rover luxury SUV for executive and VIP travel with driver.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Full-Day Chauffeur', 'Corporate Transfer']
  },
  {
    id: 'cd-gmc-yukon-denali',
    makeModel: 'GMC Yukon',
    brand: 'Other',
    category: '7-Seater / MPV',
    serviceType: 'CHAUFFEUR DRIVEN',
    serviceAssignment: 'Chauffeur Driven',
    seats: 7,
    luggageCapacity: '6 Large Bags',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=900',
    transmission: 'Automatic',
    dailyRateAED: 700,
    weeklyRateAED: 4200,
    monthlyRateAED: 13000,
    description: 'GMC Yukon 7-seater SUV with spacious luggage capacity for group transfers with driver.',
    chauffeurServices: ['Airport Transfer', 'Hourly Hire', 'Full-Day Chauffeur', 'Corporate Transfer']
  }
];

// Helper: Filter dedicated Mercedes vehicles for Chauffeur or Self-Drive (V-Class, Vito, then other models)
export const MERCEDES_FLEET = FLEET_CATALOG.filter(
  v => v.brand === 'Mercedes-Benz'
).sort((a, b) => {
  const getOrder = (id: string) => {
    if (id.includes('v-class')) return 1;
    if (id.includes('vito')) return 2;
    if (id.includes('s-class')) return 3;
    if (id.includes('e-class')) return 4;
    if (id.includes('g63')) return 5;
    if (id.includes('c-class')) return 6;
    return 10;
  };
  return getOrder(a.id) - getOrder(b.id);
});

export const CORPORATE_RATES: Record<string, CorporateRate> = {
  "CHEVROLET MALIBU": {
    rateCategory: "CHEVROLET MALIBU",
    daily: 80,
    weekly: 450,
    oneMonth: 1500,
    threeMonth: 1400,
    sixMonth: 1350,
    nineMonth: 1300,
    twelveMonth: 1250
  },
  "KIA FORTE": {
    rateCategory: "KIA FORTE",
    daily: 130,
    weekly: 700,
    oneMonth: 1500,
    threeMonth: 1450,
    sixMonth: 1400,
    nineMonth: 1350,
    twelveMonth: 1300
  },
  "KIA SOUL": {
    rateCategory: "KIA SOUL",
    daily: 100,
    weekly: 600,
    oneMonth: 1300,
    threeMonth: 1275,
    sixMonth: 1225,
    nineMonth: 1250,
    twelveMonth: 1200
  },
  "MITSUBISHI MIRAGE": {
    rateCategory: "MITSUBISHI MIRAGE",
    daily: 65,
    weekly: 350,
    oneMonth: 1000,
    threeMonth: 975,
    sixMonth: 950,
    nineMonth: 925,
    twelveMonth: 900
  },
  "MITSUBISHI ATTRAGE": {
    rateCategory: "MITSUBISHI ATTRAGE",
    daily: 70,
    weekly: 400,
    oneMonth: 1150,
    threeMonth: 1125,
    sixMonth: 1100,
    nineMonth: 1075,
    twelveMonth: 1050
  },
  "NISSAN ARMADA": {
    rateCategory: "NISSAN ARMADA",
    daily: 280,
    weekly: 1850,
    oneMonth: 7000,
    threeMonth: 6500,
    sixMonth: 6000,
    nineMonth: 5500,
    twelveMonth: 5000
  },
  "NISSAN MURANO": {
    rateCategory: "NISSAN MURANO",
    daily: 140,
    weekly: 900,
    oneMonth: 2300,
    threeMonth: 2200,
    sixMonth: 2100,
    nineMonth: 2000,
    twelveMonth: 1900
  },
  "NISSAN ROUGE": {
    rateCategory: "NISSAN ROUGE",
    daily: 130,
    weekly: 850,
    oneMonth: 2200,
    threeMonth: 2100,
    sixMonth: 2000,
    nineMonth: 1950,
    twelveMonth: 1900
  },
  "NISSAN SENTRA": {
    rateCategory: "NISSAN SENTRA",
    daily: 85,
    weekly: 500,
    oneMonth: 1700,
    threeMonth: 1650,
    sixMonth: 1600,
    nineMonth: 1550,
    twelveMonth: 1500
  },
  "NISSAN SUNNY": {
    rateCategory: "NISSAN SUNNY",
    daily: 90,
    weekly: 550,
    oneMonth: 1550,
    threeMonth: 1500,
    sixMonth: 1450,
    nineMonth: 1400,
    twelveMonth: 1300
  }
};

const getVehicleImage = (name: string): string => {
  if (name.includes('ARMADA')) {
    return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
  }
  if (name.includes('MURANO') || name.includes('ROUGE')) {
    return 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800';
  }
  if (name.includes('MALIBU') || name.includes('SENTRA') || name.includes('FORTE')) {
    return 'https://images.unsplash.com/photo-1550355191-aa80b1b94e21?auto=format&fit=crop&q=80&w=800';
  }
  return 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800';
};

const rawVehicleList: [number, string, string, string][] = [
  [1, "NISSAN SENTRA", "BLUE", "2021"],
  [2, "KIA SOUL", "WHITE", "2021"],
  [3, "NISSAN SUNNY", "WHITE", "2024"],
  [4, "MITSUBISHI MIRAGE", "BLACK", "2021"],
  [5, "MITSUBISHI MIRAGE", "BLUE", "2022"],
  [6, "NISSAN SENTRA", "GRAY", "2021"],
  [7, "NISSAN SENTRA", "SILVER", "2021"],
  [8, "CHEVROLET MALIBU", "GRAY", "2023"],
  [9, "NISSAN ROUGE", "WHITE", "2023"],
  [10, "KIA FORTE", "BLUE", "2021"],
  [11, "KIA FORTE", "WHITE", "2021"],
  [12, "NISSAN SENTRA", "SILVER", "2023"],
  [13, "MITSUBISHI MIRAGE", "BLACK", "2021"],
  [14, "CHEVROLET MALIBU", "BLACK", "2023"],
  [15, "CHEVROLET MALIBU", "WHITE", "2024"],
  [16, "NISSAN SUNNY", "WHITE", "2024"],
  [17, "KIA SOUL", "SILVER", "2021"],
  [18, "NISSAN MURANO", "GRAY", "2023"],
  [19, "CHEVROLET MALIBU", "BLACK", "2023"],
  [20, "MITSUBISHI ATTRAGE", "WHITE", "2022"],
  [21, "MITSUBISHI ATTRAGE", "WHITE", "2022"],
  [22, "MITSUBISHI MIRAGE", "RED", "2021"],
  [23, "NISSAN SENTRA", "GRAY", "2021"],
  [24, "CHEVROLET MALIBU", "GRAY", "2023"],
  [25, "MITSUBISHI MIRAGE", "GRAY", "2024"],
  [26, "NISSAN SUNNY", "WHITE", "2024"],
  [27, "NISSAN SUNNY", "WHITE", "2024"],
  [28, "MITSUBISHI ATTRAGE", "WHITE", "2022"],
  [29, "CHEVROLET MALIBU", "BLACK", "2023"],
  [30, "NISSAN SENTRA", "BLACK", "2021"],
  [31, "MITSUBISHI MIRAGE", "SILVER", "2021"],
  [32, "CHEVROLET MALIBU", "GRAY", "2023"],
  [33, "CHEVROLET MALIBU", "GRAY", "2023"],
  [34, "MITSUBISHI MIRAGE", "BLUE", "2024"],
  [35, "MITSUBISHI MIRAGE", "BLACK", "2021"],
  [36, "NISSAN SENTRA", "GRAY", "2024"],
  [37, "KIA FORTE", "GRAY", "2021"],
  [38, "MITSUBISHI MIRAGE", "GRAY", "2024"],
  [39, "NISSAN ROUGE", "BLUE", "2023"],
  [40, "NISSAN SUNNY", "WHITE", "2024"],
  [41, "MITSUBISHI MIRAGE", "GRAY", "2024"],
  [42, "NISSAN SENTRA", "BLACK", "2021"],
  [43, "MITSUBISHI ATTRAGE", "WHITE", "2022"],
  [44, "NISSAN SENTRA", "BLACK", "2022"],
  [45, "CHEVROLET MALIBU", "BLACK", "2024"],
  [46, "CHEVROLET MALIBU", "GRAY", "2023"],
  [47, "NISSAN SENTRA", "GRAY", "2021"],
  [48, "NISSAN ROUGE", "BLACK", "2023"],
  [49, "CHEVROLET MALIBU", "BLACK", "2023"],
  [50, "MITSUBISHI ATTRAGE", "GRAY", "2021"],
  [51, "NISSAN SUNNY", "WHITE", "2024"],
  [52, "NISSAN ROUGE", "BLACK", "2023"],
  [53, "NISSAN ROUGE", "GRAY", "2023"],
  [54, "MITSUBISHI MIRAGE", "BURGUNDY", "2021"],
  [55, "MITSUBISHI ATTRAGE", "BLUE", "2022"],
  [56, "MITSUBISHI ATTRAGE", "WHITE", "2022"],
  [57, "NISSAN SUNNY", "WHITE", "2024"],
  [58, "NISSAN SUNNY", "WHITE", "2024"],
  [59, "NISSAN SENTRA", "SILVER", "2021"],
  [60, "MITSUBISHI ATTRAGE", "WHITE", "2022"],
  [61, "CHEVROLET MALIBU", "BLACK", "2024"],
  [62, "NISSAN ROUGE", "BLUE", "2023"],
  [63, "NISSAN ROUGE", "BLACK", "2023"],
  [64, "NISSAN ROUGE", "BLUE", "2023"],
  [65, "CHEVROLET MALIBU", "BLACK", "2023"],
  [66, "MITSUBISHI ATTRAGE", "WHITE", "2022"],
  [67, "MITSUBISHI MIRAGE", "GRAY", "2021"],
  [68, "KIA SOUL", "GRAY", "2021"],
  [69, "NISSAN SUNNY", "WHITE", "2024"],
  [70, "MITSUBISHI MIRAGE", "BLACK", "2021"],
  [71, "CHEVROLET MALIBU", "WHITE", "2023"],
  [72, "MITSUBISHI MIRAGE", "RED", "2021"],
  [73, "NISSAN SENTRA", "BLACK", "2024"],
  [74, "MITSUBISHI ATTRAGE", "WHITE", "2022"],
  [75, "NISSAN SUNNY", "WHITE", "2024"],
  [76, "MITSUBISHI ATTRAGE", "WHITE", "2022"],
  [77, "CHEVROLET MALIBU", "GRAY", "2023"],
  [78, "NISSAN ARMADA", "WHITE", "2022"],
  [79, "NISSAN ROUGE", "WHITE", "2023"],
  [80, "MITSUBISHI MIRAGE", "GRAY", "2021"],
  [81, "NISSAN ROUGE", "GRAY", "2023"],
  [82, "MITSUBISHI MIRAGE", "GRAY", "2021"],
  [83, "CHEVROLET MALIBU", "WHITE", "2023"],
  [84, "KIA FORTE", "BLACK", "2022"],
  [85, "NISSAN ROUGE", "WHITE", "2023"],
  [86, "CHEVROLET MALIBU", "BLACK", "2023"]
];

export const INVENTORY_VEHICLES: InventoryVehicle[] = rawVehicleList.map(([sNo, vName, vCol, vModel]) => {
  const isSUV = vName.includes('ARMADA') || vName.includes('MURANO') || vName.includes('ROUGE');
  const category = isSUV ? 'SUVs' : 'Economy Cars';
  const seats = isSUV ? 7 : 5;

  return {
    id: `car-inv-${sNo}`,
    serialNumber: sNo,
    vehicleName: vName,
    colour: vCol,
    model: vModel,
    category,
    image: getVehicleImage(vName),
    rateCategory: vName, // Maps directly to corporate rate key
    seats,
    transmission: 'Automatic',
    features: ['Air Conditioning', 'Automatic Transmission'],
    description: `${vName} (${vModel}) in ${vCol}.`
  };
});
