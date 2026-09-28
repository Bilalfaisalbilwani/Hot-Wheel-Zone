import { VisaType, VisaServiceItem, FleetVehicle } from '../types';
export { 
  INVENTORY_VEHICLES, 
  FLEET_CATALOG, 
  MERCEDES_FLEET, 
  CHAUFFEUR_SERVICE_OPTIONS, 
  CORPORATE_RATES, 
  CORPORATE_RATES_METADATA, 
  INVENTORY_VEHICLES as VEHICLES 
} from './carInventory';

export const COMPANY_CONFIG = {
  name: 'ZONE TOURISM LLC & HOTWHEELS CAR RENTAL LLC',
  travelCompany: 'ZONE TOURISM LLC',
  carCompany: 'HOTWHEELS CAR RENTAL LLC',
  primaryIdentity: 'ZONE TOURISM LLC',
  carRentalIdentity: 'HOTWHEELS CAR RENTAL LLC',
  // Official corporate telephone and mobile lines
  phone: '+971 4 222 6182',
  phones: ['+971 4 222 6182', '+971 55 558 6359', '03315424466'],
  // Official WhatsApp desk
  whatsappNumber: '971555586359',
  whatsappDisplay: '+971 55 558 6359',
  // Official corporate email channels
  email: 'info@zonetourism.ae',
  visaEmail: 'visa@zonetourism.ae',
  carRentalEmail: 'rentals@hotwheelscarrental.ae',
  accountsEmail: 'accounts@zonetourism.ae',
  // Verified Dubai office address
  address: 'Shop No. 2, Ground Floor, Malik Saud Abdul Aziz Building, 8th Street, Al Rigga Road, Near Union Metro Station, Exit 2, Deira, Dubai, UAE – 125131',
  googleMapsUrl: 'https://maps.app.goo.gl/LUEzbhsh17Jf8YgbA',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.0969913819927!2d55.3130791!3d25.2673225!2m3!1f0!2f0!3f0!3m2!1i1024!2f768!4f13.1!3m3!1m2!1s0x3e5f5ccade0db389%3A0xae9fbab7ef12feb2!2sZone%20Tourism%20LLC%20%26%20Hotwheels%20Car%20Rental!5e0!3m2!1sen!2sae!4v1710000000000!5m2!1sen!2sae',
  // Official social media presences
  social: {
    instagram: 'https://instagram.com/zonetourism.ae',
    facebook: 'https://facebook.com/zonetourismdubai',
    tiktok: 'https://www.tiktok.com/@zonetourism.ae',
    linkedin: 'https://linkedin.com/company/zone-tourism-uae',
    youtube: 'https://youtube.com/@zonetourismdubai',
    twitter: 'https://x.com/zonetourism'
  },
  // Distinct divisional breakdown
  entities: {
    zoneTourism: {
      name: 'ZONE TOURISM LLC',
      tradeType: 'Travel & Tourism LLC',
      division: 'Visit Visas, Tour Packages & Travel Logistics',
      phone: '+971 4 222 6182',
      mobile: '+971 55 558 6359',
      email: 'visa@zonetourism.ae',
      whatsapp: '923315424466',
      address: 'Shop No. 2, Ground Floor, Malik Saud Abdul Aziz Building, 8th Street, Al Rigga Road, Near Union Metro Station, Exit 2, Deira, Dubai, UAE – 125131',
      scope: 'UAE 30/60-day visit visas, multi-entry travel permits, international visa assistance, document reviews.'
    },
    hotwheels: {
      name: 'HOTWHEELS CAR RENTAL LLC',
      tradeType: 'Car Rental LLC',
      division: 'Vehicle Rental, Mercedes Chauffeur & Transfers',
      phone: '+971 4 222 6182',
      mobile: '+971 55 558 6359',
      email: 'rentals@hotwheelscarrental.ae',
      whatsapp: '923315424466',
      address: 'Shop No. 2, Ground Floor, Malik Saud Abdul Aziz Building, 8th Street, Al Rigga Road, Near Union Metro Station, Exit 2, Deira, Dubai, UAE – 125131',
      scope: 'Self-drive rental cars, VIP Mercedes-Benz V-Class chauffeur, DXB airport pick-up and inter-emirate journeys.'
    }
  },
  credentials: {
    jurisdiction: 'Dubai, United Arab Emirates',
    tourismLicence: 'Commercial Tourism License, Dubai, UAE',
    transportLicence: 'RTA-Compliant Vehicle Rental & Chauffeur Services',
    iataPolicy: 'IATA and airline ticketing credentials cited strictly where currently active and valid',
    officeType: 'Physical Corporate Office in Dubai, UAE',
    supportPolicy: 'Direct Local Customer Support via Phone & WhatsApp Desk'
  },
  securityDepositNote: 'Security Deposit Required — All Rentals. Security deposit is applicable on all vehicle rentals as per vehicle category and standard rental policy.',
};

export const VISA_TYPES: VisaType[] = [
  {
    id: '30-days-single',
    title: '30 Days Single Entry',
    duration: '30 Days',
    entryType: 'Single Entry',
    description: 'Single entry permit for short vacations, family visits, or brief tourism in the UAE.',
    processingTime: 'Varies by nationality & immigration approval',
    validity: '60 Days from Issue Date',
  },
  {
    id: '60-days-single',
    title: '60 Days Single Entry',
    duration: '60 Days',
    entryType: 'Single Entry',
    description: 'Single entry permit for extended holidays, longer visits, or leisure travel in the UAE.',
    processingTime: 'Varies by nationality & immigration approval',
    validity: '60 Days from Issue Date',
  },
  {
    id: '30-days-multiple',
    title: '30 Days Multiple Entry',
    duration: '30 Days',
    entryType: 'Multiple Entry',
    description: 'Multiple entry permit allowing flexible entry and exit within 30 days.',
    processingTime: 'Varies by nationality & immigration approval',
    validity: '60 Days from Issue Date',
  },
  {
    id: '60-days-multiple',
    title: '60 Days Multiple Entry',
    duration: '60 Days',
    entryType: 'Multiple Entry',
    description: 'Multiple entry permit for repeat business trips or frequent visits within 60 days.',
    processingTime: 'Varies by nationality & immigration approval',
    validity: '60 Days from Issue Date',
  },
];

// UAE Visa Processing & Policy Information
export const UAE_PROCESSING_INFO = 'Processing time may vary depending on the visa type, nationality and UAE Immigration approval.';
export const UAE_EXPRESS_PROCESSING_INFO = 'Express/Urgent processing may be available for selected applications, subject to immigration availability and additional charges.';

export const UAE_IMPORTANT_INFORMATION: string[] = [
  'Passport must normally be valid for at least 6 months from the intended travel date.',
  'Visa validity, permitted stay and number of entries depend on the approved visa type.',
  'Additional documents or security/guarantee requirements may apply to certain nationalities.',
  'Submission of documents does not guarantee visa approval.',
  'Visa approval, rejection and processing time are entirely subject to the UAE Immigration Authorities.',
  'Visa fees and service charges are non-refundable once the application has been submitted, unless specifically advised otherwise.'
];

// UAE Visa Document Requirements - For All Applicants
export const UAE_CORE_DOCUMENTS: string[] = [
  'Clear Color Passport Copy',
  'Passport must have minimum 6 months validity',
  'Passport Cover Page',
  'Recent Passport-Size Photograph — White Background',
  'National ID Card — Front & Back (if applicable)',
  'Confirmed Return/Onward Air Ticket — if required'
];

// UAE Additional Documents - If Required
export const UAE_ADDITIONAL_DOCUMENTS: string[] = [
  'Previous UAE Visa Copy',
  'Previous UAE Entry/Exit Record',
  'Guarantor/Sponsor Documents',
  'UAE Residence Visa & Emirates ID of Relative/Sponsor',
  'Relationship Proof',
  'Birth Certificate for Children',
  'Marriage Certificate for Spouse',
  'Hotel Booking / UAE Accommodation Details',
  'Bank Statement or Proof of Funds',
  'Previous Travel History / Visa Copies'
];

// Current 5 Primary Visa Services requested by client
export const MAIN_VISA_SERVICES: VisaServiceItem[] = [
  {
    id: 'uae-visit-visa',
    destination: 'United Arab Emirates (UAE)',
    visaType: 'UAE Visit Visa',
    basicDocuments: [
      'Passport copy (valid for at least 6 months)',
      'Passport-Size Photograph (white background)',
      'Passport Cover Page',
      'Confirmed Return/Onward Air Ticket — if required'
    ],
    processingTime: 'Processing time may vary depending on the visa type, nationality and UAE Immigration approval.',
    whatsappMessage: 'Hello Zone Tourism, I would like to apply / enquire about the UAE Visit Visa.',
    isUae: true
  },
  {
    id: 'schengen-visa',
    destination: 'Schengen Area (Europe)',
    visaType: 'Schengen Visa Assistance',
    basicDocuments: [
      'Passport valid for at least 6 months with 2 blank pages',
      'Recent Passport-Size Photograph (white background)',
      'Confirmed flight reservation and proof of accommodation',
      'Bank statements (last 3 to 6 months)',
      'Employment verification letter / NOC'
    ],
    processingTime: '10 to 15 Working Days (subject to consulate)',
    whatsappMessage: 'Hello Zone Tourism, I would like to apply / enquire about Schengen Visa Assistance.',
    isUae: false
  },
  {
    id: 'uk-visa',
    destination: 'United Kingdom (UK)',
    visaType: 'UK Visa Assistance',
    basicDocuments: [
      'Valid passport with minimum 6 months validity',
      'Passport-Size Photograph',
      'Personal bank statements showing available funds',
      'Employment verification and leave approval letter',
      'Travel itinerary and accommodation booking'
    ],
    processingTime: '3 to 6 Weeks (UKVI dependent)',
    whatsappMessage: 'Hello Zone Tourism, I would like to apply / enquire about UK Visa Assistance.',
    isUae: false
  },
  {
    id: 'usa-visa',
    destination: 'United States of America (USA)',
    visaType: 'USA Visa Assistance',
    basicDocuments: [
      'Valid passport with minimum 6 months validity',
      'Completed DS-160 application confirmation barcode',
      'Recent 2x2 inch (51x51 mm) photograph (white background)',
      'Proof of financial solvency and ties to residence country',
      'Appointment confirmation sheet'
    ],
    processingTime: 'Subject to US Embassy appointment availability',
    whatsappMessage: 'Hello Zone Tourism, I would like to apply / enquire about USA Visa Assistance.',
    isUae: false
  },
  {
    id: 'china-visa',
    destination: 'China',
    visaType: 'China Business / Tourist Visa',
    basicDocuments: [
      'Original passport valid for at least 6 months with blank pages',
      'Recent Passport-Size Photograph (white background)',
      'Official invitation letter (Business) or hotel bookings (Tourist)',
      'Round-trip airline booking confirmation',
      'UAE residence visa & Emirates ID copy (if applying from UAE)'
    ],
    processingTime: '4 to 7 Working Days (consulate dependent)',
    whatsappMessage: 'Hello Zone Tourism, I would like to apply / enquire about China Business / Tourist Visa.',
    isUae: false
  }
];

export const VISA_DISCLAIMER = 'Visa approval and processing time are subject to the relevant immigration, consulate or embassy authorities.';

export const NATIONALITIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bahrain', 'Bangladesh', 
  'Belgium', 'Brazil', 'Canada', 'China', 'Colombia', 'Denmark', 'Egypt', 'France', 'Germany', 
  'Greece', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Italy', 'Japan', 'Jordan', 'Kenya', 'Kuwait', 
  'Lebanon', 'Malaysia', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Oman', 
  'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 
  'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 
  'Thailand', 'Tunisia', 'Turkey', 'Ukraine', 'United Kingdom', 'United States', 'Vietnam', 'Yemen', 'Other Nationality'
].sort();

