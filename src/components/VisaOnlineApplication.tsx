import React, { useState, useRef } from 'react';
import { 
  NATIONALITIES, 
  UAE_IMPORTANT_INFORMATION, 
  COMPANY_CONFIG,
  VISA_DISCLAIMER
} from '../data/travelData';
import { 
  formatVisaApplicationWhatsApp, 
  openWhatsAppDirectly, 
  buildWhatsAppLink, 
  PRIMARY_WHATSAPP_NUMBER 
} from '../utils/whatsapp';
import { 
  UploadCloud, FileText, CheckCircle2, AlertCircle, 
  X, Send, ShieldCheck, Check, Plane, User, Phone, 
  Globe, Calendar, FileCheck2, Info, ArrowRight, 
  ArrowLeft, RefreshCw
} from 'lucide-react';
import { WhatsAppOfficialIcon } from './WhatsAppFloat';

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  category: 'passportCopy' | 'photograph' | 'passportCover' | 'nationalId' | 'airTicket' | 'additional';
}

interface VisaOnlineApplicationProps {
  initialVisaType?: string;
  initialDestination?: string;
  onSuccess?: (refId: string) => void;
}

const ALL_VISA_OPTIONS = [
  { id: '30-days-single', label: '30 Days – Single Entry', category: 'UAE Visit Visa', entry: 'Single Entry', duration: '30 Days' },
  { id: '60-days-single', label: '60 Days – Single Entry', category: 'UAE Visit Visa', entry: 'Single Entry', duration: '60 Days' },
  { id: '30-days-multiple', label: '30 Days – Multiple Entry', category: 'UAE Visit Visa', entry: 'Multiple Entry', duration: '30 Days' },
  { id: '60-days-multiple', label: '60 Days – Multiple Entry', category: 'UAE Visit Visa', entry: 'Multiple Entry', duration: '60 Days' },
  { id: 'schengen-visa', label: 'Schengen Visa Assistance', category: 'International', entry: 'As per Embassy', duration: 'Europe' },
  { id: 'uk-visa', label: 'UK Visa Assistance', category: 'International', entry: 'Standard Visitor', duration: 'UK' },
  { id: 'usa-visa', label: 'USA Visa Assistance', category: 'International', entry: 'B1/B2 Tourist', duration: 'USA' },
  { id: 'china-visa', label: 'China Business / Tourist Visa', category: 'International', entry: 'Business / Tourist', duration: 'China' }
];

export const VisaOnlineApplication: React.FC<VisaOnlineApplicationProps> = ({
  initialVisaType = '30-days-single',
  initialDestination = 'Dubai, UAE',
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields (Exact 6 fields requested by user)
  const normalizeVisaId = (id?: string) => {
    if (!id || id === 'uae-visit-visa') return '30-days-single';
    return id;
  };

  const [selectedVisaId, setSelectedVisaId] = useState<string>(() => normalizeVisaId(initialVisaType));
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [isUaeResident, setIsUaeResident] = useState<'Yes' | 'No'>('No');
  const [destination, setDestination] = useState(initialDestination);
  const [travelDate, setTravelDate] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  React.useEffect(() => {
    if (initialVisaType) {
      const normalized = normalizeVisaId(initialVisaType);
      setSelectedVisaId(normalized);
      const found = ALL_VISA_OPTIONS.find(v => v.id === normalized);
      if (found) {
        if (found.category === 'UAE Visit Visa') {
          setDestination('Dubai, UAE');
        } else {
          setDestination(found.duration);
        }
      }
    }
  }, [initialVisaType]);

  // Uploaded Files State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    referenceId: string;
    visaTypeLabel: string;
    name: string;
    filesCount: number;
  } | null>(null);

  // File Inputs
  const passportInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const nationalIdInputRef = useRef<HTMLInputElement>(null);
  const ticketInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  const handleSelectVisa = (visaId: string) => {
    setSelectedVisaId(visaId);
    const found = ALL_VISA_OPTIONS.find(v => v.id === visaId);
    if (found) {
      if (found.category === 'UAE Visit Visa') {
        setDestination('Dubai, UAE');
      } else {
        setDestination(found.duration);
      }
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: UploadedFileItem['category']
  ) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];

    Array.from(files).forEach(file => {
      if (file.size > maxFileSize) {
        setUploadError(`File "${file.name}" exceeds 10MB limit.`);
        return;
      }
      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
        setUploadError(`File "${file.name}" has unsupported format. Please upload PDF, JPG, or PNG.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        const newItem: UploadedFileItem = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          dataUrl: dataUrl || '',
          category
        };

        setUploadedFiles(prev => {
          if (category === 'passportCopy' || category === 'photograph' || category === 'passportCover' || category === 'nationalId' || category === 'airTicket') {
            const filtered = prev.filter(f => f.category !== category);
            return [...filtered, newItem];
          }
          return [...prev, newItem];
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getPassportFile = () => uploadedFiles.find(f => f.category === 'passportCopy');
  const getPhotoFile = () => uploadedFiles.find(f => f.category === 'photograph');
  const getCoverFile = () => uploadedFiles.find(f => f.category === 'passportCover');
  const getNationalIdFile = () => uploadedFiles.find(f => f.category === 'nationalId');
  const getAirTicketFile = () => uploadedFiles.find(f => f.category === 'airTicket');
  const getAdditionalFiles = () => uploadedFiles.filter(f => f.category === 'additional');

  // Step 2 Validation
  const validateStep2 = () => {
    setSubmitError(null);
    if (!name.trim() || name.trim().length < 2) {
      setSubmitError('Please enter applicant name (minimum 2 characters).');
      return false;
    }
    if (!nationality.trim()) {
      setSubmitError('Please enter or select nationality.');
      return false;
    }
    if (!destination.trim()) {
      setSubmitError('Please enter travel destination.');
      return false;
    }
    if (!travelDate) {
      setSubmitError('Please select intended travel date.');
      return false;
    }
    if (!whatsappNumber.trim() || whatsappNumber.replace(/\D/g, '').length < 7) {
      setSubmitError('Please enter a valid WhatsApp number with country code.');
      return false;
    }
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    setSubmitError(null);
    if (!getPassportFile()) {
      setSubmitError('Please upload a clear color copy of your passport.');
      return false;
    }
    if (!getPhotoFile()) {
      setSubmitError('Please upload a recent passport-size photo with white background.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitError(null);

    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }
    if (!validateStep3()) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    const selectedOption = ALL_VISA_OPTIONS.find(v => v.id === selectedVisaId);
    const visaTitle = selectedOption ? `${selectedOption.category} - ${selectedOption.label}` : 'UAE Visit Visa';

    const payload = {
      name: name.trim(),
      nationality: nationality.trim(),
      isUaeResident,
      destination: destination.trim(),
      visaType: visaTitle,
      travelDate,
      whatsappNumber: whatsappNumber.trim(),
      uploadedDocumentsCount: uploadedFiles.length,
      documentSummaries: uploadedFiles.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        category: f.category
      }))
    };

    try {
      const res = await fetch('/api/enquiries/visa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit application.');
      }

      const refId = json.referenceId || `HWZ-VE-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedResult({
        referenceId: refId,
        visaTypeLabel: visaTitle,
        name: name.trim(),
        filesCount: uploadedFiles.length
      });

      if (onSuccess) {
        onSuccess(refId);
      }

      // Automatically launch WhatsApp with the structured application text
      const waMsg = formatVisaApplicationWhatsApp({
        referenceId: refId,
        name: name.trim(),
        nationality: nationality.trim(),
        isUaeResident,
        destination: destination.trim(),
        visaType: visaTitle,
        travelDate,
        whatsappNumber: whatsappNumber.trim(),
        uploadedDocumentsCount: uploadedFiles.length
      });
      openWhatsAppDirectly(waMsg, COMPANY_CONFIG.whatsappNumber || PRIMARY_WHATSAPP_NUMBER);
    } catch (err: any) {
      console.error('Visa submit error:', err);
      setSubmitError(err.message || 'Error submitting application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setName('');
    setNationality('');
    setIsUaeResident('No');
    setTravelDate('');
    setWhatsappNumber('');
    setUploadedFiles([]);
    setSubmitError(null);
    setUploadError(null);
    setSubmittedResult(null);
  };

  // SUCCESS SCREEN
  if (submittedResult) {
    const waMsg = formatVisaApplicationWhatsApp({
      referenceId: submittedResult.referenceId,
      name: submittedResult.name,
      nationality: nationality.trim(),
      isUaeResident,
      destination: destination.trim(),
      visaType: submittedResult.visaTypeLabel,
      travelDate,
      whatsappNumber: whatsappNumber.trim(),
      uploadedDocumentsCount: submittedResult.filesCount
    });
    const waLink = buildWhatsAppLink(waMsg, COMPANY_CONFIG.whatsappNumber || PRIMARY_WHATSAPP_NUMBER);

    return (
      <div className="bg-white rounded-3xl border border-emerald-200 shadow-sm p-6 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
            Application & Documents Received
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">
            Enquiry Submitted Successfully!
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm">
            Thank you, <strong className="text-[#0A2540]">{submittedResult.name}</strong>. Your documents have been uploaded to Zone Tourism LLC visa desk.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B4DA2]/5 border border-[#0B4DA2]/20 max-w-md mx-auto space-y-1.5 text-center">
          <span className="text-[11px] font-bold text-[#0B4DA2] uppercase tracking-wider block">
            Reference Number
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-black text-[#0A2540] tracking-wider">
            {submittedResult.referenceId}
          </div>
          <p className="text-[11px] text-slate-500">
            {submittedResult.visaTypeLabel} • {submittedResult.filesCount} Document(s) Attached
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <WhatsAppOfficialIcon className="w-4 h-4" />
            <span>Connect on WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A2540] font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>New Application</span>
          </button>
        </div>
      </div>
    );
  }

  const selectedVisaObj = ALL_VISA_OPTIONS.find(v => v.id === selectedVisaId);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-left">
      
      {/* STEP PROGRESS HEADER */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-8 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
              currentStep === 1 ? 'text-[#0B4DA2]' : currentStep > 1 ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep === 1 ? 'bg-[#0B4DA2] text-white' : currentStep > 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">1. Package</span>
          </button>

          <div className={`h-0.5 flex-1 mx-2 sm:mx-4 ${currentStep > 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => { if (currentStep > 2 || validateStep2()) setCurrentStep(2); }}
            className={`flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
              currentStep === 2 ? 'text-[#0B4DA2]' : currentStep > 2 ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep === 2 ? 'bg-[#0B4DA2] text-white' : currentStep > 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="hidden sm:inline">2. Details</span>
          </button>

          <div className={`h-0.5 flex-1 mx-2 sm:mx-4 ${currentStep > 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => { if (validateStep2()) setCurrentStep(3); }}
            className={`flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
              currentStep === 3 ? 'text-[#0B4DA2]' : currentStep > 3 ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep === 3 ? 'bg-[#0B4DA2] text-white' : currentStep > 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStep > 3 ? '✓' : '3'}
            </span>
            <span className="hidden sm:inline">3. Uploads</span>
          </button>

          <div className={`h-0.5 flex-1 mx-2 sm:mx-4 ${currentStep > 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

          {/* Step 4 */}
          <button
            type="button"
            onClick={() => { if (validateStep2() && validateStep3()) setCurrentStep(4); }}
            className={`flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
              currentStep === 4 ? 'text-[#0B4DA2]' : 'text-slate-400'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep === 4 ? 'bg-[#0B4DA2] text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              4
            </span>
            <span className="hidden sm:inline">4. Submit</span>
          </button>

        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">

        {/* ERROR NOTICE */}
        {submitError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* ================= STEP 1: SELECT VISA PACKAGE ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#0A2540]">
                Step 1: Select Visa Package
              </h3>
              <p className="text-xs text-slate-500">
                Choose the visa option you wish to apply for.
              </p>
            </div>

            {/* UAE Options */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                🇦🇪 UAE Visit Visa Options:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_VISA_OPTIONS.filter(v => v.category === 'UAE Visit Visa').map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => handleSelectVisa(opt.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      selectedVisaId === opt.id
                        ? 'border-[#0B4DA2] bg-[#0B4DA2]/5 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="visaOption"
                          checked={selectedVisaId === opt.id}
                          onChange={() => handleSelectVisa(opt.id)}
                          className="w-4 h-4 text-[#0B4DA2]"
                        />
                        <span className="text-sm font-bold text-[#0A2540]">{opt.label}</span>
                      </div>
                      <span className="text-xs text-slate-500 block pl-6">
                        Stay: {opt.duration} • {opt.entry}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* International Options */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                🌍 International Visa Assistance:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_VISA_OPTIONS.filter(v => v.category === 'International').map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => handleSelectVisa(opt.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      selectedVisaId === opt.id
                        ? 'border-[#0B4DA2] bg-[#0B4DA2]/5 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="visaOption"
                        checked={selectedVisaId === opt.id}
                        onChange={() => handleSelectVisa(opt.id)}
                        className="w-4 h-4 text-[#0B4DA2]"
                      />
                      <span className="text-xs font-bold text-[#0A2540]">{opt.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-3 px-6 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <span>Continue to Applicant Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: APPLICANT DETAILS (EXACT 6 FIELDS) ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0A2540]">
                  Step 2: Applicant Information
                </h3>
                <p className="text-xs text-slate-500">
                  Selected Package: <strong className="text-[#0B4DA2]">{selectedVisaObj?.label}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 1. Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">
                  * Name (Full name as on passport)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Bilal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
                  />
                </div>
              </div>

              {/* 2. Nationality */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  * Nationality
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    list="applicant-nationalities"
                    required
                    placeholder="Select or enter nationality"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
                  />
                  <datalist id="applicant-nationalities">
                    {NATIONALITIES.map((nat) => (
                      <option key={nat} value={nat} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* 3. UAE Resident - Yes / No */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  * UAE Resident – Yes / No
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUaeResident('Yes')}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isUaeResident === 'Yes'
                        ? 'bg-[#0B4DA2] text-white border-[#0B4DA2]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUaeResident('No')}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isUaeResident === 'No'
                        ? 'bg-[#0B4DA2] text-white border-[#0B4DA2]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* 4. Destination */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  * Destination
                </label>
                <div className="relative">
                  <Plane className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dubai, UAE"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
                  />
                </div>
              </div>

              {/* 5. Travel Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  * Travel Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
                  />
                </div>
              </div>

              {/* 6. WhatsApp Number */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">
                  * WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +971 55 558 6359"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
                  />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setCurrentStep(3);
                }}
                className="py-3 px-6 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <span>Continue to Document Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: DOCUMENT UPLOAD (DIRECT ON WEBSITE) ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#0A2540]">
                Step 3: Upload Documents Directly on Website
              </h3>
              <p className="text-xs text-slate-500">
                Upload clear color copies (PDF, JPG, PNG up to 10MB each).
              </p>
            </div>

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 1. Clear Color Passport Copy (REQUIRED) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#0A2540] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#0B4DA2]" />
                      <span>Clear Color Passport Copy</span>
                      <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Minimum 6 months validity required.
                    </span>
                  </div>
                  {getPassportFile() && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      ✓ Ready
                    </span>
                  )}
                </div>

                {getPassportFile() ? (
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate text-[11px]">{getPassportFile()?.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(getPassportFile()!.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={passportInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileUpload(e, 'passportCopy')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => passportInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-lg border border-dashed border-[#0B4DA2]/40 bg-white hover:bg-[#0B4DA2]/5 text-[#0B4DA2] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Passport Copy</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Passport-Size Photograph (REQUIRED) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#0A2540] flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#0B4DA2]" />
                      <span>Photo (White Background)</span>
                      <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Recent passport-size photo.
                    </span>
                  </div>
                  {getPhotoFile() && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      ✓ Ready
                    </span>
                  )}
                </div>

                {getPhotoFile() ? (
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate text-[11px]">{getPhotoFile()?.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(getPhotoFile()!.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileUpload(e, 'photograph')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-lg border border-dashed border-[#0B4DA2]/40 bg-white hover:bg-[#0B4DA2]/5 text-[#0B4DA2] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Photograph</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Passport Cover Page */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>Passport Cover Page</span>
                    </span>
                    <span className="text-[11px] text-slate-500 block">Cover page (if available).</span>
                  </div>
                  {getCoverFile() && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      ✓ Attached
                    </span>
                  )}
                </div>

                {getCoverFile() ? (
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate text-[11px]">{getCoverFile()?.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(getCoverFile()!.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileUpload(e, 'passportCover')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-lg border border-dashed border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-slate-500" />
                      <span>Upload Cover Page</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 4. National ID Card — Front & Back */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>National ID Card — Front & Back</span>
                    </span>
                    <span className="text-[11px] text-slate-500 block">CNIC / ID (if applicable).</span>
                  </div>
                  {getNationalIdFile() && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      ✓ Attached
                    </span>
                  )}
                </div>

                {getNationalIdFile() ? (
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate text-[11px]">{getNationalIdFile()?.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(getNationalIdFile()!.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={nationalIdInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileUpload(e, 'nationalId')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => nationalIdInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-lg border border-dashed border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-slate-500" />
                      <span>Upload National ID</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 5. Confirmed Return/Onward Air Ticket */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Plane className="w-4 h-4 text-slate-500" />
                      <span>Confirmed Return/Onward Air Ticket</span>
                    </span>
                    <span className="text-[11px] text-slate-500 block">If required / available.</span>
                  </div>
                  {getAirTicketFile() && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      ✓ Attached
                    </span>
                  )}
                </div>

                {getAirTicketFile() ? (
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate text-[11px]">{getAirTicketFile()?.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(getAirTicketFile()!.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={ticketInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileUpload(e, 'airTicket')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => ticketInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-lg border border-dashed border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-slate-500" />
                      <span>Upload Air Ticket</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 6. Additional Documents */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>Additional Documents — If Required</span>
                    </span>
                    <span className="text-[11px] text-slate-500 block">Sponsor ID, Hotel booking, etc.</span>
                  </div>
                  {getAdditionalFiles().length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      {getAdditionalFiles().length} Attached
                    </span>
                  )}
                </div>

                <div>
                  <input
                    ref={additionalInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={(e) => handleFileUpload(e, 'additional')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => additionalInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-lg border border-dashed border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 text-slate-500" />
                    <span>+ Upload Additional Files</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep3()) setCurrentStep(4);
                }}
                className="py-3 px-6 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <span>Review & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: REVIEW & SUBMIT ================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#0A2540]">
                Step 4: Review Details & Submit Enquiry
              </h3>
              <p className="text-xs text-slate-500">
                Please verify your details before submitting.
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Package:</span>
                  <span className="font-bold text-[#0A2540]">{selectedVisaObj?.label}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Applicant:</span>
                  <span className="font-bold text-[#0A2540]">{name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Nationality:</span>
                  <span className="font-bold text-[#0A2540]">{nationality}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">UAE Resident:</span>
                  <span className="font-bold text-[#0A2540]">{isUaeResident}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination:</span>
                  <span className="font-bold text-[#0A2540]">{destination}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Travel Date:</span>
                  <span className="font-bold text-[#0A2540]">{travelDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp:</span>
                  <span className="font-bold text-[#0A2540]">{whatsappNumber}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Attached Documents ({uploadedFiles.length}):</span>
                  <span className="font-medium text-slate-700">
                    {uploadedFiles.map(f => f.name).join(', ') || 'No files'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mandatory Regulatory Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{VISA_DISCLAIMER}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className={`py-3.5 px-7 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  isSubmitting ? 'bg-[#0B4DA2]/70 cursor-not-allowed' : 'bg-[#0B4DA2] hover:bg-[#083B7D]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
