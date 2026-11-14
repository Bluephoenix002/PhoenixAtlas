import React from 'react';

interface SubdivisionFlagProps {
  name: string;
  countryCode?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const US_STATE_CODES: Record<string, string> = {
  alabama: 'al',
  alaska: 'ak',
  arizona: 'az',
  arkansas: 'ar',
  california: 'ca',
  colorado: 'co',
  connecticut: 'ct',
  delaware: 'de',
  florida: 'fl',
  georgia: 'ga',
  hawaii: 'hi',
  idaho: 'id',
  illinois: 'il',
  indiana: 'in',
  iowa: 'ia',
  kansas: 'ks',
  kentucky: 'ky',
  louisiana: 'la',
  maine: 'me',
  maryland: 'md',
  massachusetts: 'ma',
  michigan: 'mi',
  minnesota: 'mn',
  mississippi: 'ms',
  missouri: 'mo',
  montana: 'mt',
  nebraska: 'ne',
  nevada: 'nv',
  'new hampshire': 'nh',
  nhampshire: 'nh',
  'new jersey': 'nj',
  njersey: 'nj',
  'new mexico': 'nm',
  nmexico: 'nm',
  'new york': 'ny',
  nyork: 'ny',
  'north carolina': 'nc',
  ncarolina: 'nc',
  'north dakota': 'nd',
  ndakota: 'nd',
  ohio: 'oh',
  oklahoma: 'ok',
  oregon: 'or',
  pennsylvania: 'pa',
  'rhode island': 'ri',
  risland: 'ri',
  'south carolina': 'sc',
  scarolina: 'sc',
  'south dakota': 'sd',
  sdakota: 'sd',
  tennessee: 'tn',
  texas: 'tx',
  utah: 'ut',
  vermont: 'vt',
  virginia: 'va',
  washington: 'wa',
  'west virginia': 'wv',
  wvirginia: 'wv',
  wisconsin: 'wi',
  wyoming: 'wy',
  'district of columbia': 'dc',
  districtofcolumbia: 'dc',
  'puerto rico': 'pr'
};

function normalizeStateKey(raw: string): string {
  return raw
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .trim();
}

// Helper for a detailed royal Spanish heraldic crown (Corona Real)
const SPANISH_CROWN = (cx: number, cy: number, scale = 1) => `
  <g transform="translate(${cx},${cy}) scale(${scale})">
    <path d="M-4.5,0 C-4.8,-2.8 -2.2,-3.8 0,-3.2 C2.2,-3.8 4.8,-2.8 4.5,0 Z" fill="#DA121A" stroke="#D97706" stroke-width="0.45"/>
    <path d="M-4.5,0 Q-2.2,-3.5 0,-3.5 Q2.2,-3.5 4.5,0" fill="none" stroke="#FCD116" stroke-width="0.65"/>
    <line x1="0" y1="-3.5" x2="0" y2="0" stroke="#FCD116" stroke-width="0.65"/>
    <rect x="-4.6" y="-0.3" width="9.2" height="1.4" rx="0.4" fill="#FCD116" stroke="#92400E" stroke-width="0.35"/>
    <circle cx="-3" cy="0.4" r="0.35" fill="#EF4444"/>
    <circle cx="0" cy="0.4" r="0.4" fill="#2563EB"/>
    <circle cx="3" cy="0.4" r="0.35" fill="#10B981"/>
    <circle cx="0" cy="-4.1" r="0.55" fill="#FCD116" stroke="#92400E" stroke-width="0.25"/>
    <path d="M0,-5.3 V-4.2 M-0.55,-4.8 H0.55" stroke="#FCD116" stroke-width="0.4"/>
  </g>
`;

// Helper for N-pointed star polygon
function starPoints(cx: number, cy: number, points: number, outerR: number, innerR: number, rotDeg = -90): string {
  const pts: string[] = [];
  const step = Math.PI / points;
  const startRad = (rotDeg * Math.PI) / 180;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = startRad + i * step;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

export function getSubdivisionFlagSvgMarkup(name: string, countryCode?: string): string {
  const clean = normalizeStateKey(name);
  const cc = (countryCode || '').toUpperCase();

  // =========================================================================
  // 1. MALAYSIA — ALL 16 STATES & FEDERAL TERRITORIES (HIGH-DETAIL HERALDRY)
  // =========================================================================
  if (
    cc === 'MY' ||
    clean.includes('selangor') ||
    clean.includes('johor') ||
    clean.includes('sarawak') ||
    clean.includes('sabah') ||
    clean.includes('pulau pinang') ||
    clean.includes('trengganu') ||
    clean.includes('terengganu') ||
    clean.includes('kelantan') ||
    clean.includes('kedah') ||
    clean.includes('perak') ||
    clean.includes('pahang') ||
    clean.includes('negeri sembilan') ||
    clean.includes('melaka') ||
    clean.includes('perlis') ||
    clean.includes('kuala lumpur') ||
    clean.includes('putrajaya') ||
    clean.includes('labuan')
  ) {
    if (clean.includes('johor')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#002B7F"/>
        <rect width="26" height="17" fill="#CE1126"/>
        <circle cx="11.2" cy="8.5" r="5.2" fill="#FFFFFF"/>
        <circle cx="12.9" cy="8.5" r="4.3" fill="#CE1126"/>
        <polygon points="${starPoints(16.8, 8.5, 5, 3.1, 1.25, -18)}" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('kedah')) {
      // High-detail Kedah state coat of arms in canton: golden shield with black outline & ribs, green crescent below, detailed paddy wreath with grains & ribbon
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#DA121A"/>
        <g transform="translate(15, 11.2)">
          <!-- Golden Paddy Wreath (Left & Right arcs of rice grains) -->
          <path d="M0,7.8 C-6.5,7.2 -9.5,1.8 -8.2,-4.5 C-7.4,-7.5 -4.8,-9.4 -1.8,-9.8" fill="none" stroke="#FCD116" stroke-width="1.35" stroke-linecap="round"/>
          <path d="M0,7.8 C6.5,7.2 9.5,1.8 8.2,-4.5 C7.4,-7.5 4.8,-9.4 1.8,-9.8" fill="none" stroke="#FCD116" stroke-width="1.35" stroke-linecap="round"/>
          <path d="M0,7.8 C-6.5,7.2 -9.5,1.8 -8.2,-4.5 C-7.4,-7.5 -4.8,-9.4 -1.8,-9.8" fill="none" stroke="#1E293B" stroke-width="0.28" stroke-dasharray="1.1,0.9"/>
          <path d="M0,7.8 C6.5,7.2 9.5,1.8 8.2,-4.5 C7.4,-7.5 4.8,-9.4 1.8,-9.8" fill="none" stroke="#1E293B" stroke-width="0.28" stroke-dasharray="1.1,0.9"/>
          <!-- Individual Paddy Clusters along Wreath -->
          <g fill="#FCD116" stroke="#78350F" stroke-width="0.25">
            <ellipse cx="-6.8" cy="4.2" rx="1.2" ry="0.65" transform="rotate(35 -6.8 4.2)"/>
            <ellipse cx="-8.5" cy="1.2" rx="1.2" ry="0.65" transform="rotate(65 -8.5 1.2)"/>
            <ellipse cx="-8.7" cy="-2.2" rx="1.2" ry="0.65" transform="rotate(95 -8.7 -2.2)"/>
            <ellipse cx="-7.4" cy="-5.6" rx="1.2" ry="0.65" transform="rotate(125 -7.4 -5.6)"/>
            <ellipse cx="-4.8" cy="-8.2" rx="1.2" ry="0.65" transform="rotate(150 -4.8 -8.2)"/>
            <ellipse cx="-1.8" cy="-9.5" rx="1.1" ry="0.55" transform="rotate(170 -1.8 -9.5)"/>
            <ellipse cx="6.8" cy="4.2" rx="1.2" ry="0.65" transform="rotate(-35 6.8 4.2)"/>
            <ellipse cx="8.5" cy="1.2" rx="1.2" ry="0.65" transform="rotate(-65 8.5 1.2)"/>
            <ellipse cx="8.7" cy="-2.2" rx="1.2" ry="0.65" transform="rotate(-95 8.7 -2.2)"/>
            <ellipse cx="7.4" cy="-5.6" rx="1.2" ry="0.65" transform="rotate(-125 7.4 -5.6)"/>
            <ellipse cx="4.8" cy="-8.2" rx="1.2" ry="0.65" transform="rotate(-150 4.8 -8.2)"/>
            <ellipse cx="1.8" cy="-9.5" rx="1.1" ry="0.55" transform="rotate(-170 1.8 -9.5)"/>
          </g>
          <!-- Green Crescent Embracing Shield Base -->
          <path d="M-5.8,0.8 C-4.8,5.8 4.8,5.8 5.8,0.8 C4.3,4.0 -4.3,4.0 -5.8,0.8 Z" fill="#008542" stroke="#052E16" stroke-width="0.35"/>
          <!-- Sovereign Yellow Shield (Perisai) -->
          <path d="M-4.2,-6.8 C-2.2,-7.6 2.2,-7.6 4.2,-6.8 L4.2,-1.8 C4.2,1.5 0,3.6 0,3.6 C0,3.6 -4.2,1.5 -4.2,-1.8 Z" fill="#FCD116" stroke="#1E293B" stroke-width="0.55"/>
          <path d="M-3.2,-6.0 C-1.5,-6.6 1.5,-6.6 3.2,-6.0 L3.2,-2.0 C3.2,0.7 0,2.4 0,2.4 C0,2.4 -3.2,0.7 -3.2,-2.0 Z" fill="none" stroke="#92400E" stroke-width="0.35"/>
          <line x1="0" y1="-6.8" x2="0" y2="2.6" stroke="#92400E" stroke-width="0.3"/>
          <!-- Wreath Tie Ribbon at Base -->
          <path d="M-1.5,7.2 L1.5,7.2 L2.4,9.2 L0.8,8.5 L0,9.4 L-0.8,8.5 L-2.4,9.2 Z" fill="#008542" stroke="#FCD116" stroke-width="0.3"/>
        </g>
      </svg>`;
    }
    if (clean.includes('kelantan')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#DA121A"/>
        <g transform="translate(30, 16)" fill="#FFFFFF" stroke="#FFFFFF">
          <!-- Crossed Spears & Kris Daggers -->
          <line x1="-11" y1="-8" x2="-4" y2="8" stroke-width="1.1" stroke-linecap="round"/>
          <polygon points="-11.8,-9.8 -9.5,-7.5 -11.5,-6.5" fill="#FFFFFF" stroke="none"/>
          <line x1="11" y1="-8" x2="4" y2="8" stroke-width="1.1" stroke-linecap="round"/>
          <polygon points="11.8,-9.8 9.5,-7.5 11.5,-6.5" fill="#FFFFFF" stroke="none"/>
          <path d="M-8,-4 Q-6.5,-1 -5.5,2 Q-4.5,5 -3,8" fill="none" stroke-width="0.95"/>
          <path d="M8,-4 Q6.5,-1 5.5,2 Q4.5,5 3,8" fill="none" stroke-width="0.95"/>
          <!-- Upturned White Crescent -->
          <path d="M-8.5,-1.5 C-7,7.5 7,7.5 8.5,-1.5 C6.5,4.8 -6.5,4.8 -8.5,-1.5 Z" fill="#FFFFFF" stroke="none"/>
          <!-- 5-Pointed Star & Royal Crown -->
          <polygon points="${starPoints(0, -2.2, 5, 3.6, 1.4)}" fill="#FFFFFF" stroke="none"/>
          <path d="M-4,-6.8 L-3,-9.2 L0,-7.8 L3,-9.2 L4,-6.8 Z" fill="#FFFFFF" stroke="none"/>
        </g>
      </svg>`;
    }
    if (clean.includes('melaka') || clean.includes('malacca')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="15" fill="#CE1126"/>
        <rect y="15" width="60" height="15" fill="#FFFFFF"/>
        <rect width="30" height="15" fill="#002B7F"/>
        <circle cx="13" cy="7.5" r="4.8" fill="#FCD116"/>
        <circle cx="14.6" cy="7.5" r="3.9" fill="#002B7F"/>
        <polygon points="${starPoints(18.5, 7.5, 5, 2.9, 1.15)}" fill="#FCD116"/>
      </svg>`;
    }
    if (clean.includes('negeri sembilan')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#FCD116"/>
        <polygon points="0,0 30,0 30,15" fill="#CE1126"/>
        <polygon points="0,0 0,15 30,15" fill="#000000"/>
      </svg>`;
    }
    if (clean.includes('pahang')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="15" fill="#FFFFFF"/>
        <rect y="15" width="60" height="15" fill="#000000"/>
      </svg>`;
    }
    if (clean.includes('pulau pinang') || clean.includes('penang')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="20" height="30" fill="#38BDF8"/>
        <rect x="20" width="20" height="30" fill="#FFFFFF"/>
        <rect x="40" width="20" height="30" fill="#FCD116"/>
        <!-- Detailed Betel Nut Palm Tree (Pokok Pinang) on Grassy Mound & Waves -->
        <ellipse cx="30" cy="22.5" rx="6.5" ry="2.0" fill="#15803D"/>
        <path d="M24.5,22.8 Q30,24.2 35.5,22.8" fill="none" stroke="#0284C7" stroke-width="1.1"/>
        <path d="M29.1,21.5 L29.5,11.5 L30.5,11.5 L30.9,21.5 Z" fill="#78350F"/>
        <circle cx="29.2" cy="12.2" r="0.8" fill="#F59E0B"/>
        <circle cx="30.8" cy="12.2" r="0.8" fill="#F59E0B"/>
        <path d="M30,11.5 C25,11.5 23,14 23,14 C25,10 28,9.5 30,10.5 Z" fill="#15803D"/>
        <path d="M30,11.5 C35,11.5 37,14 37,14 C35,10 32,9.5 30,10.5 Z" fill="#15803D"/>
        <path d="M30,10.5 C25,8.5 24,6.5 24,6.5 C27,7 29,8.5 30,10 Z" fill="#16A34A"/>
        <path d="M30,10.5 C35,8.5 36,6.5 36,6.5 C33,7 31,8.5 30,10 Z" fill="#16A34A"/>
        <path d="M30,10.2 L29.2,5.5 L30,4.8 L30.8,5.5 Z" fill="#15803D"/>
      </svg>`;
    }
    if (clean.includes('perak')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="10" fill="#FFFFFF"/>
        <rect y="10" width="60" height="10" fill="#FCD116"/>
        <rect y="20" width="60" height="10" fill="#000000"/>
      </svg>`;
    }
    if (clean.includes('perlis')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="15" fill="#FCD116"/>
        <rect y="15" width="60" height="15" fill="#002664"/>
      </svg>`;
    }
    if (clean.includes('sabah')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="10" fill="#2980B9"/>
        <rect y="10" width="60" height="10" fill="#FFFFFF"/>
        <rect y="20" width="60" height="10" fill="#CE1126"/>
        <rect width="26" height="20" fill="#7FB3D5"/>
        <polygon points="3.5,16.5 6.5,8.5 8.5,10 10.5,6.8 12.2,8.5 14.5,6.2 16.5,8.2 18.8,6.5 22.5,16.5" fill="#1B4F72"/>
      </svg>`;
    }
    if (clean.includes('sarawak')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#FCD116"/>
        <polygon points="0,0 18,0 60,21 60,30 42,30 0,9" fill="#CE1126"/>
        <polygon points="0,0 9,0 60,25.5 60,30 51,30 0,4.5" fill="#000000"/>
        <polygon points="${starPoints(30, 15, 9, 6.6, 3.1, -90)}" fill="#FCD116" stroke="#1E293B" stroke-width="0.25"/>
      </svg>`;
    }
    if (clean.includes('selangor')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="30" height="15" fill="#CE1126"/>
        <rect x="30" width="30" height="15" fill="#FCD116"/>
        <rect y="15" width="30" height="15" fill="#FCD116"/>
        <rect x="30" y="15" width="30" height="15" fill="#CE1126"/>
        <circle cx="12.2" cy="7.5" r="4.6" fill="#FFFFFF"/>
        <circle cx="13.8" cy="7.5" r="3.7" fill="#CE1126"/>
        <polygon points="${starPoints(17.6, 7.5, 5, 2.8, 1.15)}" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('trengganu') || clean.includes('terengganu')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#FFFFFF"/>
        <rect x="5" y="4" width="50" height="22" fill="#000000"/>
        <circle cx="27.5" cy="15" r="6.2" fill="#FFFFFF"/>
        <circle cx="29.6" cy="15" r="5.1" fill="#000000"/>
        <polygon points="${starPoints(34.5, 15, 5, 3.5, 1.4)}" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('kuala lumpur')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#002B7F"/>
        <rect y="0" width="60" height="1.5" fill="#CE1126"/>
        <rect y="1.5" width="60" height="1.5" fill="#FFFFFF"/>
        <rect y="3" width="60" height="1.5" fill="#CE1126"/>
        <rect y="4.5" width="60" height="1.5" fill="#FFFFFF"/>
        <rect y="6" width="60" height="1.5" fill="#CE1126"/>
        <rect y="7.5" width="60" height="1.5" fill="#FFFFFF"/>
        <rect y="21" width="60" height="1.5" fill="#CE1126"/>
        <rect y="22.5" width="60" height="1.5" fill="#FFFFFF"/>
        <rect y="24" width="60" height="1.5" fill="#CE1126"/>
        <rect y="25.5" width="60" height="1.5" fill="#FFFFFF"/>
        <rect y="27" width="60" height="1.5" fill="#CE1126"/>
        <rect y="28.5" width="60" height="1.5" fill="#FFFFFF"/>
        <circle cx="16" cy="15" r="4.8" fill="#FCD116"/>
        <circle cx="17.8" cy="15" r="3.9" fill="#002B7F"/>
        <polygon points="${starPoints(23, 15, 14, 3.4, 1.6)}" fill="#FCD116"/>
      </svg>`;
    }
    if (clean.includes('labuan')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="60" height="10" fill="#CE1126"/>
        <rect y="10" width="60" height="10" fill="#FFFFFF"/>
        <rect y="20" width="60" height="10" fill="#002B7F"/>
        <circle cx="27.5" cy="15" r="4.4" fill="#FCD116"/>
        <circle cx="29.1" cy="15" r="3.5" fill="#FFFFFF"/>
        <polygon points="${starPoints(33.5, 15, 14, 3.1, 1.45)}" fill="#FCD116"/>
      </svg>`;
    }
    if (clean.includes('putrajaya')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <rect width="18" height="30" fill="#002B7F"/>
        <rect x="18" width="24" height="30" fill="#FCD116"/>
        <rect x="42" width="18" height="30" fill="#002B7F"/>
        <!-- Detailed Malaysian Coat of Arms (Jata Negara) -->
        <g transform="translate(30, 15)">
          <circle cx="0" cy="-6.2" r="1.8" fill="#FCD116" stroke="#92400E" stroke-width="0.4"/>
          <path d="M-5.5,-3 L-3.8,3.5 L3.8,3.5 L5.5,-3 Z" fill="#F59E0B" stroke="#78350F" stroke-width="0.4"/>
          <path d="M-3.2,-3.2 L3.2,-3.2 L3.2,1.8 C3.2,3.8 0,5.2 0,5.2 C0,5.2 -3.2,3.8 -3.2,1.8 Z" fill="#CE1126" stroke="#1E293B" stroke-width="0.4"/>
          <rect x="-3.0" y="-3.0" width="6.0" height="1.4" fill="#1E293B"/>
          <rect x="-1.5" y="-1.6" width="1.5" height="3.2" fill="#FFFFFF"/>
          <rect x="0" y="-1.6" width="1.5" height="3.2" fill="#FCD116"/>
          <path d="M-6,5.8 Q0,7.5 6,5.8" fill="none" stroke="#B45309" stroke-width="1.1"/>
        </g>
      </svg>`;
    }
  }

  // =========================================================================
  // 2. SPAIN — ALL 18 AUTONOMOUS COMMUNITIES & CITIES (HIGH-DETAIL HERALDRY)
  // =========================================================================
  if (
    cc === 'ES' ||
    clean.includes('andaluc') ||
    clean.includes('catalu') ||
    clean.includes('galicia') ||
    clean.includes('vasco') ||
    clean.includes('madrid') ||
    clean.includes('canarias') ||
    clean.includes('valencia') ||
    clean.includes('castilla') ||
    clean.includes('arag') ||
    clean.includes('extremadura') ||
    clean.includes('baleares') ||
    clean.includes('navarra') ||
    clean.includes('murcia') ||
    clean.includes('asturias') ||
    clean.includes('cantabria') ||
    clean.includes('rioja') ||
    clean.includes('ceuta') ||
    clean.includes('melilla')
  ) {
    if (clean.includes('andaluc')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="12" fill="#007A33"/>
        <rect y="12" width="60" height="12" fill="#FFFFFF"/>
        <rect y="24" width="60" height="12" fill="#007A33"/>
        <g transform="translate(30, 18)">
          <path d="M-5.5,-5.5 A5.5,5.5 0 0,1 5.5,-5.5 L5.5,5.5 L-5.5,5.5 Z" fill="#E2E8F0" stroke="#D97706" stroke-width="0.6"/>
          <rect x="-4.5" y="-4" width="1.2" height="8.5" fill="#94A3B8"/>
          <rect x="3.3" y="-4" width="1.2" height="8.5" fill="#94A3B8"/>
          <circle cx="0" cy="-1.5" r="1.4" fill="#B45309"/>
          <path d="M-2.2,4.5 L0,0 L2.2,4.5 Z" fill="#007A33"/>
          <circle cx="-2.2" cy="3.5" r="1.3" fill="#D97706"/>
          <circle cx="2.2" cy="3.5" r="1.3" fill="#D97706"/>
          <rect x="-6.5" y="4.8" width="13" height="1.5" rx="0.5" fill="#007A33" stroke="#FCD116" stroke-width="0.3"/>
        </g>
      </svg>`;
    }
    if (clean.includes('catalu')) {
      // La Senyera: 5 yellow and 4 red horizontal stripes
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#FCDD09"/>
        <rect y="4" width="60" height="4" fill="#DA121A"/>
        <rect y="12" width="60" height="4" fill="#DA121A"/>
        <rect y="20" width="60" height="4" fill="#DA121A"/>
        <rect y="28" width="60" height="4" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('madrid')) {
      // Crimson red field with 7 five-pointed white stars (4 over 3)
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#C60B1E"/>
        <polygon points="${starPoints(15, 12.5, 5, 3.2, 1.3)}" fill="#FFFFFF"/>
        <polygon points="${starPoints(25, 12.5, 5, 3.2, 1.3)}" fill="#FFFFFF"/>
        <polygon points="${starPoints(35, 12.5, 5, 3.2, 1.3)}" fill="#FFFFFF"/>
        <polygon points="${starPoints(45, 12.5, 5, 3.2, 1.3)}" fill="#FFFFFF"/>
        <polygon points="${starPoints(20, 23.5, 5, 3.2, 1.3)}" fill="#FFFFFF"/>
        <polygon points="${starPoints(30, 23.5, 5, 3.2, 1.3)}" fill="#FFFFFF"/>
        <polygon points="${starPoints(40, 23.5, 5, 3.2, 1.3)}" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('vasco')) {
      // Basque Ikurriña: red field, green saltire, white cross on top
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#D52B1E"/>
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#009B48" stroke-width="5.2"/>
        <path d="M30,0 V36 M0,18 H60" stroke="#FFFFFF" stroke-width="5.2"/>
      </svg>`;
    }
    if (clean.includes('galicia')) {
      // White field with sky-blue diagonal band and crowned chalice coat of arms
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#FFFFFF"/>
        <polygon points="0,0 11,0 60,29.5 60,36 49,36 0,6.5" fill="#009ADE"/>
        <g transform="translate(30, 19.5)">
          <path d="M-4.5,-4.5 L4.5,-4.5 L4.5,2.5 C4.5,5.5 0,7 0,7 C0,7 -4.5,5.5 -4.5,2.5 Z" fill="#003399" stroke="#FCD116" stroke-width="0.6"/>
          <path d="M-1.5,1 L1.5,1 L0.8,4.2 L2,4.8 L-2,4.8 L-0.8,4.2 Z" fill="#FCD116"/>
          <circle cx="0" cy="-1.2" r="1.2" fill="#FFFFFF" stroke="#FCD116" stroke-width="0.3"/>
        </g>
        ${SPANISH_CROWN(30, 13.8, 0.95)}
      </svg>`;
    }
    if (clean.includes('canarias')) {
      // White, blue, yellow vertical tricolor with coat of arms (7 islands + crown)
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="20" height="36" fill="#FFFFFF"/>
        <rect x="20" width="20" height="36" fill="#0768A9"/>
        <rect x="40" width="20" height="36" fill="#FFCC00"/>
        <g transform="translate(30, 20)">
          <path d="M-4.8,-5 L4.8,-5 L4.8,2.5 C4.8,5.8 0,7.2 0,7.2 C0,7.2 -4.8,5.8 -4.8,2.5 Z" fill="#0768A9" stroke="#FCD116" stroke-width="0.6"/>
          <polygon points="-2.5,-2 -1.2,-3.5 0.2,-2" fill="#E2E8F0"/>
          <polygon points="1,-2 2.2,-3.5 3.5,-2" fill="#E2E8F0"/>
          <polygon points="-3,1 -1.8,-0.5 -0.5,1" fill="#E2E8F0"/>
          <polygon points="0.5,1 1.8,-0.5 3,1" fill="#E2E8F0"/>
          <polygon points="-1,3.5 0,2 1,3.5" fill="#E2E8F0"/>
        </g>
        ${SPANISH_CROWN(30, 13.8, 0.95)}
      </svg>`;
    }
    if (clean.includes('valencia')) {
      // Real Senyera: 4 red bars on gold with crowned blue hoist strip
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#FCDD09"/>
        <rect y="4" width="60" height="4" fill="#DA121A"/>
        <rect y="12" width="60" height="4" fill="#DA121A"/>
        <rect y="20" width="60" height="4" fill="#DA121A"/>
        <rect y="28" width="60" height="4" fill="#DA121A"/>
        <rect width="14" height="36" fill="#003399"/>
        <rect x="13.2" width="1.2" height="36" fill="#DA121A"/>
        <path d="M4,3 V33 M7,3 V33 M10,3 V33" stroke="#FCDD09" stroke-width="0.9" stroke-dasharray="2.5,1.5"/>
      </svg>`;
    }
    if (clean.includes('león') || clean.includes('leon')) {
      // Quartered Castle (Crimson/Gold) & Lion (Silver/Purple)
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="30" height="18" fill="#AF1E2D"/>
        <rect x="30" width="30" height="18" fill="#E2E8F0"/>
        <rect y="18" width="30" height="18" fill="#E2E8F0"/>
        <rect x="30" y="18" width="30" height="18" fill="#AF1E2D"/>
        <!-- Castles in Q1 & Q4 -->
        <g fill="#FCD116" stroke="#78350F" stroke-width="0.3">
          <rect x="11" y="6" width="8" height="7"/>
          <rect x="10.5" y="3.5" width="2" height="3"/>
          <rect x="14" y="2.8" width="2" height="3.7"/>
          <rect x="17.5" y="3.5" width="2" height="3"/>
          <rect x="41" y="24" width="8" height="7"/>
          <rect x="40.5" y="21.5" width="2" height="3"/>
          <rect x="44" y="20.8" width="2" height="3.7"/>
          <rect x="47.5" y="21.5" width="2" height="3"/>
        </g>
        <rect x="14" y="9.5" width="2" height="3.5" fill="#1E3A8A"/>
        <rect x="44" y="27.5" width="2" height="3.5" fill="#1E3A8A"/>
        <!-- Purple Lions in Q2 & Q3 -->
        <path d="M43,4.5 Q47,4.5 46,8 Q49,10 47,13.5 Q44,15 42,13.5 Q40,10 43,4.5 Z" fill="#9333EA" stroke="#FCD116" stroke-width="0.35"/>
        <path d="M13,22.5 Q17,22.5 16,26 Q19,28 17,31.5 Q14,33 12,31.5 Q10,28 13,22.5 Z" fill="#9333EA" stroke="#FCD116" stroke-width="0.35"/>
      </svg>`;
    }
    if (clean.includes('mancha')) {
      // Crimson left half with golden three-towered castle, white right half
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="30" height="36" fill="#A6192E"/>
        <rect x="30" width="30" height="36" fill="#FFFFFF"/>
        <g fill="#FCD116" stroke="#78350F" stroke-width="0.4">
          <rect x="9" y="14" width="12" height="11"/>
          <rect x="8.5" y="9.5" width="3" height="5"/>
          <rect x="13.5" y="8" width="3" height="6.5"/>
          <rect x="18.5" y="9.5" width="3" height="5"/>
        </g>
        <path d="M13.5,25 V20.5 A1.5,1.5 0 0,1 16.5,20.5 V25 Z" fill="#003399"/>
      </svg>`;
    }
    if (clean.includes('arag')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#FCDD09"/>
        <rect y="4" width="60" height="4" fill="#DA121A"/>
        <rect y="12" width="60" height="4" fill="#DA121A"/>
        <rect y="20" width="60" height="4" fill="#DA121A"/>
        <rect y="28" width="60" height="4" fill="#DA121A"/>
        <g transform="translate(18, 20)">
          <path d="M-5,-5.5 L5,-5.5 L5,2.5 C5,6 0,7.5 0,7.5 C0,7.5 -5,6 -5,2.5 Z" fill="#FFFFFF" stroke="#B45309" stroke-width="0.6"/>
          <rect x="-4.7" y="-5.2" width="4.7" height="5.2" fill="#FCDD09"/>
          <rect x="0" y="-5.2" width="4.7" height="5.2" fill="#003399"/>
          <rect x="0" y="0" width="4.7" height="5.5" fill="#FCDD09"/>
          <path d="M-2.5,0 V5.5 M-4.5,2.5 H0" stroke="#DA121A" stroke-width="1"/>
        </g>
        ${SPANISH_CROWN(18, 13.5, 1)}
      </svg>`;
    }
    if (clean.includes('extremadura')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="12" fill="#009639"/>
        <rect y="12" width="60" height="12" fill="#FFFFFF"/>
        <rect y="24" width="60" height="12" fill="#000000"/>
        <g transform="translate(20, 19.5)">
          <path d="M-4.5,-5 L4.5,-5 L4.5,2.5 C4.5,5.5 0,7 0,7 C0,7 -4.5,5.5 -4.5,2.5 Z" fill="#FCD116" stroke="#78350F" stroke-width="0.5"/>
          <rect x="0" y="-4.8" width="4.3" height="5" fill="#A6192E"/>
          <path d="M-4.3,0.5 L4.3,0.5 L4.3,4.5 C4.3,6 0,6.8 0,6.8 C0,6.8 -4.3,6 -4.3,4.5 Z" fill="#0072CE"/>
          <circle cx="0" cy="3.5" r="1.4" fill="#15803D"/>
        </g>
        ${SPANISH_CROWN(20, 13.5, 0.9)}
      </svg>`;
    }
    if (clean.includes('baleares')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#FCDD09"/>
        <rect y="4" width="60" height="4" fill="#DA121A"/>
        <rect y="12" width="60" height="4" fill="#DA121A"/>
        <rect y="20" width="60" height="4" fill="#DA121A"/>
        <rect y="28" width="60" height="4" fill="#DA121A"/>
        <rect width="28" height="18" fill="#5B21B6"/>
        <g fill="#FFFFFF" stroke="#4C1D95" stroke-width="0.3">
          <rect x="5" y="10" width="18" height="5.5"/>
          <rect x="6" y="6.5" width="2.5" height="3.5"/>
          <rect x="9.5" y="6.5" width="2.5" height="3.5"/>
          <rect x="12.8" y="4" width="2.4" height="6"/>
          <rect x="16" y="6.5" width="2.5" height="3.5"/>
          <rect x="19.5" y="6.5" width="2.5" height="3.5"/>
        </g>
      </svg>`;
    }
    if (clean.includes('navarra')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#DA121A"/>
        <g transform="translate(30, 20.5)">
          <path d="M-5.5,-6 L5.5,-6 L5.5,2.5 C5.5,6.5 0,8.2 0,8.2 C0,8.2 -5.5,6.5 -5.5,2.5 Z" fill="#DA121A" stroke="#FCD116" stroke-width="0.9"/>
          <path d="M-5,-5.5 L5,4.5 M5,-5.5 L-5,4.5 M0,-6 V7.5 M-5.2,-0.5 H5.2" stroke="#FCD116" stroke-width="0.7" stroke-dasharray="1,0.5"/>
          <circle cx="0" cy="-0.5" r="1.2" fill="#10B981" stroke="#FCD116" stroke-width="0.4"/>
        </g>
        ${SPANISH_CROWN(30, 13.2, 1.05)}
      </svg>`;
    }
    if (clean.includes('murcia')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#9B1B30"/>
        <!-- 4 Golden Castles in top-left -->
        <g fill="#FCD116">
          <rect x="6" y="5" width="3.5" height="3.5"/><rect x="12" y="5" width="3.5" height="3.5"/>
          <rect x="6" y="10.5" width="3.5" height="3.5"/><rect x="12" y="10.5" width="3.5" height="3.5"/>
          <!-- 7 Golden Crowns in bottom-right (1-3-2-1) -->
          <polygon points="43,19 46,19 45.5,21 43.5,21"/>
          <polygon points="39,23 42,23 41.5,25 39.5,25"/>
          <polygon points="43,23 46,23 45.5,25 43.5,25"/>
          <polygon points="47,23 50,23 49.5,25 47.5,25"/>
          <polygon points="41,27 44,27 43.5,29 41.5,29"/>
          <polygon points="45,27 48,27 47.5,29 45.5,29"/>
          <polygon points="43,31 46,31 45.5,33 43.5,33"/>
        </g>
      </svg>`;
    }
    if (clean.includes('asturias')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#0066CC"/>
        <g transform="translate(22, 18)" fill="#FCD116" stroke="#92400E" stroke-width="0.35">
          <path d="M-1.2,-9 L1.2,-9 L0.8,9 L-0.8,9 Z"/>
          <path d="M-7.5,-2.5 L7.5,-2.5 L7.5,-0.5 L-7.5,-0.5 Z"/>
          <circle cx="0" cy="-1.5" r="1.8" fill="#DA121A" stroke="#FCD116" stroke-width="0.4"/>
          <text x="-5.2" y="3.5" font-size="3.5" fill="#FCD116" stroke="none" font-family="serif" font-weight="bold">Α</text>
          <text x="3.5" y="3.5" font-size="3.5" fill="#FCD116" stroke="none" font-family="serif" font-weight="bold">Ω</text>
        </g>
      </svg>`;
    }
    if (clean.includes('cantabria')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="18" fill="#FFFFFF"/>
        <rect y="18" width="60" height="18" fill="#DA121A"/>
        <g transform="translate(30, 19.5)">
          <path d="M-4.8,-5.2 L4.8,-5.2 L4.8,2.5 C4.8,5.8 0,7.2 0,7.2 C0,7.2 -4.8,5.8 -4.8,2.5 Z" fill="#0284C7" stroke="#FCD116" stroke-width="0.6"/>
          <path d="M-4.6,0.5 L4.6,0.5 L4.6,3.5 C4.6,5.8 0,7 0,7 C0,7 -4.6,5.8 -4.6,3.5 Z" fill="#DA121A"/>
          <circle cx="0" cy="3.5" r="1.8" fill="#FCD116"/>
          <rect x="-3.2" y="-3.8" width="2.2" height="3.8" fill="#FCD116"/>
          <polygon points="0.5,-1.5 3.5,-1.5 2.8,-0.2 1.2,-0.2" fill="#78350F"/>
        </g>
        ${SPANISH_CROWN(30, 13.2, 0.95)}
      </svg>`;
    }
    if (clean.includes('rioja')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="9" fill="#DA121A"/>
        <rect y="9" width="60" height="9" fill="#FFFFFF"/>
        <rect y="18" width="60" height="9" fill="#008542"/>
        <rect y="27" width="60" height="9" fill="#FCDD09"/>
        <g transform="translate(30, 19.5)">
          <path d="M-4.5,-4.8 L4.5,-4.8 L4.5,2.5 C4.5,5.5 0,6.8 0,6.8 C0,6.8 -4.5,5.5 -4.5,2.5 Z" fill="#FCD116" stroke="#78350F" stroke-width="0.5"/>
          <rect x="0" y="-4.6" width="4.3" height="9" fill="#DA121A"/>
          <path d="M-2.2,-3.5 V3.5 M-3.8,-1.5 H-0.6" stroke="#DA121A" stroke-width="0.9"/>
          <rect x="1.2" y="-1" width="2" height="3" fill="#FCD116"/>
        </g>
        ${SPANISH_CROWN(30, 13.6, 0.9)}
      </svg>`;
    }
    if (clean.includes('ceuta') || clean.includes('melilla')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">
        <rect width="60" height="36" fill="#000000"/>
        <polygon points="0,0 30,0 30,18" fill="#FFFFFF"/>
        <polygon points="30,18 60,0 60,18" fill="#FFFFFF"/>
        <polygon points="30,18 60,36 30,36" fill="#FFFFFF"/>
        <polygon points="30,18 0,36 0,18" fill="#FFFFFF"/>
        <g transform="translate(30, 19.5)">
          <path d="M-4.8,-5 L4.8,-5 L4.8,2.5 C4.8,5.8 0,7.2 0,7.2 C0,7.2 -4.8,5.8 -4.8,2.5 Z" fill="#DA121A" stroke="#FCD116" stroke-width="0.6"/>
          <rect x="-2.8" y="-3" width="5.6" height="6" fill="#FFFFFF"/>
          <circle cx="0" cy="0" r="1.2" fill="#003399"/>
        </g>
        ${SPANISH_CROWN(30, 13.2, 0.95)}
      </svg>`;
    }
  }

  // =========================================================================
  // 3. CANADA — ALL 13 PROVINCES & TERRITORIES
  // =========================================================================
  if (
    cc === 'CA' ||
    clean.includes('quebec') ||
    clean.includes('québec') ||
    clean.includes('ontario') ||
    clean.includes('british columbia') ||
    clean.includes('alberta') ||
    clean.includes('manitoba') ||
    clean.includes('saskatchewan') ||
    clean.includes('nova scotia') ||
    clean.includes('new brunswick') ||
    clean.includes('newfoundland') ||
    clean.includes('prince edward') ||
    clean.includes('yukon') ||
    clean.includes('northwest territories') ||
    clean.includes('nunavut')
  ) {
    if (clean.includes('quebec') || clean.includes('québec')) {
      const fleur = (x: number, y: number) => `
        <g transform="translate(${x},${y}) scale(0.85)" fill="#FFFFFF">
          <path d="M0,-3.5 C0.8,-1.8 1.2,0 0,2 C-1.2,0 -0.8,-1.8 0,-3.5 Z"/>
          <path d="M0,0.5 C1.5,-1.5 3.2,-1.2 2.8,0.6 C2.2,1.5 0.8,1.2 0,1.5 Z"/>
          <path d="M0,0.5 C-1.5,-1.5 -3.2,-1.2 -2.8,0.6 C-2.2,1.5 -0.8,1.2 0,1.5 Z"/>
          <rect x="-1.8" y="1.1" width="3.6" height="0.6" rx="0.2"/>
          <path d="M-0.8,1.7 L0,3.2 L0.8,1.7 Z"/>
        </g>`;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#003399"/>
        <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" stroke-width="3.4"/>
        ${fleur(6.8, 4.6)}
        ${fleur(23.2, 4.6)}
        ${fleur(6.8, 15.4)}
        ${fleur(23.2, 15.4)}
      </svg>`;
    }
    if (clean.includes('ontario')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#C8102E"/>
        <rect width="14" height="10" fill="#012169"/>
        <path d="M0,0 L14,10 M14,0 L0,10" stroke="#FFFFFF" stroke-width="1.6"/>
        <path d="M7,0 V10 M0,5 H14" stroke="#FFFFFF" stroke-width="2.4"/>
        <path d="M7,0 V10 M0,5 H14" stroke="#C8102E" stroke-width="1.4"/>
        <path d="M19,5.5 H25 V10.5 C25,13 22,14.5 22,14.5 C22,14.5 19,13 19,10.5 Z" fill="#006A4E" stroke="#FFFFFF" stroke-width="0.4"/>
        <rect x="19.2" y="5.7" width="5.6" height="2.6" fill="#FFFFFF"/>
        <path d="M22,5.7 V8.3 M19.2,7 H24.8" stroke="#C8102E" stroke-width="0.8"/>
        <circle cx="21" cy="10.2" r="0.9" fill="#FFD100"/>
        <circle cx="23" cy="10.2" r="0.9" fill="#FFD100"/>
        <circle cx="22" cy="12" r="0.9" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('manitoba')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#C8102E"/>
        <rect width="14" height="10" fill="#012169"/>
        <path d="M0,0 L14,10 M14,0 L0,10" stroke="#FFFFFF" stroke-width="1.6"/>
        <path d="M7,0 V10 M0,5 H14" stroke="#FFFFFF" stroke-width="2.4"/>
        <path d="M7,0 V10 M0,5 H14" stroke="#C8102E" stroke-width="1.4"/>
        <path d="M19,5.5 H25 V10.5 C25,13 22,14.5 22,14.5 C22,14.5 19,13 19,10.5 Z" fill="#006A4E" stroke="#FFFFFF" stroke-width="0.4"/>
        <rect x="19.2" y="5.7" width="5.6" height="2.6" fill="#FFFFFF"/>
        <path d="M22,5.7 V8.3 M19.2,7 H24.8" stroke="#C8102E" stroke-width="0.8"/>
        <ellipse cx="22" cy="11.2" rx="1.8" ry="1.2" fill="#583B1F"/>
      </svg>`;
    }
    if (clean.includes('british columbia')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="8" fill="#012169"/>
        <path d="M0,0 L30,8 M30,0 L0,8" stroke="#FFFFFF" stroke-width="1.8"/>
        <path d="M15,0 V8 M0,4 H30" stroke="#FFFFFF" stroke-width="2.6"/>
        <path d="M15,0 V8 M0,4 H30" stroke="#C8102E" stroke-width="1.5"/>
        <polygon points="13.5,3 14.2,4.5 15,3 15.8,4.5 16.5,3 16.2,5.2 13.8,5.2" fill="#FFD100"/>
        <rect y="8" width="30" height="12" fill="#FFFFFF"/>
        <rect y="10" width="30" height="2" fill="#003399"/>
        <rect y="14" width="30" height="2" fill="#003399"/>
        <rect y="18" width="30" height="2" fill="#003399"/>
        <circle cx="15" cy="19" r="5.5" fill="#FFD100" stroke="#B45309" stroke-width="0.4"/>
      </svg>`;
    }
    if (clean.includes('alberta')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#003399"/>
        <path d="M11,3.5 H19 V12 C19,15 15,16.8 15,16.8 C15,16.8 11,15 11,12 Z" fill="#FFFFFF" stroke="#FFD100" stroke-width="0.5"/>
        <line x1="15" y1="3.5" x2="15" y2="7.5" stroke="#C8102E" stroke-width="1.2"/>
        <line x1="11" y1="5.5" x2="19" y2="5.5" stroke="#C8102E" stroke-width="1.2"/>
        <rect x="11.3" y="7.5" width="7.4" height="3.2" fill="#38BDF8"/>
        <polygon points="11.3,10.7 13,8.5 15,10.2 17,8.2 18.7,10.7" fill="#E2E8F0"/>
        <rect x="11.3" y="10.7" width="7.4" height="2.3" fill="#15803D"/>
        <path d="M11.3,13 H18.7 C18.4,15 15,16.4 15,16.4 C15,16.4 11.6,15 11.3,13 Z" fill="#F59E0B"/>
      </svg>`;
    }
    if (clean.includes('saskatchewan')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#006A4E"/>
        <rect y="10" width="30" height="10" fill="#FFD100"/>
        <path d="M4,2 H9 V6.5 C9,8.2 6.5,9.2 6.5,9.2 C6.5,9.2 4,8.2 4,6.5 Z" fill="#006A4E" stroke="#FFFFFF" stroke-width="0.5"/>
        <rect x="4.2" y="2.2" width="4.6" height="2" fill="#FFD100"/>
        <circle cx="22.5" cy="10" r="2.8" fill="#CE1126" stroke="#15803D" stroke-width="0.6"/>
        <circle cx="22.5" cy="10" r="0.9" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('nova scotia')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <path d="M0,0 L30,20 M30,0 L0,20" stroke="#003399" stroke-width="3.6"/>
        <path d="M12,6 H18 V11 C18,13.2 15,14.5 15,14.5 C15,14.5 12,13.2 12,11 Z" fill="#FFD100" stroke="#C8102E" stroke-width="0.7"/>
        <path d="M15,7.5 Q16.8,8 16.2,10 Q17.2,11.2 15.8,12.5 Q14,13 13.8,11.2 Z" fill="#C8102E"/>
      </svg>`;
    }
    if (clean.includes('new brunswick')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6" fill="#C8102E"/>
        <rect x="10" y="2" width="10" height="2" rx="0.8" fill="#FFD100"/>
        <rect y="6" width="30" height="10" fill="#FFD100"/>
        <path d="M8.5,12.8 L21.5,12.8 L19.2,15.8 L10.8,15.8 Z" fill="#1E293B"/>
        <path d="M12,8.5 Q15,7.2 18,8.5 L17.2,12.2 L12.8,12.2 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="0.4"/>
        <line x1="15" y1="6.8" x2="15" y2="13" stroke="#1E293B" stroke-width="0.9"/>
        <rect y="16" width="30" height="4" fill="#003399"/>
        <path d="M0,17.8 H30" stroke="#FFFFFF" stroke-width="1"/>
      </svg>`;
    }
    if (clean.includes('newfoundland')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <polygon points="0,0 13,0 0,9" fill="#002B7F"/>
        <polygon points="0,20 13,20 0,11" fill="#002B7F"/>
        <polygon points="15,0 30,0 30,8" fill="#FFFFFF" stroke="#CE1126" stroke-width="1.5"/>
        <polygon points="15,20 30,20 30,12" fill="#FFFFFF" stroke="#CE1126" stroke-width="1.5"/>
        <polygon points="15,10 30,7 30,13" fill="#FCD116" stroke="#CE1126" stroke-width="0.8"/>
      </svg>`;
    }
    if (clean.includes('prince edward')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <rect width="30" height="6" fill="#CE1126"/>
        <rect x="10" y="2" width="10" height="2" rx="0.8" fill="#FFD100"/>
        <ellipse cx="15" cy="17.2" rx="9" ry="1.8" fill="#15803D"/>
        <rect x="10.6" y="13" width="0.8" height="4" fill="#78350F"/>
        <rect x="16.4" y="12" width="1.2" height="5" fill="#78350F"/>
        <circle cx="11" cy="12" r="2.2" fill="#15803D"/>
        <circle cx="17" cy="10.8" r="3.2" fill="#15803D"/>
      </svg>`;
    }
    if (clean.includes('yukon')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="9" height="20" fill="#006A4E"/>
        <rect x="9" width="12" height="20" fill="#FFFFFF"/>
        <rect x="21" width="9" height="20" fill="#003399"/>
        <path d="M12,6 H18 V11.5 C18,13.5 15,14.8 15,14.8 C15,14.8 12,13.5 12,11.5 Z" fill="#CE1126" stroke="#003399" stroke-width="0.6"/>
        <rect x="12.2" y="6.2" width="5.6" height="2.2" fill="#FFFFFF"/>
        <path d="M15,6.2 V8.4 M12.2,7.3 H17.8" stroke="#CE1126" stroke-width="0.7"/>
      </svg>`;
    }
    if (clean.includes('northwest territories')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="8" height="20" fill="#003399"/>
        <rect x="8" width="14" height="20" fill="#FFFFFF"/>
        <rect x="22" width="8" height="20" fill="#003399"/>
        <polygon points="12,5 18,5 18,12 15,15 12,12" fill="#CE1126" stroke="#1E293B" stroke-width="0.4"/>
        <polygon points="12,5 18,5 12,11" fill="#006A4E"/>
        <rect x="12" y="5" width="6" height="2" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('nunavut')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="15" height="20" fill="#FFD100"/>
        <rect x="15" width="15" height="20" fill="#FFFFFF"/>
        <g fill="#CE1126" stroke="#000000" stroke-width="0.45">
          <ellipse cx="15" cy="4.8" rx="1.4" ry="1.1"/>
          <rect x="11.2" y="6.2" width="7.6" height="2.2" rx="0.8"/>
          <rect x="13" y="8.6" width="4" height="2.6" rx="0.6"/>
          <rect x="12.2" y="11.4" width="2.2" height="4.8" rx="0.6"/>
          <rect x="15.6" y="11.4" width="2.2" height="4.8" rx="0.6"/>
        </g>
        <polygon points="${starPoints(24.5, 5, 5, 2.2, 0.9)}" fill="#003399"/>
      </svg>`;
    }
  }

  // =========================================================================
  // 4. BELGIAN PROVINCES & REGIONS
  // =========================================================================
  if (clean.includes('antwerp') || clean.includes('antwerpen')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16">
      <rect width="24" height="16" fill="#FFFFFF"/>
      <g fill="#DA121A">
        <rect x="0" y="0" width="4" height="4"/><rect x="8" y="0" width="4" height="4"/><rect x="16" y="0" width="4" height="4"/>
        <rect x="4" y="4" width="4" height="4"/><rect x="12" y="4" width="4" height="4"/><rect x="20" y="4" width="4" height="4"/>
        <rect x="0" y="8" width="4" height="4"/><rect x="8" y="8" width="4" height="4"/><rect x="16" y="8" width="4" height="4"/>
        <rect x="4" y="12" width="4" height="4"/><rect x="12" y="12" width="4" height="4"/><rect x="20" y="12" width="4" height="4"/>
      </g>
      <g fill="#FFD100">
        <rect x="4" y="0" width="4" height="4"/><rect x="12" y="0" width="4" height="4"/>
        <rect x="0" y="4" width="4" height="4"/><rect x="8" y="4" width="4" height="4"/>
        <rect x="4" y="8" width="4" height="4"/><rect x="20" y="8" width="4" height="4"/>
        <rect x="8" y="12" width="4" height="4"/><rect x="16" y="12" width="4" height="4"/>
      </g>
      <g fill="#003399">
        <rect x="20" y="0" width="4" height="4"/><rect x="16" y="4" width="4" height="4"/>
        <rect x="12" y="8" width="4" height="4"/><rect x="0" y="12" width="4" height="4"/>
      </g>
    </svg>`;
  }
  if ((clean.includes('limburg') && cc !== 'NL') || (clean.includes('limburg') && cc === 'BE')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#FFFFFF"/>
      <path d="M15,4 Q18,5 17,9 Q20,11 18,15 Q15,18 13,15 Q10,18 9,14 Q8,11 11,9 Q9,5 15,4 Z" fill="#DA121A" stroke="#7F1D1D" stroke-width="0.4"/>
      <polygon points="13.2,4.2 14,2.2 15,3.5 16,2.2 16.8,4.2" fill="#FFD100"/>
    </svg>`;
  }
  if (clean.includes('oost-vlaanderen') || clean.includes('east flanders')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#008542"/>
      <rect y="6" width="30" height="8" fill="#FFFFFF"/>
      <rect y="8" width="30" height="1" fill="#008542"/>
      <rect y="11" width="30" height="1" fill="#008542"/>
      <path d="M15,4.5 Q18,5 17,8.5 Q19.5,10.5 17.5,14.5 Q15,16.5 13,14.5 Q11,16.5 10,13.5 Q8.5,10.5 11.5,8.5 Z" fill="#000000"/>
      <circle cx="15.8" cy="6.2" r="0.8" fill="#DA121A"/>
    </svg>`;
  }
  if (clean.includes('west-vlaanderen') || clean.includes('west flanders')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#FFD100"/>
      <polygon points="0,0 15,0 15,10" fill="#002654"/>
      <polygon points="30,0 30,10 15,10" fill="#002654"/>
      <polygon points="30,20 15,20 15,10" fill="#002654"/>
      <polygon points="0,20 0,10 15,10" fill="#002654"/>
      <path d="M11.5,6.5 H18.5 V11.5 C18.5,13.5 15,14.8 15,14.8 C15,14.8 11.5,13.5 11.5,11.5 Z" fill="#DA121A" stroke="#FFD100" stroke-width="0.4"/>
    </svg>`;
  }
  if (clean.includes('vlaams-brabant') || clean.includes('vlaams brabant') || clean.includes('flemish brabant')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#000000"/>
      <path d="M15,3.5 Q18.5,4 17.5,8 Q20.5,11 18.5,15.5 Q15,17.5 13,15.5 Q10.5,17.5 9.5,14 Q8,11 11,8 Z" fill="#FFD100"/>
      <path d="M13.2,8.5 H16.8 V12 C16.8,13.2 15,14 15,14 C15,14 13.2,13.2 13.2,12 Z" fill="#DA121A"/>
      <rect x="13.2" y="10" width="3.6" height="1.4" fill="#FFFFFF"/>
    </svg>`;
  }
  if (clean.includes('brabant wallon') || clean.includes('brabant-wallon') || clean.includes('waals-brabant') || clean.includes('walloon brabant')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#000000"/>
      <polygon points="0,0 15,12 30,0 30,20 0,20" fill="#FFD100"/>
      <path d="M15,2 Q17,2.2 16.2,5 Q18,6.8 16.5,9 Q14.5,9.5 13.2,7 Z" fill="#FFD100"/>
      <circle cx="7" cy="14.5" r="2.6" fill="#DA121A"/>
      <circle cx="23" cy="14.5" r="2.6" fill="#DA121A"/>
    </svg>`;
  }
  if (clean.includes('liège') || clean.includes('liege') || clean.includes('luik')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="15" height="10" fill="#DA121A"/>
      <rect x="15" width="15" height="10" fill="#FFD100"/>
      <rect y="10" width="15" height="10" fill="#FFD100"/>
      <rect x="15" y="10" width="15" height="10" fill="#DA121A"/>
      <rect x="6.8" y="2" width="1.4" height="6" fill="#FFD100"/>
      <rect x="16" y="3" width="11" height="2.5" fill="#DA121A"/>
      <rect x="16" y="4" width="11" height="0.8" fill="#FFFFFF"/>
    </svg>`;
  }
  if (clean.includes('hainaut') || clean.includes('henegouwen')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#FFD100"/>
      <line x1="15" y1="0" x2="15" y2="20" stroke="#000000" stroke-width="0.4"/>
      <line x1="0" y1="10" x2="30" y2="10" stroke="#000000" stroke-width="0.4"/>
      <ellipse cx="7.5" cy="5" rx="3" ry="2.2" fill="#000000"/>
      <ellipse cx="22.5" cy="5" rx="3" ry="2.2" fill="#DA121A"/>
      <ellipse cx="7.5" cy="15" rx="3" ry="2.2" fill="#DA121A"/>
      <ellipse cx="22.5" cy="15" rx="3" ry="2.2" fill="#000000"/>
    </svg>`;
  }
  if (clean.includes('namur') || clean.includes('namen')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="15" height="20" fill="#000000"/>
      <rect x="15" width="15" height="20" fill="#DA121A"/>
    </svg>`;
  }
  if (clean.includes('luxembourg') || clean.includes('luxemburg')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="2.2" fill="#FFFFFF"/>
      <rect y="2.2" width="30" height="2.2" fill="#0096D6"/>
      <rect y="4.4" width="30" height="2.2" fill="#FFFFFF"/>
      <rect y="6.6" width="30" height="2.2" fill="#0096D6"/>
      <rect y="8.8" width="30" height="2.2" fill="#FFFFFF"/>
      <rect y="11.0" width="30" height="2.2" fill="#0096D6"/>
      <rect y="13.2" width="30" height="2.2" fill="#FFFFFF"/>
      <rect y="15.4" width="30" height="2.2" fill="#0096D6"/>
      <rect y="17.6" width="30" height="2.4" fill="#FFFFFF"/>
      <path d="M15,4 Q18,5 17,9 Q20,11 18,15 Q15,18 13,15 Q10,18 9,14 Q8,11 11,9 Q9,5 15,4 Z" fill="#EF3340"/>
      <polygon points="13.2,4.2 14,2.2 15,3.5 16,2.2 16.8,4.2" fill="#FFD100"/>
    </svg>`;
  }
  if (clean.includes('bruxelles') || clean.includes('brussel')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#002654"/>
      <path d="M15,4 C17.5,7 17.5,11 15,13.5 C12.5,11 12.5,7 15,4 Z" fill="#FFD100" stroke="#FFFFFF" stroke-width="0.6"/>
      <circle cx="15" cy="15.5" r="1.6" fill="#FFD100" stroke="#FFFFFF" stroke-width="0.5"/>
    </svg>`;
  }

  // =========================================================================
  // 5. SWITZERLAND — ALL 26 CANTONAL FLAGS (HIGH-DETAIL HERALDRY)
  // =========================================================================
  if (
    cc === 'CH' ||
    clean.includes('zürich') ||
    clean.includes('zurich') ||
    clean.includes('graubünden') ||
    clean.includes('schaffhausen') ||
    clean.includes('appenzell') ||
    clean.includes('sankt gallen') ||
    clean.includes('thurgau') ||
    clean.includes('aargau') ||
    clean.includes('basel') ||
    clean.includes('solothurn') ||
    clean.includes('fribourg') ||
    clean.includes('neuchâtel') ||
    clean.includes('genève') ||
    clean.includes('vaud') ||
    clean.includes('valais') ||
    clean.includes('ticino') ||
    clean.includes('obwalden') ||
    clean.includes('nidwalden') ||
    clean.includes('schwyz') ||
    clean.includes('glarus')
  ) {
    if (clean.includes('zürich') || clean.includes('zurich')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <polygon points="0,0 0,20 30,20" fill="#0055A4"/>
      </svg>`;
    }
    if (clean.includes('bern')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#DA121A"/>
        <polygon points="0,0 11,0 30,13 30,20 19,20 0,7" fill="#FFD100"/>
        <!-- Black Bernese Bear walking up-left with red tongue & claws -->
        <g transform="translate(15, 10) rotate(-32)" fill="#000000">
          <ellipse cx="0" cy="0" rx="5.2" ry="2.6"/>
          <circle cx="-5.5" cy="-1.2" r="2.0"/>
          <circle cx="-4.6" cy="-3.0" r="0.8"/>
          <path d="M-7.2,-1.0 L-8.6,-0.5" stroke="#DA121A" stroke-width="0.65" stroke-linecap="round"/>
          <rect x="-4.5" y="1.2" width="1.4" height="3.2" rx="0.5" transform="rotate(20 -4.5 1.2)"/>
          <rect x="-1.8" y="1.5" width="1.4" height="3.0" rx="0.5" transform="rotate(-10 -1.8 1.5)"/>
          <rect x="1.8" y="1.4" width="1.5" height="3.2" rx="0.5" transform="rotate(15 1.8 1.4)"/>
          <rect x="4.0" y="0.8" width="1.4" height="3.2" rx="0.5" transform="rotate(-25 4.0 0.8)"/>
        </g>
      </svg>`;
    }
    if (clean.includes('lucerne') || clean.includes('luzern')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="15" height="20" fill="#0055A4"/>
        <rect x="15" width="15" height="20" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean === 'uri') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFD100"/>
        <g transform="translate(15, 10)">
          <path d="M-5.5,-3 C-8,-6 -9,-2 -6,-1.5 Z" fill="#000000"/>
          <path d="M5.5,-3 C8,-6 9,-2 6,-1.5 Z" fill="#000000"/>
          <path d="M-4.2,-4 C-6.5,-8 -2.5,-8.5 -2,-5" fill="none" stroke="#000000" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M4.2,-4 C6.5,-8 2.5,-8.5 2,-5" fill="none" stroke="#000000" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M-4,-5 H4 L3,3.5 C2,5.5 -2,5.5 -3,3.5 Z" fill="#000000"/>
          <circle cx="-1.8" cy="-1.5" r="0.65" fill="#FFFFFF"/>
          <circle cx="1.8" cy="-1.5" r="0.65" fill="#FFFFFF"/>
          <path d="M0,4.5 Q1.8,6.5 1.2,7.8" fill="none" stroke="#DA121A" stroke-width="1.1" stroke-linecap="round"/>
          <circle cx="0" cy="4.2" r="2.2" fill="none" stroke="#DA121A" stroke-width="1.1"/>
        </g>
      </svg>`;
    }
    if (clean.includes('schwyz')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#DA121A"/>
        <path d="M6.5,2.2 V7.8 M3.7,5 H9.3" stroke="#FFFFFF" stroke-width="1.5"/>
      </svg>`;
    }
    if (clean.includes('obwalden')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#DA121A"/>
        <rect y="10" width="30" height="10" fill="#FFFFFF"/>
        <rect x="14.2" y="3" width="1.6" height="7" fill="#FFFFFF"/>
        <rect x="11" y="3" width="3.2" height="4.2" fill="#FFFFFF"/>
        <rect x="15.8" y="3" width="3.2" height="4.2" fill="#FFFFFF"/>
        <rect x="14.2" y="10" width="1.6" height="3.5" fill="#DA121A"/>
        <circle cx="15" cy="15.2" r="2.6" fill="none" stroke="#DA121A" stroke-width="1.4"/>
      </svg>`;
    }
    if (clean.includes('nidwalden')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#DA121A"/>
        <g fill="none" stroke="#FFFFFF" stroke-width="1.4">
          <line x1="13.5" y1="3.5" x2="13.5" y2="13"/>
          <line x1="16.5" y1="3.5" x2="16.5" y2="13"/>
          <rect x="10" y="3.8" width="3.2" height="4.5" fill="#FFFFFF" stroke="none"/>
          <rect x="16.8" y="3.8" width="3.2" height="4.5" fill="#FFFFFF" stroke="none"/>
          <circle cx="15" cy="15.2" r="2.6"/>
        </g>
      </svg>`;
    }
    if (clean.includes('glarus')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#DA121A"/>
        <circle cx="15" cy="5.2" r="2.6" fill="#FFD100"/>
        <circle cx="15" cy="5.2" r="1.4" fill="#FDE68A"/>
        <path d="M12,8 L18,8 L19,16.5 L11,16.5 Z" fill="#000000"/>
        <line x1="19.5" y1="3.5" x2="19.5" y2="17.5" stroke="#FFD100" stroke-width="1.1"/>
        <rect x="10.2" y="9.5" width="2.2" height="2.8" fill="#FFD100"/>
      </svg>`;
    }
    if (clean === 'zug') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#FFFFFF"/>
        <rect y="6.6" width="30" height="6.8" fill="#0055A4"/>
        <rect y="13.4" width="30" height="6.6" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('fribourg')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#000000"/>
        <rect y="10" width="30" height="10" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('solothurn')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#DA121A"/>
        <rect y="10" width="30" height="10" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('basel-stadt') || clean === 'basel stadt') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <path d="M15,4 C11.5,4 11.5,8.5 14.5,8.5 C16,8.5 16,6.5 14.5,6.5 M14.5,8.5 L13,16 L17,16 L15.5,8.5" fill="#000000" stroke="#000000" stroke-width="1.4" stroke-linejoin="round"/>
      </svg>`;
    }
    if (clean.includes('basel-landschaft') || clean.includes('basel landschaft')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <path d="M15,4 C18.5,4 18.5,8.5 15.5,8.5 C14,8.5 14,6.5 15.5,6.5 M15.5,8.5 L13,16 L17,16 L14.5,8.5" fill="#DA121A" stroke="#DA121A" stroke-width="1.4" stroke-linejoin="round"/>
        <circle cx="17.8" cy="4.2" r="0.6" fill="#DA121A"/>
        <circle cx="19.2" cy="5.8" r="0.6" fill="#DA121A"/>
        <circle cx="19.0" cy="7.6" r="0.6" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('schaffhausen')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFD100"/>
        <g transform="translate(15, 10)">
          <path d="M-2,-5 C-5,-6 -5.5,-3 -3,-2.5" fill="none" stroke="#F59E0B" stroke-width="1.4"/>
          <ellipse cx="0" cy="0.5" rx="3.2" ry="4.8" fill="#000000" transform="rotate(-20)"/>
          <circle cx="-2.2" cy="-4.2" r="1.8" fill="#000000"/>
          <polygon points="-3.5,-5.8 -2.2,-7.2 -1,-5.8" fill="#EF4444"/>
          <line x1="-2.5" y1="3" x2="-4.5" y2="6.5" stroke="#000000" stroke-width="1.4"/>
          <line x1="1.5" y1="3.5" x2="0.5" y2="7" stroke="#000000" stroke-width="1.4"/>
          <line x1="-3.5" y1="-1" x2="-6.5" y2="1" stroke="#000000" stroke-width="1.4"/>
        </g>
      </svg>`;
    }
    if (clean.includes('appenzell')) {
      const isOuter = clean.includes('ausser');
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <g transform="translate(15, 10)" fill="#000000">
          <ellipse cx="0" cy="0.5" rx="3.2" ry="5.2" transform="rotate(-12)"/>
          <circle cx="-1.5" cy="-4.8" r="2.0"/>
          <path d="M-3.2,-4.8 L-4.8,-4.5" stroke="#DA121A" stroke-width="0.7"/>
          <line x1="-2" y1="-2" x2="-5.5" y2="-3.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="-2" y1="1" x2="-5.5" y2="0.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="-1.5" y1="4.5" x2="-3.5" y2="7.5" stroke="#000000" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="1.8" y1="4.5" x2="3.2" y2="7.5" stroke="#000000" stroke-width="1.6" stroke-linecap="round"/>
        </g>
        ${isOuter ? '<text x="6.5" y="13" font-size="6.5" font-family="serif" font-weight="bold" fill="#000000">V</text><text x="20.5" y="13" font-size="6.5" font-family="serif" font-weight="bold" fill="#000000">R</text>' : ''}
      </svg>`;
    }
    if (clean.includes('sankt gallen') || clean.includes('st. gallen')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#008542"/>
        <rect x="12" y="2.5" width="6" height="15" rx="0.8" fill="#FFFFFF"/>
        <line x1="13.5" y1="2.5" x2="13.5" y2="17.5" stroke="#008542" stroke-width="0.4"/>
        <line x1="15" y1="2.5" x2="15" y2="17.5" stroke="#008542" stroke-width="0.4"/>
        <line x1="16.5" y1="2.5" x2="16.5" y2="17.5" stroke="#008542" stroke-width="0.4"/>
        <path d="M12,5.5 L8.5,4.2 C7.8,6.5 8.5,8.8 12,8.2 Z" fill="#FFFFFF"/>
        <line x1="11.8" y1="6.5" x2="18.2" y2="9.5" stroke="#008542" stroke-width="1.2"/>
        <line x1="11.8" y1="11.5" x2="18.2" y2="14.5" stroke="#008542" stroke-width="1.2"/>
      </svg>`;
    }
    if (clean.includes('graubünden') || clean.includes('graubunden') || clean.includes('grisons')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="7.5" height="10" fill="#000000"/>
        <rect x="7.5" width="7.5" height="10" fill="#FFFFFF"/>
        <rect x="15" width="15" height="10" fill="#0055A4"/>
        <rect x="15" y="0" width="7.5" height="5" fill="#FFD100"/>
        <rect x="22.5" y="5" width="7.5" height="5" fill="#FFD100"/>
        <path d="M22.5,0 V10 M15,5 H30" stroke="#0055A4" stroke-width="2.2"/>
        <rect y="10" width="30" height="10" fill="#FFFFFF"/>
        <line x1="0" y1="10" x2="30" y2="10" stroke="#000000" stroke-width="0.5"/>
        <!-- Black Alpine Ibex in bottom half -->
        <path d="M13,18 L14,14 L17,13 L18,18 M13.5,14 C11,11 15,10 16,12.5" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
    }
    if (clean.includes('aargau')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="15" height="20" fill="#000000"/>
        <rect x="15" width="15" height="20" fill="#0055A4"/>
        <path d="M1.5,7.5 Q4.5,6 7.5,7.5 T13.5,7.5 M1.5,10 Q4.5,8.5 7.5,10 T13.5,10 M1.5,12.5 Q4.5,11 7.5,12.5 T13.5,12.5" fill="none" stroke="#FFFFFF" stroke-width="1.2"/>
        <polygon points="${starPoints(22.5, 6.2, 5, 2.2, 0.9)}" fill="#FFFFFF"/>
        <polygon points="${starPoints(19.5, 12.8, 5, 2.2, 0.9)}" fill="#FFFFFF"/>
        <polygon points="${starPoints(25.5, 12.8, 5, 2.2, 0.9)}" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('thurgau')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <polygon points="0,0 0,20 30,20" fill="#008542"/>
        <ellipse cx="19" cy="6.5" rx="4.2" ry="1.8" transform="rotate(-30 19 6.5)" fill="#FFD100" stroke="#B45309" stroke-width="0.4"/>
        <ellipse cx="11" cy="13.5" rx="4.2" ry="1.8" transform="rotate(-30 11 13.5)" fill="#FFD100" stroke="#B45309" stroke-width="0.4"/>
      </svg>`;
    }
    if (clean.includes('ticino')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#DA121A"/>
        <rect y="10" width="30" height="10" fill="#0055A4"/>
      </svg>`;
    }
    if (clean.includes('vaud')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#FFFFFF"/>
        <rect y="10" width="30" height="10" fill="#008542"/>
        <text x="15" y="4.8" text-anchor="middle" font-size="2.5" font-family="serif" font-weight="bold" fill="#D97706">LIBERTÉ</text>
        <text x="15" y="8.2" text-anchor="middle" font-size="2.5" font-family="serif" font-weight="bold" fill="#D97706">ET PATRIE</text>
      </svg>`;
    }
    if (clean.includes('valais')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="15" height="20" fill="#FFFFFF"/>
        <rect x="15" width="15" height="20" fill="#DA121A"/>
        <g fill="#DA121A">
          <polygon points="${starPoints(7.5, 3.5, 5, 1.5, 0.6)}"/>
          <polygon points="${starPoints(7.5, 7.8, 5, 1.5, 0.6)}"/>
          <polygon points="${starPoints(7.5, 12.2, 5, 1.5, 0.6)}"/>
          <polygon points="${starPoints(7.5, 16.5, 5, 1.5, 0.6)}"/>
        </g>
        <g fill="#FFFFFF">
          <polygon points="${starPoints(22.5, 3.5, 5, 1.5, 0.6)}"/>
          <polygon points="${starPoints(22.5, 7.8, 5, 1.5, 0.6)}"/>
          <polygon points="${starPoints(22.5, 12.2, 5, 1.5, 0.6)}"/>
          <polygon points="${starPoints(22.5, 16.5, 5, 1.5, 0.6)}"/>
        </g>
        <circle cx="15" cy="2.5" r="1.1" fill="#F59E0B"/>
        <circle cx="15" cy="6.2" r="1.1" fill="#F59E0B"/>
        <circle cx="15" cy="10" r="1.1" fill="#F59E0B"/>
        <circle cx="15" cy="13.8" r="1.1" fill="#F59E0B"/>
        <circle cx="15" cy="17.5" r="1.1" fill="#F59E0B"/>
      </svg>`;
    }
    if (clean.includes('neuchâtel') || clean.includes('neuchatel')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="10" height="20" fill="#008542"/>
        <rect x="10" width="10" height="20" fill="#FFFFFF"/>
        <rect x="20" width="10" height="20" fill="#DA121A"/>
        <path d="M25,2 V7 M22.5,4.5 H27.5" stroke="#FFFFFF" stroke-width="1.4"/>
      </svg>`;
    }
    if (clean.includes('genève') || clean.includes('geneve') || clean.includes('geneva')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="15" height="20" fill="#FFD100"/>
        <rect x="15" width="15" height="20" fill="#DA121A"/>
        <!-- Half Black Eagle on Left -->
        <path d="M15,4 C10,4 6,7 5,11 C8,10 11,12 10,16 L15,16 Z" fill="#000000"/>
        <polygon points="11.5,3.8 13,2 14.8,3.8" fill="#DA121A"/>
        <!-- Gold Key on Right -->
        <rect x="21.2" y="4" width="1.6" height="9" fill="#FFD100"/>
        <rect x="18" y="4.2" width="3.2" height="4.2" fill="#FFD100"/>
        <circle cx="22" cy="14.8" r="2.4" fill="none" stroke="#FFD100" stroke-width="1.4"/>
      </svg>`;
    }
    if (clean === 'jura') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="15" height="20" fill="#FFFFFF"/>
        <path d="M7.5,4 C4.5,4 4.5,8.5 7,8.5 M7,8.5 L5.5,16 L9.5,16 L8,8.5" fill="#DA121A" stroke="#DA121A" stroke-width="1.3"/>
        <rect x="15" y="0" width="15" height="2.85" fill="#DA121A"/>
        <rect x="15" y="2.85" width="15" height="2.85" fill="#FFFFFF"/>
        <rect x="15" y="5.7" width="15" height="2.85" fill="#DA121A"/>
        <rect x="15" y="8.55" width="15" height="2.85" fill="#FFFFFF"/>
        <rect x="15" y="11.4" width="15" height="2.85" fill="#DA121A"/>
        <rect x="15" y="14.25" width="15" height="2.85" fill="#FFFFFF"/>
        <rect x="15" y="17.1" width="15" height="2.9" fill="#DA121A"/>
      </svg>`;
    }
  }

  // =========================================================================
  // 6. BRAZIL — ALL 26 STATES & FEDERAL DISTRICT (HIGH-DETAIL HERALDRY)
  // =========================================================================
  if (
    cc === 'BR' ||
    clean.includes('são paulo') ||
    clean.includes('minas gerais') ||
    clean.includes('pernambuco') ||
    clean.includes('rio grande do sul') ||
    clean.includes('rio de janeiro') ||
    clean.includes('santa catarina') ||
    clean.includes('mato grosso') ||
    clean.includes('espírito santo') ||
    clean.includes('distrito federal') ||
    clean.includes('tocantins') ||
    clean.includes('maranhão') ||
    clean.includes('rondônia') ||
    clean.includes('roraima') ||
    clean.includes('amapá')
  ) {
    if (clean.includes('são paulo') || clean.includes('sao paulo')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39 26">
        <rect width="39" height="26" fill="#FFFFFF"/>
        <g fill="#000000">
          <rect y="0" width="39" height="2"/><rect y="4" width="39" height="2"/><rect y="8" width="39" height="2"/>
          <rect y="12" width="39" height="2"/><rect y="16" width="39" height="2"/><rect y="20" width="39" height="2"/><rect y="24" width="39" height="2"/>
        </g>
        <rect width="15" height="10" fill="#DA121A"/>
        <circle cx="7.5" cy="5" r="3.6" fill="#FFFFFF"/>
        <path d="M6,3.2 L9.2,3.8 L8.5,6.8 L6.8,7.2 L5.8,5.2 Z" fill="#1E3A8A"/>
        <circle cx="2" cy="1.8" r="0.8" fill="#FFD100"/><circle cx="13" cy="1.8" r="0.8" fill="#FFD100"/>
        <circle cx="2" cy="8.2" r="0.8" fill="#FFD100"/><circle cx="13" cy="8.2" r="0.8" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('minas gerais')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <polygon points="15,4.2 21.5,15.5 8.5,15.5" fill="#DA121A"/>
        <text x="15" y="17.8" text-anchor="middle" font-size="2.0" font-family="sans-serif" font-weight="bold" fill="#000000">QUÆ SERA TAMEN</text>
      </svg>`;
    }
    if (clean.includes('pernambuco')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="13" fill="#003399"/>
        <rect y="13" width="30" height="7" fill="#FFFFFF"/>
        <path d="M5,13 A10,9.5 0 0,1 25,13" fill="none" stroke="#DA121A" stroke-width="1.3"/>
        <path d="M6.3,13 A8.7,8.2 0 0,1 23.7,13" fill="none" stroke="#FFD100" stroke-width="1.3"/>
        <path d="M7.6,13 A7.4,6.9 0 0,1 22.4,13" fill="none" stroke="#009B3A" stroke-width="1.3"/>
        <circle cx="15" cy="9.5" r="2.0" fill="#FFD100"/>
        <polygon points="${starPoints(15, 2.2, 5, 1.4, 0.55)}" fill="#FFD100"/>
        <path d="M15,14.2 V18.8 M13,16.5 H17" stroke="#DA121A" stroke-width="1.2"/>
      </svg>`;
    }
    if (clean.includes('bahia')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="5" fill="#FFFFFF"/>
        <rect y="5" width="30" height="5" fill="#DA121A"/>
        <rect y="10" width="30" height="5" fill="#FFFFFF"/>
        <rect y="15" width="30" height="5" fill="#DA121A"/>
        <rect width="12" height="10" fill="#003399"/>
        <polygon points="6,2 9.8,8.5 2.2,8.5" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('rio grande do sul')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <polygon points="0,0 30,0 0,20" fill="#009B3A"/>
        <polygon points="30,0 30,20 0,20" fill="#FFD100"/>
        <polygon points="0,13 20,0 30,0 30,7 10,20 0,20" fill="#DA121A"/>
        <ellipse cx="15" cy="10" rx="4.2" ry="5.2" fill="#FFFFFF" stroke="#FFD100" stroke-width="0.6"/>
        <circle cx="15" cy="10" r="2.2" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('rio de janeiro')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="15" height="10" fill="#FFFFFF"/>
        <rect x="15" width="15" height="10" fill="#38BDF8"/>
        <rect y="10" width="15" height="10" fill="#38BDF8"/>
        <rect x="15" y="10" width="15" height="10" fill="#FFFFFF"/>
        <ellipse cx="15" cy="10" rx="4.2" ry="5" fill="#1E3A8A" stroke="#15803D" stroke-width="0.8"/>
        <polygon points="13,12 15,7.5 17,12" fill="#94A3B8"/>
      </svg>`;
    }
    if (clean.includes('paraná') || clean.includes('parana')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#009B3A"/>
        <polygon points="0,2.5 8,0 30,14 30,20 22,20 0,6" fill="#FFFFFF"/>
        <circle cx="15" cy="10" r="4.5" fill="#003399" stroke="#15803D" stroke-width="0.7"/>
        <path d="M10.5,9.5 Q15,8 19.5,10.5" fill="none" stroke="#FFFFFF" stroke-width="1.1"/>
        <circle cx="14" cy="11.5" r="0.5" fill="#FFFFFF"/><circle cx="16" cy="12" r="0.5" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('santa catarina')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#DA121A"/>
        <rect y="6.6" width="30" height="6.8" fill="#FFFFFF"/>
        <rect y="13.4" width="30" height="6.6" fill="#DA121A"/>
        <polygon points="15,3.5 23,10 15,16.5 7,10" fill="#009B3A"/>
        <circle cx="15" cy="10" r="3" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('ceará') || clean.includes('ceara')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#009B3A"/>
        <polygon points="15,2 27,10 15,18 3,10" fill="#FFD100"/>
        <circle cx="15" cy="10" r="4.2" fill="#FFFFFF" stroke="#009B3A" stroke-width="0.6"/>
        <rect x="14.4" y="7.5" width="1.2" height="4.5" fill="#78350F"/>
      </svg>`;
    }
    if (clean.includes('goiás') || clean.includes('goias')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFD100"/>
        <rect y="0" width="30" height="2.5" fill="#009B3A"/>
        <rect y="5" width="30" height="2.5" fill="#009B3A"/>
        <rect y="10" width="30" height="2.5" fill="#009B3A"/>
        <rect y="15" width="30" height="2.5" fill="#009B3A"/>
        <rect width="12" height="10" fill="#003399"/>
        <circle cx="3" cy="2.5" r="0.8" fill="#FFFFFF"/><circle cx="9" cy="2.5" r="0.8" fill="#FFFFFF"/>
        <circle cx="6" cy="5" r="0.8" fill="#FFFFFF"/>
        <circle cx="3" cy="7.5" r="0.8" fill="#FFFFFF"/><circle cx="9" cy="7.5" r="0.8" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('mato grosso do sul')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#38BDF8"/>
        <polygon points="0,0 21,0 0,14" fill="#FFFFFF"/>
        <polygon points="0,0 16,0 0,10.5" fill="#009B3A"/>
        <polygon points="${starPoints(23, 14, 5, 3.2, 1.3)}" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('mato grosso')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#003399"/>
        <polygon points="15,2 27,10 15,18 3,10" fill="#FFFFFF"/>
        <circle cx="15" cy="10" r="4.8" fill="#009B3A"/>
        <polygon points="${starPoints(15, 10, 5, 3.6, 1.4)}" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('amazonas')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#FFFFFF"/>
        <rect y="6.6" width="30" height="6.8" fill="#DA121A"/>
        <rect y="13.4" width="30" height="6.6" fill="#FFFFFF"/>
        <rect width="12" height="6.6" fill="#003399"/>
        <circle cx="6" cy="3.3" r="1.1" fill="#FFFFFF"/>
        <circle cx="3" cy="2" r="0.5" fill="#FFFFFF"/><circle cx="9" cy="2" r="0.5" fill="#FFFFFF"/>
        <circle cx="3" cy="4.6" r="0.5" fill="#FFFFFF"/><circle cx="9" cy="4.6" r="0.5" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean === 'pará' || clean === 'para') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#DA121A"/>
        <polygon points="0,0 7,0 30,15.5 30,20 23,20 0,4.5" fill="#FFFFFF"/>
        <polygon points="${starPoints(15, 10, 5, 3.4, 1.35)}" fill="#003399"/>
      </svg>`;
    }
    if (clean.includes('maranhão') || clean.includes('maranhao')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <rect y="0" width="30" height="2.2" fill="#DA121A"/>
        <rect y="4.4" width="30" height="2.2" fill="#000000"/>
        <rect y="8.8" width="30" height="2.2" fill="#DA121A"/>
        <rect y="13.2" width="30" height="2.2" fill="#000000"/>
        <rect y="17.6" width="30" height="2.4" fill="#DA121A"/>
        <rect width="11" height="8.8" fill="#003399"/>
        <polygon points="${starPoints(5.5, 4.4, 5, 2.8, 1.1)}" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('piauí') || clean.includes('piaui')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFD100"/>
        <g fill="#009B3A">
          <rect y="0" width="30" height="1.54"/><rect y="3.08" width="30" height="1.54"/>
          <rect y="6.16" width="30" height="1.54"/><rect y="9.24" width="30" height="1.54"/>
          <rect y="12.32" width="30" height="1.54"/><rect y="15.4" width="30" height="1.54"/><rect y="18.46" width="30" height="1.54"/>
        </g>
        <rect width="12" height="7.7" fill="#003399"/>
        <polygon points="${starPoints(6, 3.85, 5, 2.4, 0.95)}" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('paraíba') || clean.includes('paraiba')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="10" height="20" fill="#000000"/>
        <rect x="10" width="20" height="20" fill="#DA121A"/>
        <text x="20" y="12" text-anchor="middle" font-size="5.2" font-family="sans-serif" font-weight="bold" fill="#FFFFFF">NEGO</text>
      </svg>`;
    }
    if (clean.includes('rio grande do norte')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#009B3A"/>
        <rect y="10" width="30" height="10" fill="#FFFFFF"/>
        <ellipse cx="15" cy="10" rx="4.2" ry="4.2" fill="#FFD100"/>
        <rect x="13" y="8" width="4" height="4" fill="#38BDF8"/>
      </svg>`;
    }
    if (clean.includes('alagoas')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="10" height="20" fill="#DA121A"/>
        <rect x="10" width="10" height="20" fill="#FFFFFF"/>
        <rect x="20" width="10" height="20" fill="#003399"/>
        <path d="M12.5,6.5 H17.5 V11.5 C17.5,13.5 15,14.8 15,14.8 C15,14.8 12.5,13.5 12.5,11.5 Z" fill="#FFD100" stroke="#15803D" stroke-width="0.6"/>
        <polygon points="${starPoints(15, 4.5, 5, 1.3, 0.5)}" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('sergipe')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="5" fill="#009B3A"/>
        <rect y="5" width="30" height="5" fill="#FFD100"/>
        <rect y="10" width="30" height="5" fill="#009B3A"/>
        <rect y="15" width="30" height="5" fill="#FFD100"/>
        <rect width="12" height="10" fill="#003399"/>
        <polygon points="${starPoints(6, 5, 5, 2.2, 0.85)}" fill="#FFFFFF"/>
        <circle cx="2.5" cy="2" r="0.7" fill="#FFFFFF"/><circle cx="9.5" cy="2" r="0.7" fill="#FFFFFF"/>
        <circle cx="2.5" cy="8" r="0.7" fill="#FFFFFF"/><circle cx="9.5" cy="8" r="0.7" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('espírito santo') || clean.includes('espirito santo')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#38BDF8"/>
        <rect y="6.6" width="30" height="6.8" fill="#FFFFFF"/>
        <rect y="13.4" width="30" height="6.6" fill="#F472B6"/>
        <text x="15" y="10.8" text-anchor="middle" font-size="2.2" font-family="sans-serif" font-weight="bold" fill="#0284C7">TRABALHA E CONFIA</text>
      </svg>`;
    }
    if (clean === 'acre') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <polygon points="0,0 30,0 0,20" fill="#FFD100"/>
        <polygon points="30,0 30,20 0,20" fill="#009B3A"/>
        <polygon points="${starPoints(5.5, 4.5, 5, 2.8, 1.1)}" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('rondônia') || clean.includes('rondonia')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#003399"/>
        <rect y="10" width="30" height="10" fill="#FFD100"/>
        <polygon points="0,20 15,10 30,20" fill="#009B3A"/>
        <polygon points="${starPoints(15, 10, 5, 4.2, 1.65)}" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('roraima')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <polygon points="0,0 24,0 0,16" fill="#38BDF8"/>
        <polygon points="24,0 30,0 30,4 6,20 0,20 0,16" fill="#FFFFFF"/>
        <polygon points="30,4 30,20 6,20" fill="#009B3A"/>
        <rect y="16.5" width="30" height="1.2" fill="#DA121A"/>
        <polygon points="${starPoints(15, 10, 5, 3.8, 1.5)}" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('amapá') || clean.includes('amapa')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.5" fill="#003399"/>
        <rect y="6.5" width="30" height="7" fill="#009B3A" stroke="#FFFFFF" stroke-width="0.9"/>
        <rect y="13.5" width="30" height="6.5" fill="#FFD100"/>
        <polygon points="0,0 12,10 0,20" fill="#000000" stroke="#FFFFFF" stroke-width="0.8"/>
        <polygon points="5,7.5 7.5,10 5,12.5 2.5,10" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('tocantins')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <polygon points="0,0 21,0 0,14" fill="#003399"/>
        <polygon points="21,0 30,0 30,6 9,20 0,20 0,14" fill="#FFFFFF"/>
        <polygon points="30,6 30,20 9,20" fill="#FFD100"/>
        <polygon points="${starPoints(15, 10, 8, 4.4, 2.2)}" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('distrito federal')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <rect x="9.5" y="4.5" width="11" height="11" fill="#009B3A"/>
        <path d="M15,6 V14 M11,10 H19" stroke="#FFD100" stroke-width="1.8"/>
      </svg>`;
    }
  }

  // =========================================================================
  // 7. AUSTRALIA — ALL 6 STATES & 2 MAINLAND TERRITORIES
  // =========================================================================
  if (
    cc === 'AU' ||
    clean.includes('new south wales') ||
    clean.includes('queensland') ||
    clean.includes('south australia') ||
    clean.includes('western australia') ||
    clean.includes('tasmania') ||
    clean.includes('northern territory') ||
    clean.includes('australian capital territory') ||
    clean === 'victoria'
  ) {
    const auBlueEnsignBase = `
      <rect width="30" height="20" fill="#012169"/>
      <rect width="14" height="10" fill="#012169"/>
      <path d="M0,0 L14,10 M14,0 L0,10" stroke="#FFFFFF" stroke-width="1.6"/>
      <path d="M7,0 V10 M0,5 H14" stroke="#FFFFFF" stroke-width="2.4"/>
      <path d="M7,0 V10 M0,5 H14" stroke="#C8102E" stroke-width="1.4"/>
    `;
    if (clean.includes('western australia')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        ${auBlueEnsignBase}
        <circle cx="22.5" cy="10" r="4.5" fill="#FFD100"/>
        <!-- Black Swan -->
        <path d="M20.5,11.5 C20.5,9.5 23.5,9.5 24.5,11.5 C23.5,12.5 21,12.5 20.5,11.5 Z M21,11 C20,9.5 20.2,7.8 21.2,7.8 C21.8,7.8 21.8,8.5 21.2,8.5" fill="#000000" stroke="#000000" stroke-width="0.6"/>
      </svg>`;
    }
    if (clean.includes('south australia')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        ${auBlueEnsignBase}
        <circle cx="22.5" cy="10" r="4.5" fill="#FFD100"/>
        <!-- Piping Shrike (Magpie with outstretched black/white wings) -->
        <path d="M19,9.5 Q22.5,7 26,9.5 L24.5,11.5 L20.5,11.5 Z" fill="#000000"/>
        <circle cx="22.5" cy="10.2" r="1.3" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('new south wales')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        ${auBlueEnsignBase}
        <circle cx="22.5" cy="10" r="4.5" fill="#FFFFFF"/>
        <path d="M22.5,5.5 V14.5 M18,10 H27" stroke="#C8102E" stroke-width="1.6"/>
        <circle cx="22.5" cy="10" r="1.1" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('queensland')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        ${auBlueEnsignBase}
        <circle cx="22.5" cy="10" r="4.5" fill="#FFFFFF"/>
        <path d="M22.5,6.2 L23.5,9 H26.3 L23.5,10 L26.3,11 H23.5 L22.5,13.8 L21.5,11 H18.7 L21.5,10 L18.7,9 H21.5 Z" fill="#38BDF8"/>
        <circle cx="22.5" cy="10" r="1.2" fill="#C8102E" stroke="#FFD100" stroke-width="0.4"/>
      </svg>`;
    }
    if (clean.includes('tasmania')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        ${auBlueEnsignBase}
        <circle cx="22.5" cy="10" r="4.5" fill="#FFFFFF"/>
        <ellipse cx="22.5" cy="10" rx="2.8" ry="1.6" fill="#C8102E"/>
      </svg>`;
    }
    if (clean === 'victoria') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        ${auBlueEnsignBase}
        <!-- Southern Cross topped by Royal Crown -->
        <polygon points="21,4.8 22.5,3.5 24,4.8 23.6,6.2 21.4,6.2" fill="#FFD100" stroke="#C8102E" stroke-width="0.4"/>
        <circle cx="22.5" cy="8" r="0.9" fill="#FFFFFF"/>
        <circle cx="19.5" cy="10.5" r="0.9" fill="#FFFFFF"/>
        <circle cx="25.5" cy="10" r="0.9" fill="#FFFFFF"/>
        <circle cx="22.5" cy="14.5" r="1.0" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('northern territory')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="10" height="20" fill="#000000"/>
        <rect x="10" width="20" height="20" fill="#C65D21"/>
        <circle cx="5" cy="4.5" r="0.9" fill="#FFFFFF"/>
        <circle cx="2.5" cy="9.5" r="0.9" fill="#FFFFFF"/>
        <circle cx="7.5" cy="8.8" r="0.9" fill="#FFFFFF"/>
        <circle cx="5" cy="15.5" r="1.0" fill="#FFFFFF"/>
        <circle cx="20" cy="10" r="4.6" fill="#FFFFFF"/>
        <polygon points="${starPoints(20, 10, 7, 2.2, 0.9)}" fill="#000000"/>
      </svg>`;
    }
    if (clean.includes('australian capital territory')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="10" height="20" fill="#003399"/>
        <rect x="10" width="20" height="20" fill="#FFD100"/>
        <circle cx="5" cy="4.5" r="0.9" fill="#FFFFFF"/>
        <circle cx="2.5" cy="9.5" r="0.9" fill="#FFFFFF"/>
        <circle cx="7.5" cy="8.8" r="0.9" fill="#FFFFFF"/>
        <circle cx="5" cy="15.5" r="1.0" fill="#FFFFFF"/>
        <path d="M17,6.5 H23 V11.5 C23,13.8 20,15 20,15 C20,15 17,13.8 17,11.5 Z" fill="#003399" stroke="#FFFFFF" stroke-width="0.6"/>
        <rect x="18.8" y="8" width="2.4" height="3.5" fill="#FFFFFF"/>
      </svg>`;
    }
  }

  // =========================================================================
  // 8. GERMANY — ALL 16 BUNDESLÄNDER (STATE FLAGS & COATS OF ARMS)
  // =========================================================================
  if (
    cc === 'DE' ||
    clean.includes('bayern') ||
    clean.includes('bavaria') ||
    clean.includes('baden-württemberg') ||
    clean.includes('brandenburg') ||
    clean.includes('mecklenburg') ||
    clean.includes('niedersachsen') ||
    clean.includes('nordrhein-westfalen') ||
    clean.includes('rheinland-pfalz') ||
    clean.includes('sachsen') ||
    clean.includes('schleswig-holstein') ||
    clean.includes('thüringen') ||
    clean.includes('saarland') ||
    clean === 'berlin' ||
    clean === 'hamburg' ||
    clean === 'bremen' ||
    clean === 'hessen'
  ) {
    if (clean.includes('bayern') || clean.includes('bavaria')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <g fill="#0080C9">
          <polygon points="0,0 10,0 5,5"/><polygon points="15,0 25,0 20,5"/>
          <polygon points="5,5 15,5 10,10 0,10"/><polygon points="20,5 30,5 25,10 15,10"/>
          <polygon points="10,10 20,10 15,15 5,15"/><polygon points="25,10 30,10 30,15 20,15"/>
          <polygon points="0,15 10,15 5,20 0,20"/><polygon points="15,15 25,15 20,20 10,20"/>
        </g>
      </svg>`;
    }
    if (clean === 'berlin') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="4" fill="#DA121A"/>
        <rect y="4" width="30" height="12" fill="#FFFFFF"/>
        <rect y="16" width="30" height="4" fill="#DA121A"/>
        <ellipse cx="15" cy="10.5" rx="2.4" ry="4.2" fill="#000000"/>
        <circle cx="14.2" cy="6" r="1.5" fill="#000000"/>
        <line x1="12.5" y1="8.5" x2="10.5" y2="7.5" stroke="#000000" stroke-width="1.2" stroke-linecap="round"/>
      </svg>`;
    }
    if (clean === 'hamburg') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#DA121A"/>
        <g fill="#FFFFFF">
          <rect x="9" y="10" width="12" height="6.5"/>
          <rect x="9" y="6" width="3" height="4"/>
          <rect x="13.5" y="4.5" width="3" height="5.5"/>
          <rect x="18" y="6" width="3" height="4"/>
        </g>
        <rect x="13.8" y="12.5" width="2.4" height="4" fill="#DA121A"/>
      </svg>`;
    }
    if (clean === 'bremen') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <g fill="#DA121A">
          <rect y="0" width="30" height="2.5"/><rect y="5" width="30" height="2.5"/>
          <rect y="10" width="30" height="2.5"/><rect y="15" width="30" height="2.5"/>
        </g>
        <path d="M12,6 H18 V11.5 C18,13.8 15,15 15,15 C15,15 12,13.8 12,11.5 Z" fill="#DA121A" stroke="#FFD100" stroke-width="0.6"/>
        <line x1="13.5" y1="12.5" x2="16.5" y2="8" stroke="#FFFFFF" stroke-width="1.3"/>
      </svg>`;
    }
    if (clean.includes('baden-württemberg') || clean.includes('baden-wurttemberg')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#000000"/>
        <rect y="10" width="30" height="10" fill="#FFCC00"/>
        <path d="M12,6 H18 V11.5 C18,13.8 15,15 15,15 C15,15 12,13.8 12,11.5 Z" fill="#FFCC00" stroke="#000000" stroke-width="0.5"/>
        <line x1="13.2" y1="8" x2="16.8" y2="8" stroke="#000000" stroke-width="1.1"/>
        <line x1="13.2" y1="10" x2="16.8" y2="10" stroke="#000000" stroke-width="1.1"/>
        <line x1="13.2" y1="12" x2="16.8" y2="12" stroke="#000000" stroke-width="1.1"/>
      </svg>`;
    }
    if (clean.includes('brandenburg')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#DA121A"/>
        <rect y="10" width="30" height="10" fill="#FFFFFF"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="0.5"/>
        <path d="M15,7 L12.5,9.5 L14,13 L16,13 L17.5,9.5 Z" fill="#DA121A"/>
      </svg>`;
    }
    if (clean === 'hessen') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#DA121A"/>
        <rect y="10" width="30" height="10" fill="#FFFFFF"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#0055A4" stroke="#FFD100" stroke-width="0.5"/>
        <ellipse cx="15" cy="10.2" rx="2.0" ry="3.2" fill="#DA121A" stroke="#FFFFFF" stroke-width="0.6" stroke-dasharray="1,0.8"/>
      </svg>`;
    }
    if (clean.includes('mecklenburg')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="5" fill="#0055A4"/>
        <rect y="5" width="30" height="3.5" fill="#FFFFFF"/>
        <rect y="8.5" width="30" height="3" fill="#FFD100"/>
        <rect y="11.5" width="30" height="3.5" fill="#FFFFFF"/>
        <rect y="15" width="30" height="5" fill="#DA121A"/>
        <circle cx="9.5" cy="10" r="2.2" fill="#000000"/>
        <circle cx="20.5" cy="10" r="2.2" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('niedersachsen')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#000000"/>
        <rect y="6.6" width="30" height="6.8" fill="#DA121A"/>
        <rect y="13.4" width="30" height="6.6" fill="#FFCC00"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#DA121A" stroke="#FFFFFF" stroke-width="0.5"/>
        <path d="M13,12 L15,8 L17,9.5 L16,13 Z" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('nordrhein-westfalen')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#008542"/>
        <rect y="6.6" width="30" height="6.8" fill="#FFFFFF"/>
        <rect y="13.4" width="30" height="6.6" fill="#DA121A"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#008542" stroke="#FFFFFF" stroke-width="0.5"/>
        <rect x="15" y="5.7" width="3.3" height="6.5" fill="#DA121A"/>
        <circle cx="15" cy="13.2" r="1.4" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('rheinland-pfalz')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#000000"/>
        <rect y="6.6" width="30" height="6.8" fill="#DA121A"/>
        <rect y="13.4" width="30" height="6.6" fill="#FFCC00"/>
        <path d="M3,2 H10 V7.5 C10,9.8 6.5,11 6.5,11 C6.5,11 3,9.8 3,7.5 Z" fill="#FFFFFF" stroke="#FFCC00" stroke-width="0.5"/>
        <path d="M4.8,2.2 V7.5 M3.2,4.8 H6.4" stroke="#DA121A" stroke-width="0.9"/>
        <rect x="6.5" y="2.2" width="3.3" height="5" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('saarland')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#000000"/>
        <rect y="6.6" width="30" height="6.8" fill="#DA121A"/>
        <rect y="13.4" width="30" height="6.6" fill="#FFCC00"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="0.5"/>
        <rect x="11.7" y="5.7" width="3.3" height="4.5" fill="#0055A4"/>
        <rect x="15" y="10.2" width="3.3" height="4.2" fill="#000000"/>
      </svg>`;
    }
    if (clean.includes('sachsen-anhalt')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#FFCC00"/>
        <rect y="10" width="30" height="10" fill="#000000"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFCC00" stroke="#FFFFFF" stroke-width="0.5"/>
        <line x1="12" y1="6" x2="18" y2="11" stroke="#008542" stroke-width="1.3"/>
        <rect x="12" y="11" width="6" height="3.2" fill="#DA121A"/>
      </svg>`;
    }
    if (clean === 'sachsen' || clean === 'saxony') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#FFFFFF"/>
        <rect y="10" width="30" height="10" fill="#008542"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFCC00" stroke="#000000" stroke-width="0.6"/>
        <line x1="12" y1="6.2" x2="18" y2="13.5" stroke="#008542" stroke-width="1.6"/>
      </svg>`;
    }
    if (clean.includes('schleswig-holstein')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#0055A4"/>
        <rect y="6.6" width="30" height="6.8" fill="#FFFFFF"/>
        <rect y="13.4" width="30" height="6.6" fill="#DA121A"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFD100" stroke="#1E293B" stroke-width="0.5"/>
        <rect x="15" y="5.7" width="3.3" height="8.5" fill="#DA121A"/>
        <circle cx="16.6" cy="10" r="1.1" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('thüringen') || clean.includes('thuringen')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#FFFFFF"/>
        <rect y="10" width="30" height="10" fill="#DA121A"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#0055A4" stroke="#FFD100" stroke-width="0.5"/>
        <ellipse cx="15" cy="10.2" rx="1.8" ry="3" fill="#FFFFFF" stroke="#DA121A" stroke-width="0.6"/>
      </svg>`;
    }
  }

  // =========================================================================
  // 9. AUSTRIA — ALL 9 BUNDESLÄNDER (STATE FLAGS WITH COATS OF ARMS)
  // =========================================================================
  if (
    cc === 'AT' ||
    clean.includes('niederösterreich') ||
    clean.includes('oberösterreich') ||
    clean.includes('steiermark') ||
    clean.includes('kärnten') ||
    clean.includes('vorarlberg') ||
    clean.includes('burgenland') ||
    clean.includes('salzburg') ||
    clean === 'tirol' ||
    clean === 'wien'
  ) {
    if (clean.includes('niederösterreich') || clean.includes('niederosterreich')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#0055A4"/>
        <rect y="10" width="30" height="10" fill="#FFD100"/>
        <path d="M11.5,6 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#0055A4" stroke="#FFD100" stroke-width="0.6"/>
        <rect x="12" y="4.2" width="6" height="1.8" fill="#FFD100"/>
        <circle cx="13.5" cy="8.5" r="0.8" fill="#FFD100"/><circle cx="16.5" cy="8.5" r="0.8" fill="#FFD100"/>
        <circle cx="13.5" cy="11" r="0.8" fill="#FFD100"/><circle cx="16.5" cy="11" r="0.8" fill="#FFD100"/>
        <circle cx="15" cy="13.2" r="0.8" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('steiermark')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#FFFFFF"/>
        <rect y="10" width="30" height="10" fill="#008542"/>
        <path d="M11.5,6 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#008542" stroke="#FFFFFF" stroke-width="0.6"/>
        <ellipse cx="15" cy="10.5" rx="1.8" ry="3.2" fill="#FFFFFF"/>
        <circle cx="13.8" cy="7.5" r="0.8" fill="#DA121A"/>
      </svg>`;
    }
    if (clean === 'tirol' || clean === 'tyrol') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#FFFFFF"/>
        <rect y="10" width="30" height="10" fill="#DA121A"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="0.5"/>
        <path d="M15,7 L12.2,9.5 L13.8,13.5 L16.2,13.5 L17.8,9.5 Z" fill="#DA121A"/>
        <circle cx="15" cy="6.8" r="1.2" fill="none" stroke="#008542" stroke-width="0.6"/>
      </svg>`;
    }
    if (clean.includes('oberösterreich') || clean.includes('oberosterreich')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#FFFFFF"/>
        <rect y="10" width="30" height="10" fill="#DA121A"/>
        <path d="M11.5,6 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#000000" stroke="#FFD100" stroke-width="0.5"/>
        <rect x="15" y="6.2" width="3.3" height="8" fill="#DA121A"/>
        <circle cx="13.2" cy="10" r="1.1" fill="#FFD100"/>
      </svg>`;
    }
    if (clean.includes('salzburg')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#DA121A"/>
        <rect y="10" width="30" height="10" fill="#FFFFFF"/>
        <path d="M11.5,6 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFD100" stroke="#1E293B" stroke-width="0.5"/>
        <rect x="15" y="6.2" width="3.3" height="8" fill="#DA121A"/>
        <rect x="15" y="9" width="3.3" height="2" fill="#FFFFFF"/>
        <ellipse cx="13.2" cy="10.2" rx="1.1" ry="2.2" fill="#000000"/>
      </svg>`;
    }
    if (clean.includes('kärnten') || clean.includes('karnten')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#FFFFFF"/>
        <rect y="6.6" width="30" height="6.8" fill="#DA121A"/>
        <rect y="13.4" width="30" height="6.6" fill="#FFD100"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFD100" stroke="#1E293B" stroke-width="0.5"/>
        <rect x="15" y="5.7" width="3.3" height="8.5" fill="#DA121A"/>
        <rect x="15" y="9" width="3.3" height="2" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('burgenland')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#DA121A"/>
        <rect y="10" width="30" height="10" fill="#FFD100"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFD100" stroke="#78350F" stroke-width="0.6"/>
        <path d="M15,7 L12.5,9.5 L14,13.5 L16,13.5 L17.5,9.5 Z" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('vorarlberg')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#DA121A"/>
        <rect y="10" width="30" height="10" fill="#FFFFFF"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="0.5"/>
        <path d="M13,7 H17 V12.5 L15.8,11.5 L15,12.8 L14.2,11.5 L13,12.5 Z" fill="#DA121A"/>
      </svg>`;
    }
    if (clean === 'wien' || clean === 'vienna') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#DA121A"/>
        <rect y="10" width="30" height="10" fill="#FFFFFF"/>
        <path d="M11.5,5.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#DA121A" stroke="#000000" stroke-width="0.7"/>
        <path d="M15,5.7 V15.2 M11.7,10 H18.3" stroke="#FFFFFF" stroke-width="1.6"/>
      </svg>`;
    }
  }

  // =========================================================================
  // 10. NETHERLANDS — ALL 12 PROVINCIAL FLAGS
  // =========================================================================
  if (
    cc === 'NL' ||
    clean.includes('friesland') ||
    clean.includes('noord-brabant') ||
    clean.includes('groningen') ||
    clean.includes('gelderland') ||
    clean.includes('overijssel') ||
    clean.includes('noord-holland') ||
    clean.includes('zuid-holland') ||
    clean.includes('drenthe') ||
    clean.includes('zeeland') ||
    clean.includes('flevoland') ||
    clean.includes('utrecht')
  ) {
    if (clean.includes('friesland') || clean.includes('fryslân')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#0055A4"/>
        <polygon points="0,4 6,0 30,16 30,20 24,20 0,4" fill="#FFFFFF"/>
        <polygon points="10,0 16,0 30,9.5 30,13.5" fill="#FFFFFF"/>
        <polygon points="0,10.5 14,20 8,20 0,14.5" fill="#FFFFFF"/>
        <!-- 7 Red Pompeblêden (Water-lily leaves) -->
        <g fill="#DA121A">
          <circle cx="5" cy="14" r="1.3"/><circle cx="10" cy="17.2" r="1.3"/>
          <circle cx="7.5" cy="5.2" r="1.3"/><circle cx="15" cy="10" r="1.3"/><circle cx="22.5" cy="14.8" r="1.3"/>
          <circle cx="20" cy="2.8" r="1.3"/><circle cx="25" cy="6" r="1.3"/>
        </g>
      </svg>`;
    }
    if (clean.includes('noord-brabant')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <g fill="#DA121A">
          <rect x="0" y="0" width="5" height="5"/><rect x="10" y="0" width="5" height="5"/><rect x="20" y="0" width="5" height="5"/>
          <rect x="5" y="5" width="5" height="5"/><rect x="15" y="5" width="5" height="5"/><rect x="25" y="5" width="5" height="5"/>
          <rect x="0" y="10" width="5" height="5"/><rect x="10" y="10" width="5" height="5"/><rect x="20" y="10" width="5" height="5"/>
          <rect x="5" y="15" width="5" height="5"/><rect x="15" y="15" width="5" height="5"/><rect x="25" y="15" width="5" height="5"/>
        </g>
      </svg>`;
    }
    if (clean.includes('groningen')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="15" height="10" fill="#DA121A"/>
        <rect x="15" width="15" height="10" fill="#008542"/>
        <rect y="10" width="15" height="10" fill="#008542"/>
        <rect x="15" y="10" width="15" height="10" fill="#DA121A"/>
        <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" stroke-width="5.6"/>
        <path d="M15,0 V20 M0,10 H30" stroke="#003399" stroke-width="2.6"/>
      </svg>`;
    }
    if (clean.includes('utrecht')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="10" fill="#FFFFFF"/>
        <rect y="10" width="30" height="10" fill="#DA121A"/>
        <rect width="10" height="10" fill="#DA121A"/>
        <path d="M5,0 V10 M0,5 H10" stroke="#FFFFFF" stroke-width="2.2"/>
      </svg>`;
    }
    if (clean.includes('noord-holland')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#FFD100"/>
        <rect y="6.6" width="30" height="6.8" fill="#DA121A"/>
        <rect y="13.4" width="30" height="6.6" fill="#0055A4"/>
      </svg>`;
    }
    if (clean.includes('zuid-holland')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFD100"/>
        <path d="M11,4 Q15,4 14,8 Q17,10 15,15 Q12,17 10,14 Q7,16 7,12 Q6,9 9,7 Z" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('zeeland')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#0055A4"/>
        <path d="M0,4 Q5,2.5 10,4 T20,4 T30,4 M0,10 Q5,8.5 10,10 T20,10 T30,10 M0,16 Q5,14.5 10,16 T20,16 T30,16" fill="none" stroke="#FFFFFF" stroke-width="2.2"/>
        <path d="M11.5,6.5 H18.5 V11.5 C18.5,14 15,15.5 15,15.5 C15,15.5 11.5,14 11.5,11.5 Z" fill="#FFD100" stroke="#0055A4" stroke-width="0.6"/>
        <polygon points="12,6.2 15,4.2 18,6.2" fill="#FFD100"/>
        <circle cx="15" cy="9.2" r="1.6" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('gelderland')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="6.6" fill="#0055A4"/>
        <rect y="6.6" width="30" height="6.8" fill="#FFD100"/>
        <rect y="13.4" width="30" height="6.6" fill="#000000"/>
      </svg>`;
    }
    if (clean.includes('overijssel')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="4" fill="#DA121A"/>
        <rect y="4" width="30" height="4" fill="#FFD100"/>
        <rect y="8" width="30" height="4" fill="#0055A4"/>
        <rect y="12" width="30" height="4" fill="#FFD100"/>
        <rect y="16" width="30" height="4" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('drenthe')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#FFFFFF"/>
        <rect y="3.5" width="30" height="2.2" fill="#DA121A"/>
        <rect y="14.3" width="30" height="2.2" fill="#DA121A"/>
        <rect x="13" y="7.5" width="4" height="5" fill="#000000"/>
        <circle cx="8" cy="8.5" r="0.7" fill="#DA121A"/><circle cx="8" cy="11.5" r="0.7" fill="#DA121A"/>
        <circle cx="22" cy="8.5" r="0.7" fill="#DA121A"/><circle cx="22" cy="11.5" r="0.7" fill="#DA121A"/>
      </svg>`;
    }
    if (clean.includes('flevoland')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="9" fill="#0055A4"/>
        <rect y="9" width="30" height="2" fill="#FFD100"/>
        <rect y="11" width="30" height="9" fill="#009B3A"/>
        <circle cx="5.5" cy="4.5" r="2.2" fill="#FFFFFF"/>
      </svg>`;
    }
    if (clean.includes('limburg')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
        <rect width="30" height="8" fill="#FFFFFF"/>
        <rect y="8" width="30" height="4" fill="#0055A4"/>
        <rect y="12" width="30" height="8" fill="#FFD100"/>
        <path d="M9,3.5 Q12.5,4 11.5,8 Q14,10 12.5,14.5 Q9.5,16.5 7.5,14 Q5,16 5,12.5 Z" fill="#DA121A"/>
      </svg>`;
    }
  }

  // =========================================================================
  // 11. US STATES VECTOR FALLBACKS
  // =========================================================================
  if (clean.includes('texas')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="10" height="20" fill="#002868"/>
      <rect x="10" width="20" height="10" fill="#FFFFFF"/>
      <rect x="10" y="10" width="20" height="10" fill="#BF0A30"/>
      <polygon points="${starPoints(5, 10, 5, 3.2, 1.3)}" fill="#FFFFFF"/>
    </svg>`;
  }
  if (clean.includes('california')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="17" fill="#FFFFFF"/>
      <rect y="17" width="30" height="3" fill="#BD1021"/>
      <polygon points="${starPoints(4.5, 4.5, 5, 1.8, 0.7)}" fill="#BD1021"/>
      <ellipse cx="15" cy="11" rx="5.5" ry="3.2" fill="#583B1F"/>
      <ellipse cx="15" cy="14.5" rx="7.5" ry="1" fill="#008542"/>
    </svg>`;
  }
  if (clean.includes('alaska')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#0F2042"/>
      <circle cx="6" cy="14" r="0.9" fill="#FFB81C"/>
      <circle cx="9" cy="13" r="0.9" fill="#FFB81C"/>
      <circle cx="11" cy="15" r="0.9" fill="#FFB81C"/>
      <circle cx="14" cy="14" r="0.9" fill="#FFB81C"/>
      <circle cx="15" cy="11" r="0.9" fill="#FFB81C"/>
      <circle cx="18" cy="9" r="0.9" fill="#FFB81C"/>
      <circle cx="24" cy="4" r="1.6" fill="#FFB81C"/>
    </svg>`;
  }
  if (clean.includes('new mexico') || clean.includes('nmexico')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#FFD100"/>
      <circle cx="15" cy="10" r="3.2" stroke="#BA0C2F" stroke-width="1.3" fill="none"/>
      <line x1="15" y1="3" x2="15" y2="17" stroke="#BA0C2F" stroke-width="1.3"/>
      <line x1="8" y1="10" x2="22" y2="10" stroke="#BA0C2F" stroke-width="1.3"/>
    </svg>`;
  }
  if (clean.includes('colorado')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="6.6" fill="#002868"/>
      <rect y="6.6" width="30" height="6.8" fill="#FFFFFF"/>
      <rect y="13.4" width="30" height="6.6" fill="#002868"/>
      <circle cx="11" cy="10" r="4.8" fill="#BF0A30"/>
      <circle cx="11" cy="10" r="2.8" fill="#FFD100"/>
    </svg>`;
  }
  if (clean.includes('arizona')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="10" fill="#BF0A30"/>
      <polygon points="15,10 0,0 6,0" fill="#FFD100"/>
      <polygon points="15,10 11,0 19,0" fill="#FFD100"/>
      <polygon points="15,10 24,0 30,0" fill="#FFD100"/>
      <rect y="10" width="30" height="10" fill="#002868"/>
      <polygon points="${starPoints(15, 10, 5, 3.8, 1.5)}" fill="#CE5C17"/>
    </svg>`;
  }
  if (clean.includes('florida') || clean.includes('alabama')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#FFFFFF"/>
      <line x1="0" y1="0" x2="30" y2="20" stroke="#CC0000" stroke-width="3.5"/>
      <line x1="30" y1="0" x2="0" y2="20" stroke="#CC0000" stroke-width="3.5"/>
      ${clean.includes('florida') ? '<circle cx="15" cy="10" r="4" fill="#FFD100" stroke="#CC0000" stroke-width="0.8"/>' : ''}
    </svg>`;
  }
  if (clean.includes('hawaii')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="2.5" fill="#FFFFFF"/>
      <rect y="2.5" width="30" height="2.5" fill="#CC0000"/>
      <rect y="5" width="30" height="2.5" fill="#002868"/>
      <rect y="7.5" width="30" height="2.5" fill="#FFFFFF"/>
      <rect y="10" width="30" height="2.5" fill="#CC0000"/>
      <rect y="12.5" width="30" height="2.5" fill="#002868"/>
      <rect y="15" width="30" height="2.5" fill="#FFFFFF"/>
      <rect y="17.5" width="30" height="2.5" fill="#CC0000"/>
      <rect width="14" height="10" fill="#00247D"/>
      <path d="M0,0 L14,10 M14,0 L0,10" stroke="#FFFFFF" stroke-width="1.6"/>
      <path d="M7,0 V10 M0,5 H14" stroke="#FFFFFF" stroke-width="2.4"/>
      <path d="M7,0 V10 M0,5 H14" stroke="#CF142B" stroke-width="1.4"/>
    </svg>`;
  }
  if (clean.includes('maryland')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="15" height="10" fill="#FFD100"/>
      <line x1="0" y1="0" x2="15" y2="10" stroke="#000000" stroke-width="3"/>
      <rect x="15" width="15" height="10" fill="#FFFFFF"/>
      <path d="M22.5,0 V10 M15,5 H30" stroke="#BF0A30" stroke-width="2.5"/>
      <rect y="10" width="15" height="10" fill="#FFFFFF"/>
      <path d="M7.5,10 V20 M0,15 H15" stroke="#BF0A30" stroke-width="2.5"/>
      <rect x="15" y="10" width="15" height="10" fill="#FFD100"/>
      <line x1="15" y1="10" x2="30" y2="20" stroke="#000000" stroke-width="3"/>
    </svg>`;
  }
  if (clean.includes('tennessee')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="27" height="20" fill="#CC0000"/>
      <rect x="27" width="1" height="20" fill="#FFFFFF"/>
      <rect x="28" width="2" height="20" fill="#002868"/>
      <circle cx="14" cy="10" r="5" fill="#002868" stroke="#FFFFFF" stroke-width="0.9"/>
      <circle cx="12.5" cy="8.5" r="1" fill="#FFFFFF"/>
      <circle cx="15.5" cy="9" r="1" fill="#FFFFFF"/>
      <circle cx="13.8" cy="11.8" r="1" fill="#FFFFFF"/>
    </svg>`;
  }
  if (clean.includes('south carolina') || clean.includes('scarolina')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#002868"/>
      <circle cx="6" cy="5" r="2.4" fill="#FFFFFF"/>
      <circle cx="6.8" cy="4.4" r="2" fill="#002868"/>
      <rect x="14.3" y="9" width="1.4" height="6" fill="#FFFFFF"/>
      <circle cx="15" cy="8" r="3.2" fill="#FFFFFF"/>
    </svg>`;
  }
  if (clean.includes('ohio')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#BF0A30"/>
      <rect y="4" width="30" height="3.5" fill="#FFFFFF"/>
      <rect y="12.5" width="30" height="3.5" fill="#FFFFFF"/>
      <polygon points="0,0 16,10 0,20" fill="#002868"/>
      <circle cx="6" cy="10" r="3" fill="#BF0A30" stroke="#FFFFFF" stroke-width="1.2"/>
    </svg>`;
  }
  if (clean.includes('washington')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#00843D"/>
      <circle cx="15" cy="10" r="4.8" fill="#FFD100" stroke="#000000" stroke-width="0.5"/>
      <circle cx="15" cy="10" r="3.4" fill="#38BDF8"/>
    </svg>`;
  }

  // Generic US State Navy Seal Flag
  if (US_STATE_CODES[clean] || cc === 'US') {
    const abbr = (US_STATE_CODES[clean] || name.slice(0, 2)).toUpperCase();
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
      <rect width="30" height="20" fill="#002868"/>
      <circle cx="15" cy="10" r="5.5" fill="#FFD100" stroke="#FFFFFF" stroke-width="0.8"/>
      <circle cx="15" cy="10" r="4.2" fill="#0F172A"/>
      <text x="15" y="12" text-anchor="middle" font-size="5.2" fill="#F8FAFC" font-family="sans-serif" font-weight="bold">${abbr}</text>
    </svg>`;
  }

  // Generic heraldic fallback
  const code2 = name.slice(0, 2).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
    <rect width="30" height="20" fill="#1e293b"/>
    <rect width="10" height="20" fill="#38bdf8" opacity="0.85"/>
    <circle cx="20" cy="10" r="4.5" fill="#f59e0b"/>
    <text x="20" y="12.2" text-anchor="middle" font-size="5.5" fill="#0f172a" font-family="sans-serif" font-weight="bold">${code2}</text>
  </svg>`;
}

export function resolveLocalSubdivisionFlagUrl(name: string, countryCode?: string): string | null {
  const rawLower = normalizeStateKey(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss');
  const compact = rawLower.replace(/[^a-z0-9]/g, '');
  const has = (sub: string) => compact.includes(sub.replace(/[^a-z0-9]/g, ''));
  const eq = (sub: string) => compact === sub.replace(/[^a-z0-9]/g, '');
  const cc = (countryCode || '').toUpperCase();

  // 1. UNITED STATES (50 States + DC)
  if ((US_STATE_CODES[rawLower] || US_STATE_CODES[compact]) && (!cc || cc === 'US')) {
    return `/flags/subdivisions/us-${US_STATE_CODES[rawLower] || US_STATE_CODES[compact]}.svg`;
  }

  // 2. BELGIUM (10 Provinces + Brussels + Flanders + Wallonia)
  if (
    cc === 'BE' ||
    has('vlaanderen') ||
    has('flanders') ||
    has('wallon') ||
    has('vlaamsbrabant') ||
    has('brabantwallon') ||
    has('waalsbrabant') ||
    has('hainaut') ||
    has('henegouwen') ||
    has('namur') ||
    has('namen') ||
    has('liege') ||
    has('luik') ||
    has('antwerp')
  ) {
    if (has('antwerp')) return '/flags/subdivisions/be-van.svg';
    if (has('oostvlaanderen') || has('eastflanders') || has('flandreorientale'))
      return '/flags/subdivisions/be-vov.svg';
    if (has('westvlaanderen') || has('westflanders') || has('flandreoccidentale'))
      return '/flags/subdivisions/be-vwv.svg';
    if (has('vlaamsbrabant') || has('flemishbrabant') || has('brabantflamand'))
      return '/flags/subdivisions/be-vbr.svg';
    if (has('brabantwallon') || has('walloonbrabant') || has('waalsbrabant'))
      return '/flags/subdivisions/be-wbr.svg';
    if (has('hainaut') || has('henegouwen')) return '/flags/subdivisions/be-wht.svg';
    if (has('liege') || has('luik') || has('luttich'))
      return '/flags/subdivisions/be-wlg.svg';
    if (has('luxembourg') || has('luxemburg'))
      return '/flags/subdivisions/be-wlx.svg';
    if (has('namur') || has('namen')) return '/flags/subdivisions/be-wna.svg';
    if (has('brussel') || has('bruxelles')) return '/flags/subdivisions/be-bru.svg';
    if (has('limburg') && cc !== 'NL') return '/flags/subdivisions/be-vli.svg';
    if (eq('vlaanderen') || eq('flanders') || has('vlaamsgewest'))
      return '/flags/subdivisions/be-vlg.svg';
    if (eq('wallonie') || eq('wallonia') || has('waalsgewest'))
      return '/flags/subdivisions/be-wal.svg';
  }

  // 3. NETHERLANDS (12 Provinces)
  if (
    cc === 'NL' ||
    has('drenthe') ||
    has('flevoland') ||
    has('friesland') ||
    has('fryslan') ||
    has('gelderland') ||
    has('groningen') ||
    has('noordbrabant') ||
    has('noordholland') ||
    has('overijssel') ||
    has('utrecht') ||
    has('zeeland') ||
    has('zuidholland')
  ) {
    if (has('drenthe')) return '/flags/subdivisions/nl-dr.svg';
    if (has('flevoland')) return '/flags/subdivisions/nl-fl.svg';
    if (has('friesland') || has('fryslan')) return '/flags/subdivisions/nl-fr.svg';
    if (has('gelderland')) return '/flags/subdivisions/nl-ge.svg';
    if (has('groningen')) return '/flags/subdivisions/nl-gr.svg';
    if (has('limburg')) return '/flags/subdivisions/nl-li.svg';
    if (has('noordbrabant') || has('northbrabant'))
      return '/flags/subdivisions/nl-nb.svg';
    if (has('noordholland') || has('northholland'))
      return '/flags/subdivisions/nl-nh.svg';
    if (has('overijssel')) return '/flags/subdivisions/nl-ov.svg';
    if (has('utrecht')) return '/flags/subdivisions/nl-ut.svg';
    if (has('zeeland')) return '/flags/subdivisions/nl-ze.svg';
    if (has('zuidholland') || has('southholland'))
      return '/flags/subdivisions/nl-zh.svg';
  }

  // 4. AUSTRIA (9 Bundesländer with Official Coat of Arms)
  if (
    cc === 'AT' ||
    has('burgenland') ||
    has('karnten') ||
    has('carinthia') ||
    has('niederosterreich') ||
    has('oberosterreich') ||
    has('salzburg') ||
    has('steiermark') ||
    has('styria') ||
    has('tirol') ||
    has('vorarlberg') ||
    eq('wien') ||
    eq('vienna')
  ) {
    if (has('burgenland')) return '/flags/subdivisions/at-1.svg';
    if (has('karnten') || has('carinthia')) return '/flags/subdivisions/at-2.svg';
    if (has('niederosterreich') || has('loweraustria'))
      return '/flags/subdivisions/at-3.svg';
    if (has('oberosterreich') || has('upperaustria'))
      return '/flags/subdivisions/at-4.svg';
    if (has('salzburg')) return '/flags/subdivisions/at-5.svg';
    if (has('steiermark') || has('styria')) return '/flags/subdivisions/at-6.svg';
    if (has('tirol') || has('tyrol')) return '/flags/subdivisions/at-7.svg';
    if (has('vorarlberg')) return '/flags/subdivisions/at-8.svg';
    if (has('wien') || has('vienna')) return '/flags/subdivisions/at-9.svg';
  }

  // 5. GERMANY (16 Bundesländer with Official Coat of Arms)
  if (
    cc === 'DE' ||
    has('badenwurttemberg') ||
    has('bayern') ||
    has('bavaria') ||
    has('brandenburg') ||
    has('bremen') ||
    has('hamburg') ||
    has('hessen') ||
    has('mecklenburg') ||
    has('niedersachsen') ||
    has('nordrhein') ||
    has('rheinlandpfalz') ||
    has('saarland') ||
    has('sachsen') ||
    has('schleswigholstein') ||
    has('thuringen') ||
    eq('berlin')
  ) {
    if (has('baden')) return '/flags/subdivisions/de-bw.svg';
    if (has('bayern') || has('bavaria')) return '/flags/subdivisions/de-by.svg';
    if (has('berlin')) return '/flags/subdivisions/de-be.svg';
    if (has('brandenburg')) return '/flags/subdivisions/de-bb.svg';
    if (has('bremen')) return '/flags/subdivisions/de-hb.svg';
    if (has('hamburg')) return '/flags/subdivisions/de-hh.svg';
    if (has('hessen') || has('hesse')) return '/flags/subdivisions/de-he.svg';
    if (has('mecklenburg')) return '/flags/subdivisions/de-mv.svg';
    if (has('niedersachsen') || has('lowersaxony'))
      return '/flags/subdivisions/de-ni.svg';
    if (has('nordrhein') || has('northrhine'))
      return '/flags/subdivisions/de-nw.svg';
    if (has('rheinland') || has('rhineland'))
      return '/flags/subdivisions/de-rp.svg';
    if (has('saarland')) return '/flags/subdivisions/de-sl.svg';
    if (has('sachsenanhalt') || has('saxonyanhalt'))
      return '/flags/subdivisions/de-st.svg';
    if (has('sachsen') || has('saxony')) return '/flags/subdivisions/de-sn.svg';
    if (has('schleswig')) return '/flags/subdivisions/de-sh.svg';
    if (has('thuringen') || has('thuringia'))
      return '/flags/subdivisions/de-th.svg';
  }

  // 6. SWITZERLAND (26 Cantons)
  if (
    cc === 'CH' ||
    has('aargau') ||
    has('argovie') ||
    has('innerrhoden') ||
    has('ausserrhoden') ||
    has('basellandschaft') ||
    has('balecampagne') ||
    has('baselstadt') ||
    has('baleville') ||
    eq('basel') ||
    has('bern') ||
    has('fribourg') ||
    has('freiburg') ||
    has('geneve') ||
    has('geneva') ||
    has('genf') ||
    has('glarus') ||
    has('glaris') ||
    has('graubunden') ||
    has('grisons') ||
    has('grigioni') ||
    has('jura') ||
    has('luzern') ||
    has('lucerne') ||
    has('neuchatel') ||
    has('neuenburg') ||
    has('nidwalden') ||
    has('obwalden') ||
    has('schaffhausen') ||
    has('schaffhouse') ||
    has('schwyz') ||
    has('solothurn') ||
    has('soleure') ||
    has('gallen') ||
    has('thurgau') ||
    has('thurgovie') ||
    has('ticino') ||
    has('tessin') ||
    has('uri') ||
    has('valais') ||
    has('wallis') ||
    has('vaud') ||
    has('waadt') ||
    has('zug') ||
    has('zoug') ||
    has('zurich')
  ) {
    if (has('aargau') || has('argovie')) return '/flags/subdivisions/ch-ag.svg';
    if (has('innerrhoden')) return '/flags/subdivisions/ch-ai.svg';
    if (has('ausserrhoden')) return '/flags/subdivisions/ch-ar.svg';
    if (has('basellandschaft') || has('balecampagne'))
      return '/flags/subdivisions/ch-bl.svg';
    if (has('baselstadt') || has('baleville') || eq('basel'))
      return '/flags/subdivisions/ch-bs.svg';
    if (has('bern')) return '/flags/subdivisions/ch-be.svg';
    if (has('fribourg') || has('freiburg')) return '/flags/subdivisions/ch-fr.svg';
    if (has('geneve') || has('geneva') || has('genf'))
      return '/flags/subdivisions/ch-ge.svg';
    if (has('glarus') || has('glaris')) return '/flags/subdivisions/ch-gl.svg';
    if (has('graubunden') || has('grisons') || has('grigioni')) return '/flags/subdivisions/ch-gr.svg';
    if (has('jura')) return '/flags/subdivisions/ch-ju.svg';
    if (has('luzern') || has('lucerne')) return '/flags/subdivisions/ch-lu.svg';
    if (has('neuchatel') || has('neuenburg')) return '/flags/subdivisions/ch-ne.svg';
    if (has('nidwalden')) return '/flags/subdivisions/ch-nw.svg';
    if (has('obwalden')) return '/flags/subdivisions/ch-ow.svg';
    if (has('schaffhausen') || has('schaffhouse')) return '/flags/subdivisions/ch-sh.svg';
    if (has('schwyz')) return '/flags/subdivisions/ch-sz.svg';
    if (has('solothurn') || has('soleure')) return '/flags/subdivisions/ch-so.svg';
    if (has('gallen')) return '/flags/subdivisions/ch-sg.svg';
    if (has('thurgau') || has('thurgovie')) return '/flags/subdivisions/ch-tg.svg';
    if (has('ticino') || has('tessin')) return '/flags/subdivisions/ch-ti.svg';
    if (has('uri')) return '/flags/subdivisions/ch-ur.svg';
    if (has('valais') || has('wallis')) return '/flags/subdivisions/ch-vs.svg';
    if (has('vaud') || has('waadt')) return '/flags/subdivisions/ch-vd.svg';
    if (has('zug') || has('zoug')) return '/flags/subdivisions/ch-zg.svg';
    if (has('zurich')) return '/flags/subdivisions/ch-zh.svg';
  }

  // 7. SPAIN (17 Autonomous Communities + Ceuta & Melilla)
  if (
    cc === 'ES' ||
    has('andalucia') ||
    has('andalusia') ||
    has('aragon') ||
    has('asturias') ||
    has('baleares') ||
    has('balearic') ||
    has('balears') ||
    has('canarias') ||
    has('canary') ||
    has('cantabria') ||
    has('mancha') ||
    has('castilla') ||
    has('leon') ||
    has('cataluna') ||
    has('catalonia') ||
    has('catalunya') ||
    has('ceuta') ||
    has('extremadura') ||
    has('galicia') ||
    has('rioja') ||
    has('madrid') ||
    has('melilla') ||
    has('murcia') ||
    has('navarra') ||
    has('navarre') ||
    has('vasco') ||
    has('basque') ||
    has('euskadi') ||
    has('valencia')
  ) {
    if (has('andalucia') || has('andalusia')) return '/flags/subdivisions/es-an.svg';
    if (has('aragon')) return '/flags/subdivisions/es-ar.svg';
    if (has('asturias')) return '/flags/subdivisions/es-as.svg';
    if (has('baleares') || has('balearic') || has('balears'))
      return '/flags/subdivisions/es-ib.svg';
    if (has('canarias') || has('canary')) return '/flags/subdivisions/es-cn.svg';
    if (has('cantabria')) return '/flags/subdivisions/es-cb.svg';
    if (has('mancha')) return '/flags/subdivisions/es-cm.svg';
    if (has('leon')) return '/flags/subdivisions/es-cl.svg';
    if (has('cataluna') || has('catalonia') || has('catalunya'))
      return '/flags/subdivisions/es-ct.svg';
    if (has('ceuta')) return '/flags/subdivisions/es-ce.svg';
    if (has('extremadura')) return '/flags/subdivisions/es-ex.svg';
    if (has('galicia')) return '/flags/subdivisions/es-ga.svg';
    if (has('rioja')) return '/flags/subdivisions/es-ri.svg';
    if (has('madrid')) return '/flags/subdivisions/es-md.svg';
    if (has('melilla')) return '/flags/subdivisions/es-ml.svg';
    if (has('murcia')) return '/flags/subdivisions/es-mc.svg';
    if (has('navarra') || has('navarre')) return '/flags/subdivisions/es-nc.svg';
    if (has('vasco') || has('basque') || has('euskadi'))
      return '/flags/subdivisions/es-pv.svg';
    if (has('valencia')) return '/flags/subdivisions/es-vc.svg';
  }

  // 8. CANADA (10 Provinces + 3 Territories)
  if (
    cc === 'CA' ||
    has('quebec') ||
    has('ontario') ||
    has('britishcolumbia') ||
    has('colombie') ||
    has('alberta') ||
    has('manitoba') ||
    has('saskatchewan') ||
    has('novascotia') ||
    has('nouvelleecosse') ||
    has('newbrunswick') ||
    has('nouveaubrunswick') ||
    has('newfoundland') ||
    has('labrador') ||
    has('terreneuve') ||
    has('princeedward') ||
    has('princeedouard') ||
    has('yukon') ||
    has('northwestterritories') ||
    has('territoiresdunordouest') ||
    has('nunavut')
  ) {
    if (has('alberta')) return '/flags/subdivisions/ca-ab.svg';
    if (has('britishcolumbia') || has('colombie'))
      return '/flags/subdivisions/ca-bc.svg';
    if (has('manitoba')) return '/flags/subdivisions/ca-mb.svg';
    if (has('newbrunswick') || has('nouveaubrunswick'))
      return '/flags/subdivisions/ca-nb.svg';
    if (has('newfoundland') || has('labrador') || has('terreneuve'))
      return '/flags/subdivisions/ca-nl.svg';
    if (has('northwestterritories') || has('territoiresdunordouest'))
      return '/flags/subdivisions/ca-nt.svg';
    if (has('novascotia') || has('nouvelleecosse'))
      return '/flags/subdivisions/ca-ns.svg';
    if (has('nunavut')) return '/flags/subdivisions/ca-nu.svg';
    if (has('ontario')) return '/flags/subdivisions/ca-on.svg';
    if (has('princeedward') || has('princeedouard')) return '/flags/subdivisions/ca-pe.svg';
    if (has('quebec')) return '/flags/subdivisions/ca-qc.svg';
    if (has('saskatchewan')) return '/flags/subdivisions/ca-sk.svg';
    if (has('yukon')) return '/flags/subdivisions/ca-yt.svg';
  }

  // 9. AUSTRALIA (6 States + 2 Territories)
  if (
    cc === 'AU' ||
    has('newsouthwales') ||
    has('queensland') ||
    has('southaustralia') ||
    has('tasmania') ||
    has('victoria') ||
    has('westernaustralia') ||
    has('northernterritory') ||
    has('australiancapital')
  ) {
    if (has('australiancapital')) return '/flags/subdivisions/au-act.svg';
    if (has('newsouthwales')) return '/flags/subdivisions/au-nsw.svg';
    if (has('northernterritory')) return '/flags/subdivisions/au-nt.svg';
    if (has('queensland')) return '/flags/subdivisions/au-qld.svg';
    if (has('southaustralia')) return '/flags/subdivisions/au-sa.svg';
    if (has('tasmania')) return '/flags/subdivisions/au-tas.svg';
    if (has('victoria')) return '/flags/subdivisions/au-vic.svg';
    if (has('westernaustralia')) return '/flags/subdivisions/au-wa.svg';
  }

  // 10. MALAYSIA (13 States + 3 Federal Territories)
  if (
    cc === 'MY' ||
    has('johor') ||
    has('kedah') ||
    has('kelantan') ||
    has('melaka') ||
    has('malacca') ||
    has('negerisembilan') ||
    has('pahang') ||
    has('penang') ||
    has('pulaupinang') ||
    has('perak') ||
    has('perlis') ||
    has('sabah') ||
    has('sarawak') ||
    has('selangor') ||
    has('terengganu') ||
    has('trengganu') ||
    has('kualalumpur') ||
    has('labuan') ||
    has('putrajaya')
  ) {
    if (has('johor')) return '/flags/subdivisions/my-01.svg';
    if (has('kedah')) return '/flags/subdivisions/my-02.svg';
    if (has('kelantan')) return '/flags/subdivisions/my-03.svg';
    if (has('melaka') || has('malacca')) return '/flags/subdivisions/my-04.svg';
    if (has('negerisembilan')) return '/flags/subdivisions/my-05.svg';
    if (has('pahang')) return '/flags/subdivisions/my-06.svg';
    if (has('penang') || has('pulaupinang'))
      return '/flags/subdivisions/my-07.svg';
    if (has('perak')) return '/flags/subdivisions/my-08.svg';
    if (has('perlis')) return '/flags/subdivisions/my-09.svg';
    if (has('selangor')) return '/flags/subdivisions/my-10.svg';
    if (has('terengganu') || has('trengganu'))
      return '/flags/subdivisions/my-11.svg';
    if (has('sabah')) return '/flags/subdivisions/my-12.svg';
    if (has('sarawak')) return '/flags/subdivisions/my-13.svg';
    if (has('kualalumpur')) return '/flags/subdivisions/my-14.svg';
    if (has('labuan')) return '/flags/subdivisions/my-15.svg';
    if (has('putrajaya')) return '/flags/subdivisions/my-16.svg';
  }

  // 11. BRAZIL (26 States + Distrito Federal)
  if (
    cc === 'BR' ||
    eq('acre') ||
    eq('para') ||
    has('alagoas') ||
    has('amapa') ||
    has('amazonas') ||
    has('bahia') ||
    has('ceara') ||
    has('distritofederal') ||
    has('espiritosanto') ||
    has('goias') ||
    has('maranhao') ||
    has('matogrosso') ||
    has('minasgerais') ||
    has('parana') ||
    has('paraiba') ||
    has('pernambuco') ||
    has('piaui') ||
    has('riodejaneiro') ||
    has('riograndedonorte') ||
    has('riograndedosul') ||
    has('rondonia') ||
    has('roraima') ||
    has('santacatarina') ||
    has('saopaulo') ||
    has('sergipe') ||
    has('tocantins')
  ) {
    if (eq('acre')) return '/flags/subdivisions/br-ac.svg';
    if (has('alagoas')) return '/flags/subdivisions/br-al.svg';
    if (has('amapa')) return '/flags/subdivisions/br-ap.svg';
    if (has('amazonas')) return '/flags/subdivisions/br-am.svg';
    if (has('bahia')) return '/flags/subdivisions/br-ba.svg';
    if (has('ceara')) return '/flags/subdivisions/br-ce.svg';
    if (has('distritofederal')) return '/flags/subdivisions/br-df.svg';
    if (has('espiritosanto')) return '/flags/subdivisions/br-es.svg';
    if (has('goias')) return '/flags/subdivisions/br-go.svg';
    if (has('maranhao')) return '/flags/subdivisions/br-ma.svg';
    if (has('matogrossodosul')) return '/flags/subdivisions/br-ms.svg';
    if (has('matogrosso')) return '/flags/subdivisions/br-mt.svg';
    if (has('minasgerais')) return '/flags/subdivisions/br-mg.svg';
    if (has('parana')) return '/flags/subdivisions/br-pr.svg';
    if (has('paraiba')) return '/flags/subdivisions/br-pb.svg';
    if (eq('para')) return '/flags/subdivisions/br-pa.svg';
    if (has('pernambuco')) return '/flags/subdivisions/br-pe.svg';
    if (has('piaui')) return '/flags/subdivisions/br-pi.svg';
    if (has('riodejaneiro')) return '/flags/subdivisions/br-rj.svg';
    if (has('riograndedonorte')) return '/flags/subdivisions/br-rn.svg';
    if (has('riograndedosul')) return '/flags/subdivisions/br-rs.svg';
    if (has('rondonia')) return '/flags/subdivisions/br-ro.svg';
    if (has('roraima')) return '/flags/subdivisions/br-rr.svg';
    if (has('santacatarina')) return '/flags/subdivisions/br-sc.svg';
    if (has('saopaulo')) return '/flags/subdivisions/br-sp.svg';
    if (has('sergipe')) return '/flags/subdivisions/br-se.svg';
    if (has('tocantins')) return '/flags/subdivisions/br-to.svg';
  }

  return null;
}

export function getSubdivisionFlagImageUrl(name: string, countryCode?: string): string {
  const localUrl = resolveLocalSubdivisionFlagUrl(name, countryCode);
  if (localUrl) {
    return localUrl;
  }
  const svg = getSubdivisionFlagSvgMarkup(name, countryCode);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SubdivisionFlag: React.FC<SubdivisionFlagProps> = ({
  name,
  countryCode,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-5 text-[9px]',
    md: 'w-14 h-9 text-xs',
    lg: 'w-24 h-16 text-sm',
    xl: 'w-36 h-24 text-base'
  };

  const [imgError, setImgError] = React.useState(false);
  const localFlagUrl = resolveLocalSubdivisionFlagUrl(name, countryCode);

  React.useEffect(() => {
    setImgError(false);
  }, [name, countryCode]);

  const svgMarkup = getSubdivisionFlagSvgMarkup(name, countryCode);

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 border border-slate-700/60 rounded overflow-hidden shadow bg-slate-900/40 ${sizeClasses[size]} ${className}`}
    >
      {!imgError && localFlagUrl ? (
        <img
          src={localFlagUrl}
          alt={`${name} flag`}
          className="w-full h-full object-contain rounded shadow-sm"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      )}
    </div>
  );
};

