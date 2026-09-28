import React from 'react';
import { PageRoute } from '../types';
import { PageHeader } from '../components/PageHeader';
import { ShieldCheck, Mail, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPageProps {
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ currentRoute, setRoute }) => {
  return (
    <div>
      <PageHeader
        title="Privacy Policy"
        subtitle="ZONE TOURISM LLC & HOTWHEELS CAR RENTAL LLC Privacy & Data Protection Policy"
        currentRoute={currentRoute}
        setRoute={setRoute}
      />

      <section className="py-16 sm:py-20 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            
            {/* Intro Lead */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0A2540]/5 border border-[#0A2540]/10 text-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-[#0B4DA2] font-bold text-sm uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5 text-[#0B4DA2]" />
                <span>Commitment to Your Privacy</span>
              </div>
              <p className="font-medium text-slate-800 leading-relaxed text-sm sm:text-base">
                <strong>ZONE TOURISM LLC & HOTWHEELS CAR RENTAL LLC</strong> respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, handle, and safeguard personal and travel-related information when you use our services.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-[#0A2540] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-black inline-flex items-center justify-center">1</span>
                <span>Information We Collect</span>
              </h2>
              <p>
                When you enquire about UAE visit visa services or car rental services through <strong>ZONE TOURISM LLC & HOTWHEELS CAR RENTAL LLC</strong>, we may collect information necessary to process your request, including:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 pl-1">
                {[
                  'Full name',
                  'Nationality',
                  'Passport and residency information',
                  'Travel destination and intended travel dates',
                  'WhatsApp or other contact details',
                  'Documents required for visa processing or car rental services'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-[#0B4DA2] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-2 text-xs sm:text-sm text-slate-600">
                We collect only information that is reasonably necessary to provide and manage our services.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-3 border-t border-slate-100 pt-8">
              <h2 className="text-lg sm:text-xl font-black text-[#0A2540] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-black inline-flex items-center justify-center">2</span>
                <span>Passport & Document Handling</span>
              </h2>
              <p>
                Where required, customers may submit passports and other supporting documents through WhatsApp, email, or our official communication channels.
              </p>
              <p>
                We treat all submitted documents as confidential and take reasonable measures to protect them. Documents required for visa processing may be shared only with authorized immigration, government, airline, or relevant processing channels where necessary to complete the requested service.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-3 border-t border-slate-100 pt-8">
              <h2 className="text-lg sm:text-xl font-black text-[#0A2540] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-black inline-flex items-center justify-center">3</span>
                <span>How We Use Your Information</span>
              </h2>
              <p>
                The information we collect may be used to:
              </p>
              <ul className="space-y-2 pt-1 pl-1">
                {[
                  'Process and coordinate UAE visa applications',
                  'Verify and submit required documentation',
                  'Provide visa application status updates',
                  'Arrange and manage car rental bookings',
                  'Communicate with you regarding your enquiry or booking',
                  'Respond to customer requests and provide support',
                  'Comply with applicable legal and regulatory requirements'
                ].map((usage, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B4DA2]" />
                    <span>{usage}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-2 text-xs sm:text-sm text-slate-600">
                We do not use your personal information for purposes unrelated to the services requested without appropriate authorization.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3 border-t border-slate-100 pt-8">
              <h2 className="text-lg sm:text-xl font-black text-[#0A2540] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-black inline-flex items-center justify-center">4</span>
                <span>Data Security</span>
              </h2>
              <p>
                We take reasonable and appropriate measures to protect your personal and passport information from unauthorized access, misuse, loss, disclosure, alteration, or destruction.
              </p>
              <p>
                These measures may include restricted access, secure handling procedures, and appropriate technical and organizational safeguards.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 italic">
                However, no method of electronic transmission or storage can be guaranteed to be completely secure.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-3 border-t border-slate-100 pt-8">
              <h2 className="text-lg sm:text-xl font-black text-[#0A2540] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-black inline-flex items-center justify-center">5</span>
                <span>Email & Electronic Communication</span>
              </h2>
              <p>
                Applications, enquiries, and supporting documents may be communicated through our official company email address, <a href="mailto:info@zonetourism.ae" className="text-[#0B4DA2] font-semibold hover:underline">info@zonetourism.ae</a>, or other official communication channels.
              </p>
              <p>
                We do not sell, rent, or trade your personal information to third-party marketers.
              </p>
              <p>
                Information may be shared with service providers, government authorities, immigration channels, or other authorized parties where reasonably necessary to provide the requested service or comply with applicable requirements.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-3 border-t border-slate-100 pt-8">
              <h2 className="text-lg sm:text-xl font-black text-[#0A2540] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-black inline-flex items-center justify-center">6</span>
                <span>Data Retention</span>
              </h2>
              <p>
                We retain personal information and supporting documents only for as long as reasonably necessary to provide our services, maintain appropriate business records, resolve enquiries or disputes, or comply with applicable legal and regulatory obligations.
              </p>
              <p>
                When information is no longer required, we take reasonable steps to securely dispose of or delete it, subject to any applicable retention requirements.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-3 border-t border-slate-100 pt-8">
              <h2 className="text-lg sm:text-xl font-black text-[#0A2540] flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-black inline-flex items-center justify-center">7</span>
                <span>Your Privacy</span>
              </h2>
              <p>
                If you have questions about how your personal information or documents are collected, used, or handled, you may contact us using the details below.
              </p>
            </div>

            {/* Section 8 - Contact Box */}
            <div className="border-t border-slate-100 pt-8">
              <div className="bg-[#0A2540] text-white rounded-2xl p-6 sm:p-8 space-y-3">
                <h2 className="text-lg sm:text-xl font-black flex items-center gap-2 text-white">
                  <span className="w-7 h-7 rounded-xl bg-[#C9A227] text-slate-900 text-xs font-black inline-flex items-center justify-center">8</span>
                  <span>Contact Us</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  For any questions, concerns, or requests regarding this Privacy Policy or our data-handling practices, please contact:
                </p>
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <div className="font-extrabold text-white text-base">
                    ZONE TOURISM LLC & HOTWHEELS CAR RENTAL LLC
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                    <Mail className="w-4 h-4 text-[#C9A227]" />
                    <span>Email: <a href="mailto:info@zonetourism.ae" className="text-[#C9A227] hover:underline font-semibold">info@zonetourism.ae</a></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
