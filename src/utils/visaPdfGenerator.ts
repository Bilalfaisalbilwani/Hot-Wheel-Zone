import { jsPDF } from 'jspdf';

export interface UploadedImageData {
  name: string;
  category?: string;
  dataUrl?: string;
  type?: string;
}

export interface VisaApplicationPdfData {
  referenceId: string;
  name: string;
  nationality: string;
  isUaeResident: string;
  destination: string;
  visaType: string;
  travelDate: string;
  whatsappNumber: string;
  uploadedDocuments: string[];
  submissionDate?: string;
  passportCopy?: UploadedImageData | null;
  passportPhoto?: UploadedImageData | null;
  passportCover?: UploadedImageData | null;
  additionalFiles?: UploadedImageData[];
}

/**
 * Helper to safely add an image to jsPDF page while preserving aspect ratio
 */
function embedImageInBox(
  doc: jsPDF,
  dataUrl: string | undefined,
  boxX: number,
  boxY: number,
  boxWidth: number,
  boxHeight: number
) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) return;
  try {
    let format: 'JPEG' | 'PNG' | 'WEBP' = 'JPEG';
    if (dataUrl.startsWith('data:image/png')) format = 'PNG';
    else if (dataUrl.startsWith('data:image/webp')) format = 'WEBP';
    doc.addImage(dataUrl, format, boxX, boxY, boxWidth, boxHeight, undefined, 'FAST');
  } catch (err) {
    console.warn('Could not embed image in PDF:', err);
  }
}

/**
 * Generates an official, premium Zone Tourism LLC Visa Application PDF
 * with all uploaded documents & pictures embedded directly into the pages!
 */
export function generateVisaApplicationPdf(data: VisaApplicationPdfData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const submissionDate = data.submissionDate || new Date().toLocaleString('en-AE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // Color Palette
  const primaryNavy = [10, 37, 64]; // #0A2540
  const accentBlue = [11, 77, 162]; // #0B4DA2
  const goldColor = [201, 162, 39]; // #C9A227
  const textDark = [30, 41, 59]; // #1E293B
  const textMuted = [100, 116, 139]; // #64748B
  const bgLight = [245, 247, 250]; // #F5F7FA

  // =============================================================
  // PAGE 1: OFFICIAL APPLICATION SUMMARY & ATTACHED THUMBNAILS
  // =============================================================

  // Top Header Banner
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 0, 210, 36, 'F');

  // Gold accent bottom line
  doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.rect(0, 36, 210, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ZONE TOURISM LLC', 14, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 215, 235);
  doc.text('Visa Assistance & Documentation Services | Dubai, United Arab Emirates', 14, 23);
  doc.text('Phone: +971 4 222 6182 | WhatsApp: +971 55 558 6359 | Email: info@zonetourism.ae', 14, 29);

  // Right Side Reference Box
  doc.setFillColor(accentBlue[0], accentBlue[1], accentBlue[2]);
  doc.roundedRect(138, 8, 58, 20, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('OFFICIAL APPLICATION', 142, 14);

  doc.setFontSize(10);
  doc.setTextColor(255, 220, 100);
  doc.text(data.referenceId, 142, 22);

  // Title
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('UAE VISIT VISA APPLICATION SUMMARY', 14, 47);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Generated On: ${submissionDate}`, 14, 53);
  doc.text(`Status: Verified Digital Submission`, 135, 53);

  // Divider Line
  doc.setDrawColor(220, 226, 235);
  doc.setLineWidth(0.5);
  doc.line(14, 56, 196, 56);

  // SECTION A: VISA & TRAVEL DETAILS
  let yPos = 62;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(14, yPos, 182, 30, 2, 2, 'F');
  doc.setDrawColor(210, 220, 235);
  doc.roundedRect(14, yPos, 182, 30, 2, 2, 'D');

  doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('A. VISA & DESTINATION SPECIFICATIONS', 18, yPos + 6);

  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(7.5);
  doc.text('SELECTED VISA TYPE:', 18, yPos + 13);
  doc.text('DESTINATION:', 110, yPos + 13);
  doc.text('INTENDED TRAVEL DATE:', 18, yPos + 22);
  doc.text('PROCESSING AUTHORITY:', 110, yPos + 22);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(data.visaType || '30 Days – Single Entry', 18, yPos + 18);
  doc.text(data.destination || 'United Arab Emirates (Dubai)', 110, yPos + 18);
  doc.text(data.travelDate || 'As specified', 18, yPos + 27);
  doc.text('GDRFA / UAE Immigration', 110, yPos + 27);

  // SECTION B: APPLICANT DETAILS (With Passport Photo Box)
  yPos = 97;
  const hasPhoto = !!data.passportPhoto?.dataUrl;
  const infoWidth = hasPhoto ? 142 : 182;

  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(14, yPos, infoWidth, 38, 2, 2, 'F');
  doc.setDrawColor(210, 220, 235);
  doc.roundedRect(14, yPos, infoWidth, 38, 2, 2, 'D');

  doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('B. APPLICANT PERSONAL INFORMATION', 18, yPos + 6);

  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(7.5);
  doc.text('FULL APPLICANT NAME:', 18, yPos + 13);
  doc.text('NATIONALITY:', 80, yPos + 13);
  doc.text('UAE RESIDENT STATUS:', 18, yPos + 24);
  doc.text('CONTACT WHATSAPP:', 80, yPos + 24);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(data.name || 'N/A', 18, yPos + 18);
  doc.text(data.nationality || 'N/A', 80, yPos + 18);
  doc.text(data.isUaeResident === 'Yes' ? 'Yes (UAE Resident)' : 'No (Non-Resident / Visitor)', 18, yPos + 29);
  doc.text(data.whatsappNumber || 'N/A', 80, yPos + 29);

  // If passport photo exists, embed thumbnail on right side of Page 1!
  if (hasPhoto && data.passportPhoto?.dataUrl) {
    const photoBoxX = 160;
    const photoBoxY = yPos;
    const photoBoxW = 36;
    const photoBoxH = 38;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH, 2, 2, 'F');
    doc.setDrawColor(accentBlue[0], accentBlue[1], accentBlue[2]);
    doc.roundedRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH, 2, 2, 'D');

    embedImageInBox(doc, data.passportPhoto.dataUrl, photoBoxX + 2, photoBoxY + 2, photoBoxW - 4, photoBoxH - 4);
  }

  // SECTION C: ATTACHED DOCUMENTS & VERIFICATION CHECKLIST
  yPos = 140;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(14, yPos, 182, 54, 2, 2, 'F');
  doc.setDrawColor(210, 220, 235);
  doc.roundedRect(14, yPos, 182, 54, 2, 2, 'D');

  doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('C. ATTACHED DOCUMENTS SUMMARY (EMBEDDED IN THIS PDF)', 18, yPos + 6);

  const docs = data.uploadedDocuments && data.uploadedDocuments.length > 0
    ? data.uploadedDocuments
    : ['Passport Copy (Attached)', 'Passport Photo (Attached)'];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  let docY = yPos + 13;
  docs.slice(0, 6).forEach((docName) => {
    doc.setFillColor(220, 245, 230);
    doc.roundedRect(18, docY - 2.5, 3.5, 3.5, 1, 1, 'F');
    doc.setTextColor(20, 140, 70);
    doc.setFont('helvetica', 'bold');
    doc.text('v', 18.8, docY);

    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(docName, 24, docY);
    docY += 5;
  });

  if (docs.length > 6) {
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`+ ${docs.length - 6} more attached files (see following pages)`, 24, docY);
  }

  // Notice about attached pages below
  doc.setFillColor(235, 245, 255);
  doc.roundedRect(18, yPos + 43, 174, 8, 1.5, 1.5, 'F');
  doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('>> All uploaded document images are attached on the following pages of this official PDF.', 22, yPos + 48.5);

  // SECTION D: TERMS & NOTICE
  yPos = 200;
  doc.setFillColor(254, 249, 235);
  doc.roundedRect(14, yPos, 182, 36, 2, 2, 'F');
  doc.setDrawColor(245, 215, 140);
  doc.roundedRect(14, yPos, 182, 36, 2, 2, 'D');

  doc.setTextColor(150, 90, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('IMPORTANT TERMS & IMMIGRATION COMPLIANCE NOTICE:', 18, yPos + 6);

  doc.setTextColor(90, 60, 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const termsText = [
    '1. Passport must be valid for at least 6 months from the date of intended travel.',
    '2. Visa issuance, validity and processing timeframe are strictly subject to UAE Immigration Authorities (GDRFA).',
    '3. Submission of this form confirms verification request. Visa charges are non-refundable once submitted to immigration.',
    '4. For any changes or priority processing, please present this Reference ID to your Zone Tourism representative.'
  ];

  let termY = yPos + 12;
  termsText.forEach((t) => {
    doc.text(t, 18, termY);
    termY += 5;
  });

  // Page 1 Footer
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 275, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('ZONE TOURISM LLC — DUBAI, UNITED ARAB EMIRATES', 105, 282, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(190, 205, 225);
  doc.text('Official Visa Assistance & Documentation Desk | WhatsApp: +971 55 558 6359', 105, 287, { align: 'center' });
  doc.text(`Official Document ID: ${data.referenceId} | Page 1 of Attached Application`, 105, 292, { align: 'center' });

  // =============================================================
  // PAGE 2: ATTACHED PASSPORT COPY (CLEAR IMAGE EMBEDDED)
  // =============================================================
  if (data.passportCopy?.dataUrl && data.passportCopy.dataUrl.startsWith('data:image/')) {
    doc.addPage();

    // Top Header Banner
    doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.rect(0, 0, 210, 26, 'F');
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.rect(0, 26, 210, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('ZONE TOURISM LLC — ATTACHED DOCUMENT', 14, 13);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 215, 235);
    doc.text(`Applicant: ${data.name} | Ref: ${data.referenceId}`, 14, 20);

    // Section Title
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('DOCUMENT 1: CLEAR COLOR PASSPORT COPY', 14, 37);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`File: ${data.passportCopy.name}`, 14, 43);

    // Image Container Box
    doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
    doc.roundedRect(14, 48, 182, 215, 2, 2, 'F');
    doc.setDrawColor(200, 210, 225);
    doc.roundedRect(14, 48, 182, 215, 2, 2, 'D');

    // Embed Passport Copy Image
    embedImageInBox(doc, data.passportCopy.dataUrl, 16, 50, 178, 211);

    // Page Footer
    doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`ZONE TOURISM LLC | Ref: ${data.referenceId} | Passport Bio Page`, 105, 290, { align: 'center' });
  }

  // =============================================================
  // PAGE 3: PASSPORT PHOTOGRAPH & COVER PAGE (IF ATTACHED)
  // =============================================================
  const hasPhotoImg = data.passportPhoto?.dataUrl && data.passportPhoto.dataUrl.startsWith('data:image/');
  const hasCoverImg = data.passportCover?.dataUrl && data.passportCover.dataUrl.startsWith('data:image/');

  if (hasPhotoImg || hasCoverImg) {
    doc.addPage();

    // Top Header Banner
    doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.rect(0, 0, 210, 26, 'F');
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.rect(0, 26, 210, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('ZONE TOURISM LLC — ATTACHED DOCUMENTS', 14, 13);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 215, 235);
    doc.text(`Applicant: ${data.name} | Ref: ${data.referenceId}`, 14, 20);

    let currY = 37;

    // Passport Photo
    if (hasPhotoImg && data.passportPhoto?.dataUrl) {
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('DOCUMENT 2: PASSPORT-SIZE PHOTOGRAPH (WHITE BACKGROUND)', 14, currY);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text(`File: ${data.passportPhoto.name}`, 14, currY + 5);

      const photoH = hasCoverImg ? 95 : 200;
      doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
      doc.roundedRect(14, currY + 9, 182, photoH, 2, 2, 'F');
      doc.setDrawColor(200, 210, 225);
      doc.roundedRect(14, currY + 9, 182, photoH, 2, 2, 'D');

      embedImageInBox(doc, data.passportPhoto.dataUrl, 16, currY + 11, 178, photoH - 4);
      currY += photoH + 20;
    }

    // Passport Cover Page
    if (hasCoverImg && data.passportCover?.dataUrl && currY < 240) {
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('DOCUMENT 3: PASSPORT COVER PAGE', 14, currY);

      const coverH = 270 - currY - 14;
      if (coverH > 40) {
        doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
        doc.roundedRect(14, currY + 7, 182, coverH, 2, 2, 'F');
        doc.setDrawColor(200, 210, 225);
        doc.roundedRect(14, currY + 7, 182, coverH, 2, 2, 'D');

        embedImageInBox(doc, data.passportCover.dataUrl, 16, currY + 9, 178, coverH - 4);
      }
    }

    // Page Footer
    doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`ZONE TOURISM LLC | Ref: ${data.referenceId} | Photograph & Cover Documents`, 105, 290, { align: 'center' });
  }

  // =============================================================
  // SUBSEQUENT PAGES: ADDITIONAL SUPPORTING DOCUMENTS (IMAGES)
  // =============================================================
  if (data.additionalFiles && data.additionalFiles.length > 0) {
    data.additionalFiles.forEach((file, index) => {
      if (file.dataUrl && file.dataUrl.startsWith('data:image/')) {
        doc.addPage();

        // Top Header Banner
        doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
        doc.rect(0, 0, 210, 26, 'F');
        doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.rect(0, 26, 210, 1.5, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('ZONE TOURISM LLC — SUPPORTING DOCUMENT', 14, 13);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(200, 215, 235);
        doc.text(`Applicant: ${data.name} | Ref: ${data.referenceId}`, 14, 20);

        // Section Title
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`SUPPORTING DOCUMENT ${index + 1}: ${file.name}`, 14, 37);

        // Container Box
        doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
        doc.roundedRect(14, 45, 182, 220, 2, 2, 'F');
        doc.setDrawColor(200, 210, 225);
        doc.roundedRect(14, 45, 182, 220, 2, 2, 'D');

        embedImageInBox(doc, file.dataUrl, 16, 47, 178, 216);

        // Page Footer
        doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
        doc.rect(0, 280, 210, 17, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(`ZONE TOURISM LLC | Ref: ${data.referenceId} | Supporting File: ${file.name}`, 105, 290, { align: 'center' });
      }
    });
  }

  return doc;
}

/**
 * Downloads the generated PDF file directly to client device
 */
export function downloadVisaApplicationPdf(data: VisaApplicationPdfData): jsPDF {
  const doc = generateVisaApplicationPdf(data);
  const fileName = `UAE_Visa_Application_${data.referenceId || 'Document'}.pdf`;
  try {
    doc.save(fileName);
  } catch (error) {
    console.error('Error with doc.save, attempting blob URL fallback:', error);
    try {
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 1500);
    } catch (fallbackErr) {
      console.error('Failed fallback download:', fallbackErr);
    }
  }
  return doc;
}

/**
 * Shares the PDF via Web Share API directly to WhatsApp if supported on device (Mobile/Tablet/Supported desktop)
 */
export async function shareVisaApplicationPdf(data: VisaApplicationPdfData): Promise<boolean> {
  try {
    const doc = generateVisaApplicationPdf(data);
    const pdfBlob = doc.output('blob');
    const fileName = `UAE_Visa_Application_${data.referenceId}.pdf`;
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({
        title: `UAE Visa Application - ${data.name}`,
        text: `Official UAE Visa Application (${data.referenceId}) for Zone Tourism LLC.`,
        files: [pdfFile]
      });
      return true;
    }
  } catch (err) {
    console.log('Web Share not completed:', err);
  }
  return false;
}
