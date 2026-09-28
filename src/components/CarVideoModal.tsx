import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, MessageSquare, 
  Sparkles, Car, ShieldCheck, ChevronLeft, ChevronRight, 
  Image as ImageIcon, Film, CheckCircle2, Users, Briefcase, 
  Calendar, Phone, ExternalLink, Info, Eye, LayoutGrid, MonitorPlay
} from 'lucide-react';
import { WhatsAppOfficialIcon } from './WhatsAppFloat';
import { COMPANY_CONFIG } from '../data/travelData';
import { buildWhatsAppLink, PRIMARY_WHATSAPP_NUMBER } from '../utils/whatsapp';

export interface MediaVehicle {
  id?: string;
  make?: string;
  model?: string;
  category?: string;
  image?: string;
  gallery?: string[];
  images?: string[];
  videoUrl?: string;
  video?: string;
  dailyPriceAED?: number;
  dailyPriceUSD?: number;
  weeklyPriceAED?: number;
  monthlyPriceAED?: number;
  dailyPrice?: number;
  seats?: number;
  luggage?: string;
  luggageCapacity?: string;
  description?: string;
  isMercedesChauffeur?: boolean;
  serviceType?: string;
  rentalType?: string;
}

interface CarMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: MediaVehicle | null;
  initialMode?: 'photo' | 'video';
  onOpenEnquiry?: (type: 'visa' | 'car-rental', item?: string) => void;
}

// Extract all photos uploaded for the vehicle (main image + gallery array)
function getVehicleGallery(car: MediaVehicle): string[] {
  const list: string[] = [];

  // Main vehicle photo
  if (car.image && typeof car.image === 'string' && car.image.trim()) {
    list.push(car.image.trim());
  }

  // Extra photos uploaded by admin in gallery
  const extraList = (Array.isArray(car.gallery) && car.gallery.length > 0
    ? car.gallery
    : Array.isArray(car.images) && car.images.length > 0
      ? car.images
      : []
  );

  for (const img of extraList) {
    if (img && typeof img === 'string' && img.trim() && !list.includes(img.trim())) {
      list.push(img.trim());
    }
  }

  if (list.length > 0) {
    return list;
  }

  return ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'];
}

const PHOTO_ANGLE_LABELS = [
  'Main Exterior',
  'Interior Luxury Cabin',
  'Cockpit & Dashboard',
  'Rear Angle & Cargo',
  'Side Profile',
  'Detail View',
  'Angle #7',
  'Angle #8',
  'Angle #9',
  'Angle #10'
];

export const CarMediaModal: React.FC<CarMediaModalProps> = ({
  isOpen,
  onClose,
  car,
  initialMode = 'photo',
  onOpenEnquiry
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeMedia, setActiveMedia] = useState<'video' | 'grid' | number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const videoUrl = car?.videoUrl || car?.video || '';
  const gallery = car ? getVehicleGallery(car) : [];
  const hasVideo = Boolean(videoUrl);

  // Initialize active media when modal opens
  useEffect(() => {
    if (isOpen) {
      setVideoError(false);
      if (initialMode === 'video' && hasVideo) {
        setActiveMedia('video');
        setIsPlaying(true);
      } else {
        setActiveMedia(0);
      }
    }
  }, [isOpen, car, initialMode, hasVideo]);

  // Handle Video Autoplay & Reset
  useEffect(() => {
    if (activeMedia === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [activeMedia]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (activeMedia === 'video') {
          setActiveMedia(gallery.length - 1);
        } else if (typeof activeMedia === 'number') {
          setActiveMedia(prev => (typeof prev === 'number' ? (prev === 0 ? (hasVideo ? 'video' : gallery.length - 1) : prev - 1) : 0));
        }
      } else if (e.key === 'ArrowRight') {
        if (activeMedia === 'video') {
          setActiveMedia(0);
        } else if (typeof activeMedia === 'number') {
          setActiveMedia(prev => (typeof prev === 'number' ? (prev === gallery.length - 1 ? (hasVideo ? 'video' : 0) : prev + 1) : 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeMedia, gallery.length, hasVideo, onClose]);

  if (!isOpen || !car) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Next / Previous Photo Nav
  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMedia === 'video') {
      setActiveMedia(gallery.length - 1);
    } else if (typeof activeMedia === 'number') {
      setActiveMedia(prev => (typeof prev === 'number' ? (prev === 0 ? (hasVideo ? 'video' : gallery.length - 1) : prev - 1) : 0));
    }
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMedia === 'video') {
      setActiveMedia(0);
    } else if (typeof activeMedia === 'number') {
      setActiveMedia(prev => {
        if (typeof prev === 'number') {
          if (prev === gallery.length - 1) {
            return hasVideo ? 'video' : 0;
          }
          return prev + 1;
        }
        return 0;
      });
    }
  };

  // Embed URL helper (YouTube / Vimeo / Shorts)
  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    // Standard YouTube watch or embed
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch && vimeoMatch[3]) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1&muted=1`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const makeModel = `${car.make || ''} ${car.model || ''}`.trim() || 'Vehicle';
  const isChauffeur = car.isMercedesChauffeur || car.serviceType === 'CHAUFFEUR DRIVEN' || car.rentalType === 'Chauffeur Driven';

  const waText = isChauffeur
    ? `Hello Hotwheels Car Rental, I saw all photos and video for ${makeModel} (Mercedes VIP Chauffeur). Please share a tailored quotation for my route in Dubai.`
    : `Hello Hotwheels Car Rental, I saw all photos and video for ${makeModel}. Please confirm availability and rental booking details.`;

  const whatsappUrl = buildWhatsAppLink(waText, COMPANY_CONFIG.whatsappNumber || PRIMARY_WHATSAPP_NUMBER);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#0A2540] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col max-h-[94vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 1. Header Bar with Direct Media Tabs & Total Counts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-slate-900/95 shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B4DA2] flex items-center justify-center text-white font-bold shadow-md shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {makeModel}
                </h3>
                {car.category && (
                  <span className="px-2 py-0.5 rounded-full bg-white/15 text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                    {car.category}
                  </span>
                )}
                {car.isMercedesChauffeur && (
                  <span className="px-2 py-0.5 rounded-full bg-[#C9A227] text-[#0A2540] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> VIP Fleet
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-2">
                <span>📸 {gallery.length} Photos</span>
                {hasVideo && <span>• 🎬 1 HD Walkaround Video</span>}
              </p>
            </div>
          </div>

          {/* Quick Media Mode Toggle Tabs + Close */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
            {/* Photos Switch Tab (if has video or multiple photos) */}
            {(hasVideo || gallery.length > 1) && (
              <button
                type="button"
                onClick={() => setActiveMedia(0)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  typeof activeMedia === 'number'
                    ? 'bg-white text-[#0A2540] shadow-sm ring-2 ring-white/50'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#0B4DA2]" />
                <span>Photos ({gallery.length})</span>
              </button>
            )}

            {/* Video Switch Tab (only if video exists) */}
            {hasVideo && (
              <button
                type="button"
                onClick={() => setActiveMedia('video')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMedia === 'video'
                    ? 'bg-[#C9A227] text-[#0A2540] shadow-md ring-2 ring-[#C9A227]/60'
                    : 'bg-[#0B4DA2] text-white hover:bg-blue-600'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>HD Video</span>
              </button>
            )}

            {/* View All Media Grid Tab (if 3 or more media items) */}
            {(gallery.length + (hasVideo ? 1 : 0) >= 3) && (
              <button
                type="button"
                onClick={() => setActiveMedia('grid')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMedia === 'grid'
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
                title="View all photos & video in grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">All Media ({gallery.length + (hasVideo ? 1 : 0)})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-1"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Main Media Viewport (Photo Lightbox, Video Player, or Grid Overview) */}
        <div className="relative w-full bg-black flex items-center justify-center min-h-[280px] sm:min-h-[390px] md:min-h-[460px] max-h-[58vh] overflow-hidden group select-none">
          
          {/* Mode 1: All Media Grid Overview */}
          {activeMedia === 'grid' ? (
            <div className="w-full h-full max-h-[58vh] overflow-y-auto p-4 sm:p-6 bg-slate-950">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
                  <span>Click any photo or video below to view full-size:</span>
                  <span className="text-[#C9A227] font-bold">{gallery.length + (hasVideo ? 1 : 0)} Total Media Files</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {/* Video Tile (if present) */}
                  {hasVideo && (
                    <div 
                      onClick={() => setActiveMedia('video')}
                      className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B4DA2] to-[#0A2540] border-2 border-[#C9A227] flex flex-col items-center justify-center text-center cursor-pointer group/vid shadow-lg hover:scale-102 transition-transform"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/20 group-hover/vid:bg-white/30 flex items-center justify-center text-[#C9A227] mb-1.5 shadow-md">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                      <span className="text-xs font-black text-white tracking-wide uppercase">
                        🎬 HD Video Walkaround
                      </span>
                      <span className="text-[10px] text-amber-200 mt-0.5">Click to Play</span>
                    </div>
                  )}

                  {/* Photo Tiles */}
                  {gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveMedia(idx)}
                      className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-800 border border-white/20 hover:border-[#C9A227] cursor-pointer group/tile shadow-md hover:scale-102 transition-all"
                    >
                      <img
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover/tile:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover/tile:opacity-100 transition-opacity flex items-end p-2.5">
                        <div className="flex items-center justify-between w-full text-[11px] font-bold text-white">
                          <span>{PHOTO_ANGLE_LABELS[idx] || `Angle #${idx + 1}`}</span>
                          <span className="px-1.5 py-0.5 rounded bg-black/60 text-[9px]">{idx + 1}/{gallery.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeMedia === 'video' ? (
            /* Mode 2: Video Player (YouTube / Vimeo Embed OR HTML5 MP4 Stream) */
            embedUrl ? (
              <div className="relative w-full aspect-video min-h-[300px] sm:min-h-[420px] md:min-h-[480px] max-h-[60vh] bg-black flex items-center justify-center">
                <iframe
                  src={embedUrl}
                  title={`${makeModel} Video Walkaround`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : videoUrl && !videoError ? (
              <div className="relative w-full aspect-video min-h-[280px] sm:min-h-[400px] md:min-h-[460px] max-h-[58vh] bg-black flex items-center justify-center">
                {/* Top Video Indicator */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-xs text-white text-xs font-bold border border-white/20 flex items-center gap-2 shadow-md pointer-events-none z-10">
                  <Film className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>HD Video Walkaround</span>
                </div>

                {/* Instant "View Photos" Pill button in video mode */}
                <button
                  type="button"
                  onClick={() => setActiveMedia(0)}
                  className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#0A2540] text-xs font-bold border border-white/30 flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 cursor-pointer backdrop-blur-xs z-10"
                  title="Switch to vehicle photos"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#0B4DA2]" />
                  <span>View Photos ({gallery.length})</span>
                </button>

                <video
                  ref={videoRef}
                  src={videoUrl}
                  poster={car.image}
                  playsInline
                  autoPlay
                  loop
                  muted={isMuted}
                  controls={false}
                  onError={() => setVideoError(true)}
                  className="w-full h-full max-h-[58vh] object-contain cursor-pointer"
                  onClick={togglePlay}
                />

                {/* Video Overlay Controls */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex items-center justify-between pointer-events-auto z-10">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-[#0B4DA2] text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold shadow-xs backdrop-blur-xs"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isPlaying ? 'Pause Video' : 'Play Video'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="px-3 py-2 rounded-xl bg-white/20 hover:bg-[#0B4DA2] text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs backdrop-blur-xs"
                      title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="w-4 h-4 text-amber-300" />
                          <span className="hidden sm:inline">Muted</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <span className="hidden sm:inline">Unmuted</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleFullScreen}
                      className="p-2 rounded-xl bg-white/20 hover:bg-[#0B4DA2] text-white transition-colors cursor-pointer shadow-xs backdrop-blur-xs"
                      title="Fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Center Big Play Button when paused */}
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#0B4DA2]/90 hover:bg-[#0B4DA2] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer z-10"
                  >
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-[#C9A227]">
                  <Film className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">
                    HD Video Walkaround
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Watch the comprehensive walkaround video tour for {makeModel} or browse the multi-angle high-resolution photo gallery.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveMedia(0)}
                    className="px-4 py-2 rounded-xl bg-white text-[#0A2540] hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-4 h-4 text-[#0B4DA2]" />
                    <span>Browse {gallery.length} High-Res Photos</span>
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <WhatsAppOfficialIcon className="w-4 h-4" />
                    <span>Request Live Video on WhatsApp</span>
                  </a>
                </div>
              </div>
            )
          ) : (
            /* Mode 3: Photo Lightbox */
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={gallery[activeMedia as number] || car.image}
                alt={`${makeModel} Photo ${Number(activeMedia) + 1}`}
                className="w-full max-h-[58vh] object-contain transition-all duration-300"
              />

              {/* Photo Counter & Angle Badge */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-xs text-white text-xs font-bold border border-white/20 flex items-center gap-2 shadow-md">
                <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Photo {Number(activeMedia) + 1} of {gallery.length}</span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="text-slate-200 text-[11px]">{PHOTO_ANGLE_LABELS[Number(activeMedia)] || 'Vehicle Angle'}</span>
              </div>

              {/* Instant "Watch Video" Pill overlay on photo if video is present */}
              {hasVideo && (
                <button
                  type="button"
                  onClick={() => setActiveMedia('video')}
                  className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#0B4DA2]/95 hover:bg-[#0B4DA2] text-white text-xs font-bold border border-white/30 flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 cursor-pointer backdrop-blur-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch Video</span>
                </button>
              )}
            </div>
          )}

          {/* Left / Right Navigation Arrows (Visible in photo or video mode) */}
          {activeMedia !== 'grid' && (
            <>
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 hover:bg-[#0B4DA2] text-white flex items-center justify-center transition-all cursor-pointer opacity-85 hover:opacity-100 shadow-xl z-20 border border-white/20"
                title="Previous media"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 hover:bg-[#0B4DA2] text-white flex items-center justify-center transition-all cursor-pointer opacity-85 hover:opacity-100 shadow-xl z-20 border border-white/20"
                title="Next media"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* 3. Interactive Multi-Media Strip (All Photos & Video in one unified ribbon) */}
        {(gallery.length > 1 || hasVideo) && (
          <div className="p-3.5 bg-slate-900/95 border-t border-white/10 overflow-x-auto scrollbar-none shrink-0">
            <div className="flex items-center gap-3 max-w-max mx-auto px-2">
              
              {/* Gallery Photo Thumbnails with Labels */}
              {gallery.map((imgUrl, idx) => {
                const isSelected = activeMedia === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMedia(idx)}
                    className={`relative w-22 sm:w-28 h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 group text-left ${
                      isSelected 
                        ? 'border-[#C9A227] scale-105 shadow-lg ring-2 ring-[#C9A227]/60' 
                        : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                    }`}
                    title={`View Photo ${idx + 1}: ${PHOTO_ANGLE_LABELS[idx] || 'Angle'}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                      <span className="text-[9px] font-bold text-white truncate w-full">
                        {PHOTO_ANGLE_LABELS[idx] ? PHOTO_ANGLE_LABELS[idx].split(' ')[0] : `#${idx + 1}`}
                      </span>
                    </div>
                    <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-black/70 text-[8px] font-bold text-white">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}

              {/* Video Thumbnail Tab (if video exists) */}
              {hasVideo && (
                <button
                  type="button"
                  onClick={() => setActiveMedia('video')}
                  className={`relative w-26 sm:w-32 h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-gradient-to-br from-[#0B4DA2] to-[#0A2540] flex flex-col items-center justify-center text-center ${
                    activeMedia === 'video'
                      ? 'border-[#C9A227] scale-105 shadow-lg ring-2 ring-[#C9A227]/70'
                      : 'border-white/20 opacity-70 hover:opacity-100 hover:border-white/50'
                  }`}
                  title="Watch HD Walkaround Video"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[#C9A227] mb-0.5">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <span className="text-[10px] font-extrabold text-white tracking-wide uppercase">
                    🎬 HD Video
                  </span>
                </button>
              )}

            </div>
          </div>
        )}

        {/* 4. Specifications & Fast Booking Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* Left specs */}
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap text-xs">
              <span className="font-bold text-[#C9A227]">
                {car.seats || 5} Passenger Seats
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">
                {car.luggage || car.luggageCapacity || 'Spacious Luggage'}
              </span>
              {car.dailyPriceAED && car.dailyPriceAED > 0 && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="font-extrabold text-white">
                    AED {car.dailyPriceAED.toLocaleString()} / day
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-300 line-clamp-1 max-w-lg">
              {car.description || 'Full comprehensive UAE insurance, sanitized condition, and 24/7 Dubai roadside support.'}
            </p>
          </div>

          {/* Right Fast Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            {onOpenEnquiry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEnquiry('car-rental', makeModel);
                }}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Online Form
              </button>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <WhatsAppOfficialIcon className="w-4 h-4 text-white" />
              <span>Book / Enquire on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

// Also export as CarVideoModal for backward compatibility
export const CarVideoModal = CarMediaModal;
export default CarMediaModal;
