/**
 * INITIAL CMS MOCK STORE (PHASE 1)
 * Provides pre-seeded state for Visa Services, Cars, Mercedes Chauffeur, Enquiries, and Company Info.
 * Stored and managed server-side with proper authentication.
 */

export interface ServerVisaService {
  id: string;
  destination: string;
  visaType: string;
  duration: string;
  entryType: 'Single Entry' | 'Multiple Entry';
  priceAED: number;
  priceUSD: number;
  description: string;
  documents: string[];
  processingInfo: string;
  isActive: boolean;
  popular?: boolean;
}

export interface ServerCar {
  id: string;
  make: string;
  model: string;
  category: string;
  seats: number;
  luggage: string;
  image: string;
  rentalType: 'Self Drive' | 'Chauffeur Driven' | 'Both';
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  getQuoteOption: boolean;
  isAvailable: boolean;
  isMercedesChauffeur: boolean;
  description: string;
}

export interface ServerEnquiry {
  id: string;
  referenceId: string;
  type: 'visa' | 'car-rental';
  createdAt: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed';
  internalNotes: string;
  data: Record<string, any>;
}

export interface ServerCompanyInfo {
  travelCompanyName: string;
  carRentalCompanyName: string;
  unifiedName: string;
  phones: string[];
  whatsappNumbers: string[];
  email: string;
  accountsEmail: string;
  officeAddress: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    linkedin: string;
    twitter: string;
  };
  bankDetails: {
    primaryAccount: {
      companyAccountName: string;
      bankName: string;
      accountNumber: string;
      iban: string;
      swiftCode: string;
      currency: string;
      branchName: string;
      country: string;
      instructions: string;
    };
    secondaryAccount?: {
      companyAccountName: string;
      bankName: string;
      accountNumber: string;
      iban: string;
      swiftCode: string;
      currency: string;
      branchName: string;
      country: string;
      instructions: string;
    };
  };
}

export const INITIAL_VISA_SERVICES: ServerVisaService[] = [
  {
    id: 'visa-1',
    destination: 'United Arab Emirates (UAE)',
    visaType: 'UAE Visit Visa',
    duration: '30 & 60 Days',
    entryType: 'Single Entry',
    priceAED: 350,
    priceUSD: 100,
    description: 'Official visit visa assistance for tourists and visitors to Dubai and all UAE emirates.',
    documents: [
      'Clear Color Passport Copy',
      'Passport minimum 6 months validity',
      'Passport Cover Page',
      'Recent Passport-Size Photograph — White Background',
      'Confirmed Return/Onward Air Ticket — if required'
    ],
    processingInfo: 'Processing time may vary depending on visa type, nationality and UAE Immigration approval.',
    isActive: true,
    popular: true
  },
  {
    id: 'visa-2',
    destination: 'Schengen Area (Europe)',
    visaType: 'Schengen Visa Assistance',
    duration: 'Short Stay',
    entryType: 'Single Entry',
    priceAED: 650,
    priceUSD: 180,
    description: 'Application assistance and document review for travel across 29 Schengen member countries.',
    documents: [
      'Passport valid for at least 6 months with 2 blank pages',
      'Recent passport-size photographs (white background)',
      'Confirmed flight reservation and proof of accommodation',
      'Bank statements (last 3 to 6 months)',
      'Employment verification letter / NOC'
    ],
    processingInfo: 'Approx. 10 to 15 Working Days (subject to consulate).',
    isActive: true,
    popular: false
  },
  {
    id: 'visa-3',
    destination: 'United Kingdom (UK)',
    visaType: 'UK Visa Assistance',
    duration: 'Standard Visitor',
    entryType: 'Multiple Entry',
    priceAED: 700,
    priceUSD: 190,
    description: 'UK Standard Visitor Visa application preparation, document check, and appointment assistance.',
    documents: [
      'Valid passport with minimum 6 months validity',
      'Digital passport-size photograph',
      'Personal bank statements showing available funds',
      'Employment verification and leave approval letter',
      'Travel itinerary and accommodation booking'
    ],
    processingInfo: 'Approx. 3 to 6 Weeks (UKVI dependent).',
    isActive: true,
    popular: false
  },
  {
    id: 'visa-4',
    destination: 'United States of America (USA)',
    visaType: 'USA Visa Assistance',
    duration: 'B1/B2 Visitor',
    entryType: 'Multiple Entry',
    priceAED: 750,
    priceUSD: 205,
    description: 'DS-160 review, embassy appointment guidance, and documentation pre-checks for USA visitor visas.',
    documents: [
      'Valid passport with minimum 6 months validity',
      'Completed DS-160 application confirmation barcode',
      'Recent 2x2 inch (51x51 mm) photograph (white background)',
      'Proof of financial solvency and ties to residence country',
      'Appointment confirmation sheet'
    ],
    processingInfo: 'Subject to US Embassy appointment availability.',
    isActive: true,
    popular: false
  },
  {
    id: 'visa-5',
    destination: 'China',
    visaType: 'China Business / Tourist Visa',
    duration: 'Business / Tourist',
    entryType: 'Single Entry',
    priceAED: 600,
    priceUSD: 165,
    description: 'Consular document preparation and submission assistance for China tourist (L) and business (M) visas.',
    documents: [
      'Original passport valid for at least 6 months with blank pages',
      'Recent passport photograph (white background)',
      'Official invitation letter (Business) or hotel bookings (Tourist)',
      'Round-trip airline booking confirmation',
      'UAE residence visa & Emirates ID copy (if applying from UAE)'
    ],
    processingInfo: 'Approx. 4 to 7 Working Days (consulate dependent).',
    isActive: true,
    popular: false
  }
];

export const INITIAL_CARS: ServerCar[] = [
  {
    id: 'car-1',
    make: 'Mercedes-Benz',
    model: 'V-Class VIP Extra Long',
    category: '7-Seater / MPV',
    seats: 7,
    luggage: '6 Bags',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    rentalType: 'Both',
    dailyPrice: 1200,
    weeklyPrice: 7500,
    monthlyPrice: 24000,
    getQuoteOption: true,
    isAvailable: true,
    isMercedesChauffeur: true,
    description: 'Flagship executive multi-purpose vehicle with reclining leather captain chairs and dual panoramic sunroofs.'
  },
  {
    id: 'car-2',
    make: 'Mercedes-Benz',
    model: 'Vito Tourer Select',
    category: '7-Seater / MPV',
    seats: 8,
    luggage: '7 Bags',
    image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80',
    rentalType: 'Both',
    dailyPrice: 850,
    weeklyPrice: 5200,
    monthlyPrice: 16500,
    getQuoteOption: true,
    isAvailable: true,
    isMercedesChauffeur: true,
    description: 'Practical, spacious luxury van ideal for airport transfers, family tours, and corporate golf groups.'
  },
  {
    id: 'car-3',
    make: 'Mercedes-Benz',
    model: 'S-Class 500 AMG Line',
    category: 'Luxury',
    seats: 4,
    luggage: '3 Bags',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    rentalType: 'Both',
    dailyPrice: 1800,
    weeklyPrice: 11000,
    monthlyPrice: 38000,
    getQuoteOption: true,
    isAvailable: true,
    isMercedesChauffeur: true,
    description: 'The pinnacle of chauffeured luxury. Rear executive seat with massage function, Burmester 3D surround, and soft-close doors.'
  },
  {
    id: 'car-4',
    make: 'Mercedes-Benz',
    model: 'E-Class Sedan',
    category: 'Luxury',
    seats: 4,
    luggage: '3 Bags',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    rentalType: 'Both',
    dailyPrice: 650,
    weeklyPrice: 3900,
    monthlyPrice: 13000,
    getQuoteOption: true,
    isAvailable: true,
    isMercedesChauffeur: true,
    description: 'Refined business sedan tailored for corporate point-to-point transfers and airport runs in Dubai.'
  },
  {
    id: 'car-5',
    make: 'Nissan',
    model: 'Sunny 1.6L',
    category: 'Sedan',
    seats: 5,
    luggage: '2 Bags',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    rentalType: 'Self Drive',
    dailyPrice: 120,
    weeklyPrice: 700,
    monthlyPrice: 2100,
    getQuoteOption: false,
    isAvailable: true,
    isMercedesChauffeur: false,
    description: 'Economical, reliable compact sedan for daily commuting and city errands with great fuel economy.'
  },
  {
    id: 'car-6',
    make: 'Toyota',
    model: 'Fortuner 2.7L EXR 4WD',
    category: 'SUV',
    seats: 7,
    luggage: '4 Bags',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    rentalType: 'Both',
    dailyPrice: 280,
    weeklyPrice: 1650,
    monthlyPrice: 4800,
    getQuoteOption: true,
    isAvailable: true,
    isMercedesChauffeur: false,
    description: 'Robust 7-passenger SUV equipped with high ground clearance, rear air-conditioning, and 4x4 capability.'
  }
];

export const INITIAL_ENQUIRIES: ServerEnquiry[] = [
  {
    id: 'enq-1',
    referenceId: 'HWZ-VE-83912',
    type: 'visa',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'New',
    internalNotes: 'Applicant contacted through site; requesting 60-day visa for family of 3.',
    data: {
      name: 'Alexander Petrov',
      nationality: 'Russia',
      isUaeResident: 'No',
      destination: 'Dubai',
      travelDate: '2026-10-15',
      whatsappNumber: '+79160000001'
    }
  },
  {
    id: 'enq-2',
    referenceId: 'HWZ-CRE-49201',
    type: 'car-rental',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'Contacted',
    internalNotes: 'Client wants Mercedes V-Class with driver for 3 days starting at DXB Terminal 3. Quoted AED 3,600.',
    data: {
      pickupLocation: 'Dubai International Airport (DXB) - Terminal 3',
      pickupDate: '2026-09-25',
      returnDate: '2026-09-28',
      serviceType: 'Chauffeur Driven',
      vehicleType: 'Mercedes-Benz Executive (V-Class, Vito, S-Class)',
      whatsappNumber: '+971550000002'
    }
  },
  {
    id: 'enq-3',
    referenceId: 'HWZ-VE-29402',
    type: 'visa',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'In Progress',
    internalNotes: 'Passport scans received and reviewed. Submitting to ICP immigration system.',
    data: {
      name: 'Maria Santos',
      nationality: 'Philippines',
      isUaeResident: 'No',
      destination: 'Dubai',
      travelDate: '2026-10-01',
      whatsappNumber: '+639170000003'
    }
  },
  {
    id: 'enq-4',
    referenceId: 'HWZ-CRE-91823',
    type: 'car-rental',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    status: 'Completed',
    internalNotes: 'Self drive contract executed; Toyota Fortuner delivered to Downtown Dubai hotel.',
    data: {
      pickupLocation: 'Downtown Dubai / Burj Khalifa',
      pickupDate: '2026-09-18',
      returnDate: '2026-09-22',
      serviceType: 'Self Drive',
      vehicleType: 'Midsize SUV (e.g. Toyota RAV4, Hyundai Tucson, Kia Sportage)',
      whatsappNumber: '+447911123456'
    }
  }
];

export const INITIAL_COMPANY_INFO: ServerCompanyInfo = {
  travelCompanyName: 'ZONE TOURISM LLC',
  carRentalCompanyName: 'HOTWHEELS CAR RENTAL LLC',
  unifiedName: 'ZONE TOURISM LLC & HOTWHEELS CAR RENTAL LLC',
  phones: [],
  whatsappNumbers: [],
  email: '',
  accountsEmail: '',
  officeAddress: 'Dubai, United Arab Emirates',
  socialLinks: {
    instagram: '',
    facebook: '',
    linkedin: '',
    twitter: ''
  },
  bankDetails: {
    primaryAccount: {
      companyAccountName: 'ZONE TOURISM LLC',
      bankName: '',
      accountNumber: '',
      iban: '',
      swiftCode: '',
      currency: 'AED',
      branchName: '',
      country: 'United Arab Emirates',
      instructions: 'For UAE Visit Visa services and general tourism packages.'
    },
    secondaryAccount: {
      companyAccountName: 'HOTWHEELS CAR RENTAL LLC',
      bankName: '',
      accountNumber: '',
      iban: '',
      swiftCode: '',
      currency: 'AED',
      branchName: '',
      country: 'United Arab Emirates',
      instructions: 'For Car Rental, VIP Chauffeur services, and corporate fleet bookings.'
    }
  }
};
