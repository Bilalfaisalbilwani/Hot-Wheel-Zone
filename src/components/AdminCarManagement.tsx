import React, { useState, useEffect } from 'react';
import { CarModel } from '../types';
import { 
  Car, Plus, Edit2, Trash2, CheckCircle2, XCircle, 
  Search, RefreshCw, AlertCircle, Eye, X, 
  DollarSign, Users, Briefcase, Sparkles, Filter,
  LayoutGrid, Table as TableIcon, Copy, ArrowUpDown, Check, 
  ExternalLink, ShieldAlert, Zap, Calculator, Percent,
  Play, Film, Video, Image as ImageIcon
} from 'lucide-react';
import { CarVideoModal } from './CarVideoModal';

interface AdminCarManagementProps {
  token: string;
  showToast: (message: string, isError?: boolean) => void;
}

const CATEGORY_OPTIONS = ['Sedan', 'SUV', 'Luxury', '7-Seater / MPV', 'Sports / Coupe', 'Economy'];
const SERVICE_TYPE_OPTIONS = ['Both', 'Self Drive', 'Chauffeur Driven'];

// Quick Image & Video Presets for Dubai Fleet
const IMAGE_PRESETS = [
  { label: 'Mercedes V-Class VIP', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', videoUrl: '/videos/mercedes_vclass_tour.mp4', make: 'Mercedes-Benz', model: 'V-Class VIP Extra Long', category: 'Luxury', service: 'Both', seats: 7, luggage: '6 Bags', daily: 1200 },
  { label: 'Mercedes Vito', url: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80', videoUrl: '/videos/mercedes_vclass_tour.mp4', make: 'Mercedes-Benz', model: 'Vito Tourer Select', category: '7-Seater / MPV', service: 'Both', seats: 8, luggage: '7 Bags', daily: 850 },
  { label: 'Mercedes S-Class 500', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', videoUrl: '/videos/mercedes_sclass_tour.mp4', make: 'Mercedes-Benz', model: 'S-Class 500 AMG Line', category: 'Luxury', service: 'Both', seats: 4, luggage: '3 Bags', daily: 1800 },
  { label: 'Mercedes E-Class', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80', videoUrl: '/videos/mercedes_sclass_tour.mp4', make: 'Mercedes-Benz', model: 'E-Class Sedan', category: 'Luxury', service: 'Both', seats: 4, luggage: '2 Bags', daily: 650 },
  { label: 'Toyota Land Cruiser Prado', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', videoUrl: '/videos/toyota_prado_tour.mp4', make: 'Toyota', model: 'Land Cruiser Prado TX-L', category: 'SUV', service: 'Self Drive', seats: 7, luggage: '4 Bags', daily: 380 },
  { label: 'Toyota Fortuner 4WD', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80', videoUrl: '/videos/toyota_prado_tour.mp4', make: 'Toyota', model: 'Fortuner 4WD 2.7L', category: 'SUV', service: 'Self Drive', seats: 7, luggage: '4 Bags', daily: 280 },
  { label: 'Nissan Sentra 2.0L', url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80', videoUrl: '/videos/nissan_sentra_tour.mp4', make: 'Nissan', model: 'Sentra 2.0L', category: 'Sedan', service: 'Self Drive', seats: 5, luggage: '2 Bags', daily: 85 },
  { label: 'Chevrolet Malibu Turbo', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', videoUrl: '/videos/chevrolet_malibu_tour.mp4', make: 'Chevrolet', model: 'Malibu Turbo', category: 'Sedan', service: 'Self Drive', seats: 5, luggage: '3 Bags', daily: 80 }
];

export const VIDEO_PRESETS = [
  { label: 'Mercedes V-Class VIP Tour', url: '/videos/mercedes_vclass_tour.mp4' },
  { label: 'Mercedes S-Class 500 Tour', url: '/videos/mercedes_sclass_tour.mp4' },
  { label: 'Toyota Prado 4WD Tour', url: '/videos/toyota_prado_tour.mp4' },
  { label: 'Nissan Sentra Sedan Tour', url: '/videos/nissan_sentra_tour.mp4' },
  { label: 'Chevrolet Malibu Turbo Tour', url: '/videos/chevrolet_malibu_tour.mp4' },
];

export const AdminCarManagement: React.FC<AdminCarManagementProps> = ({ token, showToast }) => {
  const [cars, setCars] = useState<CarModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'monthly-asc' | 'monthly-desc' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State for Full Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarModel | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [autoCalcRates, setAutoCalcRates] = useState(true);

  // Dedicated Quick Pricing Editor Modal State
  const [pricingCar, setPricingCar] = useState<CarModel | null>(null);
  const [pricingFormData, setPricingFormData] = useState({
    dailyPriceAED: 0,
    dailyPriceUSD: 0,
    weeklyPriceAED: 0,
    weeklyPriceUSD: 0,
    monthlyPriceAED: 0,
    monthlyPriceUSD: 0,
  });
  const [isSavingPricing, setIsSavingPricing] = useState(false);

  // View Details Modal State
  const [viewingCar, setViewingCar] = useState<CarModel | null>(null);

  // Video Preview Modal State
  const [previewVideoCar, setPreviewVideoCar] = useState<CarModel | null>(null);

  // Delete Confirmation State
  const [deletingCar, setDeletingCar] = useState<CarModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields State for Add/Edit
  const [formData, setFormData] = useState<{
    make: string;
    model: string;
    category: string;
    serviceType: string;
    seats: number;
    luggage: string;
    dailyPriceAED: number;
    dailyPriceUSD: number;
    weeklyPriceAED: number;
    weeklyPriceUSD: number;
    monthlyPriceAED: number;
    monthlyPriceUSD: number;
    image: string;
    gallery: string[];
    videoUrl: string;
    description: string;
    getQuoteOption: boolean;
    isMercedesChauffeur: boolean;
    isActive: boolean;
  }>({
    make: '',
    model: '',
    category: 'Sedan',
    serviceType: 'Both',
    seats: 5,
    luggage: '2 Bags',
    dailyPriceAED: 200,
    dailyPriceUSD: 55,
    weeklyPriceAED: 1200,
    weeklyPriceUSD: 330,
    monthlyPriceAED: 3800,
    monthlyPriceUSD: 1040,
    image: '',
    gallery: [],
    videoUrl: '',
    description: '',
    getQuoteOption: true,
    isMercedesChauffeur: false,
    isActive: true
  });

  // Fetch cars from database via API
  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/cars', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        showToast('Admin session expired or unauthorized. Please re-login.', true);
        return;
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCars(json.data);
      } else {
        showToast(json.error || 'Failed to load cars from database.', true);
      }
    } catch (err) {
      showToast('Network error while loading cars from database.', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [token]);

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingCar(null);
    setAutoCalcRates(true);
    setFormData({
      make: '',
      model: '',
      category: 'Sedan',
      serviceType: 'Both',
      seats: 5,
      luggage: '2 Bags',
      dailyPriceAED: 300,
      dailyPriceUSD: 82,
      weeklyPriceAED: 1800,
      weeklyPriceUSD: 490,
      monthlyPriceAED: 5200,
      monthlyPriceUSD: 1417,
      image: '',
      gallery: [],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: '',
      getQuoteOption: true,
      isMercedesChauffeur: false,
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (car: CarModel) => {
    setEditingCar(car);
    setAutoCalcRates(false); // In edit mode, retain exact saved values by default
    const dPrice = car.dailyPriceAED || car.dailyPrice || 0;
    const wPrice = car.weeklyPriceAED || car.weeklyPrice || (dPrice * 6);
    const mPrice = car.monthlyPriceAED || car.monthlyPrice || (dPrice * 20);

    setFormData({
      make: car.make,
      model: car.model,
      category: car.category,
      serviceType: car.serviceType || car.rentalType || 'Both',
      seats: car.seats || 5,
      luggage: car.luggage || '2 Bags',
      dailyPriceAED: dPrice,
      dailyPriceUSD: car.dailyPriceUSD || Math.round(dPrice / 3.67),
      weeklyPriceAED: wPrice,
      weeklyPriceUSD: car.weeklyPriceUSD || Math.round(wPrice / 3.67),
      monthlyPriceAED: mPrice,
      monthlyPriceUSD: car.monthlyPriceUSD || Math.round(mPrice / 3.67),
      image: car.image,
      gallery: Array.isArray(car.gallery) ? car.gallery : (Array.isArray((car as any).images) ? (car as any).images : []),
      videoUrl: car.videoUrl || car.video || '',
      description: car.description || '',
      getQuoteOption: Boolean(car.getQuoteOption),
      isMercedesChauffeur: Boolean(car.isMercedesChauffeur),
      isActive: car.isActive !== undefined ? Boolean(car.isActive) : true
    });
    setIsModalOpen(true);
  };

  // Open Quick Pricing Editor Modal
  const handleOpenPricingModal = (car: CarModel) => {
    setPricingCar(car);
    const dPrice = car.dailyPriceAED || car.dailyPrice || 0;
    const wPrice = car.weeklyPriceAED || car.weeklyPrice || (dPrice * 6);
    const mPrice = car.monthlyPriceAED || car.monthlyPrice || (dPrice * 20);

    setPricingFormData({
      dailyPriceAED: dPrice,
      dailyPriceUSD: car.dailyPriceUSD || Math.round(dPrice / 3.67),
      weeklyPriceAED: wPrice,
      weeklyPriceUSD: car.weeklyPriceUSD || Math.round(wPrice / 3.67),
      monthlyPriceAED: mPrice,
      monthlyPriceUSD: car.monthlyPriceUSD || Math.round(mPrice / 3.67),
    });
  };

  // Save Dedicated Quick Pricing
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricingCar) return;

    setIsSavingPricing(true);
    try {
      const res = await fetch(`/api/admin/cars/${pricingCar.id}/pricing`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pricingFormData)
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Pricing updated for ${pricingCar.make} ${pricingCar.model}: Daily AED ${pricingFormData.dailyPriceAED}, Weekly AED ${pricingFormData.weeklyPriceAED}, Monthly AED ${pricingFormData.monthlyPriceAED}.`);
        setCars(prev => prev.map(c => c.id === pricingCar.id ? { ...c, ...pricingFormData } : c));
        setPricingCar(null);
      } else {
        showToast(json.error || 'Failed to update rates in database.', true);
      }
    } catch (err) {
      showToast('Network error while saving pricing rates.', true);
    } finally {
      setIsSavingPricing(false);
    }
  };

  // Quick Calculator: Calculate Weekly and Monthly from Daily
  const handleCalculateFromDaily = (dailyAED: number, target: 'modal' | 'quick') => {
    const val = isNaN(dailyAED) ? 0 : dailyAED;
    const usd = Math.round(val / 3.67);
    const weeklyAED = Math.round(val * 6);
    const weeklyUSD = Math.round(weeklyAED / 3.67);
    const monthlyAED = Math.round(val * 20);
    const monthlyUSD = Math.round(monthlyAED / 3.67);

    if (target === 'modal') {
      setFormData(prev => ({
        ...prev,
        dailyPriceAED: val,
        dailyPriceUSD: usd,
        weeklyPriceAED: weeklyAED,
        weeklyPriceUSD: weeklyUSD,
        monthlyPriceAED: monthlyAED,
        monthlyPriceUSD: monthlyUSD,
      }));
    } else {
      setPricingFormData({
        dailyPriceAED: val,
        dailyPriceUSD: usd,
        weeklyPriceAED: weeklyAED,
        weeklyPriceUSD: weeklyUSD,
        monthlyPriceAED: monthlyAED,
        monthlyPriceUSD: monthlyUSD,
      });
    }
    showToast(`Rates calculated from Daily (AED ${val}): Weekly AED ${weeklyAED}, Monthly AED ${monthlyAED}`);
  };

  // Quick Calculator: Calculate Daily and Weekly from Monthly
  const handleCalculateFromMonthly = (monthlyAED: number, target: 'modal' | 'quick') => {
    const val = isNaN(monthlyAED) ? 0 : monthlyAED;
    const monthlyUSD = Math.round(val / 3.67);
    const dailyAED = Math.round(val / 20);
    const dailyUSD = Math.round(dailyAED / 3.67);
    const weeklyAED = Math.round(dailyAED * 6);
    const weeklyUSD = Math.round(weeklyAED / 3.67);

    if (target === 'modal') {
      setFormData(prev => ({
        ...prev,
        dailyPriceAED: dailyAED,
        dailyPriceUSD: dailyUSD,
        weeklyPriceAED: weeklyAED,
        weeklyPriceUSD: weeklyUSD,
        monthlyPriceAED: val,
        monthlyPriceUSD: monthlyUSD,
      }));
    } else {
      setPricingFormData({
        dailyPriceAED: dailyAED,
        dailyPriceUSD: dailyUSD,
        weeklyPriceAED: weeklyAED,
        weeklyPriceUSD: weeklyUSD,
        monthlyPriceAED: val,
        monthlyPriceUSD: monthlyUSD,
      });
    }
    showToast(`Rates calculated from Monthly (AED ${val}): Daily AED ${dailyAED}, Weekly AED ${weeklyAED}`);
  };

  // Duplicate / Clone a Vehicle
  const handleCloneCar = (car: CarModel) => {
    setEditingCar(null);
    setAutoCalcRates(false);
    const dPrice = car.dailyPriceAED || car.dailyPrice || 0;
    const wPrice = car.weeklyPriceAED || car.weeklyPrice || (dPrice * 6);
    const mPrice = car.monthlyPriceAED || car.monthlyPrice || (dPrice * 20);

    setFormData({
      make: car.make,
      model: `${car.model} (Copy)`,
      category: car.category,
      serviceType: car.serviceType || car.rentalType || 'Both',
      seats: car.seats || 5,
      luggage: car.luggage || '2 Bags',
      dailyPriceAED: dPrice,
      dailyPriceUSD: car.dailyPriceUSD || Math.round(dPrice / 3.67),
      weeklyPriceAED: wPrice,
      weeklyPriceUSD: car.weeklyPriceUSD || Math.round(wPrice / 3.67),
      monthlyPriceAED: mPrice,
      monthlyPriceUSD: car.monthlyPriceUSD || Math.round(mPrice / 3.67),
      image: car.image,
      gallery: Array.isArray(car.gallery) ? [...car.gallery] : (Array.isArray((car as any).images) ? [...(car as any).images] : []),
      videoUrl: car.videoUrl || car.video || '',
      description: car.description || '',
      getQuoteOption: Boolean(car.getQuoteOption),
      isMercedesChauffeur: Boolean(car.isMercedesChauffeur),
      isActive: true
    });
    setIsModalOpen(true);
    showToast(`Cloned template from ${car.make} ${car.model}. Review pricing and save to fleet.`);
  };

  // Apply quick preset
  const handleApplyPreset = (preset: typeof IMAGE_PRESETS[0]) => {
    const dPrice = preset.daily;
    const wPrice = dPrice * 6;
    const mPrice = dPrice * 20;

    setFormData(prev => ({
      ...prev,
      make: preset.make,
      model: preset.model,
      category: preset.category,
      serviceType: preset.service,
      seats: preset.seats,
      luggage: preset.luggage,
      image: preset.url,
      videoUrl: preset.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      dailyPriceAED: dPrice,
      dailyPriceUSD: Math.round(dPrice / 3.67),
      weeklyPriceAED: wPrice,
      weeklyPriceUSD: Math.round(wPrice / 3.67),
      monthlyPriceAED: mPrice,
      monthlyPriceUSD: Math.round(mPrice / 3.67),
      isMercedesChauffeur: preset.make.toLowerCase().includes('mercedes')
    }));
    showToast(`Loaded preset for ${preset.label}`);
  };

  // Save (Create or Update)
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make.trim() || !formData.model.trim() || !formData.image.trim()) {
      showToast('Please fill in vehicle make, model, and image URL.', true);
      return;
    }

    setIsSaving(true);
    try {
      if (editingCar) {
        // PUT update in database
        const res = await fetch(`/api/admin/cars/${editingCar.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        const json = await res.json();
        if (json.success) {
          showToast(`"${formData.make} ${formData.model}" updated successfully in database fleet.`);
          setIsModalOpen(false);
          fetchCars();
        } else {
          showToast(json.error || 'Failed to update vehicle in database.', true);
        }
      } else {
        // POST create in database
        const res = await fetch('/api/admin/cars', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        const json = await res.json();
        if (json.success) {
          showToast(`"${formData.make} ${formData.model}" saved directly to fleet database.`);
          setIsModalOpen(false);
          fetchCars();
        } else {
          showToast(json.error || 'Failed to create vehicle in database.', true);
        }
      }
    } catch (err) {
      showToast('Network error while saving vehicle to database.', true);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (car: CarModel) => {
    const newStatus = !car.isActive;
    // Optimistic UI update
    setCars(prev => prev.map(c => c.id === car.id ? { ...c, isActive: newStatus } : c));

    try {
      const res = await fetch(`/api/admin/cars/${car.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`${car.make} ${car.model} is now ${newStatus ? 'Active in public catalog' : 'Deactivated / Hidden'}.`);
      } else {
        // Revert on failure
        setCars(prev => prev.map(c => c.id === car.id ? { ...c, isActive: car.isActive } : c));
        showToast(json.error || 'Failed to change vehicle status in database.', true);
      }
    } catch (err) {
      setCars(prev => prev.map(c => c.id === car.id ? { ...c, isActive: car.isActive } : c));
      showToast('Network error while toggling vehicle status.', true);
    }
  };

  // Delete Car
  const handleDeleteCar = async () => {
    if (!deletingCar) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/cars/${deletingCar.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        showToast(`"${deletingCar.make} ${deletingCar.model}" deleted permanently from fleet database.`);
        setCars(prev => prev.filter(c => c.id !== deletingCar.id));
        setDeletingCar(null);
      } else {
        showToast(json.error || 'Failed to delete vehicle from database.', true);
      }
    } catch (err) {
      showToast('Network error while deleting vehicle from database.', true);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered & Sorted list
  const filteredCars = cars
    .filter(c => {
      if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
      if (serviceFilter !== 'All' && (c.serviceType || c.rentalType) !== serviceFilter) return false;
      if (statusFilter === 'Active' && !c.isActive) return false;
      if (statusFilter === 'Inactive' && c.isActive) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = `${c.make} ${c.model} ${c.category} ${c.serviceType || c.rentalType} ${c.description || ''}`.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dailyA = a.dailyPriceAED || a.dailyPrice || 0;
      const dailyB = b.dailyPriceAED || b.dailyPrice || 0;
      const monthlyA = a.monthlyPriceAED || a.monthlyPrice || (dailyA * 20);
      const monthlyB = b.monthlyPriceAED || b.monthlyPrice || (dailyB * 20);

      if (sortBy === 'price-asc') return dailyA - dailyB;
      if (sortBy === 'price-desc') return dailyB - dailyA;
      if (sortBy === 'monthly-asc') return monthlyA - monthlyB;
      if (sortBy === 'monthly-desc') return monthlyB - monthlyA;
      if (sortBy === 'name') return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
      return 0; // Default newest
    });

  // Metrics
  const totalCarsCount = cars.length;
  const activeCarsCount = cars.filter(c => c.isActive).length;
  const inactiveCarsCount = totalCarsCount - activeCarsCount;
  const mercedesCarsCount = cars.filter(c => c.isMercedesChauffeur).length;

  return (
    <div className="space-y-6">
      
      {/* Fleet Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center shrink-0">
            <Car className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{totalCarsCount}</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">Total Fleet Vehicles</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">{activeCarsCount}</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">Active / Live in Catalog</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-[#C9A227] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{mercedesCarsCount}</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">Mercedes VIP Chauffeur</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-700">{inactiveCarsCount}</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">Inactive / Maintenance</div>
          </div>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] text-xs font-bold uppercase tracking-wider mb-1.5">
              <Car className="w-3.5 h-3.5" />
              <span>Fleet Database CRUD</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight">
              Hotwheels Vehicle Fleet
            </h2>
            <p className="text-xs text-slate-500">
              Add vehicles, customize Daily / Monthly / Yearly pricing, edit specifications, and manage live availability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-[#0B4DA2] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-[#0B4DA2] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table Spreadsheet View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchCars}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Fleet Data from Database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#0B4DA2]' : ''}`} />
            </button>

            {/* Add Car Button */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search make, model, category..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2] bg-slate-50/50"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white cursor-pointer focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white cursor-pointer focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
            >
              <option value="All">All Rental Services</option>
              {SERVICE_TYPE_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Sort By Option */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white cursor-pointer focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none font-medium"
            >
              <option value="newest">Sort: Newest Added</option>
              <option value="price-asc">Sort: Daily Rate (Low to High)</option>
              <option value="price-desc">Sort: Daily Rate (High to Low)</option>
              <option value="monthly-asc">Sort: Monthly Rate (Low to High)</option>
              <option value="monthly-desc">Sort: Monthly Rate (High to Low)</option>
              <option value="name">Sort: Brand / Model (A to Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* FLEET DISPLAY (GRID OR TABLE) */}
      {isLoading && cars.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#0B4DA2] mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading fleet database...</p>
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs space-y-3">
          <Car className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No vehicles found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No cars match your search filter "{searchQuery || categoryFilter || statusFilter}". Try clearing filters or click "Add Vehicle" to register a new car.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#0B4DA2] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle Now</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCars.map((car) => {
            const dailyAED = car.dailyPriceAED || car.dailyPrice || 0;
            const dailyUSD = car.dailyPriceUSD || Math.round(dailyAED / 3.67);
            const weeklyAED = car.weeklyPriceAED || car.weeklyPrice || (dailyAED * 6);
            const weeklyUSD = car.weeklyPriceUSD || Math.round(weeklyAED / 3.67);
            const monthlyAED = car.monthlyPriceAED || car.monthlyPrice || (dailyAED * 20);
            const monthlyUSD = car.monthlyPriceUSD || Math.round(monthlyAED / 3.67);

            return (
              <div 
                key={car.id} 
                className={`group bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                  car.isActive ? 'border-slate-200' : 'border-slate-300 opacity-75 bg-slate-50/50'
                }`}
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Category & Chauffeur Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white font-bold text-[10px] tracking-wide uppercase border border-white/20">
                        {car.category}
                      </span>
                      {car.isMercedesChauffeur && (
                        <span className="px-2.5 py-1 rounded-full bg-[#C9A227] text-white font-bold text-[10px] tracking-wide uppercase flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-2.5 h-2.5" /> Mercedes VIP
                        </span>
                      )}
                    </div>

                    {/* Active Status Toggle Button */}
                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(car)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md cursor-pointer transition-all flex items-center gap-1 backdrop-blur-xs border ${
                          car.isActive
                            ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white border-emerald-400'
                            : 'bg-slate-800/90 hover:bg-slate-900 text-slate-300 border-slate-600'
                        }`}
                        title={car.isActive ? 'Click to deactivate vehicle' : 'Click to activate vehicle'}
                      >
                        {car.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bottom Car Make & Model on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-base sm:text-lg font-black tracking-tight leading-snug">
                        {car.make} {car.model}
                      </div>
                      <div className="text-[11px] text-slate-300 font-medium flex items-center gap-2 mt-0.5">
                        <span>{car.serviceType || car.rentalType || 'Both Self & Chauffeur'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Specs and Rates */}
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Specs Pills */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Users className="w-3.5 h-3.5 text-[#0B4DA2]" />
                        <span className="font-semibold">{car.seats || 5} Passengers</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-[#0B4DA2]" />
                        <span className="font-semibold">{car.luggage || '2 Bags'}</span>
                      </div>
                    </div>

                    {/* Pricing Grid (Daily, Monthly, Yearly Rates) */}
                    <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-200/60">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-[#0B4DA2]" />
                          <span>Fleet Pricing Rates</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenPricingModal(car)}
                          className="text-[11px] font-bold text-[#0B4DA2] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Quick Edit Rates</span>
                        </button>
                      </div>

                      {/* Daily */}
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500 font-medium">Daily Rate:</span>
                        <div className="text-right">
                          <span className="text-sm font-black text-[#0A2540]">AED {dailyAED.toLocaleString()}</span>
                          <span className="text-[11px] text-slate-500 ml-1 font-semibold">(~${dailyUSD})</span>
                        </div>
                      </div>

                      {/* Weekly */}
                      <div className="flex items-baseline justify-between text-xs text-slate-600">
                        <span className="text-[11px] text-slate-500 font-medium">Weekly Rate:</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-800">AED {weeklyAED.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 ml-1">(~${weeklyUSD})</span>
                        </div>
                      </div>

                      {/* Monthly */}
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-[11px] text-slate-500 font-medium">Monthly Rate:</span>
                        <div className="text-right">
                          <span className="font-black text-slate-900">AED {monthlyAED.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 ml-1">(~${monthlyUSD})</span>
                        </div>
                      </div>
                    </div>

                    {car.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                        "{car.description}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewingCar(car)}
                      className="p-2 rounded-xl text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 transition-colors cursor-pointer"
                      title="View Full Specifications"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {(car.videoUrl || car.video) && (
                      <button
                        type="button"
                        onClick={() => setPreviewVideoCar(car)}
                        className="p-2 rounded-xl text-[#0B4DA2] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Watch HD Walkaround Video"
                      >
                        <Play className="w-4 h-4 fill-[#0B4DA2]" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Quick Rates Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenPricingModal(car)}
                      className="px-2.5 py-1.5 rounded-xl border border-amber-300/80 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Quickly edit daily, weekly, and monthly pricing"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Rates</span>
                    </button>

                    {/* Clone */}
                    <button
                      type="button"
                      onClick={() => handleCloneCar(car)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Duplicate this vehicle"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Clone</span>
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(car)}
                      className="px-3 py-1.5 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Edit vehicle details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeletingCar(car)}
                      className="p-1.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete vehicle from database"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Vehicle</th>
                  <th className="py-3.5 px-3">Category & Service</th>
                  <th className="py-3.5 px-3">Daily (AED / USD)</th>
                  <th className="py-3.5 px-3">Weekly (AED)</th>
                  <th className="py-3.5 px-3">Monthly (AED)</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCars.map((car) => {
                  const dailyAED = car.dailyPriceAED || car.dailyPrice || 0;
                  const dailyUSD = car.dailyPriceUSD || Math.round(dailyAED / 3.67);
                  const weeklyAED = car.weeklyPriceAED || car.weeklyPrice || (dailyAED * 6);
                  const weeklyUSD = car.weeklyPriceUSD || Math.round(weeklyAED / 3.67);
                  const monthlyAED = car.monthlyPriceAED || car.monthlyPrice || (dailyAED * 20);
                  const monthlyUSD = car.monthlyPriceUSD || Math.round(monthlyAED / 3.67);

                  return (
                    <tr key={car.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Vehicle info */}
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={car.image} 
                            alt={`${car.make} ${car.model}`}
                            className="w-14 h-10 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div>
                            <div className="font-black text-slate-900 text-sm">
                              {car.make} {car.model}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {car.isMercedesChauffeur && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C9A227] bg-[#C9A227]/10 px-1.5 py-0.5 rounded">
                                  <Sparkles className="w-2.5 h-2.5" /> Mercedes VIP
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400">
                                {car.seats || 5} Seats · {car.luggage || '2 Bags'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Service */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-[11px]">
                            {car.category}
                          </span>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {car.serviceType || car.rentalType || 'Both'}
                          </div>
                        </div>
                      </td>

                      {/* Daily Rates */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">
                          AED {dailyAED.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          ~ USD ${dailyUSD} / day
                        </div>
                      </td>

                      {/* Weekly */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">
                          AED {weeklyAED.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ~ USD ${weeklyUSD} / wk
                        </div>
                      </td>

                      {/* Monthly */}
                      <td className="py-3 px-3">
                        <div className="font-black text-slate-900">
                          AED {monthlyAED.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ~ USD ${monthlyUSD} / mo
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(car)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            car.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                          }`}
                          title={car.isActive ? 'Click to deactivate' : 'Click to activate'}
                        >
                          {car.isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          {(car.videoUrl || car.video) && (
                            <button
                              type="button"
                              onClick={() => setPreviewVideoCar(car)}
                              className="p-1.5 rounded-lg border border-blue-200 bg-blue-50 text-[#0B4DA2] hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Watch / Test Video Walkaround"
                            >
                              <Play className="w-3.5 h-3.5 fill-[#0B4DA2]" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenPricingModal(car)}
                            className="p-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                            title="Quick Edit Pricing (Daily, Weekly, Monthly)"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCloneCar(car)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Clone vehicle"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(car)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0B4DA2] hover:border-[#0B4DA2]/40 hover:bg-[#0B4DA2]/5 transition-colors cursor-pointer"
                            title="Edit vehicle details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCar(car)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete vehicle from database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: DEDICATED QUICK PRICING EDITOR (DAILY, WEEKLY, MONTHLY) */}
      {pricingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-7 my-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0A2540]">
                    Pricing Rates: {pricingCar.make} {pricingCar.model}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Change Daily, Weekly, or Monthly rates directly in database
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPricingCar(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vehicle Summary Bar */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 mt-4">
              <img 
                src={pricingCar.image} 
                alt={`${pricingCar.make} ${pricingCar.model}`} 
                className="w-14 h-11 object-cover rounded-xl border border-slate-200" 
              />
              <div className="text-xs">
                <div className="font-bold text-slate-900">{pricingCar.make} {pricingCar.model}</div>
                <div className="text-slate-500 text-[11px]">{pricingCar.category} · {pricingCar.serviceType || pricingCar.rentalType || 'Both'}</div>
              </div>
            </div>

            {/* Quick Calculator Buttons */}
            <div className="mt-4 p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-amber-700" />
                <span>Auto-Calculation Helpers:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCalculateFromDaily(pricingFormData.dailyPriceAED, 'quick')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold text-left transition-colors cursor-pointer"
                >
                  ⚡ Auto-fill from Daily (x6 wk, x20 mo)
                </button>
                <button
                  type="button"
                  onClick={() => handleCalculateFromMonthly(pricingFormData.monthlyPriceAED, 'quick')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold text-left transition-colors cursor-pointer"
                >
                  ⚡ Auto-fill from Monthly (÷20 day, x6 wk)
                </button>
              </div>
            </div>

            {/* Pricing Form */}
            <form onSubmit={handleSavePricing} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Daily Price AED & USD */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Daily Rate (AED) *
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">1 Day</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    required
                    value={pricingFormData.dailyPriceAED}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setPricingFormData(prev => ({
                        ...prev,
                        dailyPriceAED: val,
                        dailyPriceUSD: Math.round(val / 3.67)
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
                  />
                  <div className="text-[11px] text-slate-500 font-medium">
                    USD: ${pricingFormData.dailyPriceUSD} / day
                  </div>
                </div>

                {/* Weekly Price AED & USD */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Weekly Rate (AED) *
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">7 Days</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    required
                    value={pricingFormData.weeklyPriceAED}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setPricingFormData(prev => ({
                        ...prev,
                        weeklyPriceAED: val,
                        weeklyPriceUSD: Math.round(val / 3.67)
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
                  />
                  <div className="text-[11px] text-slate-500 font-medium">
                    USD: ${pricingFormData.weeklyPriceUSD} / week
                  </div>
                </div>

                {/* Monthly Price AED & USD */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Monthly Rate (AED) *
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">30 Days</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    required
                    value={pricingFormData.monthlyPriceAED}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setPricingFormData(prev => ({
                        ...prev,
                        monthlyPriceAED: val,
                        monthlyPriceUSD: Math.round(val / 3.67)
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
                  />
                  <div className="text-[11px] text-slate-500 font-medium">
                    USD: ${pricingFormData.monthlyPriceUSD} / mo
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPricingCar(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPricing}
                  className="px-6 py-2.5 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingPricing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Rates...</span>
                    </>
                  ) : (
                    <span>Save Pricing to Database</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL ADD / EDIT VEHICLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-7 my-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0B4DA2]/10 text-[#0B4DA2] flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0A2540]">
                    {editingCar ? `Edit Vehicle: ${editingCar.make} ${editingCar.model}` : 'Add New Vehicle to Fleet'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Saves directly to your persistent fleet inventory database
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets Selector */}
            {!editingCar && (
              <div className="pt-3 pb-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Quick Dubai Fleet Presets (Click to autofill):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {IMAGE_PRESETS.slice(0, 6).map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0B4DA2]/10 hover:text-[#0B4DA2] text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer border border-slate-200"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSaveCar} className="space-y-4 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Make */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Make / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mercedes-Benz, Toyota, Nissan"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2] outline-none"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Model & Trim *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. V-Class VIP Extra Long, Fortuner 4WD"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2] outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2] outline-none bg-white cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rental Service *
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2] outline-none bg-white cursor-pointer"
                  >
                    {SERVICE_TYPE_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Seats */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Seating Capacity *
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    required
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 5 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2] outline-none"
                  />
                </div>

                {/* Luggage */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Luggage Capacity *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Bags, 6 Large Bags"
                    value={formData.luggage}
                    onChange={(e) => setFormData({ ...formData, luggage: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2] outline-none"
                  />
                </div>
              </div>

              {/* Pricing Rates Section (Daily, Weekly, Monthly) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#0B4DA2]" />
                    <span>Rental Pricing Rates (Daily, Weekly, Monthly)</span>
                  </h4>

                  {/* Auto-calc toggle and helpers */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCalculateFromDaily(formData.dailyPriceAED, 'modal')}
                      className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-bold cursor-pointer"
                      title="Calculate weekly and monthly based on daily rate"
                    >
                      ⚡ Auto-fill from Daily
                    </button>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoCalcRates}
                        onChange={(e) => setAutoCalcRates(e.target.checked)}
                        className="rounded text-[#0B4DA2]"
                      />
                      <span>Sync when daily changes</span>
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Daily */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Daily Rate (AED) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.dailyPriceAED}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        if (autoCalcRates) {
                          handleCalculateFromDaily(val, 'modal');
                        } else {
                          setFormData({
                            ...formData,
                            dailyPriceAED: val,
                            dailyPriceUSD: Math.round(val / 3.67)
                          });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-black text-slate-900 focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
                    />
                    <div className="text-[10px] text-slate-500 font-semibold">
                      USD: ${formData.dailyPriceUSD} / day
                    </div>
                  </div>

                  {/* Weekly */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Weekly Rate (AED) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.weeklyPriceAED}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setFormData({ 
                          ...formData, 
                          weeklyPriceAED: val, 
                          weeklyPriceUSD: Math.round(val / 3.67) 
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bold focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
                    />
                    <div className="text-[10px] text-slate-500 font-semibold">
                      USD: ${formData.weeklyPriceUSD} / week
                    </div>
                  </div>

                  {/* Monthly */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Monthly Rate (AED) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.monthlyPriceAED}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setFormData({ 
                          ...formData, 
                          monthlyPriceAED: val, 
                          monthlyPriceUSD: Math.round(val / 3.67) 
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bold focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
                    />
                    <div className="text-[10px] text-slate-500 font-semibold">
                      USD: ${formData.monthlyPriceUSD} / month
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Image URL & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Main Vehicle Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2] outline-none"
                />
                {formData.image && (
                  <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-16 h-12 object-cover rounded-lg border border-slate-200 bg-slate-100 shrink-0" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">Primary Card Image Loaded</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-sm">{formData.image}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-Angle Photo Gallery Manager (Additional Images for Lightbox/Gallery) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#0B4DA2]" />
                      <span>Multi-Angle Photo Gallery ({formData.gallery.length} Extra Angles)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      When users click on the car image, they can browse these interior & multi-angle photos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gallery: [...formData.gallery, ''] })}
                    className="px-2.5 py-1 rounded-lg bg-[#0B4DA2] hover:bg-[#083B7D] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Angle Photo</span>
                  </button>
                </div>

                {/* Gallery Items Inputs */}
                {formData.gallery.length === 0 ? (
                  <div className="p-3 bg-white rounded-xl border border-dashed border-slate-300 text-center space-y-2">
                    <p className="text-xs text-slate-500">
                      No additional custom photos added yet. Default smart multi-angle photos (interior cabin, cockpit, rear) will automatically display.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const name = `${formData.make} ${formData.model}`.toLowerCase();
                        if (name.includes('mercedes') || name.includes('v-class') || name.includes('vito')) {
                          setFormData({
                            ...formData,
                            gallery: [
                              'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80',
                              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
                              'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
                            ]
                          });
                        } else if (formData.category === 'SUV' || name.includes('patrol') || name.includes('prado')) {
                          setFormData({
                            ...formData,
                            gallery: [
                              'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
                              'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
                              'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
                            ]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            gallery: [
                              'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
                              'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
                            ]
                          });
                        }
                        showToast('Loaded sample gallery photos');
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-[#0B4DA2] text-xs font-bold hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                    >
                      📸 Auto-fill Sample Gallery Angles
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.gallery.map((gUrl, gIdx) => (
                      <div key={gIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                        {gUrl ? (
                          <img 
                            src={gUrl} 
                            alt={`Angle ${gIdx + 1}`} 
                            className="w-12 h-10 object-cover rounded-lg border border-slate-200 bg-slate-100 shrink-0" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">
                            #{gIdx + 1}
                          </div>
                        )}
                        <input
                          type="url"
                          placeholder={`Photo URL #${gIdx + 1} (Interior, Dashboard, Rear angle...)`}
                          value={gUrl}
                          onChange={(e) => {
                            const updated = [...formData.gallery];
                            updated[gIdx] = e.target.value;
                            setFormData({ ...formData, gallery: updated });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B4DA2]/30 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.gallery.filter((_, idx) => idx !== gIdx);
                            setFormData({ ...formData, gallery: updated });
                          }}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video URL & Real-Time Test Player (CRUD Video Requirement) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#0B4DA2]" />
                    <span>Vehicle Video URL (MP4 / YouTube / Vimeo)</span>
                  </label>
                  {formData.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, videoUrl: '' })}
                      className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Remove Video
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="/videos/mercedes_vclass_tour.mp4 or direct MP4/WebM URL"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2] outline-none"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs">
                    <Video className="w-3.5 h-3.5" />
                    <span>Upload Video File</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 50 * 1024 * 1024) {
                            showToast('Video file exceeds 50MB limit.', true);
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setFormData({ ...formData, videoUrl: reader.result });
                              showToast(`Uploaded video file: ${file.name}`);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Video Preset Quick Helpers */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Quick Sample Walkaround Video Presets:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {VIDEO_PRESETS.map((vp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, videoUrl: vp.url });
                          showToast(`Selected video: ${vp.label}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        🎬 {vp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inline Video Player Preview */}
                {formData.videoUrl && (
                  <div className="mt-2 p-3 bg-slate-900 rounded-xl text-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                        <span>Real-Time Video Preview</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewVideoCar({
                          id: 'preview',
                          make: formData.make || 'Preview',
                          model: formData.model || 'Vehicle',
                          category: formData.category,
                          serviceType: formData.serviceType,
                          seats: formData.seats,
                          luggage: formData.luggage,
                          dailyPriceAED: formData.dailyPriceAED,
                          dailyPriceUSD: formData.dailyPriceUSD,
                          weeklyPriceAED: formData.weeklyPriceAED,
                          weeklyPriceUSD: formData.weeklyPriceUSD,
                          monthlyPriceAED: formData.monthlyPriceAED,
                          monthlyPriceUSD: formData.monthlyPriceUSD,
                          image: formData.image,
                          videoUrl: formData.videoUrl,
                          description: formData.description,
                          isActive: formData.isActive
                        })}
                        className="px-2 py-0.5 rounded bg-[#0B4DA2] text-white text-[10px] font-bold hover:bg-[#083B7D] cursor-pointer"
                      >
                        Open Full Player
                      </button>
                    </div>

                    <div className="relative aspect-video max-h-48 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                      <video
                        src={formData.videoUrl}
                        controls
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                        onError={() => {}}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Vehicle Description & Features
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Luxury executive van with leather captain seats, panoramic roof, rear climate control..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B4DA2]/30 focus:border-[#0B4DA2] outline-none"
                />
              </div>

              {/* Feature Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#0B4DA2] rounded"
                  />
                  <span>Active in Fleet</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isMercedesChauffeur}
                    onChange={(e) => setFormData({ ...formData, isMercedesChauffeur: e.target.checked })}
                    className="w-4 h-4 text-[#0B4DA2] rounded"
                  />
                  <span>Mercedes VIP Chauffeur</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.getQuoteOption}
                    onChange={(e) => setFormData({ ...formData, getQuoteOption: e.target.checked })}
                    className="w-4 h-4 text-[#0B4DA2] rounded"
                  />
                  <span>Show "Get Quote"</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#0B4DA2] hover:bg-[#083B7D] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <span>{editingCar ? 'Update Vehicle in Database' : 'Save to Fleet Database'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW DETAILS */}
      {viewingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="relative aspect-16/10 bg-slate-900">
              <img 
                src={viewingCar.image} 
                alt={`${viewingCar.make} ${viewingCar.model}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setViewingCar(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0B4DA2]/10 text-[#0B4DA2] text-[10px] font-bold uppercase">
                    {viewingCar.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    viewingCar.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {viewingCar.isActive ? 'Active in Live Catalog' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {viewingCar.make} {viewingCar.model}
                </h3>
                <p className="text-xs text-slate-500">{viewingCar.serviceType || viewingCar.rentalType}</p>
              </div>

              {viewingCar.description && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {viewingCar.description}
                </p>
              )}

              {/* Pricing breakdown across all durations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Daily</div>
                  <div className="text-sm font-black text-slate-900">AED {viewingCar.dailyPriceAED || viewingCar.dailyPrice || 0}</div>
                  <div className="text-[10px] text-slate-500">~${viewingCar.dailyPriceUSD || Math.round((viewingCar.dailyPriceAED || viewingCar.dailyPrice || 0) / 3.67)}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Weekly</div>
                  <div className="text-sm font-black text-slate-900">AED {viewingCar.weeklyPriceAED || viewingCar.weeklyPrice || 0}</div>
                  <div className="text-[10px] text-slate-500">~${viewingCar.weeklyPriceUSD || Math.round((viewingCar.weeklyPriceAED || viewingCar.weeklyPrice || 0) / 3.67)}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Monthly</div>
                  <div className="text-sm font-black text-slate-900">AED {viewingCar.monthlyPriceAED || viewingCar.monthlyPrice || 0}</div>
                  <div className="text-[10px] text-slate-500">~${viewingCar.monthlyPriceUSD || Math.round((viewingCar.monthlyPriceAED || viewingCar.monthlyPrice || 0) / 3.67)}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const carToPrice = viewingCar;
                    setViewingCar(null);
                    handleOpenPricingModal(carToPrice);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-900 hover:bg-amber-100 border border-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Edit Rates</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const carToEdit = viewingCar;
                    setViewingCar(null);
                    handleOpenEditModal(carToEdit);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0B4DA2] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Vehicle Specs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deletingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">Delete Vehicle?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete <strong className="text-slate-800">{deletingCar.make} {deletingCar.model}</strong> from the fleet database?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCar(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCar}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete from Database</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: VIDEO PREVIEW PLAYER MODAL */}
      <CarVideoModal
        isOpen={!!previewVideoCar}
        onClose={() => setPreviewVideoCar(null)}
        car={previewVideoCar}
      />

    </div>
  );
};
