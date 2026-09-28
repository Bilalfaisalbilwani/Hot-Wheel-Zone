import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  preferAsset?: boolean;
}

/**
 * Official Zone Tourism Tours & Travels Agency logo with verified asset loader & vector fallback
 */
export const ZoneTourismLogo: React.FC<LogoProps> = ({ className = '', size = 'md', preferAsset = true }) => {
  const [assetFailed, setAssetFailed] = React.useState(false);
  const hasCustomHeight = /\bh-\S+/.test(className);
  const fallbackHeight = size === 'sm' ? 32 : size === 'lg' ? 52 : 40;

  if (preferAsset && !assetFailed) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/assets/zone-tourism-logo.svg"
          alt="Zone Tourism LLC Tours & Travels Agency"
          style={hasCustomHeight ? { maxHeight: '100%', width: 'auto' } : { height: `${fallbackHeight}px`, width: 'auto' }}
          onError={() => setAssetFailed(true)}
          className="h-full w-auto max-h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 420 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={hasCustomHeight ? { maxHeight: '100%', width: 'auto' } : { height: `${fallbackHeight}px`, width: 'auto' }}
        className="h-full w-auto max-h-full overflow-visible"
        aria-label="Zone Tourism LLC Tours & Travels Agency"
      >
        <defs>
          <linearGradient id="ztGlobeGrad" x1="280" y1="20" x2="350" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#89C4F4" />
            <stop offset="50%" stopColor="#258CD8" />
            <stop offset="100%" stopColor="#0B4DA2" />
          </linearGradient>

          <linearGradient id="ztBlueSwoosh" x1="200" y1="50" x2="410" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00A3E0" />
            <stop offset="50%" stopColor="#0090D0" />
            <stop offset="100%" stopColor="#0072CE" />
          </linearGradient>

          <linearGradient id="ztSilverSwoosh" x1="310" y1="60" x2="380" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B0B5BA" />
            <stop offset="100%" stopColor="#7B838B" />
          </linearGradient>

          <linearGradient id="ztTextGrad" x1="30" y1="80" x2="220" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38B6FF" />
            <stop offset="100%" stopColor="#0096E6" />
          </linearGradient>

          <filter id="ztGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#004080" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* --- Globe Group --- */}
        <g transform="translate(285, 12)">
          {/* Globe Sphere Base */}
          <circle cx="50" cy="50" r="44" fill="url(#ztGlobeGrad)" />
          {/* Subtle atmospheric sheen */}
          <ellipse cx="42" cy="30" rx="30" ry="20" fill="white" opacity="0.3" />
          
          {/* Continents overlay */}
          <path
            d="M24 35 C28 28, 36 26, 44 28 C48 30, 46 36, 40 40 C36 43, 30 46, 26 42 Z
               M38 52 C44 50, 52 54, 50 62 C48 70, 38 78, 34 72 C32 66, 34 58, 38 52 Z
               M58 24 C64 22, 74 24, 76 30 C78 36, 70 42, 64 38 C60 34, 56 28, 58 24 Z
               M60 48 C66 44, 78 46, 80 54 C82 62, 72 68, 66 64 C62 60, 58 54, 60 48 Z"
            fill="white"
            opacity="0.85"
          />
        </g>

        {/* --- Dynamic Swoosh Arcs --- */}
        {/* Main upper blue arc piercing globe */}
        <path
          d="M 195 50 Q 320 48 375 78 Q 425 110 335 155 Q 215 175 220 174 Q 380 156 395 110 Q 405 76 310 52 Z"
          fill="url(#ztBlueSwoosh)"
        />

        {/* Inner grey/silver speed arc */}
        <path
          d="M 320 62 Q 380 82 388 108 Q 396 130 330 150 Q 375 128 368 108 Q 360 88 318 64 Z"
          fill="url(#ztSilverSwoosh)"
        />

        {/* Lower blue accent arc */}
        <path
          d="M 245 168 Q 345 164 365 142 Q 380 126 385 116 Q 378 132 350 148 Q 305 165 245 168 Z"
          fill="#0096E6"
        />

        {/* --- Typography --- */}
        {/* "ZONE" - Stylized blue bold letterforms with outline */}
        <g filter="url(#ztGlow)">
          <text
            x="20"
            y="120"
            fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
            fontSize="72"
            fontWeight="900"
            fontStyle="italic"
            letterSpacing="-1"
            fill="url(#ztTextGrad)"
            stroke="#1E293B"
            strokeWidth="5"
            strokeLinejoin="round"
            paintOrder="stroke fill"
          >
            ZONE
          </text>

          {/* "Tourism" in smooth script-like display */}
          <text
            x="200"
            y="114"
            fontFamily="'Playfair Display', Georgia, cursive, serif"
            fontSize="52"
            fontWeight="700"
            fontStyle="italic"
            letterSpacing="0.5"
            fill="url(#ztTextGrad)"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinejoin="round"
            paintOrder="stroke fill"
          >
            Tourism
          </text>
        </g>

        {/* "Tours & Travels Agency" Subtitle */}
        <text
          x="24"
          y="152"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          fontSize="24"
          fontWeight="800"
          fontStyle="italic"
          fill="#0F172A"
          letterSpacing="0.5"
        >
          Tours & Travels Agency
        </text>

        {/* Official LLC badge */}
        <rect x="330" y="136" width="46" height="18" rx="4" fill="#0B4DA2" />
        <text
          x="353"
          y="149"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="11"
          fontWeight="900"
          fill="#FFFFFF"
          textAnchor="middle"
        >
          LLC
        </text>
      </svg>
    </div>
  );
};

/**
 * Official Hotwheels Car Rental LLC logo with verified asset loader & vector fallback
 */
export const HotwheelsLogo: React.FC<LogoProps> = ({ className = '', size = 'md', preferAsset = true }) => {
  const [assetFailed, setAssetFailed] = React.useState(false);
  const hasCustomHeight = /\bh-\S+/.test(className);
  const fallbackHeight = size === 'sm' ? 32 : size === 'lg' ? 52 : 40;

  if (preferAsset && !assetFailed) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/assets/hotwheels-logo.svg"
          alt="Hotwheels Car Rental LLC"
          style={hasCustomHeight ? { maxHeight: '100%', width: 'auto' } : { height: `${fallbackHeight}px`, width: 'auto' }}
          onError={() => setAssetFailed(true)}
          className="h-full w-auto max-h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 440 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={hasCustomHeight ? { maxHeight: '100%', width: 'auto' } : { height: `${fallbackHeight}px`, width: 'auto' }}
        className="h-full w-auto max-h-full overflow-visible"
        aria-label="Hotwheels Car Rental LLC"
      >
        <defs>
          <linearGradient id="hwFlameGrad" x1="60" y1="50" x2="220" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE600" />
            <stop offset="35%" stopColor="#FF7A00" />
            <stop offset="70%" stopColor="#FF2A00" />
            <stop offset="100%" stopColor="#B30000" />
          </linearGradient>

          <radialGradient id="hwWheelHub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="45%" stopColor="#94A3B8" />
            <stop offset="70%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>
        </defs>

        {/* --- Top Sports Car Silhouette --- */}
        {/* Sleek aerodynamic roofline and body arch */}
        <path
          d="M 65 52 
             C 120 48, 140 28, 200 18 
             C 270 18, 330 38, 420 70 
             C 380 62, 330 50, 270 42 
             C 220 34, 180 34, 120 48 
             C 90 54, 75 58, 65 52 Z"
          fill="#0F172A"
        />

        {/* Flame Accent underneath the car hood */}
        <path
          d="M 60 52 
             Q 90 62 130 63 
             Q 180 64 220 63 
             Q 150 68 110 66 
             Q 75 62 60 52 Z"
          fill="url(#hwFlameGrad)"
        />

        {/* --- HOT WHEELS TEXT --- */}
        {/* 'H' */}
        <text
          x="62"
          y="122"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          fontSize="56"
          fontWeight="900"
          fill="#0F172A"
        >
          H
        </text>

        {/* 'O' replaced by Wheel Rim with Flame */}
        {/* Flame trailing behind wheel */}
        <path
          d="M 95 105 Q 85 92 105 84 Q 92 100 102 110 Q 88 108 95 105 Z"
          fill="url(#hwFlameGrad)"
        />
        
        {/* Wheel Assembly at (130, 96) */}
        <g transform="translate(130, 96)">
          {/* Outer Tire */}
          <circle cx="0" cy="0" r="23" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="0" cy="0" r="20.5" fill="none" stroke="#E11D48" strokeWidth="1" />
          {/* Rim Edge */}
          <circle cx="0" cy="0" r="19" fill="#475569" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Rim Hub Inner */}
          <circle cx="0" cy="0" r="16" fill="url(#hwWheelHub)" />
          {/* Spokes (8-Spoke Alloy design) */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={14 * Math.cos((angle * Math.PI) / 180)}
              y2={14 * Math.sin((angle * Math.PI) / 180)}
              stroke="#F8FAFC"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ))}
          {/* Center Lug Cap */}
          <circle cx="0" cy="0" r="5" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="0" cy="0" r="2" fill="#E11D48" />
        </g>

        {/* 'T' */}
        <text
          x="162"
          y="122"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          fontSize="56"
          fontWeight="900"
          fill="#0F172A"
        >
          T
        </text>

        {/* 'WHEELS' */}
        <text
          x="215"
          y="122"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          fontSize="56"
          fontWeight="900"
          letterSpacing="1"
          fill="#0F172A"
        >
          WHEELS
        </text>

        {/* --- CAR RENTAL SUBTITLE --- */}
        <text
          x="62"
          y="152"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          fontSize="24"
          fontWeight="700"
          letterSpacing="4"
          fill="#0F172A"
        >
          CAR RENTAL
        </text>

        {/* Official LLC badge */}
        <rect x="290" y="136" width="46" height="18" rx="4" fill="#0F172A" />
        <text
          x="313"
          y="149"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="11"
          fontWeight="900"
          fill="#FFE600"
          textAnchor="middle"
        >
          LLC
        </text>
      </svg>
    </div>
  );
};
