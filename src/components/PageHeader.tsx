import React from 'react';
import { PageRoute } from '../types';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  currentRoute: PageRoute;
  setRoute: (route: PageRoute) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, setRoute }) => {
  return (
    <div className="bg-[#0A2540] text-white py-14 sm:py-16 relative overflow-hidden border-b border-[#0A2540]">
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000"
          alt="Dubai Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0A2540]/90"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-2 text-xs font-semibold mb-3 flex-wrap">
          <button onClick={() => setRoute('home')} className="text-slate-300 hover:text-white cursor-pointer transition-colors shrink-0">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[#C9A227] truncate max-w-[200px] sm:max-w-none">{title}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2.5 text-white break-words">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-200/90 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
