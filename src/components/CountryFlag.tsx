import React, { useState, useEffect } from 'react';

interface CountryFlagProps {
  countryCode: string; // ISO 3166-1 alpha-2, e.g. "BE", "FR", "ES"
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Universal ISO-to-Unicode flag emoji converter
 */
export function isoToFlagEmoji(iso: string): string {
  if (!iso || iso.length !== 2) return '🌐';
  const codePoints = [...iso.toUpperCase()].map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Convert a 2-character regional indicator flag emoji (e.g. "🇯🇵") back to lowercase ISO-2 ("jp")
 */
export function flagEmojiToIso(emoji: string): string | null {
  if (!emoji) return null;
  const cps = Array.from(emoji.trim()).map((c) => c.codePointAt(0) || 0);
  if (cps.length === 2 && cps[0] >= 127462 && cps[0] <= 127487 && cps[1] >= 127462 && cps[1] <= 127487) {
    return String.fromCharCode(cps[0] - 127397, cps[1] - 127397).toLowerCase();
  }
  return null;
}

/**
 * Normalize country code to lowercase ISO-2 and resolve local SVG path in /flags/<iso2>.svg
 */
export function resolveLocalCountryFlagUrl(rawCode: string): string {
  const clean = (rawCode || '').trim().toLowerCase();
  const iso = clean === 'uk' ? 'gb' : clean;
  if (/^[a-z]{2}$/.test(iso)) {
    return `/flags/${iso}.svg`;
  }
  return '/flags/un.svg';
}

// 100% Offline Vector Country Flag fallback definitions
const H_TRICOLOR: Record<string, [string, string, string]> = {
  NL: ['#AE1C28', '#FFFFFF', '#21468B'],
  DE: ['#000000', '#DD0000', '#FFCE00'],
  AT: ['#ED2939', '#FFFFFF', '#ED2939'],
  LU: ['#EA141D', '#FFFFFF', '#51ADDA'],
  HU: ['#CE2939', '#FFFFFF', '#477050'],
  BG: ['#FFFFFF', '#00966E', '#D62612'],
  RU: ['#FFFFFF', '#0039A6', '#D52B1E'],
  EE: ['#0072CE', '#000000', '#FFFFFF'],
  LT: ['#FDB913', '#006A44', '#C1272D'],
  LV: ['#9E3039', '#FFFFFF', '#9E3039'],
  ES: ['#AA151B', '#F1BF00', '#AA151B'],
  HR: ['#FF0000', '#FFFFFF', '#171796'],
  RS: ['#C6363C', '#0C4076', '#FFFFFF'],
  SI: ['#FFFFFF', '#005CE6', '#ED1C24'],
  SK: ['#FFFFFF', '#0B4EA2', '#EE1C25'],
  AR: ['#74ACDF', '#FFFFFF', '#74ACDF'],
  CO: ['#FCD116', '#003893', '#CE1126'],
  VE: ['#FCD116', '#00247D', '#CF142B'],
  EC: ['#FFD100', '#0033A0', '#EF3340'],
  BO: ['#D52B1E', '#F9E300', '#007934'],
  PY: ['#D52B1E', '#FFFFFF', '#0038A8'],
  IN: ['#FF9933', '#FFFFFF', '#138808'],
  AM: ['#D90012', '#0033A0', '#F2A800'],
  AZ: ['#0092BC', '#E4002B', '#00AF66'],
  EG: ['#CE1126', '#FFFFFF', '#000000'],
  SY: ['#CE1126', '#FFFFFF', '#000000'],
  IQ: ['#CE1126', '#FFFFFF', '#000000'],
  YE: ['#CE1126', '#FFFFFF', '#000000'],
  GH: ['#CE1126', '#FCD116', '#006B3F'],
  ET: ['#078930', '#FCDD09', '#DA121A'],
  GA: ['#009E60', '#FCD116', '#3A75C4'],
  SL: ['#1EB53A', '#FFFFFF', '#0072C6']
};

const V_TRICOLOR: Record<string, [string, string, string]> = {
  BE: ['#000000', '#FDDA24', '#EF3340'],
  FR: ['#002395', '#FFFFFF', '#ED2939'],
  IT: ['#009246', '#FFFFFF', '#CE2B37'],
  IE: ['#169B62', '#FFFFFF', '#FF883E'],
  RO: ['#002B7F', '#FCD116', '#CE1126'],
  TD: ['#002664', '#FECB00', '#C60C30'],
  MD: ['#003DA5', '#FFD100', '#C8102E'],
  AD: ['#10069F', '#FEDD00', '#D50032'],
  MX: ['#006847', '#FFFFFF', '#CE1126'],
  PE: ['#D91023', '#FFFFFF', '#D91023'],
  CA: ['#FF0000', '#FFFFFF', '#FF0000'],
  NG: ['#008751', '#FFFFFF', '#008751'],
  CI: ['#F77F00', '#FFFFFF', '#009E60'],
  ML: ['#14B53A', '#FCD116', '#CE1126'],
  SN: ['#00853F', '#FDEF42', '#E31B23'],
  GN: ['#CE1126', '#FCD116', '#009460'],
  CM: ['#007A5E', '#CE1126', '#FCD116']
};

const H_BICOLOR: Record<string, [string, string]> = {
  UA: ['#005BBB', '#FFD500'],
  PL: ['#FFFFFF', '#DC143C'],
  MC: ['#CE1126', '#FFFFFF'],
  ID: ['#FF0000', '#FFFFFF'],
  SG: ['#EF3340', '#FFFFFF'],
  LI: ['#002B7F', '#CE1126'],
  SM: ['#FFFFFF', '#5EB6E4']
};

const NORDIC_CROSS: Record<string, [string, string]> = {
  DK: ['#C8102E', '#FFFFFF'],
  SE: ['#006AA7', '#FECC02'],
  FI: ['#FFFFFF', '#002F6C'],
  NO: ['#BA0C2F', '#00205B'],
  IS: ['#02529C', '#DC1E35']
};

export function getCountryFlagSvg(rawCode: string): string {
  const code = (rawCode || '').toUpperCase().trim() === 'UK' ? 'GB' : (rawCode || '').toUpperCase().trim();

  if (code === 'CH') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="40" fill="#DA291C"/><rect x="26" y="8" width="8" height="24" fill="#FFFFFF"/><rect x="18" y="16" width="24" height="8" fill="#FFFFFF"/></svg>`;
  }
  if (code === 'JP') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="40" fill="#FFFFFF"/><circle cx="30" cy="20" r="12" fill="#BC002D"/></svg>`;
  }
  if (code === 'BD') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="40" fill="#006A4E"/><circle cx="27" cy="20" r="11" fill="#F42A41"/></svg>`;
  }
  if (code === 'BR') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="40" fill="#009739"/><polygon points="30,4 55,20 30,36 5,20" fill="#FEDD00"/><circle cx="30" cy="20" r="8.5" fill="#012169"/></svg>`;
  }
  if (code === 'US') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="40" fill="#B22234"/><rect y="6" width="60" height="3" fill="#FFF"/><rect y="12" width="60" height="3" fill="#FFF"/><rect y="18" width="60" height="3" fill="#FFF"/><rect y="24" width="60" height="3" fill="#FFF"/><rect y="30" width="60" height="3" fill="#FFF"/><rect y="36" width="60" height="3" fill="#FFF"/><rect width="26" height="21" fill="#3C3B6E"/></svg>`;
  }
  if (code === 'GB') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="40" fill="#012169"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFF" stroke-width="7"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="4"/><path d="M30,0 V40 M0,20 H60" stroke="#FFF" stroke-width="11"/><path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="6.5"/></svg>`;
  }
  if (H_TRICOLOR[code]) {
    const [c1, c2, c3] = H_TRICOLOR[code];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="13.4" fill="${c1}"/><rect y="13.3" width="60" height="13.4" fill="${c2}"/><rect y="26.6" width="60" height="13.4" fill="${c3}"/></svg>`;
  }
  if (V_TRICOLOR[code]) {
    const [c1, c2, c3] = V_TRICOLOR[code];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="20" height="40" fill="${c1}"/><rect x="20" width="20" height="40" fill="${c2}"/><rect x="40" width="20" height="40" fill="${c3}"/></svg>`;
  }
  if (H_BICOLOR[code]) {
    const [c1, c2] = H_BICOLOR[code];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="20" fill="${c1}"/><rect y="20" width="60" height="20" fill="${c2}"/></svg>`;
  }
  if (NORDIC_CROSS[code]) {
    const [bg, cross] = NORDIC_CROSS[code];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="40" fill="${bg}"/><rect x="18" width="7" height="40" fill="${cross}"/><rect y="16.5" width="60" height="7" fill="${cross}"/></svg>`;
  }

  const hue = ((code.charCodeAt(0) || 65) * 37 + (code.charCodeAt(1) || 65) * 73) % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect width="60" height="40" fill="hsl(${hue}, 65%, 28%)"/><rect width="20" height="40" fill="hsl(${(hue + 45) % 360}, 75%, 38%)"/><text x="30" y="25" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF">${code.slice(0, 2)}</text></svg>`;
}

export function getCountryFlagFallbackDataUrl(code: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(getCountryFlagSvg(code))}`;
}

export function getCountryFlagDataUrl(code: string): string {
  return resolveLocalCountryFlagUrl(code);
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  className = '',
  size = 'md'
}) => {
  const code = (countryCode || '').toUpperCase().trim();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [countryCode]);

  const sizeClasses = {
    sm: 'w-6 h-4 text-sm',
    md: 'w-10 h-7 text-lg',
    lg: 'w-16 h-11 text-2xl',
    xl: 'w-24 h-16 text-4xl'
  };

  const srcUrl = imgError
    ? getCountryFlagFallbackDataUrl(code)
    : resolveLocalCountryFlagUrl(code);

  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden shrink-0 rounded shadow-sm bg-slate-900/60 ${sizeClasses[size]} ${className}`}
      title={code}
    >
      <img
        src={srcUrl}
        alt={`${code} official flag`}
        className="w-full h-full object-cover rounded shadow-sm"
        onError={() => {
          if (!imgError) setImgError(true);
        }}
      />
    </div>
  );
};
