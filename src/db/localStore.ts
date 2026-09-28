import fs from 'fs';
import path from 'path';

export interface LocalDbSchema {
  cars: any[];
  enquiries: any[];
  bankDetails: {
    primaryAccount: any;
    secondaryAccount?: any;
  };
}

const DB_FILE = path.join(process.cwd(), 'local_database_fallback.json');

const INITIAL_CARS = [
  {
    id: 'car-1',
    make: 'Mercedes-Benz',
    model: 'V-Class VIP Extra Long',
    category: 'Luxury',
    serviceType: 'Both',
    seats: 7,
    luggage: '6 Bags',
    dailyPriceAED: 1200,
    dailyPriceUSD: 327,
    weeklyPriceAED: 7500,
    weeklyPriceUSD: 2043,
    monthlyPriceAED: 24000,
    monthlyPriceUSD: 6540,
    yearlyPriceAED: 240000,
    yearlyPriceUSD: 65400,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    videoUrl: '/videos/mercedes_vclass_tour.mp4',
    description: 'Flagship executive multi-purpose vehicle with reclining leather captain chairs, dual panoramic sunroofs, and in-cabin Wi-Fi.',
    getQuoteOption: true,
    isMercedesChauffeur: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'car-2',
    make: 'Mercedes-Benz',
    model: 'Vito Tourer Select',
    category: '7-Seater / MPV',
    serviceType: 'Both',
    seats: 8,
    luggage: '7 Bags',
    dailyPriceAED: 850,
    dailyPriceUSD: 232,
    weeklyPriceAED: 5200,
    weeklyPriceUSD: 1417,
    monthlyPriceAED: 16500,
    monthlyPriceUSD: 4496,
    yearlyPriceAED: 165000,
    yearlyPriceUSD: 44960,
    image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80',
    videoUrl: '/videos/mercedes_vclass_tour.mp4',
    description: 'Practical, spacious luxury van ideal for airport transfers, family tours, and corporate golf groups.',
    getQuoteOption: true,
    isMercedesChauffeur: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'car-3',
    make: 'Mercedes-Benz',
    model: 'S-Class 500 AMG Line',
    category: 'Luxury',
    serviceType: 'Both',
    seats: 4,
    luggage: '3 Bags',
    dailyPriceAED: 1800,
    dailyPriceUSD: 490,
    weeklyPriceAED: 11000,
    weeklyPriceUSD: 2997,
    monthlyPriceAED: 38000,
    monthlyPriceUSD: 10354,
    yearlyPriceAED: 380000,
    yearlyPriceUSD: 103540,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    videoUrl: '/videos/mercedes_sclass_tour.mp4',
    description: 'The pinnacle of chauffeured luxury. Rear executive seat with massage function, Burmester 3D surround, and soft-close doors.',
    getQuoteOption: true,
    isMercedesChauffeur: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'car-4',
    make: 'Mercedes-Benz',
    model: 'E-Class Sedan',
    category: 'Luxury',
    serviceType: 'Both',
    seats: 4,
    luggage: '2 Bags',
    dailyPriceAED: 650,
    dailyPriceUSD: 177,
    weeklyPriceAED: 4000,
    weeklyPriceUSD: 1090,
    monthlyPriceAED: 13000,
    monthlyPriceUSD: 3542,
    yearlyPriceAED: 130000,
    yearlyPriceUSD: 35420,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    videoUrl: '/videos/mercedes_sclass_tour.mp4',
    description: 'Executive sedan perfect for corporate business meetings, hotel transfers, and daily VIP commute.',
    getQuoteOption: true,
    isMercedesChauffeur: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'car-5',
    make: 'Toyota',
    model: 'Land Cruiser Prado 4.0L TX-L',
    category: 'SUV',
    serviceType: 'Self Drive',
    seats: 7,
    luggage: '4 Bags',
    dailyPriceAED: 380,
    dailyPriceUSD: 104,
    weeklyPriceAED: 2300,
    weeklyPriceUSD: 627,
    monthlyPriceAED: 6800,
    monthlyPriceUSD: 1853,
    yearlyPriceAED: 68000,
    yearlyPriceUSD: 18530,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    videoUrl: '/videos/toyota_prado_tour.mp4',
    description: 'Legendary Japanese SUV offering supreme reliability, excellent air conditioning, and spacious 7-passenger capability for city and highway driving.',
    getQuoteOption: true,
    isMercedesChauffeur: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'car-6',
    make: 'Toyota',
    model: 'Fortuner 4WD 2.7L',
    category: 'SUV',
    serviceType: 'Self Drive',
    seats: 7,
    luggage: '4 Bags',
    dailyPriceAED: 280,
    dailyPriceUSD: 76,
    weeklyPriceAED: 1650,
    weeklyPriceUSD: 450,
    monthlyPriceAED: 4800,
    monthlyPriceUSD: 1308,
    yearlyPriceAED: 48000,
    yearlyPriceUSD: 13080,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    videoUrl: '/videos/toyota_prado_tour.mp4',
    description: 'Robust 7-passenger SUV equipped with high ground clearance, rear air-conditioning, and 4x4 capability.',
    getQuoteOption: true,
    isMercedesChauffeur: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_BANK_DETAILS = {
  primaryAccount: {
    id: 'primary',
    companyAccountName: 'ZONE TOURISM LLC',
    bankName: 'Emirates NBD',
    accountNumber: '1014347702901',
    iban: 'AE79 0260 0010 1434 7702 901',
    swiftCode: '',
    currency: 'AED',
    branchName: 'Dubai Branch',
    country: 'United Arab Emirates',
    instructions: 'For UAE Visit Visa services and general tourism packages.'
  },
  secondaryAccount: {
    id: 'secondary',
    companyAccountName: 'HOTWHEELS CAR RENTALS',
    bankName: 'Habib Bank AG Zurich',
    accountNumber: '02-02-08-020311-105-0573857',
    iban: 'AE03 0290 8902 1050 0573 857',
    swiftCode: 'HBZUAEADXXX',
    currency: 'AED',
    branchName: 'Sharjah Branch',
    country: 'United Arab Emirates',
    instructions: 'For Car Rental, VIP Chauffeur services, and corporate fleet bookings.'
  }
};

let inMemoryStore: LocalDbSchema = {
  cars: [...INITIAL_CARS],
  enquiries: [],
  bankDetails: { ...INITIAL_BANK_DETAILS }
};

export function loadLocalStore(): LocalDbSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      inMemoryStore = {
        cars: Array.isArray(parsed.cars) && parsed.cars.length > 0 ? parsed.cars : [...INITIAL_CARS],
        enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [],
        bankDetails: parsed.bankDetails || { ...INITIAL_BANK_DETAILS }
      };
    } else {
      saveLocalStore();
    }
  } catch (err) {
    console.error('Error reading local fallback database:', err);
  }
  return inMemoryStore;
}

export function saveLocalStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local fallback database:', err);
  }
}

// Initial load
loadLocalStore();

export { inMemoryStore };
