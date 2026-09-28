import React from 'react';
import { 
  Building2, 
  FileCheck2, 
  Car, 
  BadgeCheck, 
  Headphones, 
  MapPin
} from 'lucide-react';

interface TrustSectionProps {
  className?: string;
  setRoute?: (route: any) => void;
  onOpenVisaApp?: () => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ 
  className = ''
}) => {
  const credentials = [
    {
      icon: Building2,
      title: 'Dubai-based company'
    },
    {
      icon: FileCheck2,
      title: 'Professional travel & visa assistance'
    },
    {
      icon: Car,
      title: 'Car rental & chauffeur services'
    },
    {
      icon: BadgeCheck,
      title: 'IATA / licence details only where currently valid'
    },
    {
      icon: Headphones,
      title: 'Customer support'
    },
    {
      icon: MapPin,
      title: 'Physical Dubai office'
    }
  ];

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-8 ${className}`} id="why-choose-us">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
            Why Choose Zone Tourism & Hotwheels?
          </h2>
        </div>

        {/* 6 Genuine Credentials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
          {credentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="p-4 sm:p-5 rounded-2xl bg-[#F5F7FA] border border-slate-200 flex items-center gap-3.5 hover:border-[#0B4DA2]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm sm:text-base font-bold text-[#0A2540] leading-snug">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

