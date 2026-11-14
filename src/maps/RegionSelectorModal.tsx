import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  CheckSquare,
  Square,
  ArrowRight,
  Languages,
  Hash,
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Shield,
  Zap,
  Target,
  Layers,
  ListFilter,
  AlertTriangle,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { CountryInfo } from '../data/countriesData';
import {
  SubdivisionQuizOption,
  getCountrySubdivisions
} from '../data/countrySubdivisionCatalog';
import { CountryFlag } from '../components/CountryFlag';
import { getCitiesByScopeAndTier, CityPoint } from '../data/citiesDatabase';
import { sounds } from '../utils/soundEngine';
import { geojsonCache } from '../utils/geojsonCache';

interface RegionPolygonShape {
  name: string;
  code?: string;
  parentName?: string;
  count: number;
  rings: number[][][]; // Array of [lng, lat][] rings (outer + holes)
  centroid: [number, number]; // [lng, lat]
  bboxArea?: number;
  isOutlying: boolean;
}

export type QuizDifficultyMode = 'easy' | 'normal' | 'hard';
export type AreaCodeDepthLevel = 'all' | '1' | '2' | '3';

// 1-Level Area Code Countries (all codes share the same prefix or only have 1 flat digit level)
export const SINGLE_LEVEL_AREACODE_COUNTRIES = new Set([
  'CA', 'US', 'GT', 'PA', 'CO', 'EC', 'BO',
  'AL', 'CY', 'EE', 'FI', 'HU', 'SI', 'CH', 'LV',
  'SZ', 'GH', 'MG', 'NA', 'SN', 'TN', 'UG',
  'BT', 'IL', 'JO', 'KG', 'LB', 'AE',
  'NZ'
]);

// 3-Level Area Code Countries (Macro-Zone -> Intermediate 3-Digit Prefix -> Full Area Code)
export const THREE_LEVEL_AREACODE_COUNTRIES = new Set([
  'AR', 'AU', 'IT', 'GB', 'IN', 'RU'
]);

export function computeAreaCodeAtDepth(
  rawCode: string,
  depth: AreaCodeDepthLevel,
  countryCode?: string
): string {
  if (!rawCode || depth === 'all') return rawCode;
  const cc = (countryCode || '').toUpperCase();
  if (cc && SINGLE_LEVEL_AREACODE_COUNTRIES.has(cc)) {
    return rawCode;
  }

  // Extract primary code before any range separator ('/', '-', '–', '‑')
  const primary = rawCode.split(/[-/–‑]/)[0].trim();
  const rawDigits = primary.replace(/\D/g, '');
  if (!rawDigits) return rawCode;

  let trunk = '';
  let sig = rawDigits;
  if (cc === 'LT' && rawDigits.startsWith('8') && rawDigits.length > 1) {
    trunk = '8';
    sig = rawDigits.slice(1);
  } else if (cc === 'HU' && rawDigits.startsWith('06') && rawDigits.length > 2) {
    trunk = '06';
    sig = rawDigits.slice(2);
  } else if (rawDigits.startsWith('0') && rawDigits.length > 1) {
    trunk = '0';
    sig = rawDigits.replace(/^0+/, '');
  }
  if (!sig) return rawCode;

  // For 2-level countries, depth '2' is full code (only 3-level countries use intermediate depth '2')
  if (cc && !THREE_LEVEL_AREACODE_COUNTRIES.has(cc) && depth === '2') {
    return rawCode;
  }

  // Countries where the 1st significant digit is constant across the country (or UY where 42..47 group the 3-digit codes):
  // - 2-level countries: ES (9x), PT (2x), VN (2xx), MN (1x/2xx), GR (21..28), KZ (71/72), UY (2, 42..47)
  if (
    (cc === 'ES' ||
      cc === 'PT' ||
      cc === 'VN' ||
      cc === 'MN' ||
      cc === 'GR' ||
      cc === 'KZ' ||
      cc === 'UY') &&
    depth === '1'
  ) {
    if (sig.length <= 2) return trunk + sig;
    return trunk + sig.slice(0, 2);
  }

  // - Argentina (AR, 3-level): Level 1 = 2-digit prefix (11, 22..38 -> 13 Q), Level 2 = 3-digit prefix (11, 220..389 -> 82 Q), Level 3 = Full 4-digit (300 Q)
  if (cc === 'AR') {
    if (sig === '11') return trunk + '11';
    const len = depth === '1' ? 2 : 3;
    if (sig.length <= len) return trunk + sig;
    return trunk + sig.slice(0, len);
  }

  // - UK (GB, 3-level): Level 1 = 011..019 / 02x (2 sig digits), Level 2 = 3 sig digits, Level 3 = Full
  if (cc === 'GB') {
    const len = depth === '1' ? 2 : 3;
    if (sig.length <= len) return trunk + sig;
    return trunk + sig.slice(0, len);
  }

  const maxSig = depth === '1' ? 1 : depth === '2' ? 2 : 3;
  if (sig.length <= maxSig) {
    return trunk + sig;
  }
  const truncated = sig.slice(0, maxSig);
  return trunk + truncated;
}

interface RegionSelectorModalProps {
  country: CountryInfo;
  quizOption: SubdivisionQuizOption;
  onClose: () => void;
  onStart: (
    selectedGroups: string[],
    initialMode: 'quiz' | 'study',
    quizLangMode?: 'english' | 'native',
    quizDifficulty?: QuizDifficultyMode,
    endlessRetry?: boolean,
    selectedQuizOption?: SubdivisionQuizOption,
    isPartialRun?: boolean
  ) => void;
}

const US_STATE_ABBR_TO_NAME: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia', PR: 'Puerto Rico', VI: 'Virgin Islands', GU: 'Guam',
  AS: 'American Samoa', MP: 'Northern Mariana Islands'
};

const US_NAME_TO_ABBR: Record<string, string> = Object.fromEntries(
  Object.entries(US_STATE_ABBR_TO_NAME).map(([k, v]) => [v.toLowerCase(), k])
);

function normalizeRegionName(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/^DistrictofColumbia$/i, 'District of Columbia')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
}

function computeFeatureCentroidAndRings(geometry: any): {
  rings: number[][][];
  centroid: [number, number];
  bboxArea: number;
} {
  const rings: number[][][] = [];
  let bestRingArea = -1;
  let totalOuterArea = 0;
  let bestCentroid: [number, number] = [0, 0];

  if (!geometry) return { rings: [], centroid: [0, 0], bboxArea: 0 };

  const processRing = (ring: number[][], isOuterRing: boolean) => {
    if (!ring || ring.length < 3) return;
    const simplified: number[][] = [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < ring.length; i++) {
      const pt = ring[i];
      if (!Array.isArray(pt) || pt.length < 2) continue;
      const lng = Number(pt[0]);
      const lat = Number(pt[1]);
      if (lng < minX) minX = lng;
      if (lng > maxX) maxX = lng;
      if (lat < minY) minY = lat;
      if (lat > maxY) maxY = lat;

      if (simplified.length === 0 || i === ring.length - 1) {
        simplified.push([lng, lat]);
      } else {
        const prev = simplified[simplified.length - 1];
        const dx = lng - prev[0];
        const dy = lat - prev[1];
        if (dx * dx + dy * dy >= 0.000025) {
          simplified.push([lng, lat]);
        }
      }
    }
    if (simplified.length >= 3) {
      rings.push(simplified);
      if (isOuterRing) {
        const area = Math.max(1e-6, (maxX - minX) * (maxY - minY));
        totalOuterArea += area;
        if (area > bestRingArea) {
          bestRingArea = area;
          bestCentroid = [(minX + maxX) / 2, (minY + maxY) / 2];
        }
      }
    }
  };

  if (geometry.type === 'Polygon') {
    (geometry.coordinates || []).forEach((r: number[][], idx: number) =>
      processRing(r, idx === 0)
    );
  } else if (geometry.type === 'MultiPolygon') {
    (geometry.coordinates || []).forEach((poly: number[][][]) => {
      (poly || []).forEach((r: number[][], idx: number) => processRing(r, idx === 0));
    });
  }

  return {
    rings,
    centroid: bestCentroid,
    bboxArea: totalOuterArea > 0 ? totalOuterArea : Math.max(0, bestRingArea)
  };
}

function pointInRing2D(lng: number, lat: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

const US_OUTLYING_NAMES = new Set([
  'Alaska', 'AK',
  'Hawaii', 'HI',
  'Puerto Rico', 'PR',
  'Virgin Islands', 'U.S. Virgin Islands', 'VI',
  'Guam', 'GU',
  'Northern Mariana Islands', 'MP',
  'American Samoa', 'AS'
]);

export const RegionSelectorModal: React.FC<RegionSelectorModalProps> = ({
  country,
  quizOption,
  onClose,
  onStart
}) => {
  // Support switching Official Subdivision Level right inside the modal
  const subdivisionLevels = useMemo(() => {
    if (quizOption.availableLevels && quizOption.availableLevels.length > 0) {
      return quizOption.availableLevels;
    }
    if (
      quizOption.category === 'adm1' ||
      quizOption.category === 'adm2' ||
      quizOption.category === 'adm3'
    ) {
      const countryQuizzes = getCountrySubdivisions(country);
      const unified = countryQuizzes.find((q) => q.availableLevels && q.availableLevels.length > 1);
      if (unified?.availableLevels) return unified.availableLevels;
    }
    return [];
  }, [country, quizOption]);

  const [activeQuizOption, setActiveQuizOption] = useState<SubdivisionQuizOption>(() => {
    if (subdivisionLevels.length > 0) {
      const exact = subdivisionLevels.find((l) => l.id === quizOption.id);
      return exact || subdivisionLevels[0];
    }
    return quizOption;
  });

  useEffect(() => {
    if (subdivisionLevels.length > 0) {
      const exactMatch = subdivisionLevels.find((l) => l.id === quizOption.id);
      setActiveQuizOption(exactMatch || subdivisionLevels[0]);
    } else {
      setActiveQuizOption(quizOption);
    }
  }, [quizOption, subdivisionLevels]);

  // Parent Filter Level inside the Map Selector Popup!
  // E.g. When playing Belgium Level 4 (581 Gemeenten), the user can filter the map by Level 1 (3 Regions), Level 2 (10 Provinces), Level 3 (43 Arrondissements), or Level 4 (581 Gemeenten)!
  const activeLevelIdx = useMemo(() => {
    if (subdivisionLevels.length === 0) return 0;
    const idx = subdivisionLevels.findIndex((l) => l.id === activeQuizOption.id);
    return idx >= 0 ? idx : 0;
  }, [subdivisionLevels, activeQuizOption]);

  const [filterMapLevelIdx, setFilterMapLevelIdx] = useState<number>(0);
  const [totalUnfilteredCount, setTotalUnfilteredCount] = useState<number>(0);

  // Sync filterMapLevelIdx with activeLevelIdx whenever the active Subdivision Level changes
  useEffect(() => {
    if (subdivisionLevels.length > 1) {
      setFilterMapLevelIdx(activeLevelIdx);
    } else {
      setFilterMapLevelIdx(0);
    }
  }, [activeQuizOption, activeLevelIdx, subdivisionLevels.length]);

  const [loading, setLoading] = useState(true);
  const [regionShapes, setRegionShapes] = useState<RegionPolygonShape[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [typedPrefix, setTypedPrefix] = useState<string>('');
  const [digitLengthFilter, setDigitLengthFilter] = useState<string>('all');
  const [areaCodeDepth, setAreaCodeDepth] = useState<AreaCodeDepthLevel>('all');
  const [questionLimit, setQuestionLimit] = useState<number | 'all'>('all');
  const [customLimitInput, setCustomLimitInput] = useState<string>('');
  const [availableDigitLengths, setAvailableDigitLengths] = useState<number[]>([]);
  const [availableStartingDigits, setAvailableStartingDigits] = useState<string[]>([]);
  const [maxSigDigits, setMaxSigDigits] = useState<number>(1);
  const [hasNativeScript, setHasNativeScript] = useState<boolean>(false);
  const [quizLangMode, setQuizLangMode] = useState<'english' | 'native'>('english');
  const [mode, setMode] = useState<'quiz' | 'study'>('quiz');
  const [difficulty, setDifficulty] = useState<QuizDifficultyMode>('easy');
  const [selectedCityTiers, setSelectedCityTiers] = useState<Set<number>>(() => new Set([1]));
  const [endlessRetry, setEndlessRetry] = useState<boolean>(false);
  const [rawFeatures, setRawFeatures] = useState<any[]>([]);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Popup state for "Select Specific Areas on Map" & "Large GeoJSON Confirmation"
  const [showMapSelectorPopup, setShowMapSelectorPopup] = useState<boolean>(false);
  const [showAdvancedDigits, setShowAdvancedDigits] = useState<boolean>(false);
  const [showLargeWarningConfirm, setShowLargeWarningConfirm] = useState<boolean>(false);

  // Interactive SVG Map Zoom & Pan State (with direct 60fps DOM transform ref during drag)
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mapPan, setMapPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapSvgGroupRef = useRef<SVGGElement | null>(null);
  const livePanRef = useRef<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 1 });
  const isDraggingRef = useRef<boolean>(false);
  const didDragMoveRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0
  });

  // Track selection across levels bidirectionally (Level 1 <-> Level 2+):
  // - Selecting a subset in Level 1 and switching to Level 2 filters & shows only those Level 1 regions' smaller subdivisions.
  // - Removing all (or some) in Level 2 and switching back to Level 1 removes all (or keeps only the remaining parents) in Level 1!
  const parentSelectionRef = useRef<{
    levelIdx: number;
    selectedNames: Set<string>;
    selectedShapes: RegionPolygonShape[];
    allCount: number;
    activeParentFilter?: {
      levelIdx: number;
      selectedNames: Set<string>;
      selectedShapes: RegionPolygonShape[];
    };
  } | null>(null);

  const isAreaCode =
    activeQuizOption.category === 'areacodes' ||
    activeQuizOption.id.toLowerCase().includes('areacode');
  const isCapitalsQuiz =
    activeQuizOption.levelKey === 'COUNTRY_CAPITAL' ||
    activeQuizOption.id.toLowerCase().includes('capitals');
  const isCityQuiz =
    !isCapitalsQuiz &&
    (activeQuizOption.category === 'cities' ||
      activeQuizOption.geojsonFile === 'cities' ||
      activeQuizOption.levelKey === 'CITY_PIN');
  const isWorldOrContinentScope =
    country.id === 'WORLD' || country.id.startsWith('CONT_') || country.id === 'CUSTOM';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMapZoom(1);
    setMapPan({ x: 0, y: 0 });
    setAreaCodeDepth('all');

    // Determine which boundary file to use for the interactive Area Selector Map
    const catalogQuizzes = getCountrySubdivisions(country);
    const chosenFilterLevelOption =
      subdivisionLevels.length > 0 && subdivisionLevels[filterMapLevelIdx]
        ? subdivisionLevels[filterMapLevelIdx]
        : null;

    const catalogAdm1 =
      chosenFilterLevelOption ||
      catalogQuizzes
        .flatMap((q) => q.availableLevels || [q])
        .find((q) => q.category === 'adm1') ||
      catalogQuizzes.find((q) => q.category === 'adm1');

    const selectorBoundaryPath = isWorldOrContinentScope
      ? activeQuizOption.geojsonFile
      : chosenFilterLevelOption
      ? chosenFilterLevelOption.geojsonFile
      : catalogAdm1?.geojsonFile ||
        country.subdivisionFile ||
        `/maps/subdivisions/${(country.iso3 || 'bel').toLowerCase()}_adm1.geojson`;

    const multiFilesList: { file: string; countryCode: string; countryName: string }[] | undefined =
      (activeQuizOption as any).multiFiles;

    const fetchQuizData =
      isCityQuiz || (!isAreaCode && isWorldOrContinentScope && multiFilesList && multiFilesList.length > 12)
        ? Promise.resolve({ features: [] })
        : multiFilesList && multiFilesList.length > 0
        ? Promise.all(
            multiFilesList.map((mf) =>
              geojsonCache
                .fetchGeoJSON(mf.file)
                .then((gj) => ({
                  features: (gj?.features || []).map((f: any) => ({
                    ...f,
                    properties: {
                      ...(f.properties || {}),
                      _countryPrefix: mf.countryCode
                    }
                  }))
                }))
                .catch(() => ({ features: [] }))
            )
          ).then((results) => ({
            features: results.flatMap((r) => r.features)
          }))
        : geojsonCache
          .fetchGeoJSON(activeQuizOption.geojsonFile)
          .catch(() => ({ features: [] }));

    const fetchBoundaryData = isWorldOrContinentScope
      ? Promise.resolve(null)
      : geojsonCache.fetchGeoJSON(selectorBoundaryPath).catch(() => null);

    Promise.all([fetchQuizData, fetchBoundaryData]).then(([quizData, boundaryData]) => {
      if (cancelled) return;

      let features: any[] = quizData?.features || [];

      // If this quiz specifies multiCountries (e.g. 197 Sovereign Countries, or Continent Countries/Capitals/Flags), filter features strictly to those country codes!
      const multiCountriesList: string[] | undefined = (activeQuizOption as any).multiCountries;
      if (multiCountriesList && multiCountriesList.length > 0 && features.length > 0) {
        const allowedCodes = new Set(multiCountriesList.map((c) => c.toUpperCase()));
        const nameToIsoFallback: Record<string, string> = {
          france: 'FR',
          norway: 'NO',
          kosovo: 'XK',
          'northern cyprus': 'CY',
          'n. cyprus': 'CY',
          somaliland: 'SO'
        };
        const seenIso = new Set<string>();
        features = features.filter((f: any) => {
          const p = f.properties || {};
          const rawName = String(p.NAME || p.ADMIN || p.name || '').trim().toLowerCase();
          let iso2 = String(p.ISO_A2 || p.iso_a2 || p.ISO_A2_EH || '').trim().toUpperCase();
          if (!iso2 || iso2 === '-99') {
            iso2 = nameToIsoFallback[rawName] || '';
          }
          if (!allowedCodes.has(iso2)) return false;
          // Deduplicate split polygons that map to the same sovereign ISO code (e.g. Cyprus / N. Cyprus, Somalia / Somaliland) when doing 197 sovereign quiz
          if (seenIso.has(iso2)) return false;
          seenIso.add(iso2);
          return true;
        });
      }

      if (isCityQuiz) {
        let cities: CityPoint[] = [];
        const customPool: CityPoint[] | undefined = (activeQuizOption as any).customCitiesPool;
        if (Array.isArray(customPool) && customPool.length > 0) {
          cities = customPool;
        } else if (multiCountriesList && multiCountriesList.length > 0) {
          const allowedCodes = new Set(multiCountriesList.map((c) => c.toUpperCase()));
          cities = getCitiesByScopeAndTier({ type: 'world' }, 5, 'cumulative').filter((c) =>
            allowedCodes.has(c.countryCode.toUpperCase())
          );
        } else {
          const scopeType =
            country.id === 'WORLD'
              ? { type: 'world' as const }
              : country.id.startsWith('CONT_')
              ? { type: 'continent' as const, value: country.name }
              : { type: 'country' as const, value: country.id };
          cities = getCitiesByScopeAndTier(scopeType, 5, 'cumulative');
        }
        features = cities.map((c: CityPoint) => ({
          type: 'Feature',
          properties: {
            id: c.id,
            name: c.name,
            nativeName: c.nativeName,
            tier: c.tier
          },
          geometry: {
            type: 'Point',
            coordinates: [c.lng, c.lat]
          }
        }));
      }

      const detectedNative =
        !isAreaCode && activeQuizOption.levelKey !== 'COUNTRY_FLAG'
          ? true
          : features.some((f: any) => {
              const p = f.properties || {};
              if (p.NL_NAME_1 && p.NL_NAME_1 !== 'NA') return true;
              if (p.NL_NAME_2 && p.NL_NAME_2 !== 'NA') return true;
              if (p.nativeName) return true;
              const label = String(p.NAME_2 || p.NAME_1 || p.name || '');
              return /[^\u0000-\u024F]/.test(label);
            });
      setHasNativeScript(detectedNative);

      if (isAreaCode) {
        const lengthsSet = new Set<number>();
        const startDigitsSet = new Set<string>();
        let maxSig = 1;
        features.forEach((f: any) => {
          const code = String(
            f.properties?.AreaCode ?? f.properties?.areacode ?? f.properties?.code ?? f.properties?.name ?? ''
          ).trim();
          const primary = code.split('/')[0].trim();
          const digitsOnly = primary.replace(/\D/g, '');
          if (digitsOnly.length > 0) {
            lengthsSet.add(digitsOnly.length);
            startDigitsSet.add(digitsOnly[0]);
            const hasLeadingZero = digitsOnly.startsWith('0') && digitsOnly.length > 1;
            const sigLen = hasLeadingZero ? digitsOnly.length - 1 : digitsOnly.length;
            if (sigLen > maxSig) maxSig = sigLen;
          }
        });
        setMaxSigDigits(maxSig);
        setAvailableDigitLengths(Array.from(lengthsSet).sort((a, b) => a - b));
        setAvailableStartingDigits(Array.from(startDigitsSet).sort());
      }

      const boundaryFeatures: any[] = boundaryData?.features || [];
      const mergedBoundaryMap = new Map<
        string,
        {
          name: string;
          code?: string;
          parentName?: string;
          rings: number[][][];
          centroid: [number, number];
          bboxArea: number;
        }
      >();

      const filterKey = chosenFilterLevelOption?.levelKey || 'NAME_1';

      boundaryFeatures.forEach((bf: any, idx: number) => {
        const bp = bf.properties || {};
        const rawName = normalizeRegionName(
          String(
            bp[filterKey] ||
              bp.NAME_4 ||
              bp.NAME_3 ||
              bp.NAME_2 ||
              bp.NAME_1 ||
              bp.name ||
              bp.region ||
              bp.shapeName ||
              bp.admin1 ||
              `Region ${idx + 1}`
          )
        );
        if (!rawName) return;
        const parentName = normalizeRegionName(
          String(bp.NAME_1 || bp.PARENT_REGION || bp.province || bp.STATE || bp.region || '')
        );
        const { rings, centroid, bboxArea } = computeFeatureCentroidAndRings(bf.geometry);
        if (rings.length === 0) return;

        const usAbbr = country.id === 'US' ? US_NAME_TO_ABBR[rawName.toLowerCase()] : undefined;
        const existing = mergedBoundaryMap.get(rawName);
        if (existing) {
          existing.rings.push(...rings);
          existing.bboxArea += bboxArea;
        } else {
          mergedBoundaryMap.set(rawName, {
            name: rawName,
            code: usAbbr,
            parentName: parentName || undefined,
            rings: [...rings],
            centroid,
            bboxArea
          });
        }
      });

      const preppedBoundaries = Array.from(mergedBoundaryMap.values());
      const smallestFirstBoundaries = [...preppedBoundaries].sort(
        (a, b) => a.bboxArea - b.bboxArea
      );

      if (preppedBoundaries.length > 0) {
        const countsByGroup = new Map<string, number>();
        preppedBoundaries.forEach((a) => countsByGroup.set(a.name, 0));

        features.forEach((f: any) => {
          const p = f.properties || {};
          let matchedGroup = '';

          // Check all hierarchy properties (NAME_1, NAME_2, NAME_3, NAME_4, PARENT_REGION, STATE)
          const candValues = [
            p[filterKey],
            p.PARENT_REGION,
            p.NAME_1,
            p.NAME_2,
            p.NAME_3,
            p.NAME_4,
            p.STATE,
            p.province,
            p.region,
            p.name
          ]
            .filter(Boolean)
            .map((v) => normalizeRegionName(String(v).trim()));

          for (const candRaw of candValues) {
            const expandedUs =
              country.id === 'US' && US_STATE_ABBR_TO_NAME[candRaw.toUpperCase()]
                ? US_STATE_ABBR_TO_NAME[candRaw.toUpperCase()]
                : candRaw;
            const exact = preppedBoundaries.find(
              (a) =>
                a.name.toLowerCase() === expandedUs.toLowerCase() ||
                a.name.toLowerCase() === candRaw.toLowerCase() ||
                (a.code && a.code.toLowerCase() === candRaw.toLowerCase())
            );
            if (exact) {
              matchedGroup = exact.name;
              break;
            }
          }

          if (!matchedGroup && f.geometry) {
            let pt: [number, number] = [0, 0];
            if (f.geometry.type === 'Point' && Array.isArray(f.geometry.coordinates)) {
              pt = [f.geometry.coordinates[0], f.geometry.coordinates[1]];
            } else {
              pt = computeFeatureCentroidAndRings(f.geometry).centroid;
            }
            for (const st of smallestFirstBoundaries) {
              if (st.rings.some((r) => pointInRing2D(pt[0], pt[1], r))) {
                matchedGroup = st.name;
                break;
              }
            }
            if (!matchedGroup) {
              let bestDist = Infinity;
              for (const st of smallestFirstBoundaries) {
                const d =
                  Math.pow(st.centroid[0] - pt[0], 2) + Math.pow(st.centroid[1] - pt[1], 2);
                if (d < bestDist) {
                  bestDist = d;
                  matchedGroup = st.name;
                }
              }
            }
          }

          if (matchedGroup) {
            p._atlasGroup = matchedGroup;
            countsByGroup.set(matchedGroup, (countsByGroup.get(matchedGroup) || 0) + 1);
          }
        });

        let built: RegionPolygonShape[] = preppedBoundaries
          .map((a) => {
            const cLng = a.centroid[0];
            const cLat = a.centroid[1];
            const isOutlying =
              (country.id === 'US' &&
                (US_OUTLYING_NAMES.has(a.name) || cLat > 50 || cLat < 24 || cLng < -130)) ||
              (country.id === 'FR' && (cLat < 41 || cLng < -6 || cLng > 10)) ||
              (country.id === 'ES' && cLat < 34) ||
              (country.id === 'PT' && cLng < -12) ||
              (country.id === 'NL' && cLat < 40);
            return {
              name: a.name,
              code: a.code,
              parentName: a.parentName,
              count: countsByGroup.get(a.name) || 1,
              rings: a.rings,
              centroid: a.centroid,
              bboxArea: a.bboxArea,
              isOutlying
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        const fullUnfilteredCount = built.length;

        // Bidirectional Level 1 <-> Level 2+ Area Filtering & Selection Sync:
        const prevSel = parentSelectionRef.current;
        let nextActiveParentFilter = prevSel?.activeParentFilter;
        let initialSelectedNames = new Set(built.map((s) => s.name));

        const filterChildShapesByParents = (
          shapesToFilter: RegionPolygonShape[],
          parentNames: Set<string>,
          parentShapes: RegionPolygonShape[]
        ) => {
          const parentNamesLower = new Set(
            Array.from(parentNames).map((n) => n.toLowerCase())
          );
          return shapesToFilter.filter((shape) => {
            if (shape.parentName && parentNamesLower.has(shape.parentName.toLowerCase())) {
              return true;
            }
            const rawBound = mergedBoundaryMap.get(shape.name);
            if (rawBound?.parentName && parentNamesLower.has(rawBound.parentName.toLowerCase())) {
              return true;
            }
            return parentShapes.some((ps) =>
              ps.rings.some((r) => pointInRing2D(shape.centroid[0], shape.centroid[1], r))
            );
          });
        };

        if (prevSel && filterMapLevelIdx > prevSel.levelIdx) {
          // Moving from a higher level (e.g. Level 1) down to a more detailed level (e.g. Level 2)
          if (prevSel.selectedNames.size === 0) {
            // User deselected everything in Level 1 -> 0 selected in Level 2!
            initialSelectedNames = new Set();
            nextActiveParentFilter = undefined;
          } else if (prevSel.selectedNames.size < prevSel.allCount) {
            // User selected a specific subset of Level 1 -> show & select ONLY the smaller Level 2 subdivisions inside those chosen Level 1 areas!
            const matchingChildShapes = filterChildShapesByParents(
              built,
              prevSel.selectedNames,
              prevSel.selectedShapes
            );
            if (matchingChildShapes.length > 0) {
              built = matchingChildShapes;
              initialSelectedNames = new Set(matchingChildShapes.map((s) => s.name));
              nextActiveParentFilter = {
                levelIdx: prevSel.levelIdx,
                selectedNames: new Set(prevSel.selectedNames),
                selectedShapes: [...prevSel.selectedShapes]
              };
            }
          } else {
            nextActiveParentFilter = undefined;
          }
        } else if (prevSel && filterMapLevelIdx < prevSel.levelIdx) {
          // Moving from a detailed level (e.g. Level 2) back up to a higher level (e.g. Level 1)
          if (prevSel.selectedNames.size === 0) {
            // User removed everything in Level 2 -> everything must also be removed in Level 1!
            initialSelectedNames = new Set();
            nextActiveParentFilter = undefined;
          } else if (prevSel.selectedNames.size < prevSel.allCount) {
            // User kept a subset in Level 2 -> select only the parent Level 1 regions of the remaining Level 2 items!
            const childParentNamesLower = new Set(
              prevSel.selectedShapes
                .map((cs) => cs.parentName?.toLowerCase())
                .filter((v): v is string => Boolean(v))
            );
            const matchingParentShapes = built.filter((parentShape) => {
              if (childParentNamesLower.has(parentShape.name.toLowerCase())) {
                return true;
              }
              return prevSel.selectedShapes.some((cs) =>
                parentShape.rings.some((r) => pointInRing2D(cs.centroid[0], cs.centroid[1], r))
              );
            });
            initialSelectedNames = new Set(matchingParentShapes.map((s) => s.name));
            if (filterMapLevelIdx === 0) {
              nextActiveParentFilter = undefined;
            }
          } else if (
            nextActiveParentFilter &&
            filterMapLevelIdx === nextActiveParentFilter.levelIdx
          ) {
            initialSelectedNames = new Set(nextActiveParentFilter.selectedNames);
            nextActiveParentFilter = undefined;
          }
        } else if (
          nextActiveParentFilter &&
          filterMapLevelIdx > nextActiveParentFilter.levelIdx
        ) {
          const matchingChildShapes = filterChildShapesByParents(
            built,
            nextActiveParentFilter.selectedNames,
            nextActiveParentFilter.selectedShapes
          );
          if (matchingChildShapes.length > 0) {
            built = matchingChildShapes;
            initialSelectedNames = new Set(matchingChildShapes.map((s) => s.name));
          }
        }

        parentSelectionRef.current = {
          levelIdx: filterMapLevelIdx,
          selectedNames: new Set(initialSelectedNames),
          selectedShapes: built.filter((s) => initialSelectedNames.has(s.name)),
          allCount: fullUnfilteredCount,
          activeParentFilter: nextActiveParentFilter
        };

        setRawFeatures(features);
        setTotalUnfilteredCount(fullUnfilteredCount);
        setRegionShapes(built);
        setSelectedGroups(initialSelectedNames);
        setLoading(false);
        return;
      }

      const fallbackMap = new Map<string, RegionPolygonShape>();
      features.forEach((f: any, idx: number) => {
        const p = f.properties || {};
        const rawName = String(
          p[activeQuizOption.levelKey] || p.NAME_1 || p.NAME_2 || p.name || p.AreaCode || `Zone ${idx + 1}`
        ).trim();
        p._atlasGroup = rawName;
        const { rings, centroid, bboxArea } = computeFeatureCentroidAndRings(f.geometry);
        if (rings.length > 0) {
          const existing = fallbackMap.get(rawName);
          if (existing) {
            existing.rings.push(...rings);
            existing.count += 1;
            existing.bboxArea = (existing.bboxArea || 0) + bboxArea;
          } else {
            fallbackMap.set(rawName, {
              name: rawName,
              count: 1,
              rings: [...rings],
              centroid,
              bboxArea,
              isOutlying: false
            });
          }
        }
      });

      const fallbackShapes = Array.from(fallbackMap.values());
      setRawFeatures(features);
      setTotalUnfilteredCount(fallbackShapes.length);
      setRegionShapes(fallbackShapes);
      setSelectedGroups(new Set(fallbackShapes.map((s) => s.name)));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [country, activeQuizOption, filterMapLevelIdx, subdivisionLevels, isAreaCode, isCityQuiz, isWorldOrContinentScope]);

  // Dynamic Area Code Levels based on true geographical numbering structure for each country!
  // - NANP (US, CA, DO) & 1-tier countries: 1 level only (no depth selector needed)
  // - Mexico (MX), Brazil (BR), France (FR), Belgium (BE), Netherlands (NL), Spain (ES), etc.: 2 geographical levels (Level 1 Regional Macro-Zones + Level 2 Full Area Codes)
  // - Italy (IT), Germany (DE), UK (GB), Japan (JP), Russia (RU), China (CN), India (IN), Indonesia (ID), and World/Continent: 3 geographical levels
  const areaCodeLevelOptions = useMemo(() => {
    if (!isAreaCode) return [];
    const cc = country.id.toUpperCase();
    if (!isWorldOrContinentScope && SINGLE_LEVEL_AREACODE_COUNTRIES.has(cc)) {
      return [];
    }

    const countDistinctAtDepth = (d: AreaCodeDepthLevel): number => {
      if (rawFeatures.length === 0) {
        const base = activeQuizOption.targetCount || 100;
        if (d === '1') return Math.max(8, Math.round(base * 0.28));
        if (d === '2') return Math.max(16, Math.round(base * 0.62));
        return base;
      }
      const set = new Set<string>();
      rawFeatures.forEach((f: any) => {
        const p = f.properties || {};
        const rawCode = String(p.AreaCode ?? p.areacode ?? p.code ?? p.name ?? '').trim();
        if (rawCode) {
          const fCountry = p._countryPrefix || cc;
          const pref = p._countryPrefix ? `${p._countryPrefix}:` : '';
          set.add(pref + computeAreaCodeAtDepth(rawCode, d, fCountry));
        }
      });
      return set.size;
    };

    const allowIntermediateDepth2 =
      isWorldOrContinentScope || THREE_LEVEL_AREACODE_COUNTRIES.has(cc);

    const candidates: { id: AreaCodeDepthLevel; desc: string; count: number }[] = [
      {
        id: '1',
        desc: isWorldOrContinentScope
          ? '1st Digit Regional Macro-Zones — Highest Level'
          : cc === 'ES' || cc === 'PT' || cc === 'GR' || cc === 'UY' || cc === 'AR'
          ? '2-Digit Regional Macro-Zones — Highest Level'
          : '1st Digit Regional Zones — Highest Level',
        count: countDistinctAtDepth('1')
      },
      ...(allowIntermediateDepth2
        ? [
            {
              id: '2' as AreaCodeDepthLevel,
              desc: isWorldOrContinentScope
                ? '2 Digits Sub-Regions — Intermediate Level'
                : cc === 'AR'
                ? '3-Digit Regional Zones — Intermediate Level'
                : '2 Significant Digits — Intermediate Level',
              count: countDistinctAtDepth('2')
            }
          ]
        : []),
      {
        id: 'all',
        desc: 'All Area Codes — Full Detail',
        count: countDistinctAtDepth('all')
      }
    ];

    // Filter out any level with <= 1 question and deduplicate levels with identical question counts (never collapse World/Continent levels)
    const valid: { id: AreaCodeDepthLevel; desc: string; count: number }[] = [];
    for (const cand of candidates) {
      if (!isWorldOrContinentScope && cand.count <= 1 && cand.id !== 'all') continue;
      if (
        !isWorldOrContinentScope &&
        valid.length > 0 &&
        valid[valid.length - 1].count === cand.count
      ) {
        if (cand.id === 'all') {
          valid[valid.length - 1] = cand;
        }
        continue;
      }
      valid.push(cand);
    }

    return valid.map((v, idx) => ({
      id: v.id,
      label: `Level ${idx + 1} (${v.desc} · ${v.count} Q)`
    }));
  }, [isAreaCode, rawFeatures, activeQuizOption.targetCount, isWorldOrContinentScope, country.id]);

  const updateParentSelectionTracker = (nextSet: Set<string>) => {
    parentSelectionRef.current = {
      levelIdx: filterMapLevelIdx,
      selectedNames: new Set(nextSet),
      selectedShapes: regionShapes.filter((s) => nextSet.has(s.name)),
      allCount: totalUnfilteredCount || regionShapes.length,
      activeParentFilter:
        filterMapLevelIdx === 0 ? undefined : parentSelectionRef.current?.activeParentFilter
    };
  };

  const toggleRegion = (name: string) => {
    sounds.playTap();
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      updateParentSelectionTracker(next);
      return next;
    });
  };

  const selectAll = () => {
    sounds.playTap();
    const all = new Set(regionShapes.map((s) => s.name));
    setSelectedGroups(all);
    updateParentSelectionTracker(all);
  };

  const deselectAll = () => {
    sounds.playTap();
    const empty = new Set<string>();
    setSelectedGroups(empty);
    updateParentSelectionTracker(empty);
  };

  // Compute SVG Bounding Box for Main (non-outlying) regions
  const mapProjection = useMemo(() => {
    const mainShapes = regionShapes.filter((s) => !s.isOutlying && s.rings.length > 0);
    const targetShapes =
      mainShapes.length > 0 ? mainShapes : regionShapes.filter((s) => s.rings.length > 0);

    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    targetShapes.forEach((s) => {
      s.rings.forEach((ring) => {
        ring.forEach(([lng, lat]) => {
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        });
      });
    });

    if (!isFinite(minLng)) {
      minLng = -10;
      maxLng = 10;
      minLat = -10;
      maxLat = 10;
    }

    const midLatRad = (((minLat + maxLat) / 2) * Math.PI) / 180;
    const cosLat = Math.max(0.25, Math.cos(midLatRad));

    const spanLng = Math.max(0.05, (maxLng - minLng) * cosLat);
    const spanLat = Math.max(0.05, maxLat - minLat);

    const padX = spanLng * 0.06;
    const padY = spanLat * 0.08;

    const svgWidth = 800;
    const svgHeight = 420;

    const scale = Math.min(
      svgWidth / (spanLng + padX * 2),
      svgHeight / (spanLat + padY * 2)
    );

    const offsetX = (svgWidth - spanLng * scale) / 2;
    const offsetY = (svgHeight - spanLat * scale) / 2;

    const project = (lng: number, lat: number): [number, number] => {
      const x = offsetX + (lng - minLng) * cosLat * scale;
      const y = offsetY + (maxLat - lat) * scale;
      return [Number(x.toFixed(1)), Number(y.toFixed(1))];
    };

    return { project, svgWidth, svgHeight };
  }, [regionShapes]);

  // Per-tier city counts within the currently selected geographic regions
  const cityTierCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (!isCityQuiz || rawFeatures.length === 0) return counts;
    if (regionShapes.length > 0 && selectedGroups.size === 0) return counts;
    const isSubsetSelected =
      selectedGroups.size < regionShapes.length ||
      (totalUnfilteredCount > 0 && selectedGroups.size < totalUnfilteredCount);
    rawFeatures.forEach((f: any) => {
      const p = f.properties || {};
      const grp = p._atlasGroup || '';
      if (isSubsetSelected && (!grp || !selectedGroups.has(grp))) return;
      const t = Math.max(1, Math.min(5, Number(p.tier || 1)));
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [isCityQuiz, rawFeatures, regionShapes.length, selectedGroups, totalUnfilteredCount]);

  // Calculate matching question count taking into account selected parent regions + area code depth + prefix + multi-selected city tiers
  const matchingQuestionCount = useMemo(() => {
    if (rawFeatures.length === 0) {
      if (isAreaCode) {
        const base = activeQuizOption.targetCount || 100;
        if (areaCodeDepth === '1') return Math.max(8, Math.round(base * 0.28));
        if (areaCodeDepth === '2') return Math.max(16, Math.round(base * 0.62));
        return base;
      }
      if (regionShapes.length > 0) {
        return regionShapes.filter((s) => selectedGroups.has(s.name)).length;
      }
      return activeQuizOption.targetCount || 10;
    }

    if (regionShapes.length > 0 && selectedGroups.size === 0) {
      return 0;
    }

    const filteredByRegion = rawFeatures.filter((f: any) => {
      const p = f.properties || {};
      const grp = p._atlasGroup || '';
      const isSubsetSelected =
        selectedGroups.size < regionShapes.length ||
        (totalUnfilteredCount > 0 && selectedGroups.size < totalUnfilteredCount);
      if (isSubsetSelected && (!grp || !selectedGroups.has(grp))) {
        return false;
      }

      if (isAreaCode) {
        const rawCode = String(p.AreaCode ?? p.areacode ?? p.code ?? p.name ?? '').trim();
        const effectiveCode = computeAreaCodeAtDepth(
          rawCode,
          areaCodeDepth,
          p._countryPrefix || country.id
        );
        const digitsOnly = effectiveCode.replace(/\D/g, '');
        const cleanNoLeadingZero = digitsOnly.replace(/^0+/, '');

        if (digitLengthFilter !== 'all') {
          if (digitLengthFilter === '4+') {
            if (digitsOnly.length < 4) return false;
          } else {
            const targetLen = Number(digitLengthFilter);
            if (digitsOnly.length !== targetLen && cleanNoLeadingZero.length !== targetLen) {
              return false;
            }
          }
        }

        if (typedPrefix.trim()) {
          const pref = typedPrefix.trim();
          const prefNoZero = pref.replace(/^0+/, '');
          const matchesPrefix =
            effectiveCode.startsWith(pref) ||
            digitsOnly.startsWith(pref) ||
            (prefNoZero.length > 0 && cleanNoLeadingZero.startsWith(prefNoZero));
          if (!matchesPrefix) return false;
        }
      }

      return true;
    });

    if (isCityQuiz) {
      const tierFiltered = filteredByRegion.filter((f: any) => {
        const t = Math.max(1, Math.min(5, Number(f.properties?.tier || 1)));
        return selectedCityTiers.has(t);
      });
      return tierFiltered.length;
    }

    if (isAreaCode) {
      const uniqueCodes = new Set<string>();
      filteredByRegion.forEach((f: any) => {
        const p = f.properties || {};
        const rawCode = String(p.AreaCode ?? p.areacode ?? p.code ?? p.name ?? '').trim();
        if (rawCode) {
          const pref = p._countryPrefix ? `${p._countryPrefix}:` : '';
          uniqueCodes.add(
            pref + computeAreaCodeAtDepth(rawCode, areaCodeDepth, p._countryPrefix || country.id)
          );
        }
      });
      return uniqueCodes.size || filteredByRegion.length;
    }

    // For subdivisions, count unique subdivision names in the filtered features
    const uniqueSubNames = new Set<string>();
    filteredByRegion.forEach((f: any, idx: number) => {
      const p = f.properties || {};
      const nm = String(
        p[activeQuizOption.levelKey] || p.NAME_4 || p.NAME_3 || p.NAME_2 || p.NAME_1 || p.name || `Sub-${idx}`
      ).trim();
      const parentPrefix = p._countryPrefix || (p.NAME_2 && p.NAME_1 ? p.NAME_1 : '');
      if (nm) uniqueSubNames.add(parentPrefix ? `${parentPrefix}::${nm}` : nm);
    });
    return uniqueSubNames.size || filteredByRegion.length;
  }, [
    activeQuizOption,
    rawFeatures,
    regionShapes,
    selectedGroups,
    totalUnfilteredCount,
    isAreaCode,
    isCityQuiz,
    selectedCityTiers,
    digitLengthFilter,
    typedPrefix,
    areaCodeDepth,
    country.id
  ]);

  const effectiveQuestionCount = useMemo(() => {
    if (questionLimit === 'all' || mode === 'study') return matchingQuestionCount;
    return Math.max(1, Math.min(matchingQuestionCount, questionLimit));
  }, [matchingQuestionCount, questionLimit, mode]);

  // Determine whether this run is a partial/practice run (which shouldn't overwrite full country Mastery %)
  const isPartialRun = useMemo(() => {
    if (mode === 'study') return true;
    if (areaCodeDepth !== 'all') return true;
    if (regionShapes.length > 1 && selectedGroups.size < regionShapes.length) return true;
    if (totalUnfilteredCount > 1 && selectedGroups.size < totalUnfilteredCount) return true;
    if (questionLimit !== 'all' && effectiveQuestionCount < matchingQuestionCount) return true;
    if (typedPrefix.trim() !== '' || digitLengthFilter !== 'all') return true;
    return false;
  }, [
    mode,
    areaCodeDepth,
    regionShapes.length,
    totalUnfilteredCount,
    selectedGroups.size,
    questionLimit,
    effectiveQuestionCount,
    matchingQuestionCount,
    typedPrefix,
    digitLengthFilter
  ]);

  // Only warn about large datasets when the actual number of polygon questions/regions to play in this round is >= 250!
  // Cities quizzes use lightweight in-memory coordinates (no polygon GeoJSONs), so they never need a heavy load warning.
  const isLargeDataset = useMemo(() => {
    if (isCityQuiz) return false;
    return effectiveQuestionCount >= 250;
  }, [effectiveQuestionCount, isCityQuiz]);

  const outlyingShapes = useMemo(
    () => regionShapes.filter((s) => s.isOutlying),
    [regionShapes]
  );

  // Sync livePanRef whenever React state updates
  useEffect(() => {
    livePanRef.current = { x: mapPan.x, y: mapPan.y, zoom: mapZoom };
  }, [mapPan, mapZoom]);

  const applySvgTransformDirect = (panX: number, panY: number, zoom: number) => {
    if (!mapSvgGroupRef.current) return;
    const hw = mapProjection.svgWidth / 2;
    const hh = mapProjection.svgHeight / 2;
    mapSvgGroupRef.current.setAttribute(
      'transform',
      `translate(${hw + panX}, ${hh + panY}) scale(${zoom}) translate(${-hw}, ${-hh})`
    );
  };

  const handleSvgWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.25 : 0.8;
    const nextZoom = Math.max(1, Math.min(10, Number((livePanRef.current.zoom * factor).toFixed(2))));
    const nextPanX = nextZoom === 1 ? 0 : livePanRef.current.x;
    const nextPanY = nextZoom === 1 ? 0 : livePanRef.current.y;
    livePanRef.current = { x: nextPanX, y: nextPanY, zoom: nextZoom };
    applySvgTransformDirect(nextPanX, nextPanY, nextZoom);
    setMapZoom(nextZoom);
    if (nextZoom === 1) setMapPan({ x: 0, y: 0 });
  };

  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);

  const handleTouchStartSvg = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length >= 2) {
      isDraggingRef.current = false;
      didDragMoveRef.current = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDistRef.current = Math.hypot(dx, dy);
      pinchStartZoomRef.current = livePanRef.current.zoom;
    }
  };

  const handleTouchMoveSvg = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length >= 2 && pinchStartDistRef.current && pinchStartDistRef.current > 8) {
      isDraggingRef.current = false;
      didDragMoveRef.current = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / pinchStartDistRef.current;
      const nextZoom = Math.max(
        1,
        Math.min(18, Number((pinchStartZoomRef.current * ratio).toFixed(2)))
      );
      const nextPanX = nextZoom === 1 ? 0 : livePanRef.current.x;
      const nextPanY = nextZoom === 1 ? 0 : livePanRef.current.y;
      livePanRef.current = { x: nextPanX, y: nextPanY, zoom: nextZoom };
      applySvgTransformDirect(nextPanX, nextPanY, nextZoom);
    }
  };

  const handleTouchEndSvg = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2 && pinchStartDistRef.current !== null) {
      pinchStartDistRef.current = null;
      setMapZoom(livePanRef.current.zoom);
      if (livePanRef.current.zoom === 1) {
        setMapPan({ x: 0, y: 0 });
      } else {
        setMapPan({ x: livePanRef.current.x, y: livePanRef.current.y });
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (pinchStartDistRef.current !== null) return;
    isDraggingRef.current = true;
    didDragMoveRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: livePanRef.current.x,
      panY: livePanRef.current.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || pinchStartDistRef.current !== null) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (!didDragMoveRef.current && Math.hypot(dx, dy) > 4) {
      didDragMoveRef.current = true;
    }
    if (didDragMoveRef.current) {
      // Scale screen pixel delta into SVG viewBox coordinates (800x420) for 1:1 responsive panning at any zoom level!
      const rect = e.currentTarget.getBoundingClientRect();
      const svgScaleX = rect.width > 0 ? mapProjection.svgWidth / rect.width : 1.4;
      const svgScaleY = rect.height > 0 ? mapProjection.svgHeight / rect.height : 1.4;
      const nextX = dragStartRef.current.panX + dx * svgScaleX;
      const nextY = dragStartRef.current.panY + dy * svgScaleY;
      livePanRef.current.x = nextX;
      livePanRef.current.y = nextY;
      applySvgTransformDirect(nextX, nextY, livePanRef.current.zoom);
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (didDragMoveRef.current) {
      setMapPan({ x: livePanRef.current.x, y: livePanRef.current.y });
    }
  };

  const executeLaunchQuiz = () => {
    sounds.playFanfare();
    const filters: string[] = [];
    if (typedPrefix.trim()) {
      filters.push(`prefix:${typedPrefix.trim()}`);
    }
    if (digitLengthFilter !== 'all') {
      filters.push(`digits:${digitLengthFilter}`);
    }
    if (areaCodeDepth !== 'all') {
      filters.push(`depth:${areaCodeDepth}`);
    }
    if (isCityQuiz) {
      const sortedTiers = Array.from(selectedCityTiers).sort((a, b) => a - b);
      filters.push(`citytiers:${sortedTiers.join(',')}`);
      filters.push(`citytier:${sortedTiers[sortedTiers.length - 1] || 1}`);
    }
    if (questionLimit !== 'all' && mode === 'quiz') {
      filters.push(`limit:${questionLimit}`);
    }
    if (isPartialRun) {
      filters.push('partial:true');
    }
    const isSubsetSelected =
      selectedGroups.size < regionShapes.length ||
      (totalUnfilteredCount > 0 && selectedGroups.size < totalUnfilteredCount);
    if (isSubsetSelected) {
      Array.from(selectedGroups).forEach((g) => {
        filters.push(g);
        const sh = regionShapes.find((s) => s.name === g);
        if (sh?.code) filters.push(sh.code);
      });
    } else if (filters.length === 0) {
      filters.push('all');
    }
    onStart(
      filters,
      mode,
      quizLangMode,
      difficulty,
      endlessRetry,
      activeQuizOption,
      isPartialRun
    );
  };

  return (
    <div className="fixed inset-x-0 top-2 bottom-20 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-xl max-h-full bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="px-4 py-3 sm:px-5 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-slate-900">
          <div className="flex items-center gap-3 min-w-0">
            <CountryFlag countryCode={country.id} size="md" className="shadow-md shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold block truncate">
                {country.name} · Quiz Setup
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {activeQuizOption.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calm, Clean Scrollable Setup Body ("Rust" layout) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-4 space-y-3">
          {/* SECTION 1: Official Subdivision Level OR Area Code Level Selector */}
          {subdivisionLevels.length > 1 && (
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                <Layers className="w-3.5 h-3.5" />
                <span>Official Subdivision Level</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {subdivisionLevels.map((lvl, idx) => {
                  const isSelected = activeQuizOption.id === lvl.id;
                  const shortTitle = lvl.title
                    .replace(/^Subdivision\s+/i, '')
                    .replace(new RegExp(`,\\s*${country.name}`, 'i'), '');
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        sounds.playTap();
                        setActiveQuizOption(lvl);
                        setFilterMapLevelIdx(idx);
                      }}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sm'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{shortTitle || `Level ${idx + 1}`}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/80 text-sky-400 shrink-0">
                        {lvl.targetCount} Q
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Multi-Country Subdivision Level Selector (e.g. Benelux -> Belgium, Netherlands, Luxembourg) */}
          {Array.isArray((activeQuizOption as any).customCountriesList) &&
            (activeQuizOption as any).customCountriesList.length > 0 && (
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Subdivision Level per Country</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {((activeQuizOption as any).customCountriesList as CountryInfo[]).map((cMeta) => {
                    const cSubCard = getCountrySubdivisions(cMeta).find(
                      (q) => q.availableLevels && q.availableLevels.length > 0
                    );
                    const cLevels =
                      cSubCard?.availableLevels ||
                      getCountrySubdivisions(cMeta).filter(
                        (q) => q.category === 'adm1' || q.category === 'adm2' || q.category === 'adm3'
                      );
                    if (cLevels.length === 0) return null;
                    const currentFile =
                      (activeQuizOption as any).countrySubdivisionOverrides?.[cMeta.id] ||
                      cLevels[0].geojsonFile;
                    return (
                      <div
                        key={cMeta.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-800/80"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CountryFlag countryCode={cMeta.id} size="sm" />
                          <span className="text-xs font-bold text-white truncate">{cMeta.name}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {cLevels.map((lvl, lIdx) => {
                            const active =
                              currentFile === lvl.geojsonFile || currentFile === lvl.id;
                            const shortLbl =
                              lvl.title.match(/Level\s*\d+[^,]*/i)?.[0] || `Level ${lIdx + 1}`;
                            return (
                              <button
                                key={lvl.id}
                                onClick={() => {
                                  sounds.playTap();
                                  const nextOverrides = {
                                    ...((activeQuizOption as any).countrySubdivisionOverrides || {}),
                                    [cMeta.id]: lvl.geojsonFile
                                  };
                                  let nextTargetCountSum = 0;
                                  const nextMultiFiles = (
                                    (activeQuizOption as any).customCountriesList as CountryInfo[]
                                  ).map((cm) => {
                                    const cmSub = getCountrySubdivisions(cm).find(
                                      (q) => q.availableLevels && q.availableLevels.length > 0
                                    );
                                    const cmLvls =
                                      cmSub?.availableLevels ||
                                      getCountrySubdivisions(cm).filter(
                                        (q) =>
                                          q.category === 'adm1' ||
                                          q.category === 'adm2' ||
                                          q.category === 'adm3'
                                      );
                                    const chosenFile =
                                      nextOverrides[cm.id] ||
                                      cmLvls[0]?.geojsonFile ||
                                      cm.subdivisionFile ||
                                      `/maps/subdivisions/${(cm.iso3 || 'bel').toLowerCase()}_adm1.geojson`;
                                    const matchedLvl = cmLvls.find(
                                      (l) => l.geojsonFile === chosenFile || l.id === chosenFile
                                    );
                                    nextTargetCountSum += matchedLvl?.targetCount || cmLvls[0]?.targetCount || 12;
                                    return {
                                      file: chosenFile,
                                      countryCode: cm.id,
                                      countryName: cm.name
                                    };
                                  });
                                  setActiveQuizOption({
                                    ...activeQuizOption,
                                    targetCount: nextTargetCountSum,
                                    countrySubdivisionOverrides: nextOverrides,
                                    multiFiles: nextMultiFiles
                                  } as any);
                                }}
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                                  active
                                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                }`}
                              >
                                {shortLbl} ({lvl.targetCount} Q)
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {isAreaCode && areaCodeLevelOptions.length > 1 && (
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Area Code Depth Level</span>
                </div>
                {areaCodeDepth !== 'all' && (
                  <span className="text-[10px] text-amber-400 font-semibold">
                    Practice Level (Merged Zones)
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {areaCodeLevelOptions.map((opt) => {
                  const active = areaCodeDepth === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        sounds.playTap();
                        setAreaCodeDepth(opt.id);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
                        active
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {active && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: Mode, Difficulty & Recycle Missed */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Play Mode
              </span>
              <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
                <button
                  onClick={() => {
                    sounds.playTap();
                    setMode('quiz');
                  }}
                  className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    mode === 'quiz'
                      ? 'bg-sky-500 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Quiz
                </button>
                <button
                  onClick={() => {
                    sounds.playTap();
                    setMode('study');
                  }}
                  className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    mode === 'study'
                      ? 'bg-indigo-500 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Study Mode
                </button>
              </div>
            </div>

            {isCityQuiz && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
                      City Tiers (Multi-Select Tiers 1–5)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tap one or multiple tiers to combine their cities ({matchingQuestionCount} Q selected)
                    </span>
                  </div>
                  <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[10px] font-bold gap-0.5">
                    {([
                      { label: 'Only T1', tiers: [1] },
                      { label: 'T1–2', tiers: [1, 2] },
                      { label: 'T1–3', tiers: [1, 2, 3] },
                      { label: 'All 1–5', tiers: [1, 2, 3, 4, 5] }
                    ]).map((preset) => {
                      const isPresetActive =
                        selectedCityTiers.size === preset.tiers.length &&
                        preset.tiers.every((t) => selectedCityTiers.has(t));
                      return (
                        <button
                          key={preset.label}
                          onClick={() => {
                            sounds.playTap();
                            setSelectedCityTiers(new Set(preset.tiers));
                            const maxT = Math.max(...preset.tiers);
                            setDifficulty(maxT <= 1 ? 'easy' : maxT <= 3 ? 'normal' : 'hard');
                          }}
                          className={`px-2 py-1 rounded-md transition-colors ${
                            isPresetActive
                              ? 'bg-sky-500 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {([
                    { t: 1 as const, lbl: 'Tier 1', sub: 'World Cities' },
                    { t: 2 as const, lbl: 'Tier 2', sub: 'Major' },
                    { t: 3 as const, lbl: 'Tier 3', sub: 'Regional' },
                    { t: 4 as const, lbl: 'Tier 4', sub: 'Provincial' },
                    { t: 5 as const, lbl: 'Tier 5', sub: 'Local' }
                  ]).map((item) => {
                    const active = selectedCityTiers.has(item.t);
                    const tierCount = cityTierCounts[item.t] || 0;
                    return (
                      <button
                        key={item.t}
                        onClick={() => {
                          sounds.playTap();
                          setSelectedCityTiers((prev) => {
                            const next = new Set(prev);
                            if (next.has(item.t)) {
                              if (next.size > 1) next.delete(item.t);
                            } else {
                              next.add(item.t);
                            }
                            const maxT = Math.max(...Array.from(next));
                            setDifficulty(maxT <= 1 ? 'easy' : maxT <= 3 ? 'normal' : 'hard');
                            return next;
                          });
                        }}
                        className={`px-1.5 py-1.5 rounded-lg text-center border transition-colors ${
                          active
                            ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-[11px] font-bold leading-tight">{item.lbl}</div>
                        <div className="text-[9px] opacity-85 truncate">{item.sub}</div>
                        <div className="text-[9px] font-mono text-sky-400/90 mt-0.5">
                          {tierCount} Q
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === 'quiz' && !isCapitalsQuiz && !isCityQuiz && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Difficulty
                </span>
                <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setDifficulty('easy');
                    }}
                    className={`px-3.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      difficulty !== 'hard'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    <span>Easy</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setDifficulty('hard');
                    }}
                    className={`px-3.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      difficulty === 'hard'
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>Hard</span>
                  </button>
                </div>
              </div>
            )}

            {(mode === 'quiz' || hasNativeScript) && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  {mode === 'quiz' && !isCityQuiz && (
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setEndlessRetry((v) => !v);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        endlessRetry
                          ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Recycle Missed: {endlessRetry ? 'ON' : 'OFF'}</span>
                    </button>
                  )}
                </div>

                {hasNativeScript && (
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-amber-400" />
                    <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-amber-500/30">
                      <button
                        onClick={() => {
                          sounds.playTap();
                          setQuizLangMode('english');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          quizLangMode === 'english'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          sounds.playTap();
                          setQuizLangMode('native');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          quizLangMode === 'native'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Local Language
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 3: Questions per Round (including Custom Number Input!) & Popup Map Area Selector */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-3">
            {mode === 'quiz' && matchingQuestionCount > 1 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <ListFilter className="w-3.5 h-3.5 text-sky-400" />
                    <span>Questions per Round</span>
                  </div>
                  <span className="text-[11px] font-mono text-sky-400 font-bold">
                    {effectiveQuestionCount} / {matchingQuestionCount} Q
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setQuestionLimit('all');
                      setCustomLimitInput('');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      questionLimit === 'all' && customLimitInput === ''
                        ? 'bg-sky-500 text-white border-sky-400 shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    All ({matchingQuestionCount})
                  </button>

                  {/* Custom Number of Random Questions Input */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/90 focus-within:border-sky-400 rounded-xl px-3 py-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                      Custom #:
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={matchingQuestionCount}
                      value={customLimitInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomLimitInput(val);
                        const parsed = parseInt(val, 10);
                        if (!isNaN(parsed) && parsed > 0) {
                          setQuestionLimit(Math.min(matchingQuestionCount, parsed));
                        } else {
                          setQuestionLimit('all');
                        }
                      }}
                      placeholder="e.g. 14"
                      className="w-16 bg-transparent text-xs font-mono font-bold text-sky-300 placeholder-slate-600 focus:outline-none text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Popup Button to Select Specific Regions on the Green Interactive Map */}
            {!isWorldOrContinentScope && regionShapes.length > 1 && (
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-200 block">
                    Filter by Geographic Regions
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {selectedGroups.size === regionShapes.length
                      ? `All ${regionShapes.length} regions included`
                      : `${selectedGroups.size} of ${regionShapes.length} regions selected`}
                  </span>
                </div>
                <button
                  onClick={() => {
                    sounds.playTap();
                    setShowMapSelectorPopup(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0"
                >
                  <MapIcon className="w-4 h-4 text-emerald-400" />
                  <span>
                    Select Areas on Map ({selectedGroups.size}/{regionShapes.length})
                  </span>
                </button>
              </div>
            )}

            {/* Optional Prefix / Digit Filter Toggle for Area Codes */}
            {isAreaCode && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <button
                  onClick={() => setShowAdvancedDigits((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>
                    {showAdvancedDigits
                      ? 'Hide Starting Digit Filter'
                      : 'Filter by Starting Digits (Optional)'}
                  </span>
                </button>

                {showAdvancedDigits && (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700/80">
                        <span className="text-[11px] font-bold text-sky-400 whitespace-nowrap">
                          Starting Digits:
                        </span>
                        <input
                          type="text"
                          value={typedPrefix}
                          onChange={(e) => setTypedPrefix(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 0, 2, 21..."
                          className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                        />
                        {typedPrefix && (
                          <button
                            onClick={() => setTypedPrefix('')}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {availableDigitLengths.length > 1 && (
                        <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700/80">
                          <Hash className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <button
                            onClick={() => setDigitLengthFilter('all')}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                              digitLengthFilter === 'all'
                                ? 'bg-emerald-500 text-slate-950'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            All
                          </button>
                          {availableDigitLengths.map((len) => (
                            <button
                              key={len}
                              onClick={() => setDigitLengthFilter(String(len))}
                              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                                digitLengthFilter === String(len)
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {len}d
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {availableStartingDigits.length > 1 && (
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                        <span className="text-[10px] text-slate-400 font-semibold mr-1 shrink-0">
                          Quick Prefix:
                        </span>
                        <button
                          onClick={() => setTypedPrefix('')}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors border shrink-0 ${
                            typedPrefix === ''
                              ? 'bg-sky-500 text-white border-sky-400'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          All
                        </button>
                        {availableStartingDigits.map((digit) => (
                          <button
                            key={digit}
                            onClick={() => setTypedPrefix(typedPrefix === digit ? '' : digit)}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors border shrink-0 ${
                              typedPrefix === digit
                                ? 'bg-sky-500 text-white border-sky-400'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {digit}xx
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Large Dataset Confirmation Banner (Shown when user clicks Start on > 250 feature quizzes) */}
          {showLargeWarningConfirm && (
            <div className="bg-amber-950/90 border border-amber-500/70 rounded-xl p-3.5 space-y-2.5 animate-in zoom-in-95 duration-150">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-100 space-y-1">
                  <p className="font-bold text-amber-300">
                    Large GeoJSON Dataset ({effectiveQuestionCount} Regions)
                  </p>
                  <p className="text-amber-200/90 leading-relaxed">
                    Loading all high-detail polygons at once may cause a brief loading pause on mobile devices. Are you sure you want to continue?
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowLargeWarningConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={executeLaunchQuiz}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5"
                >
                  <span>Yes, Continue & Start Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Footer with Summary and Primary Launch Action */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 z-20">
          <div className="flex flex-col w-full sm:w-auto text-xs">
            <span className="text-slate-300 font-medium">
              <span className="text-sky-400 font-bold tabular-nums">{effectiveQuestionCount}</span> questions ready
              {!isWorldOrContinentScope && regionShapes.length > 1 && (
                <>
                  <span className="mx-1.5 text-slate-600">·</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{selectedGroups.size}</span>/{regionShapes.length} areas
                </>
              )}
            </span>
            {isPartialRun && mode === 'quiz' && (
              <span className="text-[10px] text-amber-400/90 font-medium">
                Custom / Level Practice (Does not overwrite full quiz mastery %)
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (isLargeDataset && !showLargeWarningConfirm) {
                sounds.playTap();
                setShowLargeWarningConfirm(true);
                return;
              }
              executeLaunchQuiz();
            }}
            disabled={effectiveQuestionCount === 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99]"
          >
            <span>
              {mode === 'quiz' ? 'Start Quiz on Globe' : 'Study Mode on Globe'} (
              {effectiveQuestionCount} Q)
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* POPUP OVERLAY: INTERACTIVE GREEN MAP REGION SELECTOR */}
        {showMapSelectorPopup && (
          <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-150">
            {/* Popup Header */}
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900 flex items-center justify-between gap-2 shrink-0">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  Interactive Area Filter
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                  Tap regions to include or exclude ({selectedGroups.size}/{regionShapes.length} selected)
                </h3>
              </div>
              <button
                onClick={() => setShowMapSelectorPopup(false)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done ({effectiveQuestionCount} Q)</span>
              </button>
            </div>

            {/* Parent Level Switcher inside the Map Popup (Strictly changes how the green map is grouped for filtering — NEVER overwrites the active quiz level!) */}
            {subdivisionLevels.length > 1 && (
              <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
                  Filter Map By:
                </span>
                {subdivisionLevels.map((lvl, idx) => {
                  const isActiveFilter = filterMapLevelIdx === idx;
                  const shortLabel = lvl.title
                    .replace(/^Subdivision\s+/i, '')
                    .replace(new RegExp(`,\\s*${country.name}`, 'i'), '');
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        sounds.playTap();
                        setFilterMapLevelIdx(idx);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border shrink-0 ${
                        isActiveFilter
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                      }`}
                    >
                      {shortLabel} ({lvl.targetCount})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Interactive SVG Map */}
            <div className="flex-1 relative bg-[#0c192c] flex flex-col min-h-0">
              {loading ? (
                <div className="flex-1 flex items-center justify-center text-sm text-slate-400 gap-2">
                  <MapIcon className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Loading interactive region map...</span>
                </div>
              ) : (
                <>
                  {hoveredRegion && (
                    <div className="absolute top-2.5 left-3 z-10 px-3 py-1 rounded-xl bg-slate-900/95 border border-sky-500/40 shadow-lg pointer-events-none">
                      <span className="text-xs font-bold text-sky-300">{hoveredRegion}</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 shadow-lg">
                    <button
                      onClick={() => setMapZoom((z) => Math.min(7, Number((z * 1.35).toFixed(2))))}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setMapZoom((z) => {
                          const next = Math.max(1, Number((z / 1.35).toFixed(2)));
                          if (next === 1) setMapPan({ x: 0, y: 0 });
                          return next;
                        })
                      }
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    {mapZoom > 1 && (
                      <button
                        onClick={() => {
                          setMapZoom(1);
                          setMapPan({ x: 0, y: 0 });
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-amber-400 transition-colors"
                        title="Reset Map View"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div
                    onWheel={handleSvgWheel}
                    onTouchStart={handleTouchStartSvg}
                    onTouchMove={handleTouchMoveSvg}
                    onTouchEnd={handleTouchEndSvg}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className="flex-1 w-full flex items-center justify-center p-2 overflow-hidden touch-none cursor-grab active:cursor-grabbing"
                  >
                    <svg
                      viewBox={`0 0 ${mapProjection.svgWidth} ${mapProjection.svgHeight}`}
                      className="w-full h-full select-none"
                    >
                      <g
                        ref={mapSvgGroupRef}
                        transform={`translate(${mapProjection.svgWidth / 2 + mapPan.x}, ${
                          mapProjection.svgHeight / 2 + mapPan.y
                        }) scale(${mapZoom}) translate(${-mapProjection.svgWidth / 2}, ${
                          -mapProjection.svgHeight / 2
                        })`}
                      >
                        {[...regionShapes]
                          .filter((s) => !s.isOutlying || regionShapes.length <= outlyingShapes.length)
                          .sort((a, b) => (b.bboxArea ?? 0) - (a.bboxArea ?? 0))
                          .map((shape) => {
                            const isSelected = selectedGroups.has(shape.name);
                            const isHovered = hoveredRegion === shape.name;

                            const pathD = shape.rings
                              .map((ring) => {
                                return (
                                  ring
                                    .map(([lng, lat], i) => {
                                      const [x, y] = mapProjection.project(lng, lat);
                                      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                                    })
                                    .join(' ') + ' Z'
                                );
                              })
                              .join(' ');

                            const [cx, cy] = mapProjection.project(
                              shape.centroid[0],
                              shape.centroid[1]
                            );

                            const displayLabel =
                              shape.code ||
                              (shape.name.length > 12 ? shape.name.slice(0, 10) + '.' : shape.name);

                            return (
                              <g
                                key={shape.name}
                                onClick={() => {
                                  if (!didDragMoveRef.current) {
                                    toggleRegion(shape.name);
                                  }
                                }}
                                onMouseEnter={() => setHoveredRegion(shape.name)}
                                onMouseLeave={() => setHoveredRegion(null)}
                                className="cursor-pointer transition-opacity"
                              >
                                <path
                                  d={pathD}
                                  fillRule="evenodd"
                                  fill={
                                    isSelected
                                      ? isHovered
                                        ? '#3fb950'
                                        : '#2ea043'
                                      : isHovered
                                      ? '#334155'
                                      : '#1e293b'
                                  }
                                  stroke="#090d16"
                                  strokeWidth={1.4 / Math.sqrt(mapZoom)}
                                  strokeLinejoin="round"
                                />
                                {shape.rings.length > 0 && regionShapes.length <= 85 && (
                                  <text
                                    x={cx}
                                    y={cy}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill={isSelected ? '#052e16' : '#94a3b8'}
                                    fontSize={
                                      (regionShapes.length > 35 ? 8.5 : 10) / Math.sqrt(mapZoom)
                                    }
                                    fontWeight="800"
                                    className="pointer-events-none select-none uppercase"
                                  >
                                    {displayLabel}
                                  </text>
                                )}
                              </g>
                            );
                          })}
                      </g>
                    </svg>
                  </div>

                  {outlyingShapes.length > 0 && (
                    <div className="px-3 py-1.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 shrink-0">
                        Outlying / Islands:
                      </span>
                      {outlyingShapes.map((sh) => {
                        const checked = selectedGroups.has(sh.name);
                        return (
                          <button
                            key={sh.name}
                            onClick={() => toggleRegion(sh.name)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border shrink-0 transition-colors ${
                              checked
                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {checked ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                            <span>{sh.code ? `${sh.code} (${sh.name})` : sh.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={selectAll}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 border border-slate-700 transition-colors"
                      >
                        Select All ({regionShapes.length})
                      </button>
                      <button
                        onClick={deselectAll}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 transition-colors"
                      >
                        Deselect All
                      </button>
                    </div>
                    <button
                      onClick={() => setShowMapSelectorPopup(false)}
                      className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow"
                    >
                      Confirm Selection ({effectiveQuestionCount} Q)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
