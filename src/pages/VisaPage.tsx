import React, { useState, useRef } from 'react';
import { PageRoute } from '../types';
import { PageHeader } from '../components/PageHeader';
import { COMPANY_CONFIG } from '../data/travelData';
import { 
  formatVisaEnquiryWhatsApp, 
  formatVisaApplicationWhatsApp, 
  openWhatsAppDirectly, 
  PRIMARY_WHATSAPP_NUMBER 
} from '../utils/whatsapp';
import { 
  downloadVisaApplicationPdf, 
  generateVisaApplicationPdf, 
  VisaApplicationPdfData 
} from '../utils/visaPdfGenerator';
import { 
  Check, 
  User, 
  Globe, 
  MapPin, 
  Calendar, 
  Phone, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Paperclip,
  Clock,
  Info,
  Upload,
  X,
  FileCheck,
  File,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Download,
  ExternalLink
} from 'lucide-react';
import { WhatsAppOfficialIcon } from '../components/WhatsAppFloat';

interface VisaPageProps {
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
  onOpenVisaApp?: (visaTypeId?: string) => void;
  onOpenEnquiry?: (type?: 'visa' | 'car-rental', initialDestination?: string) => void;
}

interface UploadedFileItem {
  id: string;
  category: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

const AVAILABLE_VISA_TYPES = [
  { id: '30-single', title: '30 Days – Single Entry', duration: '30 Days', entry: 'Single Entry' },
  { id: '60-single', title: '60 Days – Single Entry', duration: '60 Days', entry: 'Single Entry' },
  { id: '30-multiple', title: '30 Days – Multiple Entry', duration: '30 Days', entry: 'Multiple Entry' },
  { id: '60-multiple', title: '60 Days – Multiple Entry', duration: '60 Days', entry: 'Multiple Entry' }
];

const REQUIRED_DOCUMENTS = [
  'Clear Color Passport Copy',
  'Passport must have minimum 6 months validity',
  'Passport Cover Page',
  'Recent Passport-Size Photograph — White Background',
  'National ID Card — Front & Back (if applicable)',
  'Confirmed Return/Onward Air Ticket — if required',
  'Travel Insurance — as applicable'
];

const ADDITIONAL_DOCUMENTS = [
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

const IMPORTANT_INFORMATION = [
  'Passport must normally be valid for at least 6 months from the intended travel date.',
  'Visa validity, permitted stay and number of entries depend on the approved visa type.',
  'Additional documents or security/guarantee requirements may apply to certain nationalities.',
  'Submission of documents does not guarantee visa approval.',
  'Visa approval, rejection and processing time are entirely subject to the UAE Immigration Authorities.',
  'Visa fees and service charges are non-refundable once the application has been submitted, unless specifically advised otherwise.'
];

export const VisaPage: React.FC<VisaPageProps> = ({
  currentRoute,
  setRoute
}) => {
  // Collapsible Details State (User can expand or collapse anytime)
  const [showVisaDetails, setShowVisaDetails] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('types');

  // Form Tabs State: 'enquiry' for simple enquiry, 'apply' for documents & pdf application
  const [activeFormTab, setActiveFormTab] = useState<'enquiry' | 'apply'>('enquiry');

  // -------------------------------------------------------------
  // FORM 1: QUICK VISA ENQUIRY STATE
  // -------------------------------------------------------------
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryNationality, setEnquiryNationality] = useState('');
  const [enquiryIsUaeResident, setEnquiryIsUaeResident] = useState<'Yes' | 'No'>('No');
  const [enquiryDestination, setEnquiryDestination] = useState('');
  const [enquiryTravelDate, setEnquiryTravelDate] = useState('');
  const [enquiryWhatsAppNumber, setEnquiryWhatsAppNumber] = useState('');
  const [enquiryPassportCopy, setEnquiryPassportCopy] = useState<UploadedFileItem | null>(null);
  const [enquiryPassportPhoto, setEnquiryPassportPhoto] = useState<UploadedFileItem | null>(null);
  const [enquiryPdfPayload, setEnquiryPdfPayload] = useState<VisaApplicationPdfData | null>(null);
  const enquiryPassportCopyRef = useRef<HTMLInputElement>(null);
  const enquiryPassportPhotoRef = useRef<HTMLInputElement>(null);
  const [isEnquirySubmitting, setIsEnquirySubmitting] = useState(false);
  const [enquiryLaunched, setEnquiryLaunched] = useState(false);
  const [enquiryRefId, setEnquiryRefId] = useState('');
  const [enquiryErrorMessage, setEnquiryErrorMessage] = useState('');

  // -------------------------------------------------------------
  // FORM 2: FULL VISA APPLICATION & DOCUMENT SUBMISSION (PDF) STATE
  // -------------------------------------------------------------
  const [selectedVisaType, setSelectedVisaType] = useState('30 Days – Single Entry');
  const [appName, setAppName] = useState('');
  const [appNationality, setAppNationality] = useState('');
  const [appIsUaeResident, setAppIsUaeResident] = useState<'Yes' | 'No'>('No');
  const [appDestination, setAppDestination] = useState('');
  const [appTravelDate, setAppTravelDate] = useState('');
  const [appWhatsAppNumber, setAppWhatsAppNumber] = useState('');

  // Documents
  const [passportCopy, setPassportCopy] = useState<UploadedFileItem | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<UploadedFileItem | null>(null);
  const [passportCover, setPassportCover] = useState<UploadedFileItem | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<UploadedFileItem[]>([]);

  const [isAppSubmitting, setIsAppSubmitting] = useState(false);
  const [appLaunched, setAppLaunched] = useState(false);
  const [appRefId, setAppRefId] = useState('');
  const [appErrorMessage, setAppErrorMessage] = useState('');

  const passportCopyInputRef = useRef<HTMLInputElement>(null);
  const passportPhotoInputRef = useRef<HTMLInputElement>(null);
  const passportCoverInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesInputRef = useRef<HTMLInputElement>(null);

  const cleanWaNumber = (COMPANY_CONFIG.whatsappNumber || '971555586359').replace(/\D/g, '') || '971555586359';

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleEnquiryFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: 'passport' | 'photo'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string | undefined;
      if (category === 'passport') {
        setEnquiryPassportCopy({
          id: `epass-${Date.now()}`,
          category: 'Passport Copy (Bio Page)',
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl
        });
      } else {
        setEnquiryPassportPhoto({
          id: `ephoto-${Date.now()}`,
          category: 'Passport Size Photograph',
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
      if (category === 'passport') {
        setEnquiryPassportCopy({
          id: `epass-${Date.now()}`,
          category: 'Passport Copy (Bio Page)',
          name: file.name,
          size: file.size,
          type: file.type
        });
      } else {
        setEnquiryPassportPhoto({
          id: `ephoto-${Date.now()}`,
          category: 'Passport Size Photograph',
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    }
    e.target.value = '';
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: 'passport' | 'photo' | 'cover' | 'additional'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readFileData = (file: File): Promise<string | undefined> => {
      return new Promise((resolve) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            resolve(loadEvt.target?.result as string);
          };
          reader.onerror = () => resolve(undefined);
          reader.readAsDataURL(file);
        } else {
          resolve(undefined);
        }
      });
    };

    const processFiles = async () => {
      if (category === 'passport') {
        const file = files[0];
        const dataUrl = await readFileData(file);
        setPassportCopy({
          id: `pass-${Date.now()}`,
          category: 'Passport Copy (Bio Page)',
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl
        });
      } else if (category === 'photo') {
        const file = files[0];
        const dataUrl = await readFileData(file);
        setPassportPhoto({
          id: `photo-${Date.now()}`,
          category: 'Passport Size Photograph',
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl
        });
      } else if (category === 'cover') {
        const file = files[0];
        const dataUrl = await readFileData(file);
        setPassportCover({
          id: `cover-${Date.now()}`,
          category: 'Passport Cover Page',
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl
        });
      } else if (category === 'additional') {
        const newItems: UploadedFileItem[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const dataUrl = await readFileData(file);
          newItems.push({
            id: `add-${Date.now()}-${i}`,
            category: 'Additional Supporting Document',
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl
          });
        }
        setAdditionalFiles((prev) => [...prev, ...newItems]);
      }
    };

    processFiles();
    e.target.value = '';
  };

  const removeAdditionalFile = (id: string) => {
    setAdditionalFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getAllUploadedDocumentNames = (): string[] => {
    const list: string[] = [];
    if (passportCopy) list.push(`Passport Copy: ${passportCopy.name}`);
    if (passportPhoto) list.push(`Passport Photo: ${passportPhoto.name}`);
    if (passportCover) list.push(`Passport Cover: ${passportCover.name}`);
    additionalFiles.forEach((f) => list.push(`Supporting File: ${f.name}`));
    return list;
  };

  // -------------------------------------------------------------
  // FORM 1: SUBMIT QUICK ENQUIRY -> OPENS WHATSAPP
  // -------------------------------------------------------------
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryErrorMessage('');

    if (!enquiryName.trim()) {
      setEnquiryErrorMessage('Please enter your Name.');
      return;
    }
    if (!enquiryNationality.trim()) {
      setEnquiryErrorMessage('Please enter your Nationality.');
      return;
    }
    if (!enquiryDestination.trim()) {
      setEnquiryErrorMessage('Please enter your Destination.');
      return;
    }
    if (!enquiryTravelDate.trim()) {
      setEnquiryErrorMessage('Please select your Travel Date.');
      return;
    }
    if (!enquiryWhatsAppNumber.trim()) {
      setEnquiryErrorMessage('Please enter your WhatsApp Number.');
      return;
    }

    setIsEnquirySubmitting(true);

    const enquiryData = {
      name: enquiryName.trim(),
      nationality: enquiryNationality.trim(),
      isUaeResident: enquiryIsUaeResident,
      destination: enquiryDestination.trim(),
      travelDate: enquiryTravelDate,
      whatsappNumber: enquiryWhatsAppNumber.trim()
    };

    const refId = `HWZ-VE-${Math.floor(10000 + Math.random() * 90000)}`;
    const docsList: string[] = [];
    if (enquiryPassportCopy) docsList.push(`Passport Copy: ${enquiryPassportCopy.name}`);
    if (enquiryPassportPhoto) docsList.push(`Passport Photo: ${enquiryPassportPhoto.name}`);

    const pdfPayload: VisaApplicationPdfData = {
      referenceId: refId,
      name: enquiryData.name,
      nationality: enquiryData.nationality,
      isUaeResident: enquiryData.isUaeResident,
      destination: enquiryData.destination,
      visaType: 'Visa Enquiry & Verification',
      travelDate: enquiryData.travelDate,
      whatsappNumber: enquiryData.whatsappNumber,
      uploadedDocuments: docsList,
      passportCopy: enquiryPassportCopy ? {
        name: enquiryPassportCopy.name,
        category: 'Passport Copy (Bio Page)',
        dataUrl: enquiryPassportCopy.dataUrl,
        type: enquiryPassportCopy.type
      } : null,
      passportPhoto: enquiryPassportPhoto ? {
        name: enquiryPassportPhoto.name,
        category: 'Passport Size Photograph',
        dataUrl: enquiryPassportPhoto.dataUrl,
        type: enquiryPassportPhoto.type
      } : null,
      additionalFiles: []
    };

    setEnquiryPdfPayload(pdfPayload);

    // 1. Auto-generate and download official PDF document
    try {
      downloadVisaApplicationPdf(pdfPayload);
    } catch (saveErr) {
      console.warn('PDF download notice:', saveErr);
    }

    // 2. Open WhatsApp immediately in user click context (never blocked by popup blocker)
    const waMsg = formatVisaEnquiryWhatsApp({
      name: enquiryData.name,
      nationality: enquiryData.nationality,
      isUaeResident: enquiryData.isUaeResident,
      destination: enquiryData.destination,
      travelDate: enquiryData.travelDate,
      whatsappNumber: enquiryData.whatsappNumber,
      referenceId: refId,
      uploadedDocuments: docsList
    });
    openWhatsAppDirectly(waMsg, cleanWaNumber);

    setIsEnquirySubmitting(false);
    setEnquiryRefId(refId);
    setEnquiryLaunched(true);

    // 3. Save enquiry in database in the background
    fetch('/api/enquiries/visa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...enquiryData,
        referenceId: refId,
        uploadedDocuments: docsList,
        hasDocuments: docsList.length > 0
      })
    }).catch(() => null);
  };

  const handleDownloadEnquiryPdfAgain = () => {
    if (enquiryPdfPayload) {
      downloadVisaApplicationPdf(enquiryPdfPayload);
    }
  };

  const handleResetEnquiry = () => {
    setEnquiryName('');
    setEnquiryNationality('');
    setEnquiryIsUaeResident('No');
    setEnquiryDestination('');
    setEnquiryTravelDate('');
    setEnquiryWhatsAppNumber('');
    setEnquiryPassportCopy(null);
    setEnquiryPassportPhoto(null);
    setEnquiryPdfPayload(null);
    setEnquiryLaunched(false);
    setEnquiryRefId('');
    setEnquiryErrorMessage('');
  };

  // -------------------------------------------------------------
  // FORM 2: SUBMIT FULL APPLICATION -> GENERATES PDF & OPENS WHATSAPP
  // -------------------------------------------------------------
  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppErrorMessage('');

    if (!appName.trim()) {
      setAppErrorMessage('Please enter your Full Name (as on passport).');
      return;
    }
    if (!appNationality.trim()) {
      setAppErrorMessage('Please enter your Nationality.');
      return;
    }
    if (!appTravelDate.trim()) {
      setAppErrorMessage('Please select your Intended Travel Date.');
      return;
    }
    if (!appWhatsAppNumber.trim()) {
      setAppErrorMessage('Please enter your WhatsApp Number.');
      return;
    }

    setIsAppSubmitting(true);

    const uploadedDocsList = getAllUploadedDocumentNames();
    const refId = `HWZ-VISA-${Math.floor(10000 + Math.random() * 90000)}`;

    const pdfPayload: VisaApplicationPdfData = {
      referenceId: refId,
      name: appName.trim(),
      nationality: appNationality.trim(),
      isUaeResident: appIsUaeResident,
      destination: appDestination.trim() || 'UAE / Dubai',
      visaType: selectedVisaType,
      travelDate: appTravelDate,
      whatsappNumber: appWhatsAppNumber.trim(),
      uploadedDocuments: uploadedDocsList,
      passportCopy: passportCopy ? {
        name: passportCopy.name,
        category: passportCopy.category,
        dataUrl: passportCopy.dataUrl,
        type: passportCopy.type
      } : null,
      passportPhoto: passportPhoto ? {
        name: passportPhoto.name,
        category: passportPhoto.category,
        dataUrl: passportPhoto.dataUrl,
        type: passportPhoto.type
      } : null,
      passportCover: passportCover ? {
        name: passportCover.name,
        category: passportCover.category,
        dataUrl: passportCover.dataUrl,
        type: passportCover.type
      } : null,
      additionalFiles: additionalFiles.map((f) => ({
        name: f.name,
        category: f.category,
        dataUrl: f.dataUrl,
        type: f.type
      }))
    };

    // 1. Generate full PDF document with embedded images & auto-download to device
    try {
      const doc = generateVisaApplicationPdf(pdfPayload);
      const fileName = `UAE_Visa_Application_${refId}.pdf`;
      doc.save(fileName);
    } catch (saveErr) {
      console.warn('Local PDF save warning:', saveErr);
    }

    // 2. Open WhatsApp immediately with all formatted text data (never blocked by popup blocker)
    const waMsg = formatVisaApplicationWhatsApp({
      referenceId: refId,
      name: pdfPayload.name,
      nationality: pdfPayload.nationality,
      isUaeResident: pdfPayload.isUaeResident,
      destination: pdfPayload.destination,
      visaType: pdfPayload.visaType,
      travelDate: pdfPayload.travelDate,
      whatsappNumber: pdfPayload.whatsappNumber,
      uploadedDocuments: uploadedDocsList,
      uploadedDocumentsCount: uploadedDocsList.length
    });
    openWhatsAppDirectly(waMsg, cleanWaNumber);

    setIsAppSubmitting(false);
    setAppRefId(refId);
    setAppLaunched(true);

    // 3. Save application record in database in the background
    fetch('/api/enquiries/visa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referenceId: refId,
        name: pdfPayload.name,
        nationality: pdfPayload.nationality,
        isUaeResident: pdfPayload.isUaeResident,
        destination: pdfPayload.destination,
        visaType: pdfPayload.visaType,
        travelDate: pdfPayload.travelDate,
        whatsappNumber: pdfPayload.whatsappNumber,
        uploadedDocuments: uploadedDocsList,
        hasDocuments: uploadedDocsList.length > 0
      })
    }).catch(() => null);
  };

  const handleDownloadPdfAgain = () => {
    downloadVisaApplicationPdf({
      referenceId: appRefId || 'HWZ-VISA-SAMPLE',
      name: appName.trim() || 'Applicant',
      nationality: appNationality.trim() || 'N/A',
      isUaeResident: appIsUaeResident,
      destination: appDestination.trim() || 'UAE / Dubai',
      visaType: selectedVisaType,
      travelDate: appTravelDate || 'N/A',
      whatsappNumber: appWhatsAppNumber.trim() || 'N/A',
      uploadedDocuments: getAllUploadedDocumentNames(),
      passportCopy: passportCopy ? {
        name: passportCopy.name,
        category: passportCopy.category,
        dataUrl: passportCopy.dataUrl,
        type: passportCopy.type
      } : null,
      passportPhoto: passportPhoto ? {
        name: passportPhoto.name,
        category: passportPhoto.category,
        dataUrl: passportPhoto.dataUrl,
        type: passportPhoto.type
      } : null,
      passportCover: passportCover ? {
        name: passportCover.name,
        category: passportCover.category,
        dataUrl: passportCover.dataUrl,
        type: passportCover.type
      } : null,
      additionalFiles: additionalFiles.map((f) => ({
        name: f.name,
        category: f.category,
        dataUrl: f.dataUrl,
        type: f.type
      }))
    });
  };

  const handleResetApp = () => {
    setAppName('');
    setAppNationality('');
    setAppIsUaeResident('No');
    setAppDestination('');
    setSelectedVisaType('30 Days – Single Entry');
    setAppTravelDate('');
    setAppWhatsAppNumber('');
    setPassportCopy(null);
    setPassportPhoto(null);
    setPassportCover(null);
    setAdditionalFiles([]);
    setAppLaunched(false);
    setAppRefId('');
    setAppErrorMessage('');
  };

  const handleSelectVisaTypeAndSwitch = (visaTitle: string) => {
    setSelectedVisaType(visaTitle);
    setActiveFormTab('apply');
    const el = document.getElementById('visa-forms-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleAccordion = (sectionKey: string) => {
    setExpandedSection((prev) => (prev === sectionKey ? null : sectionKey));
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 bg-[#F5F7FA]">
      {/* Header */}
      <PageHeader
        title="UAE Visit Visa Services"
        subtitle="Visa Assistance, Requirements & Online Application Portal by Zone Tourism LLC."
        currentRoute={currentRoute}
        setRoute={setRoute}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ========================================================= */}
        {/* COLLAPSIBLE / ACCORDION VISA REQUIREMENTS & DETAILS */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
          
          {/* Main Toggle Bar */}
          <button
            type="button"
            onClick={() => setShowVisaDetails(!showVisaDetails)}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B4DA2] flex items-center justify-center font-black shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black text-[#0A2540]">
                    UAE Visit Visa Requirements, Options & Information
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-50 text-[#0B4DA2] text-[10px] font-extrabold uppercase">
                    Zone Tourism LLC
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click to {showVisaDetails ? 'hide' : 'view'} complete documents checklist, visa categories and processing details
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-[#0B4DA2] hidden md:inline">
                {showVisaDetails ? 'Hide Details' : 'View Details'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                {showVisaDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {/* Collapsible Content */}
          {showVisaDetails && (
            <div className="border-t border-slate-200/80 p-5 sm:p-7 space-y-4 bg-slate-50/40">
              
              {/* Accordion 1: Available Visa Types */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('types')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A2540]">
                    <span>•</span>
                    <span>Available Visa Types (30 & 60 Days)</span>
                  </div>
                  {expandedSection === 'types' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {expandedSection === 'types' && (
                  <div className="p-4 pt-0 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {AVAILABLE_VISA_TYPES.map((visa) => (
                      <div
                        key={visa.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-[#0A2540]">{visa.title}</h4>
                          <span className="text-[10px] text-slate-500 font-medium">{visa.entry}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectVisaTypeAndSwitch(visa.title)}
                          className="py-1 px-2.5 rounded-lg bg-[#0B4DA2] hover:bg-[#083B7D] text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Select & Apply
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 2: Documents Required */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('docs')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A2540]">
                    <FileText className="w-4 h-4 text-[#0B4DA2]" />
                    <span>Documents Required (For All Applicants)</span>
                  </div>
                  {expandedSection === 'docs' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {expandedSection === 'docs' && (
                  <div className="p-4 pt-0 border-t border-slate-100 mt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {REQUIRED_DOCUMENTS.map((doc, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-50 flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0B4DA2] shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Additional Documents – If Required */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('add_docs')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A2540]">
                    <Paperclip className="w-4 h-4 text-[#0B4DA2]" />
                    <span>Additional Documents – If Required</span>
                  </div>
                  {expandedSection === 'add_docs' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {expandedSection === 'add_docs' && (
                  <div className="p-4 pt-0 border-t border-slate-100 mt-3 space-y-2">
                    <p className="text-xs text-slate-500">
                      Depending on the applicant’s nationality, age, gender and immigration profile, additional documents may be requested:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ADDITIONAL_DOCUMENTS.map((doc, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-50 flex items-start gap-2 text-xs text-slate-700">
                          <span className="text-slate-400 font-bold">•</span>
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Processing Time & Express Service */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('processing')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A2540]">
                    <Clock className="w-4 h-4 text-[#0B4DA2]" />
                    <span>Processing Time & Express Options</span>
                  </div>
                  {expandedSection === 'processing' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {expandedSection === 'processing' && (
                  <div className="p-4 pt-0 border-t border-slate-100 mt-3 space-y-2 text-xs text-slate-700">
                    <p>Processing time may vary depending on the visa type, nationality and UAE Immigration approval.</p>
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 font-semibold flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>Express/Urgent processing may be available for selected applications, subject to immigration availability and additional charges.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 5: Important Information & Rules */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('info')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0A2540]">
                    <Info className="w-4 h-4 text-[#0B4DA2]" />
                    <span>Important Terms & Policies</span>
                  </div>
                  {expandedSection === 'info' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {expandedSection === 'info' && (
                  <div className="p-4 pt-0 border-t border-slate-100 mt-3">
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {IMPORTANT_INFORMATION.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-slate-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* TWO SEPARATE FORMS SECTION */}
        {/* ========================================================= */}
        <div id="visa-forms-section" className="space-y-6">
          
          {/* Form Switcher Tabs */}
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveFormTab('enquiry')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormTab === 'enquiry'
                  ? 'bg-white text-[#0B4DA2] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Send className="w-4 h-4 text-[#0B4DA2]" />
              <span>1. Quick Visa Enquiry Form</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFormTab('apply')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormTab === 'apply'
                  ? 'bg-[#0B4DA2] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>2. Visa Application & Document Upload Form (PDF)</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: QUICK VISA ENQUIRY FORM (Direct Data to WhatsApp) */}
          {/* ========================================================= */}
          {activeFormTab === 'enquiry' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0B4DA2] text-[11px] font-bold uppercase mb-1.5">
                    <Send className="w-3 h-3" />
                    <span>Direct WhatsApp Enquiry</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A2540]">
                    Quick Visa Enquiry Form
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill in details below and click to send your enquiry straight to WhatsApp (+971 55 558 6359).
                  </p>
                </div>

                {enquiryLaunched && (
                  <button
                    type="button"
                    onClick={handleResetEnquiry}
                    className="text-xs text-slate-500 hover:text-rose-600 underline cursor-pointer self-start sm:self-auto"
                  >
                    Clear Form
                  </button>
                )}
              </div>

              {/* Status Notification if PDF was generated & WhatsApp was launched */}
              {enquiryLaunched && (
                <div className="p-4 sm:p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0A2540] space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-emerald-800 text-sm">
                        PDF Application Downloaded & WhatsApp Ready! (Ref: {enquiryRefId})
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        Your official application PDF has been saved to your device, and WhatsApp has been opened with all your details ready to send.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleDownloadEnquiryPdfAgain}
                      className="py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0B4DA2]" />
                      <span>Download PDF Again</span>
                    </button>

                    <a
                      href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                        formatVisaEnquiryWhatsApp({
                          name: enquiryName,
                          nationality: enquiryNationality,
                          isUaeResident: enquiryIsUaeResident,
                          destination: enquiryDestination,
                          travelDate: enquiryTravelDate,
                          whatsappNumber: enquiryWhatsAppNumber,
                          referenceId: enquiryRefId,
                          uploadedDocuments: (enquiryPassportCopy || enquiryPassportPhoto) ? [
                            ...(enquiryPassportCopy ? [`Passport Copy: ${enquiryPassportCopy.name}`] : []),
                            ...(enquiryPassportPhoto ? [`Passport Photo: ${enquiryPassportPhoto.name}`] : [])
                          ] : undefined
                        })
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <WhatsAppOfficialIcon className="w-4 h-4 fill-current" />
                      <span>Open WhatsApp Chat</span>
                    </a>
                  </div>
                </div>
              )}

              <form onSubmit={handleEnquirySubmit} className="space-y-4" noValidate>
                {enquiryErrorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{enquiryErrorMessage}</span>
                  </div>
                )}

                {/* 1. Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your Name"
                      value={enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* 2. Nationality */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nationality <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your Nationality"
                      value={enquiryNationality}
                      onChange={(e) => setEnquiryNationality(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* 3. UAE Resident – Yes / No */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    UAE Resident – Yes / No <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEnquiryIsUaeResident('Yes')}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                        enquiryIsUaeResident === 'Yes'
                          ? 'border-[#0B4DA2] bg-[#0B4DA2] text-white shadow-xs'
                          : 'border-slate-200 bg-[#F5F7FA] text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {enquiryIsUaeResident === 'Yes' && <Check className="w-3.5 h-3.5" />}
                      <span>Yes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnquiryIsUaeResident('No')}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                        enquiryIsUaeResident === 'No'
                          ? 'border-[#0B4DA2] bg-[#0B4DA2] text-white shadow-xs'
                          : 'border-slate-200 bg-[#F5F7FA] text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {enquiryIsUaeResident === 'No' && <Check className="w-3.5 h-3.5" />}
                      <span>No</span>
                    </button>
                  </div>
                </div>

                {/* 4. Destination (Empty by default) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Destination <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Enter Destination (e.g. UAE / Dubai / UK)"
                      value={enquiryDestination}
                      onChange={(e) => setEnquiryDestination(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* 5. Travel Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Travel Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="date"
                      required
                      value={enquiryTravelDate}
                      onChange={(e) => setEnquiryTravelDate(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* 6. WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +971 55 558 6359"
                      value={enquiryWhatsAppNumber}
                      onChange={(e) => setEnquiryWhatsAppNumber(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 space-y-2">
                  {enquiryErrorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{enquiryErrorMessage}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isEnquirySubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[48px]"
                  >
                    {isEnquirySubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Opening WhatsApp...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Visa Enquiry on WhatsApp</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Clicking will prepare your message and open WhatsApp on +971 55 558 6359.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: DOCUMENT SUBMISSION & APPLICATION (PDF + WhatsApp) */}
          {/* ========================================================= */}
          {activeFormTab === 'apply' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0B4DA2] text-[11px] font-bold uppercase mb-1.5">
                    <Upload className="w-3 h-3" />
                    <span>Official Application & PDF Generator</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A2540]">
                    Visa Application & Document Upload Form
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select visa category, attach documents and submit. Automatically generates your application PDF and opens WhatsApp.
                  </p>
                </div>

                {appLaunched && (
                  <button
                    type="button"
                    onClick={handleResetApp}
                    className="text-xs text-slate-500 hover:text-rose-600 underline cursor-pointer self-start sm:self-auto"
                  >
                    Clear Application
                  </button>
                )}
              </div>

              {/* Status Notification if PDF was generated & WhatsApp opened */}
              {appLaunched && (
                <div className="p-4 sm:p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0A2540] space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-emerald-800 text-sm">
                        PDF Downloaded & WhatsApp Message Opened! (Ref: {appRefId})
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        Your official application PDF with attached passport and pictures has been downloaded to your device. WhatsApp has also been opened with all your application text details ready to send.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center gap-2.5">
                    {/* Download PDF Again */}
                    <button
                      type="button"
                      onClick={handleDownloadPdfAgain}
                      className="py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0B4DA2]" />
                      <span>Download PDF Again</span>
                    </button>

                    {/* WhatsApp Action */}
                    <a
                      href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                        formatVisaApplicationWhatsApp({
                          referenceId: appRefId,
                          name: appName,
                          nationality: appNationality,
                          isUaeResident: appIsUaeResident,
                          destination: appDestination || 'UAE / Dubai',
                          visaType: selectedVisaType,
                          travelDate: appTravelDate,
                          whatsappNumber: appWhatsAppNumber,
                          uploadedDocuments: getAllUploadedDocumentNames(),
                          uploadedDocumentsCount: getAllUploadedDocumentNames().length
                        })
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <WhatsAppOfficialIcon className="w-4 h-4 fill-current" />
                      <span>Open WhatsApp Chat</span>
                    </a>
                  </div>
                </div>
              )}

              <form onSubmit={handleAppSubmit} className="space-y-6" noValidate>
                {appErrorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{appErrorMessage}</span>
                  </div>
                )}

                {/* 1. Visa Category Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Selected Visa Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {AVAILABLE_VISA_TYPES.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVisaType(v.title)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          selectedVisaType === v.title
                            ? 'border-[#0B4DA2] bg-blue-50/80 text-[#0B4DA2] font-bold ring-1 ring-[#0B4DA2]'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="text-xs">
                          <p className="font-bold">{v.title}</p>
                          <span className="text-[10px] text-slate-400">{v.entry}</span>
                        </div>
                        {selectedVisaType === v.title && (
                          <CheckCircle2 className="w-4 h-4 text-[#0B4DA2] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Applicant Details */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Applicant Information
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Applicant Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="As on Passport"
                          value={appName}
                          onChange={(e) => setAppName(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nationality <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Pakistani, Indian, etc."
                          value={appNationality}
                          onChange={(e) => setAppNationality(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* UAE Resident */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        UAE Resident? <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAppIsUaeResident('Yes')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[44px] ${
                            appIsUaeResident === 'Yes'
                              ? 'border-[#0B4DA2] bg-[#0B4DA2] text-white'
                              : 'border-slate-200 bg-[#F5F7FA] text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {appIsUaeResident === 'Yes' && <Check className="w-3.5 h-3.5" />}
                          <span>Yes</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppIsUaeResident('No')}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[44px] ${
                            appIsUaeResident === 'No'
                              ? 'border-[#0B4DA2] bg-[#0B4DA2] text-white'
                              : 'border-slate-200 bg-[#F5F7FA] text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {appIsUaeResident === 'No' && <Check className="w-3.5 h-3.5" />}
                          <span>No</span>
                        </button>
                      </div>
                    </div>

                    {/* Travel Date */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Travel Date <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="date"
                          required
                          value={appTravelDate}
                          onChange={(e) => setAppTravelDate(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +971 55 558 6359"
                          value={appWhatsAppNumber}
                          onChange={(e) => setAppWhatsAppNumber(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Document Uploads */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Upload Documents (Passport & Photos)
                    </div>
                    <span className="text-[11px] text-slate-500">
                      JPG, PNG, PDF (Max 10MB)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Document 1: Passport Copy */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0A2540]">
                          Clear Color Passport Copy
                        </span>
                        <span className="text-[10px] font-bold text-[#0B4DA2] bg-blue-100/70 px-2 py-0.5 rounded">
                          Required
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Bio-data page (min. 6 months validity)
                      </p>

                      <input
                        type="file"
                        ref={passportCopyInputRef}
                        onChange={(e) => handleFileChange(e, 'passport')}
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                      />

                      {passportCopy ? (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-semibold text-emerald-900 truncate">
                                {passportCopy.name}
                              </p>
                              <p className="text-[10px] text-emerald-600">
                                {formatFileSize(passportCopy.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPassportCopy(null)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => passportCopyInputRef.current?.click()}
                          className="w-full py-3 px-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-[#0B4DA2] bg-white text-slate-600 hover:text-[#0B4DA2] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choose Passport File</span>
                        </button>
                      )}
                    </div>

                    {/* Document 2: Passport Photo */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0A2540]">
                          Passport-Size Photograph
                        </span>
                        <span className="text-[10px] font-bold text-[#0B4DA2] bg-blue-100/70 px-2 py-0.5 rounded">
                          Required
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Recent photo with white background
                      </p>

                      <input
                        type="file"
                        ref={passportPhotoInputRef}
                        onChange={(e) => handleFileChange(e, 'photo')}
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                      />

                      {passportPhoto ? (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-semibold text-emerald-900 truncate">
                                {passportPhoto.name}
                              </p>
                              <p className="text-[10px] text-emerald-600">
                                {formatFileSize(passportPhoto.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPassportPhoto(null)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => passportPhotoInputRef.current?.click()}
                          className="w-full py-3 px-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-[#0B4DA2] bg-white text-slate-600 hover:text-[#0B4DA2] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choose Photo</span>
                        </button>
                      )}
                    </div>

                    {/* Document 3: Passport Cover Page */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0A2540]">
                          Passport Cover Page
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/70 px-2 py-0.5 rounded">
                          Optional
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Front cover scan (if available)
                      </p>

                      <input
                        type="file"
                        ref={passportCoverInputRef}
                        onChange={(e) => handleFileChange(e, 'cover')}
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                      />

                      {passportCover ? (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-semibold text-emerald-900 truncate">
                                {passportCover.name}
                              </p>
                              <p className="text-[10px] text-emerald-600">
                                {formatFileSize(passportCover.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPassportCover(null)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => passportCoverInputRef.current?.click()}
                          className="w-full py-3 px-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-[#0B4DA2] bg-white text-slate-600 hover:text-[#0B4DA2] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choose Cover Page</span>
                        </button>
                      )}
                    </div>

                    {/* Document 4: Additional Supporting Docs */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0A2540]">
                          Additional Supporting Docs
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/70 px-2 py-0.5 rounded">
                          Optional
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        National ID, Previous Visa, Ticket, Sponsor Docs
                      </p>

                      <input
                        type="file"
                        ref={additionalFilesInputRef}
                        onChange={(e) => handleFileChange(e, 'additional')}
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => additionalFilesInputRef.current?.click()}
                        className="w-full py-3 px-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-[#0B4DA2] bg-white text-slate-600 hover:text-[#0B4DA2] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Attach Extra Files</span>
                      </button>
                    </div>

                  </div>

                  {/* Additional Files List */}
                  {additionalFiles.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-slate-700 block">
                        Additional Files Attached ({additionalFiles.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {additionalFiles.map((file) => (
                          <div
                            key={file.id}
                            className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <File className="w-3.5 h-3.5 text-[#0B4DA2] shrink-0" />
                              <div className="truncate">
                                <p className="text-xs font-medium text-slate-800 truncate">
                                  {file.name}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAdditionalFile(file.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2 space-y-2">
                  {appErrorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{appErrorMessage}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isAppSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[50px]"
                  >
                    {isAppSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating PDF & Opening WhatsApp...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Generate Application PDF & Open WhatsApp</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Automatically saves official PDF on your device and opens WhatsApp with your full application.
                  </p>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default VisaPage;
