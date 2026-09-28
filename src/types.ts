export interface VisaType {
  id: string;
  title: string;
  duration: string;
  entryType: 'Single Entry' | 'Multiple Entry';
  priceUSD?: number;
  priceAED?: number;
  description: string;
  processingTime: string;
  validity: string;
  popular?: boolean;
}

export interface VisaServiceItem {
  id: string;
  destination: string;
  visaType: string;
  basicDocuments: string[];
  processingTime: string;
  whatsappMessage: string;
  badge?: string;
  isUae?: boolean;
}

export interface CorporateRate {
  rateCategory: string;
  daily: number; // in AED
  weekly: number;
  oneMonth: number;
  threeMonth: number;
  sixMonth: number;
  nineMonth: number;
  twelveMonth: number;
}

export type RentalServiceType = 'SELF DRIVE' | 'CHAUFFEUR DRIVEN';
export type VehicleCategory = 'Sedan' | 'SUV' | 'Luxury' | '7-Seater / MPV';
export type ServiceAssignment = 'Chauffeur Driven' | 'Self Drive' | 'Both';

export type ChauffeurServiceOption = 
  | 'Airport Transfer' 
  | 'Hourly Hire' 
  | 'Full-Day Chauffeur' 
  | 'Corporate Transfer';

export interface FleetVehicle {
  id: string;
  makeModel: string;
  category: VehicleCategory;
  serviceType: RentalServiceType;
  serviceAssignment: ServiceAssignment;
  brand?: 'Mercedes-Benz' | 'Toyota' | 'Nissan' | 'Hyundai' | 'Kia' | 'Rolls-Royce' | 'Cadillac' | 'BMW' | 'Audi' | 'Other';
  seats: number;
  luggageCapacity?: string;
  image: string;
  gallery?: string[];
  images?: string[];
  videoUrl?: string;
  video?: string;
  transmission?: string;
  dailyRateAED?: number;
  weeklyRateAED?: number;
  monthlyRateAED?: number;
  isQuoteOnly?: boolean;
  description: string;
  features?: string[];
  chauffeurServices?: ChauffeurServiceOption[];
}

export interface InventoryVehicle {
  id: string;
  serialNumber: number;
  vehicleName: string;
  colour: string;
  model: string;
  category: 'Economy Cars' | 'SUVs' | 'Self Drive' | 'Chauffeur Driven';
  image: string;
  videoUrl?: string;
  video?: string;
  rateCategory: string;
  seats: number;
  transmission: 'Automatic';
  features: string[];
  description: string;
}

export type Vehicle = InventoryVehicle;

export interface LegacyVehicle {
  id: string;
  name: string;
  category: 'Self Drive' | 'Chauffeur Driven' | 'Economy Cars' | 'SUVs';
  image: string;
  priceAEDPerDay: number;
  priceUSDPerDay: number;
  seats: number;
  transmission: 'Automatic' | 'Manual';
  features: string[];
  description: string;
}

export interface VisaEnquiryPayload {
  name: string;
  nationality: string;
  isUaeResident: 'Yes' | 'No';
  destination: string;
  travelDate: string;
  whatsappNumber: string;
}

export interface CarRentalEnquiryPayload {
  customerName?: string;
  name?: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  serviceType: 'Self Drive' | 'Chauffeur' | 'Chauffeur Driven';
  vehicleType: string;
  whatsappNumber: string;
}

export interface EnquirySubmissionResult {
  success: boolean;
  referenceId: string;
  message: string;
  timestamp: string;
  routedTo: {
    team: string;
    email: string;
    whatsappNumber: string;
  };
}

export interface CompanyBankAccount {
  id?: string;
  category?: 'zoneTourism' | 'hotwheels' | 'crownZone' | string;
  categoryLabel?: string;
  companyAccountName: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  swiftCode?: string;
  currency: string;
  branchName?: string;
  country?: string;
  instructions?: string;
}

export interface PaymentGatewayConfig {
  isEnabled: boolean;
  providerName: string;
  statusMessage: string;
  supportedCards: string[];
}

export interface CardPaymentPayload {
  serviceEntity: string;
  referenceNo?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface CardPaymentResult {
  transactionId: string;
  referenceNo?: string;
  serviceEntity: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  cardBrand: string;
  cardLast4: string;
  timestamp: string;
  status: 'Approved' | 'Declined';
  receiptUrl?: string;
}

export interface PaymentConfiguration {
  bankTransfer: {
    primaryAccount: CompanyBankAccount;
    secondaryAccount?: CompanyBankAccount;
    accounts?: CompanyBankAccount[];
    noticeNote: string;
    supportWhatsApp: string;
    supportEmail: string;
  };
  cardPayment: PaymentGatewayConfig;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed';

export interface AdminVisaService {
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

export interface AdminCar {
  id: string;
  make: string;
  model: string;
  category: VehicleCategory;
  seats: number;
  luggage: string;
  image: string;
  gallery?: string[];
  videoUrl?: string;
  video?: string;
  rentalType: 'Self Drive' | 'Chauffeur Driven' | 'Both';
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  getQuoteOption: boolean;
  isAvailable: boolean;
  isMercedesChauffeur?: boolean;
  description?: string;
  features?: string[];
}

export interface AdminEnquiry {
  id: string;
  referenceId?: string;
  enquiryType: 'visa' | 'car-rental' | 'chauffeur' | 'contact' | string;
  name: string;
  nationality?: string;
  isUaeResident?: string;
  destination?: string;
  travelDate?: string;
  whatsappNumber: string;
  pickupLocation?: string;
  pickupDate?: string;
  returnDate?: string;
  serviceType?: string;
  vehicleType?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled' | string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  // Backward compatibility alias properties
  type?: string;
  internalNotes?: string;
  data?: Record<string, any>;
}

export interface AdminCompanyInfo {
  travelCompanyName: string;
  carRentalCompanyName: string;
  unifiedName: string;
  phones: string[];
  whatsappNumbers: string[];
  email: string;
  accountsEmail: string;
  officeAddress: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    tiktok?: string;
  };
  bankDetails: {
    primaryAccount: CompanyBankAccount;
    secondaryAccount?: CompanyBankAccount;
  };
}

export interface CarModel {
  id: string;
  make: string;
  model: string;
  category: string;
  serviceType: 'Self Drive' | 'Chauffeur Driven' | 'Both' | string;
  seats: number;
  luggage: string;
  dailyPriceAED: number;
  dailyPriceUSD: number;
  weeklyPriceAED: number;
  weeklyPriceUSD: number;
  monthlyPriceAED: number;
  monthlyPriceUSD: number;
  yearlyPriceAED?: number;
  yearlyPriceUSD?: number;
  image: string;
  gallery?: string[];
  videoUrl?: string;
  video?: string;
  description?: string;
  getQuoteOption?: boolean;
  isMercedesChauffeur?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Backward compatibility alias properties
  dailyPrice?: number;
  weeklyPrice?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  rentalType?: string;
  isAvailable?: boolean;
}

export type PageRoute = 
  | 'home' 
  | 'uae-visit-visa' 
  | 'car-rental' 
  | 'chauffeur'
  | 'mercedes-chauffeur'
  | 'make-payment'
  | 'admin'
  | 'about' 
  | 'contact' 
  | 'terms' 
  | 'privacy';
