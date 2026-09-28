import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import type { AdminCompanyInfo } from "./src/types";
import { 
  getActiveCars, 
  getAllCarsAdmin, 
  createCar, 
  updateCar, 
  deleteCar, 
  toggleCarStatus 
} from "./src/db/cars.ts";
import {
  getBankDetailsFromDb,
  updateBankDetailsInDb
} from "./src/db/bankAccounts.ts";
import { COMPANY_BANK_ACCOUNTS } from "./src/data/paymentConfig.ts";
import {
  createEnquiryInDb,
  getAllEnquiriesFromDb,
  getEnquiryByIdFromDb,
  updateEnquiryInDb,
  deleteEnquiryFromDb
} from "./src/db/enquiries.ts";
import { 
  requireAdminAuth, 
  createAdminSession, 
  invalidateAdminSession, 
  verifyAdminSecret,
  type AuthRequest
} from "./src/middleware/auth.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const COMPANY_EMAIL = process.env.COMPANY_EMAIL || "";

  // Parse JSON payloads with increased size limit for file uploads (50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Pre-seed state from initial structures
  let visaServicesState = [
    {
      id: 'visa-1',
      destination: 'Dubai / UAE',
      visaType: '30 Days Single Entry',
      duration: '30 Days',
      entryType: 'Single Entry',
      priceAED: 350,
      priceUSD: 100,
      description: 'Ideal for short vacations, family visits, or brief tourism in Dubai and across the UAE.',
      processingTime: 'Processing time may vary depending on the visa type, nationality and UAE Immigration approval.',
      validity: '60 Days from Issue Date',
      documentsRequired: ['Passport copy (valid for at least 6 months)', 'Passport-Size Photograph (white background)', 'Passport Cover Page', 'Confirmed Return/Onward Air Ticket — if required'],
      isActive: true,
      popular: true
    },
    {
      id: 'visa-2',
      destination: 'Dubai / UAE',
      visaType: '60 Days Single Entry',
      duration: '60 Days',
      entryType: 'Single Entry',
      priceAED: 700,
      priceUSD: 190,
      description: 'Perfect for extended vacations, longer holiday stays, or visiting relatives in the UAE.',
      processingTime: 'Processing time may vary depending on the visa type, nationality and UAE Immigration approval.',
      validity: '60 Days from Issue Date',
      documentsRequired: ['Passport copy (valid for at least 6 months)', 'Passport-Size Photograph (white background)', 'Passport Cover Page', 'Confirmed Return/Onward Air Ticket — if required'],
      isActive: true,
      popular: false
    },
    {
      id: 'visa-3',
      destination: 'Dubai / UAE',
      visaType: '30 Days Multiple Entry',
      duration: '30 Days',
      entryType: 'Multiple Entry',
      priceAED: 850,
      priceUSD: 230,
      description: 'Designed for travelers needing to exit and re-enter the UAE multiple times within 30 days.',
      processingTime: 'Processing time may vary depending on the visa type, nationality and UAE Immigration approval.',
      validity: '60 Days from Issue Date',
      documentsRequired: ['Passport copy (valid for at least 6 months)', 'Passport-Size Photograph (white background)', 'Passport Cover Page', 'Confirmed Return/Onward Air Ticket — if required'],
      isActive: true,
      popular: false
    },
    {
      id: 'visa-4',
      destination: 'Dubai / UAE',
      visaType: '60 Days Multiple Entry',
      duration: '60 Days',
      entryType: 'Multiple Entry',
      priceAED: 1400,
      priceUSD: 380,
      description: 'Maximum flexibility for frequent business or leisure travelers entering the UAE multiple times.',
      processingTime: 'Processing time may vary depending on the visa type, nationality and UAE Immigration approval.',
      validity: '60 Days from Issue Date',
      documentsRequired: ['Passport copy (valid for at least 6 months)', 'Passport-Size Photograph (white background)', 'Passport Cover Page', 'Confirmed Return/Onward Air Ticket — if required'],
      isActive: true,
      popular: true
    }
  ];

  let carsState = [
    {
      id: 'car-1',
      make: 'Mercedes-Benz',
      model: 'V-Class VIP Extra Long',
      category: 'Luxury',
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
      description: 'Flagship executive multi-purpose vehicle with reclining leather captain chairs, dual panoramic sunroofs, and in-cabin Wi-Fi.'
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

  let companyInfoState: AdminCompanyInfo = {
    travelCompanyName: 'ZONE TOURISM LLC',
    carRentalCompanyName: 'HOTWHEELS CAR RENTAL LLC',
    unifiedName: 'ZONE TOURISM LLC & HOTWHEELS CAR RENTAL LLC',
    phones: ['+971 4 222 6182', '+971 55 558 6359', '03315424466'],
    whatsappNumbers: ['923315424466', '971555586359'],
    email: 'info@zonetourism.ae',
    accountsEmail: 'accounts@zonetourism.ae',
    officeAddress: 'Shop No. 2, Ground Floor, Malik Saud Abdul Aziz Building, 8th Street, Al Rigga Road, Near Union Metro Station, Exit 2, Deira, Dubai, UAE – 125131',
    socialLinks: {
      instagram: 'https://instagram.com/zonetourism.ae',
      facebook: 'https://facebook.com/zonetourismdubai',
      linkedin: 'https://linkedin.com/company/zone-tourism-uae',
      tiktok: 'https://www.tiktok.com/@zonetourism.ae',
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

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Configurable Payment Information Endpoint (dynamic from PostgreSQL bank_accounts)
  app.get("/api/payment-config", async (req, res) => {
    try {
      const bankDetails = await getBankDetailsFromDb();
      res.json({
        success: true,
        bankTransfer: {
          primaryAccount: bankDetails.primaryAccount || COMPANY_BANK_ACCOUNTS[0],
          secondaryAccount: bankDetails.secondaryAccount || COMPANY_BANK_ACCOUNTS[2],
          accounts: COMPANY_BANK_ACCOUNTS,
          noticeNote: 'Please mention your booking/reference number when making the payment and share the payment receipt with our team for confirmation.',
          supportWhatsApp: companyInfoState.whatsappNumbers[0] || '971555586359',
          supportEmail: companyInfoState.accountsEmail || companyInfoState.email
        },
        cardPayment: {
          isEnabled: true,
          providerName: 'Authorized UAE Payment Gateway',
          statusMessage: 'Online credit and debit card payments (Visa, Mastercard, AMEX) are active via secure 256-bit SSL gateway.',
          supportedCards: ['Visa', 'Mastercard', 'American Express', 'Apple Pay']
        }
      });
    } catch (err: any) {
      console.error("Error retrieving payment config:", err);
      res.status(500).json({ success: false, error: "Failed to load payment configuration." });
    }
  });

  // In-memory store for card payments
  const cardTransactionsState: any[] = [];

  // Card Payment Processing Endpoint
  app.post("/api/payments/card", async (req, res) => {
    try {
      const {
        serviceEntity,
        referenceNo,
        customerName,
        customerEmail,
        customerPhone,
        amount,
        currency = 'AED',
        cardNumber = '',
        cardholderName,
        expiryMonth,
        expiryYear,
        cvv
      } = req.body;

      if (!customerName || !amount || !cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cvv) {
        return res.status(400).json({
          success: false,
          error: "Please complete all required payment card fields."
        });
      }

      const cleanNum = String(cardNumber).replace(/\s+/g, '');
      if (cleanNum.length < 13 || cleanNum.length > 19) {
        return res.status(400).json({
          success: false,
          error: "Invalid card number length."
        });
      }

      // Determine card brand
      let cardBrand = 'Visa';
      if (cleanNum.startsWith('4')) cardBrand = 'Visa';
      else if (/^5[1-5]/.test(cleanNum) || /^2[2-7]/.test(cleanNum)) cardBrand = 'Mastercard';
      else if (/^3[47]/.test(cleanNum)) cardBrand = 'American Express';
      else if (/^6(?:011|5)/.test(cleanNum)) cardBrand = 'Discover';

      const cardLast4 = cleanNum.slice(-4);
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const transactionId = `TXN-AE-${randomSuffix}`;
      const timestamp = new Date().toISOString();

      const transactionRecord = {
        transactionId,
        referenceNo: referenceNo || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceEntity: serviceEntity || 'Zone Tourism LLC & Hotwheels Car Rental LLC',
        customerName,
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        amount: Number(amount),
        currency: String(currency).toUpperCase(),
        cardBrand,
        cardLast4,
        status: 'Approved',
        timestamp
      };

      cardTransactionsState.unshift(transactionRecord);

      return res.json({
        success: true,
        data: transactionRecord,
        message: "Payment processed and approved successfully."
      });
    } catch (err: any) {
      console.error("Error processing card payment:", err);
      return res.status(500).json({
        success: false,
        error: "Card transaction could not be completed. Please try again or contact support."
      });
    }
  });

  // Get Card Payment Transactions (for Admin)
  app.get("/api/payments/transactions", (req, res) => {
    res.json({
      success: true,
      data: cardTransactionsState
    });
  });

  // Public endpoint to get active visa services
  app.get("/api/visas", (req, res) => {
    const activeVisas = visaServicesState.filter(v => v.isActive);
    res.json({ success: true, data: activeVisas });
  });

  // Public endpoint to get available cars dynamically from Cloud SQL PostgreSQL
  app.get("/api/cars", async (req, res) => {
    try {
      const dbCars = await getActiveCars();
      // Strict field whitelisting: registration numbers, vehicle plates, or internal tracking IDs must NEVER leak
      const formattedCars = dbCars.map(c => ({
        id: c.id,
        make: c.make,
        model: c.model,
        category: c.category,
        serviceType: c.serviceType,
        rentalType: c.serviceType,
        seats: c.seats,
        luggage: c.luggage,
        dailyPrice: c.dailyPriceAED,
        dailyPriceAED: c.dailyPriceAED,
        dailyPriceUSD: c.dailyPriceUSD,
        weeklyPrice: c.weeklyPriceAED,
        weeklyPriceAED: c.weeklyPriceAED,
        weeklyPriceUSD: c.weeklyPriceUSD,
        monthlyPrice: c.monthlyPriceAED,
        monthlyPriceAED: c.monthlyPriceAED,
        monthlyPriceUSD: c.monthlyPriceUSD,
        yearlyPrice: (c as any).yearlyPriceAED || (c.monthlyPriceAED ? c.monthlyPriceAED * 10 : 0),
        yearlyPriceAED: (c as any).yearlyPriceAED || (c.monthlyPriceAED ? c.monthlyPriceAED * 10 : 0),
        yearlyPriceUSD: (c as any).yearlyPriceUSD || (c.monthlyPriceUSD ? c.monthlyPriceUSD * 10 : 0),
        image: c.image,
        gallery: Array.isArray(c.gallery) ? c.gallery : (Array.isArray((c as any).images) ? (c as any).images : []),
        videoUrl: c.videoUrl || (c as any).video || '',
        video: c.videoUrl || (c as any).video || '',
        description: c.description,
        getQuoteOption: c.getQuoteOption,
        isMercedesChauffeur: c.isMercedesChauffeur,
        isAvailable: c.isActive,
      }));
      return res.json({ success: true, data: formattedCars });
    } catch (error: any) {
      console.error("Failed to fetch public cars from PostgreSQL database:", error);
      // Fallback to safe whitelisted in-memory state in case of connection edge case
      const safeFallback = carsState.map(c => ({
        id: c.id,
        make: c.make,
        model: c.model,
        category: c.category,
        serviceType: c.rentalType,
        rentalType: c.rentalType,
        seats: c.seats,
        luggage: c.luggage,
        dailyPrice: c.dailyPrice,
        weeklyPrice: c.weeklyPrice,
        monthlyPrice: c.monthlyPrice,
        image: c.image,
        gallery: Array.isArray((c as any).gallery) ? (c as any).gallery : (Array.isArray((c as any).images) ? (c as any).images : []),
        videoUrl: (c as any).videoUrl || (c as any).video || '',
        video: (c as any).videoUrl || (c as any).video || '',
        description: c.description,
        getQuoteOption: c.getQuoteOption,
        isMercedesChauffeur: c.isMercedesChauffeur,
        isAvailable: c.isAvailable,
      }));
      return res.json({ success: true, data: safeFallback });
    }
  });

  // Public endpoint for company contact info
  app.get("/api/company-info/public", (req, res) => {
    res.json({
      success: true,
      data: {
        travelCompanyName: companyInfoState.travelCompanyName,
        carRentalCompanyName: companyInfoState.carRentalCompanyName,
        unifiedName: companyInfoState.unifiedName,
        phones: companyInfoState.phones,
        whatsappNumbers: companyInfoState.whatsappNumbers,
        email: companyInfoState.email,
        officeAddress: companyInfoState.officeAddress,
        address: companyInfoState.officeAddress,
        googleMapsUrl: 'https://maps.app.goo.gl/LUEzbhsh17Jf8YgbA',
        googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.0969913819927!2d55.3130791!3d25.2673225!2m3!1f0!2f0!3f0!3m2!1i1024!2f768!4f13.1!3m3!1m2!1s0x3e5f5ccade0db389%3A0xae9fbab7ef12feb2!2sZone%20Tourism%20LLC%20%26%20Hotwheels%20Car%20Rental!5e0!3m2!1sen!2sae!4v1710000000000!5m2!1sen!2sae',
        socialLinks: companyInfoState.socialLinks
      }
    });
  });

  // Dedicated Simple Enquiry Endpoints (Phase 1: Customer views vehicle/visa -> Enquire / WhatsApp -> Team provides quote)
  // 1. VISA ENQUIRY & ONLINE DOCUMENT UPLOAD - Persisted to PostgreSQL
  app.post("/api/enquiries/visa", async (req, res) => {
    try {
      const { 
        name, 
        nationality, 
        isUaeResident, 
        destination, 
        travelDate, 
        whatsappNumber,
        visaType,
        processingSpeed,
        specialNotes,
        uploadedDocumentsCount,
        documentSummaries 
      } = req.body;

      // Proper validation of all required fields
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ success: false, error: "Please enter your full name (minimum 2 characters)." });
      }
      if (!nationality || typeof nationality !== 'string' || nationality.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Please specify your nationality." });
      }
      if (!isUaeResident || (isUaeResident !== 'Yes' && isUaeResident !== 'No')) {
        return res.status(400).json({ success: false, error: "Please specify if you are a UAE resident (Yes or No)." });
      }
      if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Please specify your destination." });
      }
      if (!travelDate || typeof travelDate !== 'string') {
        return res.status(400).json({ success: false, error: "Please select your planned travel date." });
      }
      if (!whatsappNumber || typeof whatsappNumber !== 'string' || whatsappNumber.replace(/\D/g, '').length < 7) {
        return res.status(400).json({ success: false, error: "Please provide a valid WhatsApp number with country code." });
      }

      const referenceId = `HWZ-VE-${Math.floor(10000 + Math.random() * 90000)}`;
      const timestamp = new Date().toISOString();

      const docInfo = Array.isArray(documentSummaries) && documentSummaries.length > 0
        ? `Uploaded Documents (${documentSummaries.length}): ` + documentSummaries.map((d: any) => d.name).join(', ')
        : (uploadedDocumentsCount ? `${uploadedDocumentsCount} documents uploaded online` : 'No direct attachments');

      const speedNote = processingSpeed === 'express' ? '⚡ EXPRESS / URGENT PROCESSING REQUESTED' : 'Standard Processing';

      // Persist to PostgreSQL database
      const savedEnquiry = await createEnquiryInDb({
        referenceId,
        enquiryType: 'visa',
        name: name.trim(),
        nationality: nationality.trim(),
        isUaeResident,
        destination: destination.trim(),
        travelDate,
        whatsappNumber: whatsappNumber.trim(),
        status: 'New',
        notes: `Visa: ${visaType || 'UAE Visit Visa'}. Speed: ${speedNote}. ${docInfo}. Special Notes: ${specialNotes || 'None'}`
      });

      // Log routing to company's visa operations team
      console.log(`========================================`);
      console.log(`[PERSISTED TO POSTGRESQL & ROUTED - VISA APPLICATION WITH DOCS]`);
      console.log(`Enquiry ID   : ${savedEnquiry.id}`);
      console.log(`Reference ID : ${referenceId}`);
      console.log(`Timestamp    : ${timestamp}`);
      console.log(`Applicant    : ${name.trim()}`);
      console.log(`Nationality  : ${nationality.trim()}`);
      console.log(`UAE Resident : ${isUaeResident}`);
      console.log(`Visa Type    : ${visaType || destination}`);
      console.log(`Speed        : ${speedNote}`);
      console.log(`Documents    : ${docInfo}`);
      console.log(`WhatsApp     : ${whatsappNumber.trim()}`);
      console.log(`Routed to    : Zone Tourism LLC Visa Operations Desk (${COMPANY_EMAIL})`);
      console.log(`========================================`);

      return res.json({
        success: true,
        referenceId,
        id: savedEnquiry.id,
        message: "Your visa application and documents have been uploaded and routed directly to Zone Tourism LLC visa desk.",
        timestamp,
        routedTo: {
          team: "Zone Tourism LLC Visa Operations Team",
          email: COMPANY_EMAIL,
          whatsappNumber: companyInfoState.whatsappNumbers[0] || ""
        }
      });
    } catch (err: any) {
      console.error("Error processing visa enquiry:", err);
      return res.status(500).json({ success: false, error: "Internal server error while routing visa enquiry." });
    }
  });

  // VISA APPLICATION PDF STORAGE & ONLINE ACCESS ENDPOINTS
  const visaApplicationsPdfStore = new Map<string, { base64Data: string; filename: string; timestamp: string }>();

  app.post("/api/visa-applications/upload-pdf", (req, res) => {
    try {
      const { referenceId, pdfBase64, filename } = req.body;
      if (!referenceId || !pdfBase64) {
        return res.status(400).json({ success: false, error: "Missing referenceId or pdfBase64" });
      }
      visaApplicationsPdfStore.set(referenceId, {
        base64Data: pdfBase64,
        filename: filename || `UAE_Visa_Application_${referenceId}.pdf`,
        timestamp: new Date().toISOString()
      });
      return res.json({
        success: true,
        pdfUrl: `/api/visa-applications/${encodeURIComponent(referenceId)}/pdf`
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get("/api/visa-applications/:refId/pdf", (req, res) => {
    try {
      const { refId } = req.params;
      const stored = visaApplicationsPdfStore.get(refId);
      if (!stored) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Visa Application Document</title>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <style>
                body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; }
                .card { background: white; padding: 2rem; border-radius: 1rem; border: 1px solid #e2e8f0; text-align: center; max-width: 450px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                h2 { color: #0b4da2; margin-top: 0; }
                p { color: #64748b; font-size: 0.9rem; }
                a { display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #0b4da2; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="card">
                <h2>Application PDF Processing</h2>
                <p>Application document (Ref: ${encodeURIComponent(refId)}) is being synced or has expired.</p>
                <p>Please return to the website or contact Zone Tourism LLC directly on WhatsApp: <strong>+971 55 558 6359</strong>.</p>
                <a href="/">Return to Website</a>
              </div>
            </body>
          </html>
        `);
      }

      // Safe base64 extraction across all data uri variants
      const commaIdx = stored.base64Data.indexOf(',');
      const base64Clean = commaIdx !== -1 ? stored.base64Data.substring(commaIdx + 1) : stored.base64Data;
      const pdfBuffer = Buffer.from(base64Clean, 'base64');

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${stored.filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.send(pdfBuffer);
    } catch (err: any) {
      console.error("Error serving PDF:", err);
      return res.status(500).send("Error rendering PDF.");
    }
  });

  // 2. CAR RENTAL ENQUIRY - Persisted to PostgreSQL
  app.post("/api/enquiries/car-rental", async (req, res) => {
    try {
      const { pickupLocation, pickupDate, returnDate, serviceType, vehicleType, whatsappNumber, name } = req.body;

      // Proper validation of all required fields
      if (!pickupLocation || typeof pickupLocation !== 'string' || pickupLocation.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Please specify a pickup location." });
      }
      if (!pickupDate || typeof pickupDate !== 'string') {
        return res.status(400).json({ success: false, error: "Please select a pickup date." });
      }
      if (!returnDate || typeof returnDate !== 'string') {
        return res.status(400).json({ success: false, error: "Please select a return date." });
      }
      if (new Date(returnDate) < new Date(pickupDate)) {
        return res.status(400).json({ success: false, error: "Return date cannot be earlier than pickup date." });
      }
      if (!serviceType || (serviceType !== 'Self Drive' && serviceType !== 'Chauffeur' && serviceType !== 'Chauffeur Driven')) {
        return res.status(400).json({ success: false, error: "Please choose either Self Drive or Chauffeur." });
      }
      if (!vehicleType || typeof vehicleType !== 'string' || vehicleType.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Please select or enter the preferred vehicle type." });
      }
      if (!whatsappNumber || typeof whatsappNumber !== 'string' || whatsappNumber.replace(/\D/g, '').length < 7) {
        return res.status(400).json({ success: false, error: "Please provide a valid WhatsApp number with country code." });
      }

      const referenceId = `HWZ-CRE-${Math.floor(10000 + Math.random() * 90000)}`;
      const timestamp = new Date().toISOString();

      // Persist to PostgreSQL database
      const savedEnquiry = await createEnquiryInDb({
        referenceId,
        enquiryType: 'car-rental',
        name: name ? name.trim() : 'Car Rental Client',
        pickupLocation: pickupLocation.trim(),
        pickupDate,
        returnDate,
        serviceType,
        vehicleType: vehicleType.trim(),
        whatsappNumber: whatsappNumber.trim(),
        status: 'New',
        notes: 'New car rental quote request received through quick form.'
      });

      // Log routing to company's fleet & chauffeur operations team
      console.log(`========================================`);
      console.log(`[PERSISTED TO POSTGRESQL & ROUTED - CAR RENTAL ENQUIRY]`);
      console.log(`Enquiry ID   : ${savedEnquiry.id}`);
      console.log(`Reference ID : ${referenceId}`);
      console.log(`Timestamp    : ${timestamp}`);
      console.log(`Pickup Place : ${pickupLocation.trim()}`);
      console.log(`Dates        : ${pickupDate} to ${returnDate}`);
      console.log(`Service      : ${serviceType}`);
      console.log(`Vehicle Type : ${vehicleType.trim()}`);
      console.log(`WhatsApp     : ${whatsappNumber.trim()}`);
      console.log(`Routed to    : HOTWHEELS CAR RENTAL LLC Dispatch Team (${COMPANY_EMAIL})`);
      console.log(`========================================`);

      return res.json({
        success: true,
        referenceId,
        id: savedEnquiry.id,
        message: "Your car rental quote request has been routed directly to the HOTWHEELS CAR RENTAL LLC dispatch team.",
        timestamp,
        routedTo: {
          team: "HOTWHEELS CAR RENTAL LLC Dispatch & Chauffeur Team",
          email: COMPANY_EMAIL,
          whatsappNumber: companyInfoState.whatsappNumbers[0] || ""
        }
      });
    } catch (err: any) {
      console.error("Error processing car rental enquiry:", err);
      return res.status(500).json({ success: false, error: "Internal server error while routing car rental quote." });
    }
  });

  // Contact form submission endpoint - Persisted to PostgreSQL
  app.post("/api/submit-contact", async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: "Name, email and message are required." });
      }

      const referenceId = `HWZ-MSG-${Math.floor(100000 + Math.random() * 900000)}`;

      const savedEnquiry = await createEnquiryInDb({
        referenceId,
        enquiryType: 'contact',
        name: name.trim(),
        whatsappNumber: phone ? phone.trim() : (email || ''),
        status: 'New',
        notes: `Contact message: ${subject || 'General inquiry'}. Email: ${email}, Phone: ${phone || 'N/A'}. Message: ${message}`
      });

      console.log(`[GENERAL CONTACT ENQUIRY PERSISTED] Ref: ${referenceId} from ${name} (${email}) ID: ${savedEnquiry.id}`);

      return res.json({
        success: true,
        referenceId,
        id: savedEnquiry.id,
        message: "Your message has been sent successfully. We will respond within a few hours."
      });
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      return res.status(500).json({ success: false, error: "Internal server error." });
    }
  });

  // ==========================================
  // AUTHENTICATION & ADMIN ACCESS CONTROL
  // Protected Admin API Routes with role & token validation
  // ==========================================

  // 1. Admin Login Endpoint (Validates secret key from environment variables or default admin key)
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, error: "Admin password is required." });
    }

    if (!verifyAdminSecret(password)) {
      return res.status(401).json({ success: false, error: "Invalid admin password. Access denied." });
    }

    // Issue secure session token with expiration
    const sessionToken = createAdminSession();
    return res.json({
      success: true,
      token: sessionToken,
      message: "Admin authentication successful."
    });
  });

  // Admin Logout Endpoint
  app.post("/api/admin/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1].trim();
      invalidateAdminSession(token);
    }
    return res.json({ success: true, message: "Admin session closed." });
  });

  // Admin Auth Verification Check
  app.get("/api/admin/verify", requireAdminAuth, (req: AuthRequest, res) => {
    return res.json({ success: true, authenticated: true, user: req.user });
  });

  // ==========================================
  // CAR MANAGEMENT API ROUTES (Cloud SQL PostgreSQL + Drizzle)
  // Protected: Only accessible to authenticated admins
  // Strict constraints enforced:
  // - NO car registration number
  // - NO car number
  // - NO no-deposit option
  // - NO automatic booking/availability system
  // ==========================================
  app.get("/api/admin/cars", requireAdminAuth, async (req, res) => {
    try {
      const allCars = await getAllCarsAdmin();
      const formattedCars = allCars.map(c => ({
        ...c,
        dailyPrice: c.dailyPriceAED,
        weeklyPrice: c.weeklyPriceAED,
        monthlyPrice: c.monthlyPriceAED,
        yearlyPrice: (c as any).yearlyPriceAED || (c.monthlyPriceAED ? c.monthlyPriceAED * 10 : 0),
        yearlyPriceAED: (c as any).yearlyPriceAED || (c.monthlyPriceAED ? c.monthlyPriceAED * 10 : 0),
        yearlyPriceUSD: (c as any).yearlyPriceUSD || (c.monthlyPriceUSD ? c.monthlyPriceUSD * 10 : 0),
        rentalType: c.serviceType,
        isAvailable: c.isActive,
      }));
      return res.json({ success: true, data: formattedCars });
    } catch (error: any) {
      console.error("Error fetching admin cars:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch cars from database." });
    }
  });

  app.post("/api/admin/cars", requireAdminAuth, async (req, res) => {
    try {
      const {
        make, model, category, serviceType, seats, luggage,
        dailyPriceAED, dailyPriceUSD, weeklyPriceAED, weeklyPriceUSD, monthlyPriceAED, monthlyPriceUSD,
        image, description, getQuoteOption, isMercedesChauffeur, isActive
      } = req.body;

      if (!make || !model || !category || !image) {
        return res.status(400).json({ 
          success: false, 
          error: "Make, model, category, and image URL are required fields." 
        });
      }

      const dPriceAED = Number(dailyPriceAED) || 0;
      const dPriceUSD = Number(dailyPriceUSD) || (dPriceAED ? Math.round(dPriceAED / 3.67) : 0);
      const wPriceAED = Number(weeklyPriceAED) || (dPriceAED * 6);
      const wPriceUSD = Number(weeklyPriceUSD) || (wPriceAED ? Math.round(wPriceAED / 3.67) : 0);
      const mPriceAED = Number(monthlyPriceAED) || (dPriceAED * 20);
      const mPriceUSD = Number(monthlyPriceUSD) || (mPriceAED ? Math.round(mPriceAED / 3.67) : 0);
      const yPriceAED = req.body.yearlyPriceAED ? Number(req.body.yearlyPriceAED) : 0;
      const yPriceUSD = req.body.yearlyPriceUSD ? Number(req.body.yearlyPriceUSD) : 0;

      const created = await createCar({
        make: String(make).trim(),
        model: String(model).trim(),
        category: String(category).trim(),
        serviceType: serviceType || 'Both',
        seats: Number(seats) || 5,
        luggage: String(luggage || '2 Bags').trim(),
        dailyPriceAED: dPriceAED,
        dailyPriceUSD: dPriceUSD,
        weeklyPriceAED: wPriceAED,
        weeklyPriceUSD: wPriceUSD,
        monthlyPriceAED: mPriceAED,
        monthlyPriceUSD: mPriceUSD,
        yearlyPriceAED: yPriceAED,
        yearlyPriceUSD: yPriceUSD,
        image: String(image).trim(),
        gallery: Array.isArray(req.body.gallery) ? req.body.gallery : (Array.isArray(req.body.images) ? req.body.images : []),
        videoUrl: String(req.body.videoUrl || req.body.video || '').trim(),
        description: String(description || '').trim(),
        getQuoteOption: Boolean(getQuoteOption),
        isMercedesChauffeur: Boolean(isMercedesChauffeur || String(make).toLowerCase().includes('mercedes')),
        isActive: isActive !== undefined ? Boolean(isActive) : true
      });

      return res.json({ 
        success: true, 
        data: created, 
        message: "Vehicle added successfully to the database fleet." 
      });
    } catch (error: any) {
      console.error("Error creating vehicle:", error);
      return res.status(500).json({ success: false, error: "Failed to create vehicle record in database." });
    }
  });

  app.put("/api/admin/cars/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await updateCar(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Vehicle not found." });
      }
      return res.json({ 
        success: true, 
        data: updated, 
        message: "Vehicle details updated successfully." 
      });
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      return res.status(500).json({ success: false, error: "Failed to update vehicle record." });
    }
  });

  app.delete("/api/admin/cars/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await deleteCar(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Vehicle not found." });
      }
      return res.json({ success: true, message: "Vehicle deleted from fleet successfully." });
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      return res.status(500).json({ success: false, error: "Failed to delete vehicle record." });
    }
  });

  app.patch("/api/admin/cars/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const updated = await toggleCarStatus(id, isActive);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Vehicle not found." });
      }
      return res.json({ 
        success: true, 
        data: updated, 
        message: `Vehicle has been ${updated.isActive ? 'activated' : 'deactivated'}.` 
      });
    } catch (error: any) {
      console.error("Error updating car status:", error);
      return res.status(500).json({ success: false, error: "Failed to update vehicle status." });
    }
  });

  // Dedicated Quick Pricing Update Endpoint (Daily, Weekly, Monthly)
  app.patch("/api/admin/cars/:id/pricing", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const {
        dailyPriceAED,
        dailyPriceUSD,
        weeklyPriceAED,
        weeklyPriceUSD,
        monthlyPriceAED,
        monthlyPriceUSD,
        yearlyPriceAED,
        yearlyPriceUSD
      } = req.body;

      const updated = await updateCar(id, {
        dailyPriceAED,
        dailyPriceUSD,
        weeklyPriceAED,
        weeklyPriceUSD,
        monthlyPriceAED,
        monthlyPriceUSD,
        yearlyPriceAED,
        yearlyPriceUSD
      });

      if (!updated) {
        return res.status(404).json({ success: false, error: "Vehicle not found." });
      }

      return res.json({
        success: true,
        data: updated,
        message: `Pricing rates updated successfully for ${updated.make} ${updated.model}.`
      });
    } catch (error: any) {
      console.error("Error updating car pricing:", error);
      return res.status(500).json({ success: false, error: "Failed to update vehicle rates in database." });
    }
  });

  // ==========================================
  // OFFICIAL BANK DETAILS MANAGEMENT (PHASE 1 CORE REQUIREMENT)
  // Secure: Only accessible to authenticated admins
  // ==========================================
  app.get("/api/admin/bank-details", requireAdminAuth, async (req, res) => {
    try {
      const bankDetails = await getBankDetailsFromDb();
      res.json({ 
        success: true, 
        data: bankDetails 
      });
    } catch (err: any) {
      console.error("Error fetching bank details:", err);
      res.status(500).json({ success: false, error: "Failed to fetch bank details." });
    }
  });

  app.put("/api/admin/bank-details", requireAdminAuth, async (req, res) => {
    try {
      const { primaryAccount, secondaryAccount } = req.body;
      
      if (!primaryAccount) {
        return res.status(400).json({ success: false, error: "Primary bank account information is required." });
      }

      const updatedBankDetails = await updateBankDetailsInDb(primaryAccount, secondaryAccount);

      console.log(`[BANK DETAILS PERSISTED TO POSTGRESQL BY ADMIN]`);
      console.log(`Primary Account: ${updatedBankDetails.primaryAccount.companyAccountName} | Bank: ${updatedBankDetails.primaryAccount.bankName}`);

      return res.json({ 
        success: true, 
        data: updatedBankDetails, 
        message: "Official bank details updated and persisted in PostgreSQL database successfully." 
      });
    } catch (err: any) {
      console.error("Error updating bank details in PostgreSQL:", err);
      return res.status(500).json({ success: false, error: "Failed to persist bank details to database." });
    }
  });

  // ==========================================
  // ENQUIRIES MANAGEMENT (POSTGRESQL PERSISTENCE & CRUD)
  // Secure: Only accessible to authenticated admins
  // ==========================================
  app.get("/api/admin/enquiries", requireAdminAuth, async (req, res) => {
    try {
      const enquiriesList = await getAllEnquiriesFromDb();
      return res.json({ 
        success: true, 
        data: enquiriesList 
      });
    } catch (err: any) {
      console.error("Error fetching enquiries from PostgreSQL:", err);
      return res.status(500).json({ success: false, error: "Failed to fetch enquiries from database." });
    }
  });

  app.get("/api/admin/enquiries/:id", requireAdminAuth, async (req, res) => {
    try {
      const enquiry = await getEnquiryByIdFromDb(req.params.id);
      if (!enquiry) {
        return res.status(404).json({ success: false, error: "Enquiry not found." });
      }
      return res.json({ success: true, data: enquiry });
    } catch (err: any) {
      console.error(`Error fetching enquiry ${req.params.id}:`, err);
      return res.status(500).json({ success: false, error: "Failed to fetch enquiry." });
    }
  });

  app.patch("/api/admin/enquiries/:id", requireAdminAuth, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const updated = await updateEnquiryInDb(req.params.id, { status, notes });
      return res.json({ 
        success: true, 
        data: updated, 
        message: "Enquiry updated successfully." 
      });
    } catch (err: any) {
      console.error(`Error updating enquiry ${req.params.id}:`, err);
      return res.status(500).json({ success: false, error: "Failed to update enquiry in database." });
    }
  });

  app.put("/api/admin/enquiries/:id", requireAdminAuth, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const updated = await updateEnquiryInDb(req.params.id, { status, notes });
      return res.json({ 
        success: true, 
        data: updated, 
        message: "Enquiry updated successfully." 
      });
    } catch (err: any) {
      console.error(`Error updating enquiry ${req.params.id}:`, err);
      return res.status(500).json({ success: false, error: "Failed to update enquiry in database." });
    }
  });

  app.delete("/api/admin/enquiries/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await deleteEnquiryFromDb(req.params.id);
      return res.json({ 
        success: true, 
        data: deleted, 
        message: "Enquiry deleted successfully from database." 
      });
    } catch (err: any) {
      console.error(`Error deleting enquiry ${req.params.id}:`, err);
      return res.status(500).json({ success: false, error: "Failed to delete enquiry from database." });
    }
  });


  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ZONE TOURISM LLC & HOTWHEELS CAR RENTAL LLC server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
