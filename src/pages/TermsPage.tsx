import React from 'react';
import { PageRoute } from '../types';
import { PageHeader } from '../components/PageHeader';
import { COMPANY_CONFIG } from '../data/travelData';

interface TermsPageProps {
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ currentRoute, setRoute }) => {
  return (
    <div>
      <PageHeader
        title="Terms & Conditions"
        subtitle={`Review the terms and conditions governing the use of ${COMPANY_CONFIG.name} website and services.`}
        currentRoute={currentRoute}
        setRoute={setRoute}
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8 text-slate-700 leading-relaxed text-sm">
          
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the {COMPANY_CONFIG.name} website (the "Service"), you agree to comply with and be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our website or services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Visa Facilitation Services</h2>
            <p>
              Zone Tourism LLC provides visa assistance and application support. Visa approval and processing time are subject to the relevant immigration, consulate or embassy authorities.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Customer Information & Document Submission</h2>
            <p>
              Applicants are responsible for providing authentic, accurate documents and information as required by immigration authorities.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Pricing & Payments</h2>
            <p>
              Service quotes and invoices are issued in UAE Dirhams (AED) or agreed currency equivalents. Bank transfers should include the booking reference number with payment receipts shared with our operations team.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Vehicle Rental & Chauffeur Services</h2>
            <p>
              Vehicle rental and chauffeur services are provided by HOTWHEELS CAR RENTAL LLC. Enquiries and rentals are subject to vehicle availability, standard documentation verification, and vehicle return inspection.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Limitation of Liability</h2>
            <p>
              The company shall not be liable for processing delays or decisions issued by governmental immigration departments or external authorities.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">7. Contact Information</h2>
            <p>
              For any questions regarding these Terms & Conditions, please contact us through our official channels at {COMPANY_CONFIG.email || '[Official Email – Pending Client Update]'} or call {COMPANY_CONFIG.phone || '[Official Phone – Pending Client Update]'}.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};
