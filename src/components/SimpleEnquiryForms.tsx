import React, { useState, useEffect } from 'react';
import { COMPANY_CONFIG } from '../data/travelData';
import { VisaEnquiryPayload, CarRentalEnquiryPayload, EnquirySubmissionResult } from '../types';
import { 
  formatVisaEnquiryWhatsApp, 
  formatCarRentalEnquiryWhatsApp, 
  buildWhatsAppLink, 
  openWhatsAppDirectly, 
  PRIMARY_WHATSAPP_NUMBER 
} from '../utils/whatsapp';
import { 
  downloadVisaApplicationPdf, 
  VisaApplicationPdfData 
} from '../utils/visaPdfGenerator';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  MessageSquare, 
  FileText, 
  Car, 
  Calendar, 
  MapPin, 
  User, 
  Globe, 
  Phone, 
  RefreshCw,
  Check,
  Compass,
  ArrowRight,
  Upload,
  FileCheck,
  Download,
  X,
  File,
  Copy,
  ExternalLink
} from 'lucide-react';
import { WhatsAppOfficialIcon } from './WhatsAppFloat';

// Suggestions for fast mobile tapping
const POPULAR_NATIONALITIES = [
  'United Arab Emirates', 'India', 'Pakistan', 'United Kingdom', 'Philippines', 
  'United States', 'Russia', 'Saudi Arabia', 'Egypt', 'Canada', 
  'Australia', 'Germany', 'France', 'China', 'Nigeria', 'Bangladesh', 'Other'
];

const POPULAR_DESTINATIONS = [
  'Dubai', 'Abu Dhabi', 'Sharjah', 'United Arab Emirates', 'Schengen Area', 
  'United Kingdom', 'United States', 'China', 'Saudi Arabia', 'Qatar', 'Oman'
];

const PICKUP_LOCATIONS = [
  'Dubai International Airport (DXB) - Terminal 1',
  'Dubai International Airport (DXB) - Terminal 2',
  'Dubai International Airport (DXB) - Terminal 3',
  'Al Maktoum International Airport (DWC)',
  'Downtown Dubai / Burj Khalifa',
  'Dubai Marina / JBR',
  'Business Bay',
  'Hotel / Doorstep Delivery',
  'Hotwheels Car Rental Main Office'
];

const VEHICLE_TYPES = [
  'Sedan',
  'SUV',
  'Luxury',
  '7-Seater / MPV'
];

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/* =========================================================================
   1. VISA ENQUIRY FORM
   Client-Specified Fields:
   - Name
   - Nationality
   - UAE Resident — Yes / No
   - Destination
   - Travel Date
   - WhatsApp Number
   Button: Submit Enquiry
   ========================================================================= */
export interface VisaEnquiryFormProps {
  onSuccess?: (result: EnquirySubmissionResult) => void;
  className?: string;
  defaultDestination?: string;
  initialDestination?: string;
}

export const VisaEnquiryForm: React.FC<VisaEnquiryFormProps> = ({
  onSuccess,
  className = '',
  defaultDestination,
  initialDestination
}) => {
  const [formData, setFormData] = useState<VisaEnquiryPayload>({
    name: '',
    nationality: '',
    isUaeResident: 'No',
    destination: initialDestination || defaultDestination || '',
    travelDate: '',
    whatsappNumber: ''
  });

  // Optional Documents State for Simple Form
  const [passportCopy, setPassportCopy] = useState<{ name: string; size: number; type: string; dataUrl?: string } | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<{ name: string; size: number; type: string; dataUrl?: string } | null>(null);
  const passportCopyInputRef = React.useRef<HTMLInputElement>(null);
  const passportPhotoInputRef = React.useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Partial<Record<keyof VisaEnquiryPayload, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<EnquirySubmissionResult | null>(null);
  const [submittedPdfPayload, setSubmittedPdfPayload] = useState<VisaApplicationPdfData | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'passport' | 'photo'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string | undefined;
      if (type === 'passport') {
        setPassportCopy({
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl
        });
      } else {
        setPassportPhoto({
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl
        });
      }
    };
    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      if (type === 'passport') {
        setPassportCopy({ name: file.name, size: file.size, type: file.type });
      } else {
        setPassportPhoto({ name: file.name, size: file.size, type: file.type });
      }
    }
    e.target.value = '';
  };

  // Synchronize initialDestination when prop changes
  useEffect(() => {
    if (initialDestination) {
      setFormData(prev => ({ ...prev, destination: initialDestination }));
    }
  }, [initialDestination]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof VisaEnquiryPayload, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Please specify your nationality.';
    }

    if (!formData.isUaeResident) {
      newErrors.isUaeResident = 'Please select Yes or No.';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Please enter your travel destination.';
    }

    if (!formData.travelDate) {
      newErrors.travelDate = 'Please select your planned travel date.';
    }

    const cleanPhone = formData.whatsappNumber.replace(/\D/g, '');
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'Please enter your WhatsApp number.';
    } else if (cleanPhone.length < 7) {
      newErrors.whatsappNumber = 'Please enter a valid phone number with country code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getUploadedDocsList = () => {
    const list: string[] = [];
    if (passportCopy) list.push(`Passport Copy: ${passportCopy.name}`);
    if (passportPhoto) list.push(`Passport Photo: ${passportPhoto.name}`);
    return list;
  };

  const buildWhatsAppUrl = (refId: string) => {
    const docs = getUploadedDocsList();
    const message = formatVisaEnquiryWhatsApp({
      name: formData.name,
      nationality: formData.nationality,
      isUaeResident: formData.isUaeResident,
      destination: formData.destination,
      travelDate: formData.travelDate,
      whatsappNumber: formData.whatsappNumber,
      referenceId: refId,
      uploadedDocuments: docs
    });
    return buildWhatsAppLink(message, COMPANY_CONFIG.whatsappNumber || PRIMARY_WHATSAPP_NUMBER);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    const refId = `HWZ-VISA-${Math.floor(10000 + Math.random() * 90000)}`;
    const docsList = getUploadedDocsList();

    const pdfPayload: VisaApplicationPdfData = {
      referenceId: refId,
      name: formData.name.trim(),
      nationality: formData.nationality.trim(),
      isUaeResident: formData.isUaeResident,
      destination: formData.destination.trim(),
      visaType: 'Visa Enquiry & Verification',
      travelDate: formData.travelDate,
      whatsappNumber: formData.whatsappNumber.trim(),
      uploadedDocuments: docsList,
      passportCopy: passportCopy ? {
        name: passportCopy.name,
        category: 'Passport Copy (Bio Page)',
        dataUrl: passportCopy.dataUrl,
        type: passportCopy.type
      } : null,
      passportPhoto: passportPhoto ? {
        name: passportPhoto.name,
        category: 'Passport Size Photograph',
        dataUrl: passportPhoto.dataUrl,
        type: passportPhoto.type
      } : null,
      additionalFiles: []
    };

    setSubmittedPdfPayload(pdfPayload);

    // 1. Auto-generate and download official PDF document
    try {
      downloadVisaApplicationPdf(pdfPayload);
    } catch (pdfErr) {
      console.warn('PDF download notice:', pdfErr);
    }

    // 2. Open WhatsApp immediately with complete text data
    const waMsg = formatVisaEnquiryWhatsApp({
      name: formData.name,
      nationality: formData.nationality,
      isUaeResident: formData.isUaeResident,
      destination: formData.destination,
      travelDate: formData.travelDate,
      whatsappNumber: formData.whatsappNumber,
      referenceId: refId,
      uploadedDocuments: docsList
    });
    openWhatsAppDirectly(waMsg, COMPANY_CONFIG.whatsappNumber || PRIMARY_WHATSAPP_NUMBER);

    try {
      const response = await fetch('/api/enquiries/visa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          referenceId: refId,
          uploadedDocuments: docsList,
          hasDocuments: docsList.length > 0
        })
      });

      const data = await response.json();

      const result: EnquirySubmissionResult = {
        success: true,
        referenceId: refId,
        message: data.message || 'Visa enquiry submitted successfully',
        timestamp: new Date().toISOString(),
        routedTo: {
          team: 'Zone Tourism LLC Visa Operations Team',
          email: COMPANY_CONFIG.email,
          whatsappNumber: COMPANY_CONFIG.whatsappNumber || PRIMARY_WHATSAPP_NUMBER
        }
      };

      setSubmissionResult(result);
      if (onSuccess) onSuccess(result);
    } catch (err: any) {
      // Even if network background logging encounters an issue, the client-side PDF and WhatsApp already fired
      const result: EnquirySubmissionResult = {
        success: true,
        referenceId: refId,
        message: 'Visa enquiry processed',
        timestamp: new Date().toISOString(),
        routedTo: {
          team: 'Zone Tourism LLC Visa Operations Team',
          email: COMPANY_CONFIG.email,
          whatsappNumber: COMPANY_CONFIG.whatsappNumber || PRIMARY_WHATSAPP_NUMBER
        }
      };
      setSubmissionResult(result);
      if (onSuccess) onSuccess(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdfAgain = () => {
    if (submittedPdfPayload) {
      downloadVisaApplicationPdf(submittedPdfPayload);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      nationality: '',
      isUaeResident: 'No',
      destination: initialDestination || defaultDestination || '',
      travelDate: '',
      whatsappNumber: ''
    });
    setPassportCopy(null);
    setPassportPhoto(null);
    setErrors({});
    setServerError(null);
    setSubmissionResult(null);
    setSubmittedPdfPayload(null);
  };

  // SUCCESS VIEW
  if (submissionResult) {
    const waUrl = buildWhatsAppUrl(submissionResult.referenceId);

    return (
      <div id="visa-enquiry-success" className={`p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-6 ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F7FA] text-[#0A2540] text-xs font-bold uppercase tracking-wider border border-slate-200">
            <span>Reference ID:</span>
            <span className="font-mono text-[#0B4DA2] font-black">{submissionResult.referenceId}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0A2540]">
            Application PDF Downloaded & WhatsApp Ready!
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your official application PDF document has been downloaded to your device, and WhatsApp has been opened with your full details.
          </p>
        </div>

        {/* Structured Summary Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-700">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Name</span>
              <span className="font-semibold text-[#0A2540]">{formData.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Nationality</span>
              <span className="font-semibold text-[#0A2540]">{formData.nationality}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">UAE Resident</span>
              <span className="font-semibold text-[#0A2540]">{formData.isUaeResident}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination</span>
              <span className="font-semibold text-[#0A2540]">{formData.destination}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Travel Date</span>
              <span className="font-semibold text-[#0A2540]">{formData.travelDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp Number</span>
              <span className="font-semibold text-[#0A2540]">{formData.whatsappNumber}</span>
            </div>
          </div>
          {getUploadedDocsList().length > 0 && (
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Attached Documents ({getUploadedDocsList().length})</span>
              <div className="space-y-0.5 text-[11px] font-medium text-emerald-800">
                {getUploadedDocsList().map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dual Actions: Download PDF Again + WhatsApp */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPdfAgain}
              className="w-full py-3 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs min-h-[44px]"
            >
              <Download className="w-4 h-4 text-[#0B4DA2]" />
              <span>Download PDF Again</span>
            </button>

            <a
              id="visa-whatsapp-continue-btn"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <WhatsAppOfficialIcon className="w-4 h-4 fill-current shrink-0" />
              <span>Open WhatsApp Chat</span>
            </a>
          </div>

          <button
            id="visa-submit-another-btn"
            type="button"
            onClick={handleReset}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#0A2540] hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Submit Another Application / Enquiry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form id="visa-enquiry-form" onSubmit={handleSubmit} className={`space-y-4 ${className}`} noValidate>
      {/* Error state */}
      {serverError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Submission Failed</p>
            <p className="mt-0.5 text-rose-700">{serverError}</p>
          </div>
        </div>
      )}

      {/* 1. Name */}
      <div>
        <label htmlFor="visa-field-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="visa-field-name"
            type="text"
            required
            disabled={isLoading}
            placeholder="Your Full Name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.name 
                ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400 text-rose-900' 
                : 'border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20 text-slate-900'
            }`}
          />
        </div>
        {errors.name && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.name}</p>}
      </div>

      {/* 2. Nationality */}
      <div>
        <label htmlFor="visa-field-nationality" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Nationality <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="visa-field-nationality"
            type="text"
            list="visa-nationality-suggestions"
            required
            disabled={isLoading}
            placeholder="Select or enter your nationality"
            value={formData.nationality}
            onChange={(e) => {
              setFormData({ ...formData, nationality: e.target.value });
              if (errors.nationality) setErrors({ ...errors, nationality: undefined });
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.nationality 
                ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400 text-rose-900' 
                : 'border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20 text-slate-900'
            }`}
          />
          <datalist id="visa-nationality-suggestions">
            {POPULAR_NATIONALITIES.map(n => <option key={n} value={n} />)}
          </datalist>
        </div>
        {errors.nationality && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.nationality}</p>}
      </div>

      {/* 3. UAE Resident — Yes / No */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          UAE Resident <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            id="visa-uae-resident-yes"
            type="button"
            disabled={isLoading}
            onClick={() => {
              setFormData({ ...formData, isUaeResident: 'Yes' });
              if (errors.isUaeResident) setErrors({ ...errors, isUaeResident: undefined });
            }}
            className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
              formData.isUaeResident === 'Yes'
                ? 'border-[#0B4DA2] bg-[#0B4DA2] text-white shadow-xs'
                : 'border-slate-200 bg-[#F5F7FA] text-slate-700 hover:bg-slate-100'
            }`}
          >
            {formData.isUaeResident === 'Yes' && <Check className="w-3.5 h-3.5" />}
            <span>Yes</span>
          </button>
          <button
            id="visa-uae-resident-no"
            type="button"
            disabled={isLoading}
            onClick={() => {
              setFormData({ ...formData, isUaeResident: 'No' });
              if (errors.isUaeResident) setErrors({ ...errors, isUaeResident: undefined });
            }}
            className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
              formData.isUaeResident === 'No'
                ? 'border-[#0B4DA2] bg-[#0B4DA2] text-white shadow-xs'
                : 'border-slate-200 bg-[#F5F7FA] text-slate-700 hover:bg-slate-100'
            }`}
          >
            {formData.isUaeResident === 'No' && <Check className="w-3.5 h-3.5" />}
            <span>No</span>
          </button>
        </div>
        {errors.isUaeResident && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.isUaeResident}</p>}
      </div>

      {/* 4. Destination */}
      <div>
        <label htmlFor="visa-field-destination" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Destination <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="visa-field-destination"
            type="text"
            list="visa-destination-suggestions"
            required
            disabled={isLoading}
            placeholder="e.g. Dubai, United Arab Emirates"
            value={formData.destination}
            onChange={(e) => {
              setFormData({ ...formData, destination: e.target.value });
              if (errors.destination) setErrors({ ...errors, destination: undefined });
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.destination 
                ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400 text-rose-900' 
                : 'border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20 text-slate-900'
            }`}
          />
          <datalist id="visa-destination-suggestions">
            {POPULAR_DESTINATIONS.map(d => <option key={d} value={d} />)}
          </datalist>
        </div>
        {errors.destination && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.destination}</p>}
      </div>

      {/* 5. Travel Date */}
      <div>
        <label htmlFor="visa-field-travel-date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Travel Date <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            id="visa-field-travel-date"
            type="date"
            required
            disabled={isLoading}
            min={getTodayDateString()}
            value={formData.travelDate}
            onChange={(e) => {
              setFormData({ ...formData, travelDate: e.target.value });
              if (errors.travelDate) setErrors({ ...errors, travelDate: undefined });
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 min-h-[44px] cursor-pointer ${
              errors.travelDate 
                ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400 text-rose-900' 
                : 'border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20 text-slate-900'
            }`}
          />
        </div>
        {errors.travelDate && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.travelDate}</p>}
      </div>

      {/* 6. WhatsApp Number */}
      <div>
        <label htmlFor="visa-field-whatsapp" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          WhatsApp Number <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="visa-field-whatsapp"
            type="tel"
            required
            disabled={isLoading}
            
            value={formData.whatsappNumber}
            onChange={(e) => {
              setFormData({ ...formData, whatsappNumber: e.target.value });
              if (errors.whatsappNumber) setErrors({ ...errors, whatsappNumber: undefined });
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.whatsappNumber 
                ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400 text-rose-900' 
                : 'border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20 text-slate-900'
            }`}
          />
        </div>
        {errors.whatsappNumber ? (
          <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.whatsappNumber}</p>
        ) : (
          <p className="text-[11px] text-slate-500 mt-1">Include country code for rapid WhatsApp updates.</p>
        )}
      </div>

      {/* 7. Optional Documents Attachment (Auto-embedded into generated PDF) */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Attach Documents (Optional)
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            Embeds in PDF & WhatsApp
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Passport Copy */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0A2540]">Passport Copy</span>
              <span className="text-[10px] font-semibold text-slate-400">Bio-data page</span>
            </div>

            <input
              type="file"
              ref={passportCopyInputRef}
              onChange={(e) => handleDocumentChange(e, 'passport')}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
            />

            {passportCopy ? (
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-emerald-900 truncate">{passportCopy.name}</p>
                    <p className="text-[9px] text-emerald-600">{formatFileSize(passportCopy.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPassportCopy(null)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => passportCopyInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-lg border border-dashed border-slate-300 hover:border-[#0B4DA2] bg-white text-slate-600 hover:text-[#0B4DA2] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Passport</span>
              </button>
            )}
          </div>

          {/* Passport Photo */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0A2540]">Photograph</span>
              <span className="text-[10px] font-semibold text-slate-400">White background</span>
            </div>

            <input
              type="file"
              ref={passportPhotoInputRef}
              onChange={(e) => handleDocumentChange(e, 'photo')}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
            />

            {passportPhoto ? (
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-emerald-900 truncate">{passportPhoto.name}</p>
                    <p className="text-[9px] text-emerald-600">{formatFileSize(passportPhoto.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPassportPhoto(null)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => passportPhotoInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-lg border border-dashed border-slate-300 hover:border-[#0B4DA2] bg-white text-slate-600 hover:text-[#0B4DA2] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Enquiry Button */}
      <div className="pt-2">
        <button
          id="visa-submit-enquiry-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] active:bg-[#062c5e] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating PDF & Opening WhatsApp...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PDF & Open WhatsApp</span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Generates official application PDF for your records and automatically opens WhatsApp with all details.
        </p>
      </div>
    </form>
  );
};


/* =========================================================================
   2. CAR RENTAL ENQUIRY FORM
   Client-Specified Fields:
   - Pickup Location
   - Pickup Date
   - Return Date
   - Self Drive / Chauffeur
   - Vehicle Type
   - WhatsApp Number
   Button: Submit Enquiry
   ========================================================================= */
export interface CarRentalEnquiryFormProps {
  onSuccess?: (result: EnquirySubmissionResult) => void;
  className?: string;
  defaultServiceType?: 'Self Drive' | 'Chauffeur';
  defaultVehicleType?: string;
  initialVehicleType?: string;
}

export const CarRentalEnquiryForm: React.FC<CarRentalEnquiryFormProps> = ({
  onSuccess,
  className = '',
  defaultServiceType = 'Self Drive',
  defaultVehicleType = '',
  initialVehicleType
}) => {
  const [formData, setFormData] = useState<CarRentalEnquiryPayload>({
    customerName: '',
    pickupLocation: '',
    pickupDate: '',
    returnDate: '',
    serviceType: defaultServiceType,
    vehicleType: initialVehicleType || defaultVehicleType || 'Sedan',
    whatsappNumber: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CarRentalEnquiryPayload, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Synchronize when initialVehicleType prop changes
  useEffect(() => {
    if (initialVehicleType) {
      setFormData(prev => ({ ...prev, vehicleType: initialVehicleType }));
    }
  }, [initialVehicleType]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CarRentalEnquiryPayload, string>> = {};

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Please specify a pickup location.';
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Please select a pickup date.';
    }

    if (!formData.returnDate) {
      newErrors.returnDate = 'Please select a return date.';
    } else if (formData.pickupDate && new Date(formData.returnDate) < new Date(formData.pickupDate)) {
      newErrors.returnDate = 'Return date cannot be earlier than pickup date.';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select Self Drive or Chauffeur.';
    }

    if (!formData.vehicleType.trim()) {
      newErrors.vehicleType = 'Please select a vehicle type.';
    }

    const cleanPhone = formData.whatsappNumber.replace(/\D/g, '');
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'Please enter your WhatsApp number.';
    } else if (cleanPhone.length < 7) {
      newErrors.whatsappNumber = 'Please enter a valid phone number with country code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPrimaryWhatsAppNumber = () => {
    return COMPANY_CONFIG.entities?.hotwheels?.whatsapp || COMPANY_CONFIG.whatsappNumber || '923315424466';
  };

  const getUaeWhatsAppNumber = () => {
    return COMPANY_CONFIG.whatsappNumber || '971555586359';
  };

  const formatMessageForRef = (refId: string) => {
    return formatCarRentalEnquiryWhatsApp({
      pickupLocation: formData.pickupLocation,
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate,
      serviceType: formData.serviceType,
      vehicleType: formData.vehicleType,
      whatsappNumber: formData.whatsappNumber,
      customerName: formData.customerName,
      referenceId: refId
    });
  };

  const buildWhatsAppUrl = (refId: string, destNumber = getPrimaryWhatsAppNumber()) => {
    const message = formatMessageForRef(refId);
    return buildWhatsAppLink(message, destNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    const refId = `HWZ-CR-${Math.floor(10000 + Math.random() * 90000)}`;
    const primaryNumber = getPrimaryWhatsAppNumber();

    // 1. Build complete formatted WhatsApp message containing all car inquiry data
    const waMsg = formatMessageForRef(refId);
    const waUrl = buildWhatsAppUrl(refId, primaryNumber);

    // 2. CRITICAL: Trigger opening WhatsApp synchronously within user submit gesture!
    // This executes before any asynchronous fetch await, bypassing browser popup blocker restrictions.
    openWhatsAppDirectly(waMsg, primaryNumber);

    if (onSuccess) {
      onSuccess({
        success: true,
        referenceId: refId,
        message: 'Car rental quote request received successfully',
        timestamp: new Date().toISOString(),
        routedTo: {
          team: 'Hotwheels Car Rental Dispatch & Operations Team',
          email: COMPANY_CONFIG.email,
          whatsappNumber: primaryNumber
        }
      });
    }

    // 3. Persist enquiry to PostgreSQL database asynchronously in the background
    setIsLoading(true);
    try {
      const response = await fetch('/api/enquiries/car-rental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.customerName || 'Car Rental Client',
          referenceId: refId
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        console.warn('Backend persistence notice:', data.error);
      }
    } catch (err: any) {
      console.warn('Background car rental sync notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      customerName: '',
      pickupLocation: '',
      pickupDate: '',
      returnDate: '',
      serviceType: defaultServiceType,
      vehicleType: initialVehicleType || defaultVehicleType || 'Sedan',
      whatsappNumber: ''
    });
    setErrors({});
    setServerError(null);
  };

  return (
    <form id="car-rental-enquiry-form" onSubmit={handleSubmit} className={`space-y-4 ${className}`} noValidate>
      {/* Error state */}
      {serverError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Submission Failed</p>
            <p className="mt-0.5 text-rose-700">{serverError}</p>
          </div>
        </div>
      )}

      {/* Optional: Customer Full Name */}
      <div>
        <label htmlFor="car-field-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Your Name <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="car-field-name"
            type="text"
            disabled={isLoading}
            placeholder="e.g. John Doe / Ali Khan"
            value={formData.customerName || ''}
            onChange={(e) => {
              setFormData({ ...formData, customerName: e.target.value });
            }}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 text-slate-900 text-sm transition-all focus:outline-none min-h-[44px]"
          />
        </div>
      </div>

      {/* 1. Pickup Location */}
      <div>
        <label htmlFor="car-field-pickup-location" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Pickup Location <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="car-field-pickup-location"
            type="text"
            list="car-pickup-location-suggestions"
            required
            disabled={isLoading}
            placeholder="e.g. Dubai International Airport (DXB) or Hotel"
            value={formData.pickupLocation}
            onChange={(e) => {
              setFormData({ ...formData, pickupLocation: e.target.value });
              if (errors.pickupLocation) setErrors({ ...errors, pickupLocation: undefined });
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.pickupLocation 
                ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400 text-rose-900' 
                : 'border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20 text-slate-900'
            }`}
          />
          <datalist id="car-pickup-location-suggestions">
            {PICKUP_LOCATIONS.map(loc => <option key={loc} value={loc} />)}
          </datalist>
        </div>
        {errors.pickupLocation && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.pickupLocation}</p>}
      </div>

      {/* 2 & 3. Pickup Date & Return Date (Default native browser calendar with past dates disabled) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="car-field-pickup-date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Pickup Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="car-field-pickup-date"
              type="date"
              required
              disabled={isLoading}
              min={getTodayDateString()}
              value={formData.pickupDate}
              onChange={(e) => {
                const val = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  pickupDate: val,
                  returnDate: prev.returnDate && prev.returnDate < val ? val : prev.returnDate
                }));
                if (errors.pickupDate) setErrors({ ...errors, pickupDate: undefined });
              }}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 min-h-[44px] cursor-pointer ${
                errors.pickupDate 
                  ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400 text-rose-900' 
                  : 'border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20 text-slate-900'
              }`}
            />
          </div>
          {errors.pickupDate && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.pickupDate}</p>}
        </div>

        <div>
          <label htmlFor="car-field-return-date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Return Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="car-field-return-date"
              type="date"
              required
              disabled={isLoading}
              min={formData.pickupDate || getTodayDateString()}
              value={formData.returnDate}
              onChange={(e) => {
                setFormData({ ...formData, returnDate: e.target.value });
                if (errors.returnDate) setErrors({ ...errors, returnDate: undefined });
              }}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 min-h-[44px] cursor-pointer ${
                errors.returnDate 
                  ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400 text-rose-900' 
                  : 'border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20 text-slate-900'
              }`}
            />
          </div>
          {errors.returnDate && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.returnDate}</p>}
        </div>
      </div>

      {/* 4. Self Drive / Chauffeur */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Self Drive / Chauffeur <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            id="car-service-self-drive"
            type="button"
            disabled={isLoading}
            onClick={() => {
              setFormData({ ...formData, serviceType: 'Self Drive' });
              if (errors.serviceType) setErrors({ ...errors, serviceType: undefined });
            }}
            className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
              formData.serviceType === 'Self Drive'
                ? 'border-[#0B4DA2] bg-[#0B4DA2] text-white shadow-xs'
                : 'border-slate-200 bg-[#F5F7FA] text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Self Drive</span>
          </button>
          <button
            id="car-service-chauffeur"
            type="button"
            disabled={isLoading}
            onClick={() => {
              setFormData({ ...formData, serviceType: 'Chauffeur' });
              if (errors.serviceType) setErrors({ ...errors, serviceType: undefined });
            }}
            className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
              formData.serviceType === 'Chauffeur'
                ? 'border-[#0B4DA2] bg-[#0B4DA2] text-white shadow-xs'
                : 'border-slate-200 bg-[#F5F7FA] text-slate-700 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Chauffeur Driven</span>
          </button>
        </div>
        {errors.serviceType && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.serviceType}</p>}
      </div>

      {/* 5. Vehicle Type */}
      <div>
        <label htmlFor="car-field-vehicle-type" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Vehicle Type <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            id="car-field-vehicle-type"
            required
            disabled={isLoading}
            value={formData.vehicleType}
            onChange={(e) => {
              setFormData({ ...formData, vehicleType: e.target.value });
              if (errors.vehicleType) setErrors({ ...errors, vehicleType: undefined });
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-white min-h-[44px] ${
              errors.vehicleType 
                ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400 text-rose-900' 
                : 'border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20 text-slate-900'
            }`}
          >
            <option value="" disabled>Select Vehicle Type</option>
            {formData.vehicleType && !VEHICLE_TYPES.includes(formData.vehicleType) && (
              <option value={formData.vehicleType}>{formData.vehicleType}</option>
            )}
            {VEHICLE_TYPES.map(vt => (
              <option key={vt} value={vt}>{vt}</option>
            ))}
          </select>
        </div>
        {errors.vehicleType && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.vehicleType}</p>}
      </div>

      {/* 6. WhatsApp Number */}
      <div>
        <label htmlFor="car-field-whatsapp" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          WhatsApp Number <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="car-field-whatsapp"
            type="tel"
            required
            disabled={isLoading}
            placeholder="e.g. +971 50 123 4567 or 0331 5424466"
            value={formData.whatsappNumber}
            onChange={(e) => {
              setFormData({ ...formData, whatsappNumber: e.target.value });
              if (errors.whatsappNumber) setErrors({ ...errors, whatsappNumber: undefined });
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.whatsappNumber 
                ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400 text-rose-900' 
                : 'border-slate-300 bg-white focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20 text-slate-900'
            }`}
          />
        </div>
        {errors.whatsappNumber ? (
          <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.whatsappNumber}</p>
        ) : (
          <p className="text-[11px] text-slate-500 mt-1">Include country code for rapid WhatsApp updates.</p>
        )}
      </div>

      {/* Submit Enquiry Button */}
      <div className="pt-2">
        <button
          id="car-submit-enquiry-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Opening WhatsApp...</span>
            </>
          ) : (
            <>
              <span>Submit Enquiry</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};


/* =========================================================================
   3. UNIFIED ENQUIRY WIDGET / SECTION
   Allows switching smoothly between "Visa Enquiry" and "Car Rental Enquiry"
   ========================================================================= */
interface SimpleEnquirySectionProps {
  initialType?: 'visa' | 'car-rental';
  defaultType?: 'visa' | 'car-rental';
  title?: string;
  subtitle?: string;
  className?: string;
}

export const SimpleEnquirySection: React.FC<SimpleEnquirySectionProps> = ({
  initialType = 'car-rental',
  defaultType,
  title,
  subtitle,
  className = ''
}) => {
  const activeType: 'visa' | 'car-rental' = initialType || defaultType || 'car-rental';
  const isCarRental = activeType === 'car-rental';

  const displayTitle = title || (isCarRental 
    ? 'Car Rental Enquiry' 
    : 'Visa Enquiry');

  const displaySubtitle = subtitle || (isCarRental
    ? 'Self Drive and Chauffeur Driven service enquiries for Hotwheels Car Rental LLC.'
    : 'Provide your travel details to receive visa options and pricing from Zone Tourism LLC.');

  return (
    <div id="quick-enquiry-section" className={`bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#0A2540] text-white border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {displayTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {displaySubtitle}
            </p>
          </div>

          {/* Dedicated Desk Identity Badge (No Toggle) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 text-white border border-white/15 text-xs font-bold shrink-0 self-start sm:self-center shadow-xs">
            {isCarRental ? (
              <>
                <Car className="w-4 h-4 text-[#C9A227]" />
                <span>Hotwheels Car Rental LLC</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 text-[#60A5FA]" />
                <span>Zone Tourism LLC</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Form Content - Exclusively Dedicated Form */}
      <div className="p-6 sm:p-8">
        {isCarRental ? (
          <CarRentalEnquiryForm />
        ) : (
          <VisaEnquiryForm />
        )}
      </div>
    </div>
  );
};


/* =========================================================================
   4. ENQUIRY MODAL POPUP
   Opens quick enquiry in a modal window from any page or header
   ========================================================================= */
export interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'visa' | 'car-rental';
  initialDestination?: string;
  initialVehicleType?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialType = 'visa',
  initialDestination,
  initialVehicleType
}) => {
  const [activeTab, setActiveTab] = useState<'visa' | 'car-rental'>(initialType);

  useEffect(() => {
    if (isOpen && initialType) {
      setActiveTab(initialType);
    }
  }, [isOpen, initialType]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      id="enquiry-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto bg-[#0A2540]/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        id="enquiry-modal-dialog"
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[94vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-5 bg-[#0A2540] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C9A227] shrink-0">
              {activeTab === 'visa' ? <FileText className="w-5 h-5" /> : <Car className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                {activeTab === 'visa' ? 'Visa Enquiry' : 'Car Rental Enquiry'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300">
                {activeTab === 'visa' ? 'Zone Tourism LLC • Visa Assistance' : 'Hotwheels Car Rental LLC • Direct Dubai Fleet'}
              </p>
            </div>
          </div>
          <button
            id="close-enquiry-modal-btn"
            onClick={onClose}
            aria-label="Close enquiry modal"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher - Only shown if not pre-locked to a specific service */}
        {!initialType && (
          <div className="px-4 pt-2.5 pb-2 sm:px-6 bg-[#F5F7FA] border-b border-slate-200 shrink-0">
            <div className="flex gap-1.5 sm:gap-2 p-1 rounded-xl bg-slate-200/80">
              <button
                id="enquiry-modal-tab-visa"
                type="button"
                onClick={() => setActiveTab('visa')}
                className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
                  activeTab === 'visa'
                    ? 'bg-[#0B4DA2] text-white shadow-xs'
                    : 'text-[#0A2540] hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Visa Enquiry</span>
              </button>
              <button
                id="enquiry-modal-tab-car"
                type="button"
                onClick={() => setActiveTab('car-rental')}
                className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
                  activeTab === 'car-rental'
                    ? 'bg-[#0B4DA2] text-white shadow-xs'
                    : 'text-[#0A2540] hover:text-slate-900'
                }`}
              >
                <Car className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Car Rental Enquiry</span>
              </button>
            </div>
          </div>
        )}

        {/* Body with smooth scrolling */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1">
          {activeTab === 'visa' ? (
            <VisaEnquiryForm initialDestination={initialDestination} />
          ) : (
            <CarRentalEnquiryForm initialVehicleType={initialVehicleType} />
          )}
        </div>
      </div>
    </div>
  );
};
