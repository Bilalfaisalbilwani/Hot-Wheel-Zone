import { PaymentConfiguration, CompanyBankAccount } from '../types';

/**
 * SINGLE SOURCE OF TRUTH FOR COMPANY BANK & PAYMENT CONFIGURATION
 * 
 * Configured with the official company bank accounts:
 * 1. ZONE TOURISM LLC (Emirates NBD & Commercial Bank of Dubai)
 * 2. HOTWHEELS CAR RENTALS (Habib Bank AG Zurich – Sharjah Branch)
 * 3. DUBAI AL QUOZ BRANCH – CROWN ZONE TOURISM LLC (Habib Bank AG Zurich & ADCB Bank)
 */

export const COMPANY_BANK_ACCOUNTS: CompanyBankAccount[] = [
  // 1. ZONE TOURISM LLC - Emirates NBD
  {
    id: 'zone-enbd',
    category: 'zoneTourism',
    categoryLabel: 'ZONE TOURISM LLC',
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
  // 2. ZONE TOURISM LLC - Commercial Bank of Dubai
  {
    id: 'zone-cbd',
    category: 'zoneTourism',
    categoryLabel: 'ZONE TOURISM LLC',
    companyAccountName: 'ZONE TOURISM LLC',
    bankName: 'Commercial Bank of Dubai',
    accountNumber: '1001250784',
    iban: 'AE86 0230 0000 0100 1250 784',
    swiftCode: '',
    currency: 'AED',
    branchName: 'Dubai Branch',
    country: 'United Arab Emirates',
    instructions: 'For UAE Visit Visa services and general tourism packages.'
  },
  // 3. HOTWHEELS CAR RENTALS - Habib Bank AG Zurich
  {
    id: 'hotwheels-habib',
    category: 'hotwheels',
    categoryLabel: 'HOTWHEELS CAR RENTALS',
    companyAccountName: 'HOTWHEELS CAR RENTALS',
    bankName: 'Habib Bank AG Zurich',
    accountNumber: '02-02-08-020311-105-0573857',
    iban: 'AE03 0290 8902 1050 0573 857',
    swiftCode: 'HBZUAEADXXX',
    currency: 'AED',
    branchName: 'Sharjah Branch',
    country: 'United Arab Emirates',
    instructions: 'For Car Rental, Self-Drive Fleet, and Chauffeur-driven Mercedes bookings.'
  },
  // 4. DUBAI AL QUOZ BRANCH – CROWN ZONE TOURISM LLC - Habib Bank AG Zurich
  {
    id: 'crown-habib',
    category: 'crownZone',
    categoryLabel: 'DUBAI AL QUOZ BRANCH – CROWN ZONE TOURISM LLC',
    companyAccountName: 'CROWN ZONE TOURISM LLC',
    bankName: 'Habib Bank AG Zurich',
    accountNumber: '02-02-08-020311-105-0611137',
    iban: 'AE12 0290 8902 1050 0611137',
    swiftCode: '',
    currency: 'AED',
    branchName: 'Dubai Al Quoz Branch',
    country: 'United Arab Emirates',
    instructions: 'For Dubai Al Quoz Branch tourism and travel services.'
  },
  // 5. DUBAI AL QUOZ BRANCH – CROWN ZONE TOURISM LLC - ADCB Bank
  {
    id: 'crown-adcb',
    category: 'crownZone',
    categoryLabel: 'DUBAI AL QUOZ BRANCH – CROWN ZONE TOURISM LLC',
    companyAccountName: 'CROWN ZONE TOURISM LLC',
    bankName: 'ADCB Bank',
    accountNumber: '14432881820001',
    iban: 'AE77 0030 0144 3288 1820 001',
    swiftCode: '',
    currency: 'AED',
    branchName: 'Dubai Al Quoz Branch',
    country: 'United Arab Emirates',
    instructions: 'For Dubai Al Quoz Branch tourism and travel services.'
  }
];

export const PAYMENT_CONFIG: PaymentConfiguration = {
  bankTransfer: {
    primaryAccount: COMPANY_BANK_ACCOUNTS[0], // Emirates NBD
    secondaryAccount: COMPANY_BANK_ACCOUNTS[2], // Habib Bank AG Zurich - Hotwheels
    accounts: COMPANY_BANK_ACCOUNTS,
    noticeNote: 'Please mention your booking/reference number when making the payment and share the payment receipt with our team on WhatsApp for confirmation.',
    supportWhatsApp: '971555586359',
    supportEmail: 'accounts@zonetourism.ae'
  },
  cardPayment: {
    isEnabled: true,
    providerName: 'Authorized UAE Payment Gateway',
    statusMessage: 'Online credit and debit card payments (Visa, Mastercard, AMEX) are active via secure 256-bit SSL gateway.',
    supportedCards: ['Visa', 'Mastercard', 'American Express', 'Apple Pay']
  }
};
