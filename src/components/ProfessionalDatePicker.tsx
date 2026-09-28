import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Sparkles,
  Clock
} from 'lucide-react';

export interface ProfessionalDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  minDate?: string; // YYYY-MM-DD (e.g. today)
  maxDate?: string; // YYYY-MM-DD
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
  name?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ProfessionalDatePicker: React.FC<ProfessionalDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select Travel Date',
  required = false,
  minDate,
  maxDate,
  disabled = false,
  error,
  className = '',
  id,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value or default to today's view
  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  const selectedDateObj = parseDate(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // View state for navigating months
  const [viewYear, setViewYear] = useState<number>(() => {
    return selectedDateObj ? selectedDateObj.getFullYear() : today.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState<number>(() => {
    return selectedDateObj ? selectedDateObj.getMonth() : today.getMonth();
  });

  // When value changes from outside, update view month/year
  useEffect(() => {
    if (value) {
      const d = parseDate(value);
      if (d) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewYear(parseInt(e.target.value, 10));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewMonth(parseInt(e.target.value, 10));
  };

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInCurrentMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Helper to format YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const isDateDisabled = (year: number, month: number, day: number) => {
    const dateStr = formatDateString(year, month, day);
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  const isToday = (year: number, month: number, day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isSelected = (year: number, month: number, day: number) => {
    if (!selectedDateObj) return false;
    return (
      selectedDateObj.getFullYear() === year &&
      selectedDateObj.getMonth() === month &&
      selectedDateObj.getDate() === day
    );
  };

  const handleSelectDay = (day: number) => {
    if (isDateDisabled(viewYear, viewMonth, day)) return;
    const formatted = formatDateString(viewYear, viewMonth, day);
    onChange(formatted);
    setIsOpen(false);
  };

  // Preset quick selections
  const setQuickDate = (daysFromToday: number) => {
    const target = new Date(today);
    target.setDate(today.getDate() + daysFromToday);
    const y = target.getFullYear();
    const m = target.getMonth();
    const d = target.getDate();
    const formatted = formatDateString(y, m, d);
    
    if (minDate && formatted < minDate) return;
    if (maxDate && formatted > maxDate) return;

    setViewYear(y);
    setViewMonth(m);
    onChange(formatted);
    setIsOpen(false);
  };

  // Human readable display string
  const formatDisplayString = (dateStr: string) => {
    if (!dateStr) return '';
    const d = parseDate(dateStr);
    if (!d) return dateStr;
    
    const dayName = DAYS_OF_WEEK[d.getDay()];
    const monthName = SHORT_MONTH_NAMES[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();

    return `${dayName}, ${day} ${monthName} ${year}`;
  };

  // Generate Year options (current year - 1 to current year + 5)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 1; y <= currentYear + 6; y++) {
    yearOptions.push(y);
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
          {value && (
            <span className="text-[11px] font-semibold text-[#0B4DA2] normal-case">
              {formatDisplayString(value)}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button / Input lookalike */}
      <div className="relative group">
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all text-left cursor-pointer min-h-[44px] ${
            isOpen 
              ? 'border-[#0B4DA2] ring-2 ring-[#0B4DA2]/20 bg-white shadow-xs' 
              : error 
                ? 'border-rose-300 bg-rose-50/20' 
                : 'border-slate-300 bg-white hover:border-slate-400'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className={value ? 'text-slate-900 font-medium' : 'text-slate-400'}>
              {value ? formatDisplayString(value) : placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {value && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Clear date"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-[#0B4DA2]/10 group-hover:text-[#0B4DA2] transition-colors">
              Date
            </span>
          </div>
        </button>

        {/* Calendar Icon on the left */}
        <div className="absolute left-3.5 top-3 pointer-events-none text-slate-400 group-hover:text-[#0B4DA2] transition-colors">
          <CalendarIcon className="w-4 h-4 text-[#0B4DA2]" />
        </div>
      </div>

      {/* Hidden input for HTML form submission compatibility */}
      {name && (
        <input 
          type="hidden" 
          name={name} 
          value={value} 
          required={required} 
        />
      )}

      {error && (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      )}

      {/* Dropdown Calendar Popover */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-2 left-0 right-0 sm:right-auto sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 animate-in fade-in-0 zoom-in-95 duration-150"
          style={{ boxShadow: '0 20px 35px -10px rgba(11, 77, 162, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.08)' }}
        >
          {/* Header with Quick Month/Year Switcher */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              <select
                value={viewMonth}
                onChange={handleMonthChange}
                className="text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg px-2 py-1.5 border-none cursor-pointer focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={handleYearChange}
                className="text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg px-2 py-1.5 border-none cursor-pointer focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets (Smart Booking Options) */}
          <div className="mb-3">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Quick Travel Options</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="px-1.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-[#0B4DA2] hover:text-white rounded-md transition-all text-center cursor-pointer truncate"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="px-1.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-[#0B4DA2] hover:text-white rounded-md transition-all text-center cursor-pointer truncate"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(7)}
                className="px-1.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-[#0B4DA2] hover:text-white rounded-md transition-all text-center cursor-pointer truncate"
              >
                +1 Week
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(30)}
                className="px-1.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-[#0B4DA2] hover:text-white rounded-md transition-all text-center cursor-pointer truncate"
              >
                +1 Month
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1 text-center">
            {DAYS_OF_WEEK.map((day, idx) => (
              <div 
                key={day} 
                className={`text-[11px] font-bold py-1 ${
                  idx === 0 || idx === 6 ? 'text-amber-600/80' : 'text-slate-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty offset spaces before first day */}
            {Array.from({ length: firstDay }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-8" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
              const day = idx + 1;
              const disabledDay = isDateDisabled(viewYear, viewMonth, day);
              const selected = isSelected(viewYear, viewMonth, day);
              const currentDay = isToday(viewYear, viewMonth, day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center relative transition-all cursor-pointer ${
                    selected
                      ? 'bg-gradient-to-br from-[#0B4DA2] to-[#083877] text-white shadow-md shadow-blue-500/30 font-bold scale-105'
                      : currentDay
                        ? 'border border-[#0B4DA2] text-[#0B4DA2] bg-blue-50/50 hover:bg-blue-100/70 font-bold'
                        : disabledDay
                          ? 'text-slate-300 bg-slate-50/50 cursor-not-allowed line-through text-[11px]'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{day}</span>
                  {currentDay && !selected && (
                    <span className="w-1 h-1 rounded-full bg-[#0B4DA2] absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer with Selected Date & Confirmation */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-[#0B4DA2]" />
              <span className="truncate max-w-[150px] font-medium text-slate-800">
                {value ? formatDisplayString(value) : 'No date chosen'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#0B4DA2] hover:bg-[#093d82] rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
