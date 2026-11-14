import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import {
  Search,
  Plus,
  Minus,
  RotateCcw,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  SkipForward,
  Award,
  BookOpen,
  Target,
  Clock,
  RefreshCw,
  Shield,
  Zap,
  Navigation,
  Languages
} from 'lucide-react';
import { CountryInfo, COUNTRIES_DATABASE } from '../data/countriesData';
import { SubdivisionQuizOption, getCountrySubdivisions } from '../data/countrySubdivisionCatalog';
import { SubdivisionFlag, getSubdivisionFlagImageUrl } from '../components/SubdivisionFlag';
import { CountryFlag, getCountryFlagDataUrl } from '../components/CountryFlag';
import { sounds } from '../utils/soundEngine';
import { geojsonCache, fisherYatesShuffle } from '../utils/geojsonCache';
import {
  getCitiesByScopeAndTier,
  CityPoint,
  calculateDistanceKm,
  calculateGeoScore
} from '../data/citiesDatabase';
import { db, QuizAttempt } from '../database/db';
import { LanguageSample } from '../language-learning/scriptData';
import { computeAreaCodeAtDepth, AreaCodeDepthLevel } from './RegionSelectorModal';

export interface GlobeQuizTargetItem {
  name: string;
  promptLabel?: string;
  code?: string;
  secondary?: string;
  localName?: string;
  parentGroup?: string;
  flagPrompt?: boolean;
  isCountryFlag?: boolean;
  lat?: number;
  lng?: number;
  cityTier?: number;
  countryCode?: string;
  countryName?: string;
  languageSample?: LanguageSample;
}

export interface ActiveGlobeQuizConfig {
  country: CountryInfo;
  quizOption: SubdivisionQuizOption;
  selectedGroups: string[];
  initialMode: 'quiz' | 'study';
  quizLangMode?: 'english' | 'native';
  quizDifficulty?: 'easy' | 'normal' | 'hard';
  endlessRetry?: boolean;
  multiCountries?: CountryInfo[];
  customCitiesPool?: CityPoint[];
  languageSamplesPool?: LanguageSample[];
  dailySubdivisionsPool?: Array<{ countryCode: string; countryName: string; name: string }>;
  dailyAreaCodesPool?: Array<{ countryCode: string; countryName: string; code: string }>;
  areaCodeDepth?: AreaCodeDepthLevel;
  areaCodeDepthByCountry?: Record<string, AreaCodeDepthLevel>;
  questionLimit?: number;
  countrySubdivisionOverrides?: Record<string, string>;
  isPartialRun?: boolean;
}

interface ParsedQuizFeature {
  id: string;
  featureName: string;
  shortLabel: string;
  areaCode?: string;
  parentGroup?: string;
  localName?: string;
  countryCode?: string;
  rings: number[][][]; // Array of outer rings [lng, lat][]
  holes?: number[][][][]; // Array of hole ring lists per outer ring
  spanArea?: number;
  spanDiag?: number;
  centroidLat: number;
  centroidLng: number;
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

interface WorldGlobeViewProps {
  selectedCountry: CountryInfo | null;
  onSelectCountry: (country: CountryInfo) => void;
  isPaused?: boolean;
  sensitivity?: number;
  appTheme?: 'dark' | 'light';
  activeQuizConfig?: ActiveGlobeQuizConfig | null;
  onExitQuiz?: () => void;
  onOpenQuizSettings?: () => void;
}

const MICROSTATES = new Set([
  'VA', 'MC', 'SM', 'LI', 'AD', 'MT', 'LU', 'SG', 'BH', 'BN', 'MV', 'BB', 'LC', 'VC', 'GD', 'AG', 'DM',
  'KN', 'ST', 'SC', 'KM', 'MU', 'NR', 'TV', 'PW', 'MH', 'FM', 'TO', 'WS', 'KI', 'HK', 'MO', 'GI',
  'BM', 'KY', 'VG', 'VI', 'AI', 'MS', 'BL', 'MF', 'SX', 'CW', 'AW', 'JE', 'GG', 'IM', 'FO', 'AX',
  'TT', 'CV', 'DJ', 'QA', 'KW', 'CY'
]);

/**
 * Compute official Country Mastery % (0-100) across all main country quizzes
 * (Level 1 Subdivisions + Full Area Codes + Cities + Extra/Flags), strictly
 * excluding partial runs, Level 2/3 subdivisions, multi-country, daily, and language quizzes.
 */
export function computeOfficialCountryMasteryPct(
  country: CountryInfo,
  attempts: QuizAttempt[]
): number {
  const cCode = country.id.toUpperCase();
  const validAttempts = attempts.filter((a) => {
    if (a.isPartialRun) return false;
    if (a.category === 'adm2' || a.category === 'adm3' || a.category === 'languages') return false;
    const qIdLower = (a.quizId || '').toLowerCase();
    if (
      qIdLower.includes('-practice') ||
      qIdLower.includes('-lvl1') ||
      qIdLower.includes('-lvl2') ||
      qIdLower.includes('adm2') ||
      qIdLower.includes('adm3') ||
      qIdLower.startsWith('lang-') ||
      qIdLower.startsWith('daily-') ||
      qIdLower.startsWith('world-') ||
      qIdLower.startsWith('cont-') ||
      qIdLower.startsWith('custom-')
    ) {
      return false;
    }
    return a.countryCode?.toUpperCase() === cCode;
  });

  if (validAttempts.length === 0) return 0;

  const baseQuizzes = getCountrySubdivisions(country).filter(
    (q) => q.category !== 'adm2' && q.category !== 'adm3'
  );
  const cities = getCitiesByScopeAndTier({ type: 'country', value: country.id }, 'hard');
  const officialQuizzes: SubdivisionQuizOption[] =
    cities.length >= 1
      ? [
          ...baseQuizzes,
          {
            id: `${country.id.toLowerCase()}-cities`,
            title: 'Cities',
            description: `Pinpoint ${cities.length} cities in ${country.name}`,
            category: 'cities',
            geojsonFile: '',
            levelKey: 'CITY_PIN',
            targetCount: cities.length,
            badge: 'Cities',
            color: 'amber'
          }
        ]
      : baseQuizzes;

  if (officialQuizzes.length === 0) return 0;

  let sumAccuracy = 0;
  for (const qOpt of officialQuizzes) {
    const candidateIds = new Set<string>([qOpt.id.toLowerCase()]);
    const candidateTitles = new Set<string>([
      qOpt.title.toLowerCase(),
      `${country.name} — ${qOpt.title}`.toLowerCase()
    ]);

    const matching = validAttempts.filter((att) => {
      const aId = (att.quizId || '').toLowerCase();
      const aTitle = (att.quizTitle || '').toLowerCase();
      if (qOpt.category === 'areacodes' && qOpt.targetCount > 15 && att.maxScore <= 10) {
        return false;
      }
      if (candidateIds.has(aId) || candidateTitles.has(aTitle)) return true;
      if (qOpt.category === 'adm1') {
        return (
          aId.startsWith(`${cCode.toLowerCase()}-adm1`) ||
          aId.startsWith(`${cCode.toLowerCase()}-subdivisions`) ||
          aId.includes('provinces') ||
          aId.includes('subdivision') ||
          aTitle.includes('subdivision') ||
          aTitle.includes('level 1:')
        );
      }
      if (qOpt.category === 'areacodes') {
        return (
          aId.includes('areacode') ||
          aTitle.includes('area code') ||
          Boolean(att.category?.toLowerCase().includes('area'))
        );
      }
      if (qOpt.category === 'cities') {
        return (
          aId.includes('-cities') ||
          aTitle.includes('cities') ||
          att.category?.toLowerCase() === 'cities'
        );
      }
      return false;
    });

    if (matching.length > 0) {
      const bestAcc = matching.reduce((max, cur) => {
        const trueAcc =
          cur.maxScore > 0
            ? Math.max(0, Math.min(100, Math.round((Math.min(cur.score, cur.maxScore) / cur.maxScore) * 100)))
            : Math.max(0, Math.min(100, cur.accuracy || 0));
        return Math.max(max, trueAcc);
      }, 0);
      sumAccuracy += bestAcc;
    }
  }

  return Math.max(0, Math.min(100, Math.round(sumAccuracy / officialQuizzes.length)));
}

/**
 * Helper to highlight distinctive characters inside a sample text (like image_3247aed5.png)
 */
function renderHighlightedLanguageText(sampleText: string, distinctiveChars: string[]) {
  if (!distinctiveChars || distinctiveChars.length === 0) {
    return <span>{sampleText}</span>;
  }
  const cleanChars = distinctiveChars
    .map((c) => c.trim())
    .filter((c) => c.length > 0 && c.length <= 4);
  if (cleanChars.length === 0) return <span>{sampleText}</span>;

  const escaped = cleanChars
    .sort((a, b) => b.length - a.length)
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = sampleText.split(regex);
  const lowerSet = new Set(cleanChars.map((c) => c.toLowerCase()));

  return (
    <>
      {parts.map((part, i) =>
        lowerSet.has(part.toLowerCase()) ? (
          <span
            key={i}
            className="px-1 py-0.5 mx-0.5 rounded bg-amber-500/25 text-amber-300 border-b-2 border-amber-400 font-bold"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export const WorldGlobeView: React.FC<WorldGlobeViewProps> = ({
  selectedCountry,
  onSelectCountry,
  isPaused = false,
  sensitivity = 1.0,
  appTheme = 'dark',
  activeQuizConfig = null,
  onExitQuiz,
  onOpenQuizSettings
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CountryInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Three.js scene & group refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const adm1DottedGroupRef = useRef<THREE.Group | null>(null);
  const adm1Tier1Ref = useRef<THREE.Object3D | null>(null);
  const adm1Tier2Ref = useRef<THREE.Object3D | null>(null);
  const adm1Tier3Ref = useRef<THREE.Object3D | null>(null);
  const quizOverlayGroupRef = useRef<THREE.Group | null>(null);
  const studyLabelsGroupRef = useRef<THREE.Group | null>(null);
  const cityGuessGroupRef = useRef<THREE.Group | null>(null);
  const heatmapGroupRef = useRef<THREE.Group | null>(null);
  const graticuleMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const countryBorderMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const lakeBorderMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const adm1DottedMatRef = useRef<THREE.LineBasicMaterial | null>(null);

  // Globe radius = 100; camera Z ranges from 100.38 (ultra-deep street/municipality zoom) to 380 (full planet)
  const GLOBE_RADIUS = 100;
  // Greenwich Meridian (0° Lat, 0° Lng) default rotation: Y = -Math.PI / 2, X = 0.22
  const targetRotationX = useRef(0.22);
  const targetRotationY = useRef(-Math.PI / 2);
  const targetCameraZ = useRef(295);

  const getHomeDefaultCameraZ = () => {
    const w = mountRef.current?.clientWidth || window.innerWidth;
    const h = Math.max(1, mountRef.current?.clientHeight || window.innerHeight);
    const aspect = w / h;
    return aspect < 1 ? Math.min(540, Math.round(290 / Math.max(0.45, aspect))) : 290;
  };

  // Saved framing view of the active quiz so Reset View returns to the middle of the active quiz!
  const quizDefaultViewRef = useRef<{ lat: number; lng: number; z: number } | null>(null);
  const quizMaxExtentKmRef = useRef<number>(14916);

  const allCountriesRef = useRef<CountryInfo[]>([]);
  const geoFeaturesRef = useRef<any[]>([]);
  const countryMapRef = useRef<Map<string, CountryInfo>>(new Map());
  const oceanMeshRef = useRef<THREE.Mesh | null>(null);
  const isPausedRef = useRef(isPaused);
  const sensitivityRef = useRef(sensitivity);
  const activeQuizConfigRef = useRef<ActiveGlobeQuizConfig | null>(activeQuizConfig);

  // Active Quiz State on the 3D Globe
  const [mode, setMode] = useState<'quiz' | 'study'>('quiz');
  const [difficultyMode, setDifficultyMode] = useState<'easy' | 'hard'>('easy');
  const [cityTier, setCityTier] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [endlessRetry, setEndlessRetry] = useState<boolean>(false);
  const [quizLangMode, setQuizLangMode] = useState<'english' | 'native'>('english');

  const [queue, setQueue] = useState<GlobeQuizTargetItem[]>([]);
  const [totalInitialCount, setTotalInitialCount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [firstTryScore, setFirstTryScore] = useState<number>(0);
  const [missedItemsMap, setMissedItemsMap] = useState<Map<string, GlobeQuizTargetItem>>(new Map());
  const [currentAttemptedWrong, setCurrentAttemptedWrong] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<
    'correct' | 'correct-after-mistake' | 'correct-recycled' | 'incorrect' | null
  >(null);
  const [wrongClickLabel, setWrongClickLabel] = useState<string | null>(null);
  const [isQuizDone, setIsQuizDone] = useState<boolean>(false);
  const [personalBestSec, setPersonalBestSec] = useState<number | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [isLangPromptMinimized, setIsLangPromptMinimized] = useState(false);
  const [isLangAnswerMinimized, setIsLangAnswerMinimized] = useState(false);
  const [showMasteryHeatmap, setShowMasteryHeatmap] = useState(false);
  const [reviewMissedIdx, setReviewMissedIdx] = useState<number | null>(null);
  const [isAutoReviewingMissed, setIsAutoReviewingMissed] = useState<boolean>(false);
  const isPracticeMissedRunRef = useRef<boolean>(false);

  // MapTap.gg City Pinpoint Guess State on 3D Globe
  const [cityGuessResult, setCityGuessResult] = useState<{
    cityName: string;
    distanceKm: number;
    points: number;
    guessLat: number;
    guessLng: number;
    trueLat: number;
    trueLng: number;
  } | null>(null);
  const [totalCityPoints, setTotalCityPoints] = useState<number>(0);

  // World Language Guesser Result State on 3D Globe (Clue Card with highlighted letters)
  const [languageGuessResult, setLanguageGuessResult] = useState<{
    isCorrect: boolean;
    clickedCountryName: string;
    sample: LanguageSample;
  } | null>(null);

  // Parsed active quiz features & meshes for fast 3D Globe polygon highlighting
  const parsedQuizFeaturesRef = useRef<ParsedQuizFeature[]>([]);
  const featureVisualsMapRef = useRef<
    Map<
      string,
      {
        meshes: THREE.Mesh[];
        lines: THREE.Line[];
        rings?: number[][][];
        holes?: number[][][][];
        spanDiag?: number;
        localCenter?: THREE.Vector3;
      }
    >
  >(new Map());
  const solvedSetRef = useRef<Set<string>>(new Set());
  const solvedWithMistakeSetRef = useRef<Set<string>>(new Set());
  const solvedRecycledOrangeSetRef = useRef<Set<string>>(new Set());
  const wrongFlashTimeoutsRef = useRef<Map<string, number>>(new Map());
  const hintBlinkIntervalRef = useRef<number | null>(null);

  // Sync refs for event listeners (prevents stale closure in Three.js pointerup handler!)
  const queueRef = useRef<GlobeQuizTargetItem[]>([]);
  const currentIndexRef = useRef<number>(0);
  const firstTryScoreRef = useRef<number>(0);
  const totalCityPointsRef = useRef<number>(0);
  const timerSecondsRef = useRef<number>(0);
  const totalInitialCountRef = useRef<number>(0);
  const missedItemsMapRef = useRef<Map<string, GlobeQuizTargetItem>>(new Map());
  const modeRef = useRef<'quiz' | 'study'>('quiz');
  const difficultyModeRef = useRef<'easy' | 'hard'>('easy');
  const endlessRetryRef = useRef<boolean>(false);
  const currentAttemptedWrongRef = useRef<boolean>(false);
  const isAdvancingQuestionRef = useRef<boolean>(false);
  const scoredTargetIndicesRef = useRef<Set<number>>(new Set());
  const cityGuessResultRef = useRef<any>(null);
  const languageGuessResultRef = useRef<any>(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (!isPaused && mountRef.current && rendererRef.current && cameraRef.current) {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    }
  }, [isPaused]);
  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);
  useEffect(() => {
    activeQuizConfigRef.current = activeQuizConfig;
  }, [activeQuizConfig]);
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    firstTryScoreRef.current = firstTryScore;
  }, [firstTryScore]);
  useEffect(() => {
    totalCityPointsRef.current = totalCityPoints;
  }, [totalCityPoints]);
  useEffect(() => {
    timerSecondsRef.current = timerSeconds;
  }, [timerSeconds]);
  useEffect(() => {
    totalInitialCountRef.current = totalInitialCount;
  }, [totalInitialCount]);
  useEffect(() => {
    missedItemsMapRef.current = missedItemsMap;
  }, [missedItemsMap]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    difficultyModeRef.current = difficultyMode;
  }, [difficultyMode]);
  useEffect(() => {
    endlessRetryRef.current = endlessRetry;
  }, [endlessRetry]);
  useEffect(() => {
    currentAttemptedWrongRef.current = currentAttemptedWrong;
  }, [currentAttemptedWrong]);
  useEffect(() => {
    cityGuessResultRef.current = cityGuessResult;
  }, [cityGuessResult]);
  useEffect(() => {
    languageGuessResultRef.current = languageGuessResult;
  }, [languageGuessResult]);

  const isCitiesQuiz =
    !!activeQuizConfig &&
    (activeQuizConfig.quizOption.category === 'cities' ||
      activeQuizConfig.quizOption.levelKey === 'CITY_PIN' ||
      activeQuizConfig.quizOption.id.includes('-cities'));

  const isLanguageGlobeQuiz =
    !!activeQuizConfig &&
    (activeQuizConfig.quizOption.category === 'languages' ||
      activeQuizConfig.quizOption.levelKey === 'LANGUAGE_GUESS' ||
      Boolean(
        activeQuizConfig.languageSamplesPool && activeQuizConfig.languageSamplesPool.length > 0
      ));

  const hasAnyLocalScript = queue.some((q) => Boolean(q.localName));

  // Chronometer Timer (counts up, no time limit)
  useEffect(() => {
    if (!activeQuizConfig || !timerActive || isQuizDone || mode === 'study') return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuizConfig, timerActive, isQuizDone, mode]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Point in 2D polygon raycasting check
  const isPointInPolygon = (pt: [number, number], ring: number[][]): boolean => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; i++) {
      const xi = ring[i][0],
        yi = ring[i][1];
      const xj = ring[j][0],
        yj = ring[j][1];
      const intersect =
        yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
      j = i;
    }
    return inside;
  };

  // Convert Geo Coordinates (lat, lng) to 3D Sphere Position
  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  /**
   * Subdivide long 2D GeoJSON segments along the sphere so long straight segments
   * (like Australia's outback borders or US/Canada state borders) NEVER dip below the ocean surface!
   */
  const buildSphericalRingPoints = (
    ring: number[][],
    radius: number,
    maxStepDeg = 0.85,
    closeLoop = true
  ): THREE.Vector3[] => {
    const pts: THREE.Vector3[] = [];
    if (!ring || ring.length < 2) return pts;

    const total = ring.length;
    for (let i = 0; i < total; i++) {
      const [lng1, lat1] = ring[i];
      pts.push(latLngToVector3(lat1, lng1, radius));

      const nextIdx = i + 1 < total ? i + 1 : closeLoop ? 0 : -1;
      if (nextIdx === -1) break;

      const [lng2, lat2] = ring[nextIdx];
      const dLng = lng2 - lng1;
      const dLat = lat2 - lat1;
      // Only interpolate if not jumping across the 180° antimeridian
      if (Math.abs(dLng) < 150) {
        const distDeg = Math.hypot(dLng, dLat);
        if (distDeg > maxStepDeg) {
          const steps = Math.min(45, Math.ceil(distDeg / maxStepDeg));
          for (let s = 1; s < steps; s++) {
            const t = s / steps;
            pts.push(latLngToVector3(lat1 + dLat * t, lng1 + dLng * t, radius));
          }
        }
      }
    }
    if (closeLoop && ring.length > 0) {
      pts.push(latLngToVector3(ring[0][1], ring[0][0], radius));
    }
    return pts;
  };

  /**
   * Build a curved spherical polygon mesh by triangulating in 2D (lng, lat) and recursively
   * subdividing any triangle whose edge exceeds `maxEdgeDeg` before projecting onto the sphere.
   * Prevents large flat triangles (e.g. Montana, Iowa, Texas) from dipping inside the ocean sphere!
   */
  const createSphericalPolygonGeometry = (
    ring: number[][],
    radius: number,
    maxEdgeDeg = 1.45,
    holes: number[][][] = []
  ): THREE.BufferGeometry | null => {
    if (!ring || ring.length < 3) return null;
    const cleanRingToVec2 = (rawRing: number[][]): THREE.Vector2[] => {
      const pts: THREE.Vector2[] = [];
      for (let i = 0; i < rawRing.length; i++) {
        const [lng, lat] = rawRing[i];
        if (i === rawRing.length - 1 && pts.length > 0) {
          if (Math.hypot(lng - pts[0].x, lat - pts[0].y) < 1e-5) continue;
        }
        if (
          pts.length === 0 ||
          Math.hypot(lng - pts[pts.length - 1].x, lat - pts[pts.length - 1].y) > 1e-5
        ) {
          pts.push(new THREE.Vector2(lng, lat));
        }
      }
      return pts;
    };

    const cleanPts = cleanRingToVec2(ring);
    if (cleanPts.length < 3) return null;

    // Skip polygons that cross the antimeridian (-180 / +180)
    let minX = 180,
      maxX = -180;
    for (const p of cleanPts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
    }
    if (maxX - minX > 160) return null;

    const cleanHoles: THREE.Vector2[][] = [];
    if (holes && holes.length > 0) {
      for (const hRing of holes) {
        const hPts = cleanRingToVec2(hRing);
        if (hPts.length >= 3) {
          cleanHoles.push(hPts);
        }
      }
    }

    let faces: number[][] = [];
    let usedHoles = false;
    if (cleanHoles.length > 0) {
      try {
        faces = THREE.ShapeUtils.triangulateShape(cleanPts, cleanHoles);
        usedHoles = Boolean(faces && faces.length > 0);
      } catch {
        faces = [];
      }
    }
    if (!faces || faces.length === 0) {
      try {
        faces = THREE.ShapeUtils.triangulateShape(cleanPts, []);
        usedHoles = false;
      } catch {
        return null;
      }
    }
    if (!faces || faces.length === 0) return null;

    const allPts = usedHoles ? cleanPts.concat(...cleanHoles) : cleanPts;
    const positions: number[] = [];

    const subdivideTri = (
      ax: number,
      ay: number,
      bx: number,
      by: number,
      cx: number,
      cy: number,
      depth: number
    ) => {
      const dab = Math.hypot(bx - ax, by - ay);
      const dbc = Math.hypot(cx - bx, cy - by);
      const dca = Math.hypot(ax - cx, ay - cy);
      const maxD = Math.max(dab, dbc, dca);

      if (maxD <= maxEdgeDeg || depth >= 5) {
        const va = latLngToVector3(ay, ax, radius);
        const vb = latLngToVector3(by, bx, radius);
        const vc = latLngToVector3(cy, cx, radius);
        positions.push(va.x, va.y, va.z, vb.x, vb.y, vb.z, vc.x, vc.y, vc.z);
        return;
      }

      if (dab >= dbc && dab >= dca) {
        const mx = (ax + bx) * 0.5;
        const my = (ay + by) * 0.5;
        subdivideTri(ax, ay, mx, my, cx, cy, depth + 1);
        subdivideTri(mx, my, bx, by, cx, cy, depth + 1);
      } else if (dbc >= dab && dbc >= dca) {
        const mx = (bx + cx) * 0.5;
        const my = (by + cy) * 0.5;
        subdivideTri(ax, ay, bx, by, mx, my, depth + 1);
        subdivideTri(ax, ay, mx, my, cx, cy, depth + 1);
      } else {
        const mx = (cx + ax) * 0.5;
        const my = (cy + ay) * 0.5;
        subdivideTri(ax, ay, bx, by, mx, my, depth + 1);
        subdivideTri(mx, my, bx, by, cx, cy, depth + 1);
      }
    };

    for (let i = 0; i < faces.length; i++) {
      const [i0, i1, i2] = faces[i];
      const p0 = allPts[i0];
      const p1 = allPts[i1];
      const p2 = allPts[i2];
      if (!p0 || !p1 || !p2) continue;
      subdivideTri(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, 0);
    }

    if (positions.length === 0) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  };

  // Rotate and zoom globe to frame a coordinate or bounding box
  const flyToLatLng = (lat: number, lng: number, cameraZ?: number) => {
    const phi = (lat * Math.PI) / 180;
    const theta = (lng * Math.PI) / 180;
    targetRotationX.current = Math.max(-1.48, Math.min(1.48, phi));
    targetRotationY.current = -theta - Math.PI / 2;
    if (cameraZ !== undefined) {
      targetCameraZ.current = Math.max(100.38, Math.min(580, cameraZ));
    }
  };

  // Resolve country from geographical coordinates (lat, lng) — Generous zoom-aware hit area for Microstates so they are effortless to click!
  const findCountryAtCoordinates = (lat: number, lng: number): CountryInfo | null => {
    // 1. Check if user tapped on or near a microstate (zoom-scaled hit radius: ~1.25° at world view, ~0.45° zoomed in)
    const camAltRatio = Math.max(0.35, Math.min(1.35, (targetCameraZ.current - GLOBE_RADIUS) / 70));
    let closestMicro: CountryInfo | null = null;
    let minMicroD = 1.2 * camAltRatio;
    for (const c of countryMapRef.current.values()) {
      if (MICROSTATES.has(c.id)) {
        const d = Math.hypot(c.lat - lat, c.lng - lng);
        if (d < minMicroD) {
          minMicroD = d;
          closestMicro = c;
        }
      }
    }
    if (closestMicro) return closestMicro;

    // 2. Check exact country polygon containment (Italy landmass -> Italy, never Vatican!)
    const features = geoFeaturesRef.current;
    if (features && features.length > 0) {
      for (const f of features) {
        const geom = f.geometry;
        if (!geom) continue;

        let matched = false;
        if (geom.type === 'Polygon') {
          if (geom.coordinates?.[0] && isPointInPolygon([lng, lat], geom.coordinates[0])) {
            matched = true;
          }
        } else if (geom.type === 'MultiPolygon') {
          if (geom.coordinates) {
            for (const poly of geom.coordinates) {
              if (poly?.[0] && isPointInPolygon([lng, lat], poly[0])) {
                matched = true;
                break;
              }
            }
          }
        }

        if (matched) {
          const props = f.properties || {};
          const iso2 = props.ISO_A2 || props.iso_a2 || '';
          if (iso2 && countryMapRef.current.has(iso2)) {
            return countryMapRef.current.get(iso2)!;
          }
          if (iso2 && COUNTRIES_DATABASE[iso2]) {
            return COUNTRIES_DATABASE[iso2];
          }
          const iso3 = props.ISO_A3 || props.iso_a3 || '';
          const name = props.NAME || props.name || '';
          const dbMatch = Object.values(COUNTRIES_DATABASE).find(
            (c) =>
              c.iso3?.toUpperCase() === iso3?.toUpperCase() ||
              c.name.toLowerCase() === name.toLowerCase()
          );
          if (dbMatch) return dbMatch;
        }
      }
    }

    // 3. Fallback for small ocean islands within 1.8 degrees
    let closest: CountryInfo | null = null;
    let minD = 1.8;
    for (const c of countryMapRef.current.values()) {
      if (c.id === 'VA') continue;
      const d = Math.hypot(c.lat - lat, c.lng - lng);
      if (d < minD) {
        minD = d;
        closest = c;
      }
    }
    return closest;
  };

  // Properly free WebGL GPU BufferGeometries, Materials, and Sprite CanvasTextures to prevent mobile browser crashes!
  const disposeGroupChildren = (grp: THREE.Group | null) => {
    if (!grp) return;
    while (grp.children.length > 0) {
      const child = grp.children[0] as any;
      grp.remove(child);
      if (child.geometry && typeof child.geometry.dispose === 'function') {
        child.geometry.dispose();
      }
      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m: any) => {
          if (m.map && typeof m.map.dispose === 'function') {
            m.map.dispose();
          }
          if (typeof m.dispose === 'function') {
            m.dispose();
          }
        });
      }
    }
  };

  // Find ALL active quiz polygon features at (lat, lng) on the 3D Globe
  // STRICT hole-aware & innermost-enclave-only containment:
  // 1. Clicking inside a wrong province NEVER counts as correct (no proximity/neighbor assist when inside a polygon).
  // 2. Clicking inside an enclave (e.g. Brussels inside Flanders, Osh City inside Osh, Vienna inside Lower Austria) ONLY returns the enclave and NEVER the surrounding parent polygon!
  const findAllQuizFeaturesAtCoordinates = (lat: number, lng: number): ParsedQuizFeature[] => {
    const features = parsedQuizFeaturesRef.current;
    if (!features || features.length === 0) return [];

    const cosLat = Math.max(0.25, Math.cos((lat * Math.PI) / 180));
    const exactMatchEntries: Array<{
      pf: ParsedQuizFeature;
      area: number;
    }> = [];

    // 1. Strict hole-aware point-in-polygon containment check across ALL features
    for (const pf of features) {
      const [minLng, minLat, maxLng, maxLat] = pf.bbox;
      if (lng < minLng - 0.005 || lng > maxLng + 0.005 || lat < minLat - 0.005 || lat > maxLat + 0.005) {
        continue;
      }
      for (let rIdx = 0; rIdx < pf.rings.length; rIdx++) {
        const ring = pf.rings[rIdx];
        if (isPointInPolygon([lng, lat], ring)) {
          const ringHoles = pf.holes?.[rIdx] || [];
          const inHole = ringHoles.some((hRing) => isPointInPolygon([lng, lat], hRing));
          // If the click is inside a cutout hole (such as Brussels inside Flanders), NEVER match the outer polygon!
          if (inHole) continue;
          const area =
            pf.spanArea ??
            Math.max(1e-6, (maxLng - minLng) * cosLat * (maxLat - minLat));
          exactMatchEntries.push({ pf, area });
          break;
        }
      }
    }

    if (exactMatchEntries.length > 0) {
      // Sort smallest polygon area first so enclaves always beat surrounding polygons
      exactMatchEntries.sort((a, b) => a.area - b.area);
      const smallestArea = exactMatchEntries[0].area;
      // Return ONLY the innermost polygon(s) of virtually identical area (within 8%),
      // so a surrounding region (like Flanders around Brussels) is NEVER returned when clicking inside the enclave,
      // while identical overlapping area-code polygons still work.
      return exactMatchEntries
        .filter((e) => e.area <= smallestArea * 1.08)
        .map((e) => e.pf);
    }

    // 2. Fallback ONLY when clicking in water/coastline outside ALL polygons (for tiny island microstates)
    const camAltRatio = Math.max(0.15, Math.min(1.0, (targetCameraZ.current - GLOBE_RADIUS) / 85));
    const fallbackMatches: Array<{ pf: ParsedQuizFeature; dist: number }> = [];
    for (const pf of features) {
      const [minLng, minLat, maxLng, maxLat] = pf.bbox;
      const spanDiag =
        pf.spanDiag ?? Math.hypot((maxLng - minLng) * cosLat, maxLat - minLat);
      const isMicro = Boolean(pf.countryCode && MICROSTATES.has(pf.countryCode));
      if (!isMicro && spanDiag >= 0.45) continue;
      const maxFallbackRadius = (isMicro ? 0.65 : 0.14) * camAltRatio;
      const d = Math.hypot((pf.centroidLng - lng) * cosLat, pf.centroidLat - lat);
      if (d <= maxFallbackRadius) {
        fallbackMatches.push({ pf, dist: d });
      }
    }
    fallbackMatches.sort((a, b) => a.dist - b.dist);
    return fallbackMatches.length > 0 ? [fallbackMatches[0].pf] : [];
  };

  // Find primary active quiz polygon feature at (lat, lng) on the 3D Globe
  const findQuizFeatureAtCoordinates = (lat: number, lng: number): ParsedQuizFeature | null => {
    const all = findAllQuizFeaturesAtCoordinates(lat, lng);
    return all.length > 0 ? all[0] : null;
  };

  // Helper to update a quiz feature's 3D fill and border color on the Globe
  // Lazily builds spherical interior fill meshes on-demand for large maps (>1,800 polygons) so every right answer fills in solid green!
  const setQuizFeatureColor = (
    featureName: string,
    fillHex: number,
    fillOpacity: number,
    lineHex: number,
    lineOpacity: number = 0.95
  ) => {
    const vis = featureVisualsMapRef.current.get(featureName.toLowerCase());
    if (!vis) return;

    if (
      vis.meshes.length === 0 &&
      vis.rings &&
      vis.rings.length > 0 &&
      quizOverlayGroupRef.current &&
      fillOpacity > 0.05
    ) {
      const overlayGrp = quizOverlayGroupRef.current;
      const fDiag = vis.spanDiag ?? 2.0;
      const meshRenderOrder = fDiag < 0.38 ? 6 : fDiag < 0.95 ? 4 : 2;
      vis.rings.forEach((decimatedRing, rIdx) => {
        let rMinX = 180,
          rMaxX = -180,
          rMinY = 90,
          rMaxY = -90;
        for (let ri = 0; ri < decimatedRing.length; ri++) {
          const rx = decimatedRing[ri][0];
          const ry = decimatedRing[ri][1];
          if (rx < rMinX) rMinX = rx;
          if (rx > rMaxX) rMaxX = rx;
          if (ry < rMinY) rMinY = ry;
          if (ry > rMaxY) rMaxY = ry;
        }
        const ringSpanDeg = Math.hypot(rMaxX - rMinX, rMaxY - rMinY);
        const rSpanLng = rMaxX - rMinX;
        if (decimatedRing.length >= 3 && rSpanLng < 165 && ringSpanDeg < 135) {
          const subStep = ringSpanDeg > 12 ? 1.35 : 1.75;
          const ringHoles = vis.holes?.[rIdx] || [];
          const sGeo = createSphericalPolygonGeometry(
            decimatedRing,
            GLOBE_RADIUS + 0.08,
            subStep,
            ringHoles
          );
          if (sGeo) {
            const fillMat = new THREE.MeshBasicMaterial({
              color: fillHex,
              transparent: true,
              opacity: fillOpacity,
              side: THREE.DoubleSide,
              depthWrite: false
            });
            const meshObj = new THREE.Mesh(sGeo, fillMat);
            meshObj.renderOrder = meshRenderOrder;
            const ringCenterVec = latLngToVector3(
              (rMinY + rMaxY) * 0.5,
              (rMinX + rMaxX) * 0.5,
              GLOBE_RADIUS
            );
            meshObj.userData = { localCenter: ringCenterVec };
            overlayGrp.add(meshObj);
            vis.meshes.push(meshObj);
          }
        }
      });
    }

    vis.meshes.forEach((m) => {
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.color.setHex(fillHex);
      mat.opacity = fillOpacity;
    });
    vis.lines.forEach((l) => {
      const mat = l.material as THREE.LineBasicMaterial;
      mat.color.setHex(lineHex);
      mat.opacity = lineOpacity;
    });
  };

  const stopHintBlink = () => {
    if (hintBlinkIntervalRef.current !== null) {
      window.clearInterval(hintBlinkIntervalRef.current);
      hintBlinkIntervalRef.current = null;
    }
  };

  const startPolygonBlink = (
    featureName: string,
    finalFillHex: number,
    finalLineHex: number
  ) => {
    stopHintBlink();
    let step = 0;
    setQuizFeatureColor(featureName, finalFillHex, 0.88, finalLineHex, 1.0);
    hintBlinkIntervalRef.current = window.setInterval(() => {
      step++;
      if (step >= 8) {
        stopHintBlink();
        setQuizFeatureColor(featureName, finalFillHex, 0.85, finalLineHex, 1.0);
        return;
      }
      if (step % 2 === 1) {
        setQuizFeatureColor(featureName, 0x0f172a, 0.16, 0x10b981, 1.0);
      } else {
        setQuizFeatureColor(featureName, finalFillHex, 0.9, finalLineHex, 1.0);
      }
    }, 240);
  };

  // Create a crisp, large 3D text label sprite for Study Mode ("Learn") on the 3D Globe
  const createTextSprite = (
    text: string,
    subText?: string,
    borderStrokeColor: string = 'rgba(56, 189, 248, 0.95)'
  ): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    canvas.width = 340;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
    ctx.strokeStyle = borderStrokeColor;
    ctx.lineWidth = 4;
    const rx = 14,
      ry = 14,
      rw = 312,
      rh = subText ? 96 : 76,
      rad = 18;
    ctx.beginPath();
    ctx.moveTo(rx + rad, ry);
    ctx.lineTo(rx + rw - rad, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
    ctx.lineTo(rx + rw, ry + rh - rad);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
    ctx.lineTo(rx + rad, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
    ctx.lineTo(rx, ry + rad);
    ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = text.length > 17 ? text.slice(0, 16) + '…' : text;
    ctx.fillText(label, 170, subText ? 46 : 52);

    if (subText) {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 23px JetBrains Mono, monospace';
      const sub = subText.length > 19 ? subText.slice(0, 18) + '…' : subText;
      ctx.fillText(sub, 170, 84);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.renderOrder = 20;
    return sprite;
  };

  // Crisp 2D Pinpoint Dot Sprite for Cities Study Mode — always visible at exact (lat, lng)
  const createCityDotSprite = (dotHexCss: string, tierNum: number): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 64, 64);

    // Outer dark halo for contrast against any map border or fill
    ctx.beginPath();
    ctx.arc(32, 32, 23, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.96)';
    ctx.fill();

    // Main tier-colored circle
    ctx.beginPath();
    ctx.arc(32, 32, 17, 0, Math.PI * 2);
    ctx.fillStyle = dotHexCss;
    ctx.fill();

    // Crisp white inner pinpoint core
    ctx.beginPath();
    ctx.arc(32, 32, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.userData = { isCityStudyDot: true, tier: tierNum };
    sprite.renderOrder = 35 + (6 - tierNum);
    return sprite;
  };

  // Crisp, High-Readability City Name Pill Sprite for Cities Study Mode — scales smoothly with zoom
  const createCityStudyLabelSprite = (
    text: string,
    borderStrokeColor: string,
    tierNum: number
  ): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 110;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const label = text.length > 20 ? text.slice(0, 19) + '…' : text;
    ctx.font = 'bold 44px Inter, system-ui, sans-serif';
    const textW = Math.ceil(ctx.measureText(label).width);
    const pillW = Math.min(428, Math.max(140, textW + 48));
    const pillH = 82;
    const rx = Math.round((440 - pillW) / 2);
    const ry = 14;
    const rad = 20;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.94)';
    ctx.strokeStyle = borderStrokeColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(rx + rad, ry);
    ctx.lineTo(rx + pillW - rad, ry);
    ctx.quadraticCurveTo(rx + pillW, ry, rx + pillW, ry + rad);
    ctx.lineTo(rx + pillW, ry + pillH - rad);
    ctx.quadraticCurveTo(rx + pillW, ry + pillH, rx + pillW - rad, ry + pillH);
    ctx.lineTo(rx + rad, ry + pillH);
    ctx.quadraticCurveTo(rx, ry + pillH, rx, ry + pillH - rad);
    ctx.lineTo(rx, ry + rad);
    ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 220, ry + pillH / 2 + 1);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.userData = { isCityStudyLabel: true, tier: tierNum };
    sprite.renderOrder = 25 + (6 - tierNum);
    return sprite;
  };

  // Create a crisp 3D Flag Sprite for Flag Study Mode on the 3D Globe (supports both Country Flags and US/CA/MY/ES/BE State/Provincial Flags!)
  const createFlagSprite = (
    countryCode: string,
    fallbackLabel: string,
    customFlagUrl?: string
  ): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 264;
    const ctx = canvas.getContext('2d')!;

    const drawFrame = (img?: HTMLImageElement) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(2, 6, 23, 0.94)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.92)';
      ctx.lineWidth = 6;
      const rx = 24,
        ry = 14,
        rw = 312,
        rh = customFlagUrl ? 232 : 196,
        rad = 22;
      ctx.beginPath();
      ctx.moveTo(rx + rad, ry);
      ctx.lineTo(rx + rw - rad, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
      ctx.lineTo(rx + rw, ry + rh - rad);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
      ctx.lineTo(rx + rad, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
      ctx.lineTo(rx, ry + rad);
      ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (img) {
        const boxX = rx + 14;
        const boxY = ry + 12;
        const boxW = rw - 28;
        const boxH = customFlagUrl ? 164 : rh - 24;
        const natW = img.naturalWidth || img.width || boxW;
        const natH = img.naturalHeight || img.height || boxH;
        const scale = Math.min(boxW / natW, boxH / natH);
        const drawW = Math.round(natW * scale);
        const drawH = Math.round(natH * scale);
        const drawX = Math.round(boxX + (boxW - drawW) / 2);
        const drawY = Math.round(boxY + (boxH - drawH) / 2);
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        if (customFlagUrl && fallbackLabel) {
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 28px Inter, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const shortLbl =
            fallbackLabel.length > 15 ? fallbackLabel.slice(0, 14) + '…' : fallbackLabel;
          ctx.fillText(shortLbl, 180, ry + rh - 24);
        }
      } else {
        const flagEmj =
          countryCode && countryCode.length === 2
            ? String.fromCodePoint(
                ...[...countryCode.toUpperCase()].map((c) => 127397 + c.charCodeAt(0))
              )
            : '🏳️';
        ctx.font = '96px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(flagEmj, 180, 90);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 28px Inter, system-ui, sans-serif';
        ctx.fillText((fallbackLabel || countryCode).slice(0, 13), 180, 168);
      }
    };

    drawFrame();
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const targetUrl =
      customFlagUrl ||
      (countryCode && countryCode.length === 2
        ? getCountryFlagDataUrl(countryCode)
        : '');

    if (targetUrl) {
      const img = new Image();
      if (!targetUrl.startsWith('data:') && !targetUrl.startsWith('/')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        drawFrame(img);
        texture.needsUpdate = true;
      };
      img.src = targetUrl;
    }

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.userData = { isFlagSprite: true };
    sprite.renderOrder = 20;
    return sprite;
  };

  // Draw MapTap.gg style City Guess Pin, True City Pin, and Connecting Arc on the 3D Globe
  const renderCityGuessOnGlobe = (
    guessLat: number,
    guessLng: number,
    trueLat: number,
    trueLng: number,
    hadMistakeOrHint: boolean = false
  ) => {
    const grp = cityGuessGroupRef.current;
    if (!grp) return;
    while (grp.children.length > 0) {
      grp.remove(grp.children[0]);
    }

    const r = GLOBE_RADIUS + 0.25;
    const guessPos = latLngToVector3(guessLat, guessLng, r);
    const truePos = latLngToVector3(trueLat, trueLng, r);

    const altScale = Math.max(0.12, Math.min(1.2, (targetCameraZ.current - GLOBE_RADIUS) / 80));

    const guessGeo = new THREE.SphereGeometry(0.65 * altScale, 16, 16);
    const guessMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const guessMesh = new THREE.Mesh(guessGeo, guessMat);
    guessMesh.position.copy(guessPos);
    grp.add(guessMesh);

    const trueGeo = new THREE.SphereGeometry(0.75 * altScale, 16, 16);
    const trueMat = new THREE.MeshBasicMaterial({ color: hadMistakeOrHint ? 0xef4444 : 0x10b981 });
    const trueMesh = new THREE.Mesh(trueGeo, trueMat);
    trueMesh.position.copy(truePos);
    grp.add(trueMesh);

    const arcPoints: THREE.Vector3[] = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const v = new THREE.Vector3().lerpVectors(guessPos, truePos, t).normalize();
      const arcBoost = Math.sin(t * Math.PI) * Math.min(4.0, guessPos.distanceTo(truePos) * 0.15);
      v.multiplyScalar(r + 0.15 + arcBoost);
      arcPoints.push(v);
    }
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 2 });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    grp.add(arcLine);
  };

  // Initialize Three.js Globe Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(appTheme === 'light' ? 0xe2e8f0 : 0x121214);
    sceneRef.current = scene;

    // Near clipping plane at 0.05 allows ultra-close zoom (cameraZ = 100.38 on radius 100) and far plane 1800 allows full globe zoom-out
    if (!activeQuizConfigRef.current) {
      targetCameraZ.current = getHomeDefaultCameraZ();
    }
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.05, 1800);
    camera.position.set(0, 0, targetCameraZ.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    // Master Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Matte Ocean Sphere (Adapts to Dark Mode vs Light Mode)
    const oceanGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 72, 54);
    const oceanMat = new THREE.MeshBasicMaterial({
      color: appTheme === 'light' ? 0xdbeafe : 0x091322
    });
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    globeGroup.add(oceanMesh);
    oceanMeshRef.current = oceanMesh;

    // Subtle Atmospheric Rim
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.018, 48, 36);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // Subtle Graticule Grid
    const graticuleMat = new THREE.LineBasicMaterial({
      color: appTheme === 'light' ? 0x93c5fd : 0x27272a,
      transparent: true,
      opacity: 0.35
    });
    graticuleMatRef.current = graticuleMat;
    for (let lat = -60; lat <= 60; lat += 30) {
      const radius = GLOBE_RADIUS * Math.cos((lat * Math.PI) / 180);
      const y = GLOBE_RADIUS * Math.sin((lat * Math.PI) / 180);
      const circleGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(radius * Math.cos(theta), y, radius * Math.sin(theta)));
      }
      circleGeo.setFromPoints(points);
      globeGroup.add(new THREE.Line(circleGeo, graticuleMat));
    }

    // Sub-groups for Country Pins, Zoom-Responsive Dotted Adm1 Outlines, Active Quiz Polygons, Study Mode Labels, and City Guess Pins
    const adm1DottedGroup = new THREE.Group();
    globeGroup.add(adm1DottedGroup);
    adm1DottedGroupRef.current = adm1DottedGroup;

    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    const quizOverlayGroup = new THREE.Group();
    globeGroup.add(quizOverlayGroup);
    quizOverlayGroupRef.current = quizOverlayGroup;

    const studyLabelsGroup = new THREE.Group();
    globeGroup.add(studyLabelsGroup);
    studyLabelsGroupRef.current = studyLabelsGroup;

    const cityGuessGroup = new THREE.Group();
    globeGroup.add(cityGuessGroup);
    cityGuessGroupRef.current = cityGuessGroup;

    const heatmapGroup = new THREE.Group();
    globeGroup.add(heatmapGroup);
    heatmapGroupRef.current = heatmapGroup;

    const pinGeo = new THREE.SphereGeometry(0.85, 10, 10);

    // 1. Load High-Detail World Countries GeoJSON/TopoJSON onto the 3D Globe (Merged into 1 GPU BufferGeometry for 60 FPS!)
    geojsonCache
      .fetchGeoJSON('/maps/world/countries.geojson')
      .then((data) => {
        geoFeaturesRef.current = data.features || [];

        const countryMap = new Map<string, CountryInfo>();
        Object.values(COUNTRIES_DATABASE).forEach((c) => {
          countryMap.set(c.id, c);
        });
        countryMapRef.current = countryMap;

        const segmentVertices: number[] = [];

        (data.features || []).forEach((f: any) => {
          const geom = f.geometry;
          const props = f.properties || {};
          const iso2 = props.ISO_A2 || props.iso_a2 || '';
          const iso3 = props.ISO_A3 || props.iso_a3 || '';
          const name = props.NAME || props.name || 'Country';
          if (!geom) return;

          let centroidLat = 0;
          let centroidLng = 0;
          let pointCount = 0;

          const appendRingSegments = (coords: number[][]) => {
            if (!coords || coords.length < 2) return;
            const spherePts = buildSphericalRingPoints(coords, GLOBE_RADIUS + 0.05, 1.1, true);
            for (let i = 0; i < spherePts.length - 1; i++) {
              const p1 = spherePts[i];
              const p2 = spherePts[i + 1];
              segmentVertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
            }
            coords.forEach(([lng, lat]) => {
              centroidLat += lat;
              centroidLng += lng;
              pointCount++;
            });
          };

          if (geom.type === 'Polygon') {
            geom.coordinates.forEach((ring: number[][]) => appendRingSegments(ring));
          } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach((poly: number[][][]) => {
              poly.forEach((ring: number[][]) => appendRingSegments(ring));
            });
          }

          if (iso2 && iso2 !== '-99' && !countryMap.has(iso2) && pointCount > 0) {
            const dbMatch = Object.values(COUNTRIES_DATABASE).find(
              (c) =>
                c.iso3?.toUpperCase() === iso3?.toUpperCase() ||
                c.name.toLowerCase() === name.toLowerCase()
            );
            if (dbMatch) {
              countryMap.set(iso2, dbMatch);
            } else {
              const avgLat = centroidLat / pointCount;
              const avgLng = centroidLng / pointCount;
              countryMap.set(iso2, {
                id: iso2,
                iso3: iso3 || iso2,
                name,
                nativeName: name,
                capital: props.CAPITAL || props.capital || name,
                continent: (props.CONTINENT as CountryInfo['continent']) || 'Europe',
                subregion: props.SUBREGION || 'Global',
                population: props.POP_EST || 1000000,
                areaKm2: 25000,
                lat: avgLat,
                lng: avgLng,
                languages: [`${name} Language`],
                currencies: ['Local Currency'],
                flagEmoji: '🌐',
                facts: []
              });
            }
          }
        });

        if (segmentVertices.length > 0) {
          const mergedBorderGeo = new THREE.BufferGeometry();
          mergedBorderGeo.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(segmentVertices, 3)
          );
          const borderMat = new THREE.LineBasicMaterial({
            color: appTheme === 'light' ? 0x334155 : 0x52525b,
            transparent: true,
            opacity: appTheme === 'light' ? 0.92 : 0.85
          });
          countryBorderMatRef.current = borderMat;
          globeGroup.add(new THREE.LineSegments(mergedBorderGeo, borderMat));
        }

        const allList = Array.from(countryMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        allCountriesRef.current = allList;

        // Render subtle visual dots for the 197 official sovereign countries positioned on their Capital Cities!
        allList.forEach((country) => {
          if (country.isTerritory) return;
          if (!country.lat && !country.lng) return;
          const isMicro = MICROSTATES.has(country.id);
          const pos = latLngToVector3(country.lat, country.lng, GLOBE_RADIUS + 0.14);
          const pinMat = new THREE.MeshBasicMaterial({
            color: isMicro ? 0x38bdf8 : 0x0ea5e9
          });
          const pinMesh = new THREE.Mesh(pinGeo, pinMat);
          pinMesh.scale.setScalar(isMicro ? 0.95 : 0.85);
          pinMesh.position.copy(pos);
          pinMesh.userData = { country, isMicro };
          pinsGroup.add(pinMesh);
        });
      })
      .catch((e) => console.error('Failed to project GeoJSON on globe:', e));

    // 1b. Load Major World Lakes Outlines (Rendered with the exact same slate border line as the Caspian Sea & country borders)
    geojsonCache
      .fetchGeoJSON('/maps/world/major_lakes.geojson')
      .then((lakeData) => {
        if (!lakeData || !lakeData.features) return;
        const lakeVertices: number[] = [];
        const appendLakeRing = (coords: number[][]) => {
          if (!coords || coords.length < 2) return;
          const pts = buildSphericalRingPoints(coords, GLOBE_RADIUS + 0.05, 0.9, true);
          for (let i = 0; i < pts.length - 1; i++) {
            const p1 = pts[i];
            const p2 = pts[i + 1];
            lakeVertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
          }
        };
        lakeData.features.forEach((f: any) => {
          const geom = f.geometry;
          if (!geom) return;
          if (geom.type === 'Polygon') {
            geom.coordinates.forEach((ring: number[][]) => appendLakeRing(ring));
          } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach((poly: number[][][]) =>
              poly.forEach((ring: number[][]) => appendLakeRing(ring))
            );
          }
        });
        if (lakeVertices.length > 0) {
          const lakeGeo = new THREE.BufferGeometry();
          lakeGeo.setAttribute('position', new THREE.Float32BufferAttribute(lakeVertices, 3));
          const lakeMat = new THREE.LineBasicMaterial({
            color: appTheme === 'light' ? 0x334155 : 0x52525b,
            transparent: true,
            opacity: appTheme === 'light' ? 0.92 : 0.85
          });
          lakeBorderMatRef.current = lakeMat;
          globeGroup.add(new THREE.LineSegments(lakeGeo, lakeMat));
        }
      })
      .catch(() => {});

    // 2. Load 3-Tier Country-Size Dependent ADM1 Subdivision Dotted Outlines
    // Tier 1 = Giant countries (AU, US, CA, RU, CN, BR, IN, KZ, DZ...) visible at z < 245
    // Tier 2 = Medium countries visible at z < 178
    // Tier 3 = Small countries visible at z < 138
    geojsonCache
      .fetchGeoJSON('/maps/world/world_adm1_lines.geojson')
      .then((admData) => {
        if (!admData || !admData.features) return;
        const tier1Verts: number[] = [];
        const tier2Verts: number[] = [];
        const tier3Verts: number[] = [];

        const appendDottedLineTo = (coords: number[][], targetArr: number[]) => {
          if (!coords || coords.length < 2) return;
          const pts = buildSphericalRingPoints(coords, GLOBE_RADIUS + 0.048, 0.45, false);
          for (let i = 0; i < pts.length - 1; i += 2) {
            const p1 = pts[i];
            const p2 = pts[i + 1];
            targetArr.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
          }
        };

        admData.features.forEach((f: any) => {
          const geom = f.geometry;
          if (!geom) return;
          const t = f.properties?.t || 2;
          const bucket = t === 1 ? tier1Verts : t === 2 ? tier2Verts : tier3Verts;

          if (geom.type === 'LineString') {
            appendDottedLineTo(geom.coordinates, bucket);
          } else if (geom.type === 'MultiLineString') {
            geom.coordinates.forEach((line: number[][]) => appendDottedLineTo(line, bucket));
          } else if (geom.type === 'Polygon') {
            geom.coordinates.forEach((ring: number[][]) => appendDottedLineTo(ring, bucket));
          } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach((poly: number[][][]) =>
              poly.forEach((ring: number[][]) => appendDottedLineTo(ring, bucket))
            );
          }
        });

        // Also include Belgium's regions in Tier 3 (small country zoom tier)
        geojsonCache
          .fetchGeoJSON('/maps/subdivisions/bel_adm1.geojson')
          .then((belData) => {
            if (belData?.features) {
              belData.features.forEach((bf: any) => {
                const g = bf.geometry;
                if (!g) return;
                if (g.type === 'Polygon')
                  g.coordinates.forEach((r: number[][]) => appendDottedLineTo(r, tier3Verts));
                else if (g.type === 'MultiPolygon')
                  g.coordinates.forEach((p: number[][][]) =>
                    p.forEach((r: number[][]) => appendDottedLineTo(r, tier3Verts))
                  );
              });
            }

            const dottedMat = new THREE.LineBasicMaterial({
              color: appTheme === 'light' ? 0x0284c7 : 0x38bdf8,
              transparent: true,
              opacity: appTheme === 'light' ? 0.55 : 0.42
            });
            adm1DottedMatRef.current = dottedMat;

            if (tier1Verts.length > 0) {
              const g1 = new THREE.BufferGeometry();
              g1.setAttribute('position', new THREE.Float32BufferAttribute(tier1Verts, 3));
              const m1 = new THREE.LineSegments(g1, dottedMat);
              m1.visible = false;
              adm1DottedGroup.add(m1);
              adm1Tier1Ref.current = m1;
            }
            if (tier2Verts.length > 0) {
              const g2 = new THREE.BufferGeometry();
              g2.setAttribute('position', new THREE.Float32BufferAttribute(tier2Verts, 3));
              const m2 = new THREE.LineSegments(g2, dottedMat);
              m2.visible = false;
              adm1DottedGroup.add(m2);
              adm1Tier2Ref.current = m2;
            }
            if (tier3Verts.length > 0) {
              const g3 = new THREE.BufferGeometry();
              g3.setAttribute('position', new THREE.Float32BufferAttribute(tier3Verts, 3));
              const m3 = new THREE.LineSegments(g3, dottedMat);
              m3.visible = false;
              adm1DottedGroup.add(m3);
              adm1Tier3Ref.current = m3;
            }
          })
          .catch(() => {});
      })
      .catch(() => {});

    // Touch & Mouse Interaction Controls (Altitude-Scaled Drag & Deep Zoom — Never Auto-Clicks When Pinch-Zooming or Double-Firing Touch+Mouse!)
    let isDragging = false;
    let wasMultiTouchGesture = false;
    let lastPinchTimestamp = 0;
    let lastTouchEventTimestamp = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let startDistance = 0;
    let dragDistanceTotal = 0;

    const getAltitudeFactor = () => {
      const currentZ = cameraRef.current ? cameraRef.current.position.z : targetCameraZ.current;
      const altitude = Math.max(0.38, currentZ - GLOBE_RADIUS);
      return Math.min(1.2, altitude / 130);
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        lastTouchEventTimestamp = performance.now();
        if (e.touches.length >= 2) {
          wasMultiTouchGesture = true;
          isDragging = false;
          lastPinchTimestamp = performance.now();
          startDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          return;
        }
        if (performance.now() - lastPinchTimestamp < 380) {
          wasMultiTouchGesture = true;
          isDragging = false;
          return;
        }
        wasMultiTouchGesture = false;
      } else if (performance.now() - lastTouchEventTimestamp < 650) {
        // Ignore compatibility mousedown synthesized after a touch event
        return;
      }
      isDragging = true;
      dragDistanceTotal = 0;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        lastTouchEventTimestamp = performance.now();
      } else if (performance.now() - lastTouchEventTimestamp < 650) {
        return;
      }
      if ('touches' in e && e.touches.length >= 2) {
        wasMultiTouchGesture = true;
        isDragging = false;
        lastPinchTimestamp = performance.now();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (startDistance > 0) {
          const altFactor = getAltitudeFactor();
          const factor = (startDistance - dist) * 0.35 * altFactor;
          targetCameraZ.current = Math.max(100.38, Math.min(580, targetCameraZ.current + factor));
        }
        startDistance = dist;
        return;
      }

      if ('touches' in e && wasMultiTouchGesture) {
        return;
      }

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        prevMouseX = clientX;
        prevMouseY = clientY;
        dragDistanceTotal += Math.hypot(deltaX, deltaY);

        const sens = sensitivityRef.current || 1.0;
        const altFactor = getAltitudeFactor();
        targetRotationY.current += deltaX * 0.0045 * sens * altFactor;
        targetRotationX.current += deltaY * 0.0045 * sens * altFactor;
        targetRotationX.current = Math.max(-1.48, Math.min(1.48, targetRotationX.current));
      } else if (!('touches' in e)) {
        const rect = container.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

        const activeHitRadius = activeQuizConfigRef.current ? GLOBE_RADIUS + 0.08 : GLOBE_RADIUS;
        const invGlobeMatrix = globeGroup.matrixWorld.clone().invert();
        const localRay = raycaster.ray.clone().applyMatrix4(invGlobeMatrix);
        const hitPoint = new THREE.Vector3();
        const hitSphere = localRay.intersectSphere(
          new THREE.Sphere(new THREE.Vector3(0, 0, 0), activeHitRadius),
          hitPoint
        );

        if (hitSphere) {
          const hitLen = hitPoint.length() || activeHitRadius;
          const lat =
            Math.asin(Math.max(-1, Math.min(1, hitPoint.y / hitLen))) * (180 / Math.PI);
          let lng = (Math.atan2(hitPoint.z, -hitPoint.x) * 180) / Math.PI - 180;
          if (lng < -180) lng += 360;
          else if (lng > 180) lng -= 360;

          if (activeQuizConfigRef.current) {
            if (modeRef.current === 'study') {
              const qf = findQuizFeatureAtCoordinates(lat, lng);
              setHoveredName(qf ? qf.featureName : null);
            } else {
              setHoveredName(null);
            }
          } else {
            const c = findCountryAtCoordinates(lat, lng);
            setHoveredName(c ? c.name : null);
          }
        } else {
          setHoveredName(null);
        }
      }
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e || 'changedTouches' in e) {
        lastTouchEventTimestamp = performance.now();
        if (wasMultiTouchGesture || performance.now() - lastPinchTimestamp < 380) {
          if ('touches' in e && e.touches.length === 0) {
            wasMultiTouchGesture = false;
          }
          isDragging = false;
          return;
        }
      } else if (performance.now() - lastTouchEventTimestamp < 650) {
        // Ignore compatibility mouseup synthesized after a touch event!
        isDragging = false;
        return;
      }

      if (!isDragging) return;
      isDragging = false;

      if (dragDistanceTotal < 6) {
        const clientX =
          'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
        const clientY =
          'changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;
        const rect = container.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

        const activeHitRadius = activeQuizConfigRef.current ? GLOBE_RADIUS + 0.08 : GLOBE_RADIUS;
        const invGlobeMatrix = globeGroup.matrixWorld.clone().invert();
        const localRay = raycaster.ray.clone().applyMatrix4(invGlobeMatrix);
        const hitPoint = new THREE.Vector3();
        const hitSphere = localRay.intersectSphere(
          new THREE.Sphere(new THREE.Vector3(0, 0, 0), activeHitRadius),
          hitPoint
        );

        if (hitSphere) {
          const hitLen = hitPoint.length() || activeHitRadius;
          const lat =
            Math.asin(Math.max(-1, Math.min(1, hitPoint.y / hitLen))) * (180 / Math.PI);
          let lng = (Math.atan2(hitPoint.z, -hitPoint.x) * 180) / Math.PI - 180;
          if (lng < -180) lng += 360;
          else if (lng > 180) lng -= 360;

          // CASE A: Active Quiz on the 3D Globe
          if (activeQuizConfigRef.current) {
            handleGlobeQuizTap(lat, lng);
            return;
          }

          // CASE B: Normal Country Exploration on the 3D Globe
          const c = findCountryAtCoordinates(lat, lng);
          if (c) {
            sounds.playTap();
            flyToLatLng(c.lat || lat, c.lng || lng, 155);
            onSelectCountry(c);
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const altFactor = getAltitudeFactor();
      const step = e.deltaY * 0.16 * altFactor;
      targetCameraZ.current = Math.max(100.38, Math.min(580, targetCameraZ.current + step));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isPausedRef.current) return;
      const delta = Math.min(clock.getDelta(), 0.1);

      if (cameraRef.current) {
        cameraRef.current.position.z = THREE.MathUtils.damp(
          cameraRef.current.position.z,
          targetCameraZ.current,
          12,
          delta
        );

        const camZ = cameraRef.current.position.z;
        const alt = Math.max(0.38, camZ - GLOBE_RADIUS);
        const pinScale = Math.max(0.08, Math.min(1.0, alt / 95));

        // Country-size dependent ADM1 Dotted Subdivisions:
        // Giant countries (AU, US, CA, RU, CN, BR, IN...) appear at camZ < 245 so all states are visible at once!
        // Medium countries appear at camZ < 178; Small countries appear at camZ < 138.
        const activeCfg = activeQuizConfigRef.current;
        const allowDottedInMode =
          !activeCfg ||
          activeCfg.quizOption.category === 'cities' ||
          activeCfg.quizOption.category === 'languages' ||
          activeCfg.quizOption.levelKey === 'LANGUAGE_GUESS';

        if (adm1DottedGroupRef.current) {
          adm1DottedGroupRef.current.visible = allowDottedInMode;
          if (adm1Tier1Ref.current) adm1Tier1Ref.current.visible = allowDottedInMode && camZ < 245;
          if (adm1Tier2Ref.current) adm1Tier2Ref.current.visible = allowDottedInMode && camZ < 178;
          if (adm1Tier3Ref.current) adm1Tier3Ref.current.visible = allowDottedInMode && camZ < 138;
        }

        if (pinsGroupRef.current) {
          pinsGroupRef.current.visible = !activeQuizConfigRef.current;
          pinsGroupRef.current.children.forEach((ch: any) => {
            const base = ch.userData?.isMicro ? 0.52 : 0.82;
            ch.scale.setScalar(base * pinScale);
          });
        }
        if (studyLabelsGroupRef.current && modeRef.current === 'study') {
          // Show Study Mode ("Learn") labels across all comfortable zoom levels (camZ < 290) and strictly on the front hemisphere facing the camera!
          const showLabelsAtZoom = camZ < 290;
          studyLabelsGroupRef.current.visible = showLabelsAtZoom;
          if (showLabelsAtZoom) {
            const labelScale = Math.max(0.015, Math.min(3.2, alt / 25));
            const cityDotScale = Math.max(0.010, Math.min(1.1, alt / 38));
            const cityLabelScale = Math.max(0.018, Math.min(3.1, alt / 18.5));
            const worldPos = new THREE.Vector3();
            studyLabelsGroupRef.current.children.forEach((sp) => {
              sp.getWorldPosition(worldPos);
              // Cull labels on the back side of the globe or near the grazing horizon so you NEVER see through the globe!
              const isFacingCamera = worldPos.z > GLOBE_RADIUS * 0.25;
              sp.visible = isFacingCamera;
              if (isFacingCamera) {
                if (sp.userData?.isCityStudyDot) {
                  sp.scale.setScalar(cityDotScale);
                } else if (sp.userData?.isCityStudyLabel) {
                  sp.scale.set(2.75 * cityLabelScale, 0.72 * cityLabelScale, 1);
                } else if (sp.userData?.isFlagSprite) {
                  sp.scale.set(2.85 * labelScale, 1.98 * labelScale, 1);
                } else {
                  sp.scale.set(3.85 * labelScale, 1.45 * labelScale, 1);
                }
              }
            });
          }
        } else if (studyLabelsGroupRef.current) {
          studyLabelsGroupRef.current.visible = false;
        }
      }

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.y = THREE.MathUtils.damp(
          globeGroupRef.current.rotation.y,
          targetRotationY.current,
          12,
          delta
        );
        globeGroupRef.current.rotation.x = THREE.MathUtils.damp(
          globeGroupRef.current.rotation.x,
          targetRotationX.current,
          12,
          delta
        );

        // Back-hemisphere horizon culling for active quiz polygons (generous -75 threshold per ring so large/multi-island features never have visible borders culled)
        if (quizOverlayGroupRef.current && quizOverlayGroupRef.current.children.length > 0) {
          const rotMatrix = globeGroupRef.current.matrixWorld;
          const tempVec = new THREE.Vector3();
          const children = quizOverlayGroupRef.current.children;
          for (let i = 0; i < children.length; i++) {
            const ch = children[i];
            const localCenter = ch.userData?.localCenter as THREE.Vector3 | undefined;
            if (localCenter) {
              tempVec.copy(localCenter).applyMatrix4(rotMatrix);
              ch.visible = tempVec.z > -75;
            }
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, []);

  // Clean standalone "NA" or "N/A" prefix without ever stripping "Na" from names like "Namur" or "Navarra"
  const cleanName = (val: string) => {
    if (!val) return '';
    return String(val).replace(/^(?:N\/A|n\.a\.|NA)(?:\s*[-:]+\s*|\s+|$)/i, '').trim();
  };

  // Extract feature identity without spoiler leaks (just area code or subdivision name)
  const extractFeatureInfo = (p: any, opt: SubdivisionQuizOption, countryId: string) => {
    let featureName = '';
    let shortLabel = '';
    let areaCode = '';
    let parentGroup = '';

    const cfg = activeQuizConfigRef.current;
    const isMulti =
      (cfg?.multiCountries && cfg.multiCountries.length > 1) ||
      Boolean(cfg?.dailySubdivisionsPool) ||
      Boolean(cfg?.dailyAreaCodesPool);

    if (
      opt.levelKey === 'COUNTRY' ||
      opt.levelKey === 'COUNTRY_FLAG' ||
      opt.levelKey === 'COUNTRY_CAPITAL' ||
      opt.id === 'world-countries'
    ) {
      const iso2 = String(p.ISO_A2 || p.iso_a2 || countryId || '').toUpperCase();
      const dbCountry = COUNTRIES_DATABASE[iso2];
      const cName = dbCountry?.name || cleanName(p.NAME || p.name || iso2);
      featureName = cName;
      shortLabel = cName;
      return { featureName, shortLabel, areaCode: '', parentGroup: '', localName: '' };
    }

    if (opt.levelKey === 'MACRO_REGION' && p.MACRO_REGION) {
      featureName = String(p.MACRO_REGION);
      shortLabel = featureName;
      parentGroup = p._atlasGroup || '';
      return { featureName, shortLabel, areaCode: '', parentGroup, localName: '' };
    }

    // Special handling for Thailand Provincial Abbreviations (th-abbrev) so English shows "นย (Nakhon Nayok)" and Local Script shows pure "นย"
    if (opt.id === 'th-abbrev') {
      const abbr = String(p.NL_NAME_1 || p.code || '').trim();
      const fullLabel = String(p.name || abbr).trim();
      featureName = fullLabel;
      shortLabel = abbr || fullLabel;
      parentGroup = p._atlasGroup || p.NAME_1 || '';
      return {
        featureName,
        shortLabel,
        areaCode: abbr,
        parentGroup,
        localName: abbr
      };
    }

    const isExtra =
      opt.category === 'extra' ||
      opt.id.includes('taxi') ||
      opt.id.includes('plate') ||
      opt.id.includes('pole') ||
      opt.id.includes('bins') ||
      opt.id.includes('roads') ||
      opt.id.includes('post');

    if (isExtra && opt.category !== 'cities') {
      const raw = String(
        p.AreaCode || p.Postcode || p.code || p.ref || p.NL_NAME_1 || p.NAME_1 || p.name || ''
      ).trim();
      areaCode = raw;
      shortLabel = raw;
      if (opt.id.includes('taxi') && countryId === 'EC') {
        featureName = `Taxi Letter "${raw}"`;
      } else if (opt.id.includes('taxi') && countryId === 'PA') {
        featureName = `Taxi Zone ${raw}`;
      } else if (opt.id.includes('taxi')) {
        featureName = `Taxi Code ${raw}`;
      } else if (opt.id.includes('plate') || opt.id.includes('auto')) {
        featureName = `Plate Code ${raw}`;
      } else if (opt.id.includes('pole')) {
        featureName = `Pole Grid ${raw}`;
      } else if (opt.id.includes('bins')) {
        featureName = `Bin Code ${raw}`;
      } else if (opt.id.includes('roads')) {
        featureName = `Road Prefix ${raw}`;
      } else if (opt.id.includes('post')) {
        featureName = `Postal Code ${raw}`;
      } else {
        featureName = cleanName(raw);
      }
      if (isMulti) {
        const cName = COUNTRIES_DATABASE[countryId]?.name || countryId;
        featureName = `${cName} — ${featureName}`;
      }
      parentGroup = p._atlasGroup || p.STATE || p.NAME_1 || '';
    } else if (opt.category === 'areacodes' || p.AreaCode !== undefined) {
      const raw = String(p.AreaCode ?? p.areacode ?? p.code ?? p.name ?? '').trim();
      const addLeadingZero =
        !['US', 'CA', 'MX', 'DO', 'JM', 'TT', 'BS', 'BB', 'PR'].includes(countryId) &&
        !raw.startsWith('0') &&
        raw.length <= 2 &&
        countryId === 'BE';
      const baseCode = addLeadingZero ? '0' + raw : raw;

      // Determine hierarchical Area Code Depth Level (from per-country override, global config, or selectedGroups filter)
      const depthFromGroups = cfg?.selectedGroups
        ?.find((g) => g.startsWith('depth:'))
        ?.slice(6)
        .trim() as AreaCodeDepthLevel | undefined;
      const effectiveDepth: AreaCodeDepthLevel =
        cfg?.areaCodeDepthByCountry?.[countryId] ||
        cfg?.areaCodeDepth ||
        depthFromGroups ||
        'all';

      areaCode = computeAreaCodeAtDepth(baseCode, effectiveDepth, countryId);
      shortLabel = areaCode;
      const cName = COUNTRIES_DATABASE[countryId]?.name || countryId;
      featureName = isMulti ? `${cName} — Area Code ${areaCode}` : `Area Code ${areaCode}`;
      parentGroup = p._atlasGroup || p.STATE || p.NAME_1 || '';
    } else if (p.NAME_4) {
      featureName = cleanName(p.NAME_4);
      shortLabel = featureName;
      parentGroup = p._atlasGroup || p.NAME_2 || p.NAME_1 || '';
    } else if (p.NAME_3) {
      featureName = cleanName(p.NAME_3 || p.VARNAME_3);
      shortLabel = featureName;
      parentGroup = p._atlasGroup || p.NAME_2 || p.NAME_1 || '';
    } else if (p.NAME_2) {
      featureName = cleanName(p.NAME_2 || p.VARNAME_2 || p.name);
      shortLabel = featureName;
      parentGroup = p._atlasGroup || p.NAME_1 || '';
    } else if (p.province && p.name) {
      featureName = cleanName(p.name);
      shortLabel = featureName;
      parentGroup = p._atlasGroup || p.province;
    } else {
      const baseSubName = cleanName(
        p.NAME_1 || p.name || p.NAME || p.name_en || p.ADMIN || 'Region'
      );
      shortLabel = baseSubName;
      if (isMulti) {
        const cName = COUNTRIES_DATABASE[countryId]?.name || countryId;
        featureName = `${cName} — ${baseSubName}`;
      } else {
        featureName = baseSubName;
      }
      parentGroup = p._atlasGroup || '';
    }

    const rawLocal =
      p.NL_NAME_1 ||
      p.NL_NAME_2 ||
      p.NL_NAME_3 ||
      p.name_local ||
      p.name_native ||
      '';
    const trimmedLocal = String(rawLocal || '').trim();
    const localName =
      trimmedLocal && !/^(?:N\/?A|n\.a\.|NA)$/i.test(trimmedLocal) ? trimmedLocal : '';

    return { featureName, shortLabel, areaCode, parentGroup, localName };
  };

  // Project Active Quiz onto the 3D Globe whenever activeQuizConfig or cityTier changes
  useEffect(() => {
    const overlayGrp = quizOverlayGroupRef.current;
    const studyGrp = studyLabelsGroupRef.current;
    const cityGrp = cityGuessGroupRef.current;
    if (!overlayGrp || !studyGrp || !cityGrp) return;

    // Clear and dispose previous quiz GPU geometry, materials & sprite canvas textures
    stopHintBlink();
    wrongFlashTimeoutsRef.current.forEach((tid) => window.clearTimeout(tid));
    wrongFlashTimeoutsRef.current.clear();
    disposeGroupChildren(overlayGrp);
    disposeGroupChildren(studyGrp);
    disposeGroupChildren(cityGrp);
    parsedQuizFeaturesRef.current = [];
    featureVisualsMapRef.current.clear();
    solvedSetRef.current.clear();
    solvedWithMistakeSetRef.current.clear();
    solvedRecycledOrangeSetRef.current.clear();
    setCityGuessResult(null);
    setLanguageGuessResult(null);
    setTotalCityPoints(0);
    totalCityPointsRef.current = 0;
    setWrongClickLabel(null);
    setPreviousAttempts([]);
    setReviewMissedIdx(null);
    setIsAutoReviewingMissed(false);

    if (!activeQuizConfig) {
      quizDefaultViewRef.current = null;
      geojsonCache.clearQuizGeoJSONs();
      targetCameraZ.current = getHomeDefaultCameraZ();
      return;
    }

    const {
      country,
      quizOption,
      selectedGroups,
      initialMode,
      quizLangMode: initialLangMode,
      quizDifficulty: initialDifficulty,
      multiCountries,
      customCitiesPool,
      languageSamplesPool,
      dailySubdivisionsPool,
      dailyAreaCodesPool
    } = activeQuizConfig;

    setMode(initialMode);
    setEndlessRetry(Boolean(activeQuizConfig.endlessRetry));
    setIsLangPromptMinimized(false);
    setIsLangAnswerMinimized(false);
    setShowMasteryHeatmap(false);
    if (initialLangMode) {
      setQuizLangMode(initialLangMode);
    } else {
      setQuizLangMode('english');
    }
    if (initialDifficulty) {
      setDifficultyMode(initialDifficulty === 'hard' ? 'hard' : 'easy');
      setCityTier(
        initialDifficulty === 'easy'
          ? 'easy'
          : initialDifficulty === 'hard'
          ? 'hard'
          : 'medium'
      );
    }
    setIsQuizDone(false);
    setFeedback(null);
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setFirstTryScore(0);
    firstTryScoreRef.current = 0;
    isAdvancingQuestionRef.current = false;
    scoredTargetIndicesRef.current.clear();
    setMissedItemsMap(new Map());
    missedItemsMapRef.current = new Map();
    setCurrentAttemptedWrong(false);
    currentAttemptedWrongRef.current = false;
    setTimerSeconds(0);
    timerSecondsRef.current = 0;
    isPracticeMissedRunRef.current = false;

    db.userStats.get('current').then((st) => {
      if (st?.personalBests && st.personalBests[quizOption.id]) {
        setPersonalBestSec(st.personalBests[quizOption.id].bestTimeSec);
      } else {
        setPersonalBestSec(null);
      }
    });

    const buildGlobeQuiz = async () => {
      // CASE 0: WORLD LANGUAGE GUESSER 3D GLOBE GAME
      if (
        quizOption.category === 'languages' ||
        quizOption.levelKey === 'LANGUAGE_GUESS' ||
        (languageSamplesPool && languageSamplesPool.length > 0)
      ) {
        const data = await geojsonCache.fetchGeoJSON('/maps/world/countries.geojson');
        const worldFeatures = data.features || [];
        const parsedCountries: ParsedQuizFeature[] = [];

        worldFeatures.forEach((f: any, idx: number) => {
          const geom = f.geometry;
          if (!geom) return;
          const p = f.properties || {};
          const iso2 = String(p.ISO_A2 || p.iso_a2 || '').toUpperCase();
          const cName = String(p.NAME || p.name || COUNTRIES_DATABASE[iso2]?.name || iso2);
          if (!iso2 || iso2 === '-99') return;

          const rings: number[][][] = [];
          let sumLat = 0,
            sumLng = 0,
            ptCount = 0;
          let fMinLat = 90,
            fMaxLat = -90,
            fMinLng = 180,
            fMaxLng = -180;

          const collectRing = (ring: number[][]) => {
            if (!ring || ring.length < 3) return;
            rings.push(ring);
            ring.forEach(([lng, lat]) => {
              sumLat += lat;
              sumLng += lng;
              ptCount++;
              if (lat < fMinLat) fMinLat = lat;
              if (lat > fMaxLat) fMaxLat = lat;
              if (lng < fMinLng) fMinLng = lng;
              if (lng > fMaxLng) fMaxLng = lng;
            });
          };

          if (geom.type === 'Polygon') {
            if (geom.coordinates?.[0]) collectRing(geom.coordinates[0]);
          } else if (geom.type === 'MultiPolygon') {
            (geom.coordinates || []).forEach((poly: number[][][]) => {
              if (poly?.[0]) collectRing(poly[0]);
            });
          }

          if (ptCount === 0) return;

          parsedCountries.push({
            id: `lang-c-${idx}`,
            featureName: iso2,
            shortLabel: cName,
            countryCode: iso2,
            rings,
            centroidLat: sumLat / ptCount,
            centroidLng: sumLng / ptCount,
            bbox: [fMinLng, fMinLat, fMaxLng, fMaxLat]
          });

          const keyLower = iso2.toLowerCase();
          if (!featureVisualsMapRef.current.has(keyLower)) {
            featureVisualsMapRef.current.set(keyLower, { meshes: [], lines: [] });
          }
          const visEntry = featureVisualsMapRef.current.get(keyLower)!;

          rings.forEach((ring) => {
            const linePts = buildSphericalRingPoints(ring, GLOBE_RADIUS + 0.14, 1.0, true);
            const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
            const lineMat = new THREE.LineBasicMaterial({
              color: 0x334155,
              transparent: true,
              opacity: 0.75
            });
            const lineObj = new THREE.Line(lineGeo, lineMat);
            overlayGrp.add(lineObj);
            visEntry.lines.push(lineObj);

            // Compute span per individual ring (not whole MultiPolygon) so France, Canada, USA, etc. all fill with green/red properly!
            let rMinLng = 180,
              rMaxLng = -180,
              rMinLat = 90,
              rMaxLat = -90;
            for (let i = 0; i < ring.length; i++) {
              const [lng, lat] = ring[i];
              if (lng < rMinLng) rMinLng = lng;
              if (lng > rMaxLng) rMaxLng = lng;
              if (lat < rMinLat) rMinLat = lat;
              if (lat > rMaxLat) rMaxLat = lat;
            }
            const ringSpanLng = rMaxLng - rMinLng;
            const ringSpanDiag = Math.hypot(ringSpanLng, rMaxLat - rMinLat);
            if (ring.length >= 3 && ringSpanLng < 165) {
              const fillGeo = createSphericalPolygonGeometry(
                ring,
                GLOBE_RADIUS + 0.11,
                ringSpanDiag > 25 ? 1.5 : 1.75
              );
              if (fillGeo) {
                const fillMat = new THREE.MeshBasicMaterial({
                  color: 0x0f172a,
                  transparent: true,
                  opacity: 0.0,
                  side: THREE.DoubleSide,
                  depthWrite: false
                });
                const meshObj = new THREE.Mesh(fillGeo, fillMat);
                overlayGrp.add(meshObj);
                visEntry.meshes.push(meshObj);
              }
            }
          });
        });

        parsedQuizFeaturesRef.current = parsedCountries;
        const pool = languageSamplesPool || [];
        const targets: GlobeQuizTargetItem[] = fisherYatesShuffle(
          pool.map((s) => ({
            name: s.language,
            countryCode: s.countryCode,
            countryName: s.countryName,
            languageSample: s
          }))
        );
        setQueue(targets);
        setTotalInitialCount(targets.length);
        quizDefaultViewRef.current = { lat: 20, lng: 10, z: 245 };
        flyToLatLng(20, 10, 245);
        return;
      }

      const effectiveMultiCountries =
        multiCountries && multiCountries.length > 0
          ? multiCountries
          : ((quizOption as any).multiCountries as CountryInfo[] | undefined);

      const countriesToLoad =
        effectiveMultiCountries && effectiveMultiCountries.length > 0
          ? effectiveMultiCountries
          : [country];

      // CASE 1: CITIES PINPOINT QUIZ ON THE 3D GLOBE (MapTap.gg Style — Zero Pre-Drawn City Dots!)
      if (
        quizOption.category === 'cities' ||
        quizOption.levelKey === 'CITY_PIN' ||
        quizOption.id.includes('-cities')
      ) {
        let minLat = 90,
          maxLat = -90,
          minLng = 180,
          maxLng = -180;
        const segmentVerts: number[] = [];
        const selectedStateFilterSet =
          selectedGroups.length > 0 && !selectedGroups.includes('all')
            ? new Set(
                selectedGroups
                  .filter(
                    (g) =>
                      !g.startsWith('prefix:') &&
                      !g.startsWith('digits:') &&
                      !g.startsWith('depth:') &&
                      !g.startsWith('limit:') &&
                      !g.startsWith('partial:') &&
                      !g.startsWith('citytier:') &&
                      !g.startsWith('citytiermode:')
                  )
                  .map((g) => g.toLowerCase().trim())
              )
            : null;
        const selectedAdm1Rings: number[][][] = [];

        if (countriesToLoad.length <= 15) {
          for (const c of countriesToLoad) {
            const gUrl =
              c.subdivisionFile ||
              `/maps/subdivisions/${c.iso3?.toLowerCase() || 'bel'}_adm1.geojson`;
            try {
              const data = await geojsonCache.fetchGeoJSON(gUrl);
              (data.features || []).forEach((f: any) => {
                const geom = f.geometry;
                if (!geom) return;
                const fp = f.properties || {};
                const adm1Name = String(fp.NAME_1 || fp.name || fp.region || '')
                  .replace(/([a-z])([A-Z])/g, '$1 $2')
                  .trim()
                  .toLowerCase();
                if (
                  selectedStateFilterSet &&
                  selectedStateFilterSet.size > 0 &&
                  adm1Name &&
                  !selectedStateFilterSet.has(adm1Name)
                ) {
                  return;
                }
                const drawRing = (ring: number[][]) => {
                  if (selectedStateFilterSet && selectedStateFilterSet.size > 0) {
                    selectedAdm1Rings.push(ring);
                  }
                  ring.forEach(([lng, lat]) => {
                    if (lat < minLat) minLat = lat;
                    if (lat > maxLat) maxLat = lat;
                    if (lng < minLng) minLng = lng;
                    if (lng > maxLng) maxLng = lng;
                  });
                  const pts = buildSphericalRingPoints(ring, GLOBE_RADIUS + 0.14, 0.85, true);
                  for (let i = 0; i < pts.length - 1; i++) {
                    const p1 = pts[i];
                    const p2 = pts[i + 1];
                    segmentVerts.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                  }
                };
                if (geom.type === 'Polygon') geom.coordinates.forEach(drawRing);
                else if (geom.type === 'MultiPolygon')
                  geom.coordinates.forEach((p: number[][][]) => p.forEach(drawRing));
              });
            } catch {
              // Ignore missing outline
            }
          }
        }

        if (segmentVerts.length > 0) {
          const outlineGeo = new THREE.BufferGeometry();
          outlineGeo.setAttribute('position', new THREE.Float32BufferAttribute(segmentVerts, 3));
          const outlineMat = new THREE.LineBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.88
          });
          overlayGrp.add(new THREE.LineSegments(outlineGeo, outlineMat));
        }

        const explicitCityTiersCsv = selectedGroups
          .find((g) => g.startsWith('citytiers:'))
          ?.slice(10)
          .trim();
        const explicitCityTiersSet = explicitCityTiersCsv
          ? new Set(
              explicitCityTiersCsv
                .split(',')
                .map((s) => Number(s.trim()))
                .filter((n) => n >= 1 && n <= 5)
            )
          : null;

        const explicitCityTierStr = selectedGroups
          .find((g) => g.startsWith('citytier:'))
          ?.slice(9)
          .trim();
        const explicitCityTierNum = explicitCityTierStr
          ? (Math.max(1, Math.min(5, Number(explicitCityTierStr))) as 1 | 2 | 3 | 4 | 5)
          : null;
        const explicitCityTierMode =
          (selectedGroups
            .find((g) => g.startsWith('citytiermode:'))
            ?.slice(13)
            .trim() as 'cumulative' | 'strict' | undefined) || 'cumulative';

        const effectiveTier: 'easy' | 'medium' | 'hard' | 1 | 2 | 3 | 4 | 5 =
          explicitCityTierNum ||
          (initialDifficulty
            ? initialDifficulty === 'easy'
              ? 1
              : initialDifficulty === 'hard'
              ? 5
              : 3
            : cityTier);

        let citiesList: CityPoint[] = [];
        if (customCitiesPool && customCitiesPool.length > 0) {
          if (quizOption.id.startsWith('daily-cities')) {
            citiesList = customCitiesPool;
          } else if (explicitCityTiersSet && explicitCityTiersSet.size > 0) {
            citiesList = customCitiesPool.filter((c) => explicitCityTiersSet.has(c.tier));
            if (citiesList.length === 0) citiesList = customCitiesPool;
          } else {
            const maxT =
              typeof effectiveTier === 'number'
                ? effectiveTier
                : effectiveTier === 'easy'
                ? 1
                : effectiveTier === 'medium'
                ? 3
                : 5;
            citiesList = customCitiesPool.filter((c) =>
              explicitCityTierMode === 'strict' ? c.tier === maxT : c.tier <= maxT
            );
            if (citiesList.length === 0) citiesList = customCitiesPool;
          }
        } else if (multiCountries && multiCountries.length > 1) {
          const setCodes = new Set(multiCountries.map((m) => m.id.toUpperCase()));
          if (explicitCityTiersSet && explicitCityTiersSet.size > 0) {
            const worldPool = getCitiesByScopeAndTier({ type: 'world' }, 5, 'cumulative');
            citiesList = worldPool.filter(
              (c) =>
                setCodes.has(c.countryCode.toUpperCase()) && explicitCityTiersSet.has(c.tier)
            );
          } else {
            const worldPool = getCitiesByScopeAndTier(
              { type: 'world' },
              effectiveTier,
              explicitCityTierMode
            );
            citiesList = worldPool.filter((c) => setCodes.has(c.countryCode.toUpperCase()));
          }
        } else {
          if (explicitCityTiersSet && explicitCityTiersSet.size > 0) {
            const fullCountryPool = getCitiesByScopeAndTier(
              { type: 'country', value: country.id },
              5,
              'cumulative'
            );
            citiesList = fullCountryPool.filter((c) => explicitCityTiersSet.has(c.tier));
          } else {
            citiesList = getCitiesByScopeAndTier(
              { type: 'country', value: country.id },
              effectiveTier,
              explicitCityTierMode
            );
          }
          if (selectedAdm1Rings.length > 0) {
            const inSelectedStates = citiesList.filter((c) =>
              selectedAdm1Rings.some((ring) => isPointInPolygon([c.lng, c.lat], ring))
            );
            if (inSelectedStates.length > 0) {
              citiesList = inSelectedStates;
            }
          }
        }

        const isMultiCityScope =
          (multiCountries && multiCountries.length > 1) ||
          quizOption.id.startsWith('daily-cities');

        const limitFromGroups = selectedGroups
          .find((g) => g.startsWith('limit:'))
          ?.slice(6)
          .trim();
        const parsedLimit =
          activeQuizConfig.questionLimit ||
          (limitFromGroups ? Number(limitFromGroups) : 0);

        const rawTargets: GlobeQuizTargetItem[] = fisherYatesShuffle(
          citiesList.map((c) => ({
            name: isMultiCityScope ? `${c.name} (${c.countryName})` : c.name,
            localName: c.nativeName,
            lat: c.lat,
            lng: c.lng,
            cityTier: c.tier,
            countryCode: c.countryCode,
            countryName: c.countryName
          }))
        );
        const targets =
          parsedLimit > 0 && initialMode === 'quiz'
            ? rawTargets.slice(0, parsedLimit)
            : rawTargets;

        setQueue(targets);
        setTotalInitialCount(targets.length);

        const CITY_TIER_CSS: Record<number, string> = {
          1: '#fbbf24', // Gold (Tier 1 Capitals & World Cities)
          2: '#38bdf8', // Sky Cyan (Tier 2 Major Cities)
          3: '#34d399', // Emerald (Tier 3 Regional Hubs)
          4: '#a78bfa', // Violet (Tier 4 Provincial Cities)
          5: '#fb7185'  // Rose (Tier 5 Local Cities)
        };
        const CITY_TIER_STROKE: Record<number, string> = {
          1: 'rgba(251, 191, 36, 0.96)',
          2: 'rgba(56, 189, 248, 0.96)',
          3: 'rgba(52, 211, 153, 0.96)',
          4: 'rgba(167, 139, 250, 0.96)',
          5: 'rgba(251, 113, 133, 0.96)'
        };

        targets.forEach((t) => {
          if (t.lat !== undefined && t.lng !== undefined) {
            const tierNum = t.cityTier || 3;
            const dotCss = CITY_TIER_CSS[tierNum] || '#38bdf8';
            const strokeCss = CITY_TIER_STROKE[tierNum] || 'rgba(56, 189, 248, 0.96)';
            const exactPos = latLngToVector3(t.lat, t.lng, GLOBE_RADIUS + 0.16);

            // 1. Always-visible exact geographic pinpoint dot sprite colored by City Tier
            const dotSprite = createCityDotSprite(dotCss, tierNum);
            dotSprite.center.set(0.5, 0.5);
            dotSprite.position.copy(exactPos);
            studyGrp.add(dotSprite);

            // 2. Compact, zoom-responsive City Name pill anchored directly ABOVE the city dot
            const sp = createCityStudyLabelSprite(t.name, strokeCss, tierNum);
            sp.center.set(0.5, -0.32);
            sp.position.copy(exactPos);
            studyGrp.add(sp);
          }
        });
        studyGrp.visible = initialMode === 'study';

        if (isMultiCityScope) {
          quizMaxExtentKmRef.current = 14916;
          quizDefaultViewRef.current = { lat: 20, lng: 0, z: 245 };
          flyToLatLng(20, 0, 245);
        } else if (minLat <= maxLat && maxLng - minLng <= 65) {
          const diagKm = calculateDistanceKm(minLat, minLng, maxLat, maxLng);
          quizMaxExtentKmRef.current = Math.max(110, diagKm);
          const aspect =
            (mountRef.current?.clientWidth || window.innerWidth) /
            Math.max(1, mountRef.current?.clientHeight || window.innerHeight);
          const latSpan = maxLat - minLat;
          const lngSpan = (maxLng - minLng) / Math.min(1, aspect * 1.15);
          const span = Math.max(latSpan * 1.25, lngSpan * 0.95);
          const idealZ = GLOBE_RADIUS + Math.max(5.5, Math.min(155, span * 2.65));
          const midLat = (minLat + maxLat) / 2;
          const midLng = (minLng + maxLng) / 2;
          quizDefaultViewRef.current = { lat: midLat, lng: midLng, z: idealZ };
          flyToLatLng(midLat, midLng, idealZ);
        } else {
          const approxDiag = Math.max(120, Math.sqrt(country.areaKm2 || 40000) * 1.65);
          quizMaxExtentKmRef.current = approxDiag;
          const mainCenterLat = country.id === 'US' ? 39.5 : country.lat;
          const mainCenterLng = country.id === 'US' ? -98.5 : country.lng;
          quizDefaultViewRef.current = { lat: mainCenterLat, lng: mainCenterLng, z: 155 };
          flyToLatLng(mainCenterLat, mainCenterLng, 155);
        }
        return;
      }

      // CASE 2: GEOJSON POLYGON QUIZ ON THE 3D GLOBE (Subdivisions, Area Codes, Metas, World/Continent/Custom/Daily)
      let allRawFeatures: Array<{ feature: any; countryObj: CountryInfo }> = [];

      // Fast path for unified World/Continent ADM1 Subdivisions file (/maps/world/world_adm1_quiz.geojson)
      const explicitMultiFiles:
        | { file: string; countryCode: string; countryName: string }[]
        | undefined = (quizOption as any).multiFiles;

      if (explicitMultiFiles && explicitMultiFiles.length > 0) {
        for (const mf of explicitMultiFiles) {
          try {
            const data = await geojsonCache.fetchGeoJSON(mf.file);
            const cObj =
              COUNTRIES_DATABASE[mf.countryCode.toUpperCase()] ||
              countriesToLoad.find((c) => c.id.toUpperCase() === mf.countryCode.toUpperCase()) ||
              country;
            (data.features || []).forEach((f: any) =>
              allRawFeatures.push({ feature: f, countryObj: cObj })
            );
          } catch (err) {
            console.error('Failed to load multiFile GeoJSON:', mf.file, err);
          }
        }
      } else if (quizOption.geojsonFile === '/maps/world/world_adm1_quiz.geojson') {
        try {
          const data = await geojsonCache.fetchGeoJSON('/maps/world/world_adm1_quiz.geojson');
          const allowedCodes =
            multiCountries && multiCountries.length > 0
              ? new Set(multiCountries.map((mc) => mc.id.toUpperCase()))
              : null;
          (data.features || []).forEach((f: any) => {
            const iso2 = String(f.properties?.iso2 || f.properties?.ISO_A2 || '').toUpperCase();
            if (allowedCodes && !allowedCodes.has(iso2)) return;
            const cObj = COUNTRIES_DATABASE[iso2] || country;
            allRawFeatures.push({ feature: f, countryObj: cObj });
          });
        } catch (err) {
          console.error('Failed to load world_adm1_quiz.geojson:', err);
        }
      } else {
        for (const c of countriesToLoad) {
          let gUrl = quizOption.geojsonFile;
          if (multiCountries && multiCountries.length > 1) {
            if (
              quizOption.id === 'world-countries' ||
              quizOption.levelKey === 'COUNTRY' ||
              quizOption.levelKey === 'COUNTRY_FLAG' ||
              quizOption.levelKey === 'COUNTRY_CAPITAL'
            ) {
              gUrl = '/maps/world/countries.geojson';
            } else if (quizOption.category === 'areacodes') {
              const acOpt = getCountrySubdivisions(c).find((q) => q.category === 'areacodes');
              gUrl = acOpt ? acOpt.geojsonFile : '';
            } else if (quizOption.category === 'extra') {
              const exOpt = getCountrySubdivisions(c).find((q) => q.category === 'extra');
              gUrl = exOpt ? exOpt.geojsonFile : '';
            } else if (
              activeQuizConfig.countrySubdivisionOverrides?.[c.id] ||
              (quizOption as any).countrySubdivisionOverrides?.[c.id]
            ) {
              const rawOverride =
                (quizOption as any).countrySubdivisionOverrides?.[c.id] ||
                activeQuizConfig.countrySubdivisionOverrides?.[c.id] ||
                '';
              if (rawOverride.startsWith('/')) {
                gUrl = rawOverride;
              } else {
                const matchOpt = getCountrySubdivisions(c)
                  .flatMap((q) => q.availableLevels || [q])
                  .find((q) => q.id === rawOverride);
                gUrl =
                  matchOpt?.geojsonFile ||
                  c.subdivisionFile ||
                  `/maps/subdivisions/${c.iso3?.toLowerCase() || 'bel'}_adm1.geojson`;
              }
            } else if (c.id === 'BE') {
              // Logical equivalent level for multi-country quizzes (e.g. Benelux): 10 Belgian Provinces & Brussels instead of 3 Gewesten!
              gUrl = '/maps/subdivisions/belgium_adm2.geojson';
            } else if (c.id === 'LU') {
              // Logical equivalent level for multi-country quizzes (e.g. Benelux): 12 Cantons of Luxembourg instead of 3 Districts!
              gUrl = '/maps/subdivisions/lux_adm2.geojson';
            } else {
              const catAdm1 = getCountrySubdivisions(c)
                .flatMap((q) => q.availableLevels || [q])
                .find((q) => q.category === 'adm1' && q.levelKey !== 'MACRO_REGION');
              gUrl =
                catAdm1?.geojsonFile ||
                c.subdivisionFile ||
                `/maps/subdivisions/${c.iso3?.toLowerCase() || 'bel'}_adm1.geojson`;
            }
          }
          if (!gUrl) continue;
          try {
            const data = await geojsonCache.fetchGeoJSON(gUrl);
            let feats = data.features || [];
            if (gUrl === '/maps/world/countries.geojson') {
              const allowed =
                effectiveMultiCountries && effectiveMultiCountries.length > 0
                  ? new Set(effectiveMultiCountries.map((mc) => mc.id.toUpperCase()))
                  : null;
              const includesTerritories =
                quizOption.id.includes('244') ||
                quizOption.id.includes('-all') ||
                quizOption.id.includes('territor') ||
                Boolean(effectiveMultiCountries && effectiveMultiCountries.length > 200);
              const isSovereignOnlyWorld = !includesTerritories;
              const seenIso2 = new Set<string>();
              feats.forEach((f: any) => {
                const props = f.properties || {};
                let iso2 = String(props.ISO_A2 || props.iso_a2 || '').toUpperCase();
                if (!iso2 || iso2 === '-99') {
                  const iso3 = String(props.ISO_A3 || props.iso_a3 || '').toUpperCase();
                  const rawName = String(props.NAME || props.name || '').toLowerCase();
                  const fallbackMatch = Object.values(COUNTRIES_DATABASE).find(
                    (entry) =>
                      (iso3 && iso3 !== '-99' && entry.iso3?.toUpperCase() === iso3) ||
                      (rawName && entry.name.toLowerCase() === rawName)
                  );
                  if (fallbackMatch) iso2 = fallbackMatch.id.toUpperCase();
                }
                if (!iso2 || iso2 === '-99') return;
                if (allowed && !allowed.has(iso2)) return;
                const dbC = COUNTRIES_DATABASE[iso2];
                if (isSovereignOnlyWorld && (!dbC || dbC.isTerritory)) return;
                seenIso2.add(iso2);
                const cObj = dbC || c;
                if (f.properties) f.properties.ISO_A2 = iso2;
                allRawFeatures.push({ feature: f, countryObj: cObj });
              });
              break;
            } else {
              feats.forEach((f: any) => allRawFeatures.push({ feature: f, countryObj: c }));
            }
          } catch (err) {
            console.error('Failed to load GeoJSON for globe projection:', gUrl, err);
          }
        }
      }

      // Strictly filter by pre-selected regions, parent levels, prefixes, and digit lengths from RegionSelectorModal
      if (selectedGroups.length > 0 && !selectedGroups.includes('all')) {
        const prefixFilters = selectedGroups
          .filter((g) => g.startsWith('prefix:'))
          .map((g) => g.slice(7).trim());
        const digitLenFilters = selectedGroups
          .filter((g) => g.startsWith('digits:'))
          .map((g) => g.slice(7).trim());
        const stateNameFilters = selectedGroups.filter(
          (g) =>
            !g.startsWith('prefix:') &&
            !g.startsWith('digits:') &&
            !g.startsWith('depth:') &&
            !g.startsWith('limit:') &&
            !g.startsWith('partial:')
        );

        // If stateNameFilters are active and any feature lacks p._atlasGroup, spatially tag it against ADM1
        if (
          stateNameFilters.length > 0 &&
          countriesToLoad.length === 1 &&
          allRawFeatures.some(({ feature }) => !feature.properties?._atlasGroup)
        ) {
          const c0 = countriesToLoad[0];
          const adm1Url =
            c0.subdivisionFile ||
            `/maps/subdivisions/${(c0.iso3 || 'bel').toLowerCase()}_adm1.geojson`;
          try {
            const adm1Geo = await geojsonCache.fetchGeoJSON(adm1Url);
            const adm1Polys: Array<{ name: string; rings: number[][][]; lat: number; lng: number }> = [];
            (adm1Geo?.features || []).forEach((af: any) => {
              const ap = af.properties || {};
              const aName = String(ap.NAME_1 || ap.name || ap.region || '')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .trim();
              if (!aName || !af.geometry) return;
              const rings: number[][][] = [];
              let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
              const addR = (r: number[][]) => {
                if (!r || r.length < 3) return;
                rings.push(r);
                r.forEach(([lng, lat]) => {
                  if (lng < minX) minX = lng;
                  if (lng > maxX) maxX = lng;
                  if (lat < minY) minY = lat;
                  if (lat > maxY) maxY = lat;
                });
              };
              if (af.geometry.type === 'Polygon') addR(af.geometry.coordinates[0]);
              else if (af.geometry.type === 'MultiPolygon')
                af.geometry.coordinates.forEach((p: number[][][]) => addR(p[0]));
              if (rings.length > 0) {
                adm1Polys.push({
                  name: aName,
                  rings,
                  lng: (minX + maxX) / 2,
                  lat: (minY + maxY) / 2
                });
              }
            });

            if (adm1Polys.length > 0) {
              allRawFeatures.forEach(({ feature }) => {
                const fp = feature.properties || {};
                if (fp._atlasGroup) return;
                const fg = feature.geometry;
                if (!fg) return;
                let sLat = 0, sLng = 0, cnt = 0;
                const sampleRing =
                  fg.type === 'Polygon'
                    ? fg.coordinates?.[0]
                    : fg.type === 'MultiPolygon'
                    ? fg.coordinates?.[0]?.[0]
                    : null;
                if (Array.isArray(sampleRing)) {
                  sampleRing.forEach(([lng, lat]: number[]) => {
                    sLng += lng;
                    sLat += lat;
                    cnt++;
                  });
                }
                if (cnt === 0) return;
                const cLat = sLat / cnt;
                const cLng = sLng / cnt;
                for (const st of adm1Polys) {
                  if (st.rings.some((r) => isPointInPolygon([cLng, cLat], r))) {
                    fp._atlasGroup = st.name;
                    return;
                  }
                }
                let bestD = Infinity;
                for (const st of adm1Polys) {
                  const d = (st.lat - cLat) ** 2 + (st.lng - cLng) ** 2;
                  if (d < bestD) {
                    bestD = d;
                    fp._atlasGroup = st.name;
                  }
                }
              });
            }
          } catch {
            // Ignore ADM1 fallback error
          }
        }

        const filtered = allRawFeatures.filter(({ feature, countryObj }) => {
          const p = feature.properties || {};
          const { featureName, shortLabel, parentGroup, areaCode } = extractFeatureInfo(
            p,
            quizOption,
            countryObj.id
          );

          // 1. Check Digit Length filter if present
          if (digitLenFilters.length > 0) {
            const rawDigits = String(areaCode || p.AreaCode || '').replace(/\D/g, '');
            const cleanNoZero = rawDigits.replace(/^0+/, '');
            const matchesLen = digitLenFilters.some((dl) => {
              if (dl === '4+') return rawDigits.length >= 4;
              const n = Number(dl);
              return rawDigits.length === n || cleanNoZero.length === n;
            });
            if (!matchesLen) return false;
          }

          // 2. Check Prefix filter if present
          if (prefixFilters.length > 0) {
            const rawAC = String(areaCode || p.AreaCode || '');
            const cleanAC = rawAC.replace(/^0+/, '');
            const matchesPref = prefixFilters.some((pref) => {
              const cleanPref = pref.replace(/^0+/, '');
              return (
                rawAC.startsWith(pref) ||
                (cleanPref.length > 0 && cleanAC.startsWith(cleanPref))
              );
            });
            if (!matchesPref) return false;
          }

          // 3. Check State / Parent Region / Province / Arrondissement Map filter if present
          if (stateNameFilters.length > 0) {
            const candidateProps = [
              p._atlasGroup,
              parentGroup,
              p.PARENT_REGION,
              p.NAME_1,
              p.NAME_2,
              p.NAME_3,
              p.NAME_4,
              p.STATE,
              p.province,
              p.region,
              shortLabel,
              featureName
            ]
              .filter(Boolean)
              .map((v) =>
                String(v)
                  .replace(/([a-z])([A-Z])/g, '$1 $2')
                  .toLowerCase()
                  .trim()
              );

            const matchesState = stateNameFilters.some((st) => {
              const stLower = st
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .toLowerCase()
                .trim();
              return candidateProps.includes(stLower);
            });
            if (!matchesState) return false;
          }

          return true;
        });

        if (filtered.length > 0) {
          allRawFeatures = filtered;
        }
      }

      // Parse features, build 3D Globe meshes & spherical-subdivided border lines
      const parsedList: ParsedQuizFeature[] = [];
      const targetMap = new Map<string, GlobeQuizTargetItem>();

      let globalMinLat = 90,
        globalMaxLat = -90,
        globalMinLng = 180,
        globalMaxLng = -180;

      // Track mainland bounding box for single-country quizzes so outlying territories (Guam +144.8E, Alaska -165W, Reunion, Canary Islands) never pull the camera center to 0°!
      let mainMinLat = 90,
        mainMaxLat = -90,
        mainMinLng = 180,
        mainMaxLng = -180;
      const refMainLat =
        country.id === 'US' ? 39.5 : country.id === 'FR' ? 46.5 : country.id === 'RU' ? 60 : country.lat;
      const refMainLng =
        country.id === 'US' ? -98.5 : country.id === 'FR' ? 2.5 : country.id === 'RU' ? 90 : country.lng;

      // Allow full spherical polygon fills for all area code quizzes and subdivision quizzes up to 1,800 features!
      const isLargeFeatureSet = allRawFeatures.length > 1800 && quizOption.category !== 'areacodes';
      const isMediumFeatureSet = allRawFeatures.length > 420;
      const isDailyGlobeMode =
        Boolean(dailySubdivisionsPool && dailySubdivisionsPool.length > 0) ||
        Boolean(dailyAreaCodesPool && dailyAreaCodesPool.length > 0);
      const isAreaCodeQuiz =
        quizOption.category === 'areacodes' ||
        quizOption.id.toLowerCase().includes('areacode');

      // High-contrast, maximally separated per-area-code color palette so every unique area code
      // (even consecutive codes in the same country like 91..98 in Spain or 1..9 in Level 1) gets its own unmistakable color!
      const DISTINCT_AREA_CODE_PALETTE = [
        0x38bdf8, // Sky Blue
        0xf59e0b, // Vibrant Amber
        0xa855f7, // Electric Violet
        0x10b981, // Emerald Green
        0xf43f5e, // Rose Red
        0xfacc15, // Bright Gold
        0x06b6d4, // Cyan
        0xec4899, // Hot Pink
        0x84cc16, // Lime Green
        0x6366f1, // Indigo
        0xf97316, // Bright Orange
        0x14b8a6, // Teal
        0xd946ef, // Fuchsia
        0x22c55e, // Neon Green
        0x3b82f6, // Royal Blue
        0xeab308, // Yellow Gold
        0x8b5cf6, // Purple
        0xfb7185, // Coral Rose
        0x2dd4bf, // Mint Aqua
        0xfbbf24  // Warm Sunflower
      ];

      const areaCodeGradientHexMap = new Map<string, number>();
      if (isAreaCodeQuiz) {
        const uniqueAreaItems: Array<{
          name: string;
          countryId: string;
          sortKey: string;
          numVal: number;
        }> = [];
        const seenAreaNames = new Set<string>();
        allRawFeatures.forEach(({ feature, countryObj }) => {
          const p = feature.properties || {};
          const { featureName, areaCode, shortLabel } = extractFeatureInfo(
            p,
            quizOption,
            countryObj.id
          );
          if (!featureName || seenAreaNames.has(featureName)) return;
          seenAreaNames.add(featureName);
          const rawCode = String(areaCode || shortLabel || featureName).trim();
          const digits = rawCode.match(/\d+/)?.[0] || '';
          const numVal = digits ? Number(digits) : Number.MAX_SAFE_INTEGER;
          uniqueAreaItems.push({
            name: featureName,
            countryId: countryObj.id,
            sortKey: rawCode,
            numVal
          });
        });
        uniqueAreaItems.sort((a, b) => {
          if (a.countryId !== b.countryId) return a.countryId.localeCompare(b.countryId);
          if (a.numVal !== b.numVal) return a.numVal - b.numVal;
          return a.sortKey.localeCompare(b.sortKey, undefined, { numeric: true });
        });
        uniqueAreaItems.forEach((item, rankIdx) => {
          // Step through the 20-color palette using coprime stride 7 so consecutive codes (e.g. 91, 92, 93, 94...) never get similar colors
          const paletteIdx = (rankIdx * 7) % DISTINCT_AREA_CODE_PALETTE.length;
          areaCodeGradientHexMap.set(item.name, DISTINCT_AREA_CODE_PALETTE[paletteIdx]);
        });
      }

      const targetBestSpanAreaMap = new Map<string, number>();
      const placedStudyLabelsByFeature = new Map<string, Array<[number, number]>>();

      allRawFeatures.forEach(({ feature, countryObj }, idx) => {
        const geom = feature.geometry;
        if (!geom) return;
        const p = feature.properties || {};
        const { featureName, shortLabel, areaCode, parentGroup, localName } = extractFeatureInfo(
          p,
          quizOption,
          countryObj.id
        );
        if (!featureName) return;

        const rings: number[][][] = [];
        const holes: number[][][][] = [];
        let sumLat = 0,
          sumLng = 0,
          ptCount = 0;
        let fMinLat = 90,
          fMaxLat = -90,
          fMinLng = 180,
          fMaxLng = -180;

        // Track individual ring centroids & bbox areas so mainland vs distant territory flags are centered accurately!
        const ringInfos: Array<{
          cLat: number;
          cLng: number;
          spanArea: number;
          spanDiag: number;
        }> = [];

        const collectPolygon = (outerRing: number[][], holeRings: number[][][] = []) => {
          if (!outerRing || outerRing.length < 3) return;
          rings.push(outerRing);
          holes.push(holeRings.filter((hr) => Array.isArray(hr) && hr.length >= 3));
          let rSumLat = 0,
            rSumLng = 0,
            rCnt = 0;
          let rMinLat = 90,
            rMaxLat = -90,
            rMinLng = 180,
            rMaxLng = -180;
          outerRing.forEach(([lng, lat]) => {
            sumLat += lat;
            sumLng += lng;
            ptCount++;
            rSumLat += lat;
            rSumLng += lng;
            rCnt++;
            if (lat < fMinLat) fMinLat = lat;
            if (lat > fMaxLat) fMaxLat = lat;
            if (lng < fMinLng) fMinLng = lng;
            if (lng > fMaxLng) fMaxLng = lng;
            if (lat < rMinLat) rMinLat = lat;
            if (lat > rMaxLat) rMaxLat = lat;
            if (lng < rMinLng) rMinLng = lng;
            if (lng > rMaxLng) rMaxLng = lng;
            if (lat < globalMinLat) globalMinLat = lat;
            if (lat > globalMaxLat) globalMaxLat = lat;
            if (lng < globalMinLng) globalMinLng = lng;
            if (lng > globalMaxLng) globalMaxLng = lng;
          });
          if (rCnt > 0) {
            const midLat = (rMinLat + rMaxLat) / 2;
            const dLng = Math.min(180, rMaxLng - rMinLng);
            const dLat = rMaxLat - rMinLat;
            const cosL = Math.max(0.2, Math.cos((midLat * Math.PI) / 180));
            const area = dLng * cosL * dLat;
            // Blend vertex average with bounding box midpoint so ragged northern/coastal peninsulas don't pull the center off the landmass
            const centerLat = (rSumLat / rCnt) * 0.45 + midLat * 0.55;
            const centerLng = (rSumLng / rCnt) * 0.45 + ((rMinLng + rMaxLng) / 2) * 0.55;
            ringInfos.push({
              cLat: centerLat,
              cLng: centerLng,
              spanArea: area,
              spanDiag: Math.hypot(dLng * cosL, dLat)
            });
          }
        };

        if (geom.type === 'Polygon') {
          if (geom.coordinates?.[0]) {
            collectPolygon(geom.coordinates[0], geom.coordinates.slice(1));
          }
        } else if (geom.type === 'MultiPolygon') {
          (geom.coordinates || []).forEach((poly: number[][][]) => {
            if (poly?.[0]) {
              collectPolygon(poly[0], poly.slice(1));
            }
          });
        }

        if (ptCount === 0) return;

        // Sort ringInfos by geographic area (largest mainland ring first!)
        ringInfos.sort((a, b) => b.spanArea - a.spanArea);
        const primaryRingInfo = ringInfos[0];
        const totalSpanArea = ringInfos.reduce((acc, r) => acc + r.spanArea, 0);
        const primarySpanDiag = primaryRingInfo ? primaryRingInfo.spanDiag : 1.0;

        // Use curated mainland center for whole-country quizzes on countries with huge archipelagos/territories, otherwise largest mainland ring center!
        const isWholeCountryFeature =
          quizOption.levelKey === 'COUNTRY' ||
          quizOption.levelKey === 'COUNTRY_FLAG' ||
          quizOption.levelKey === 'COUNTRY_CAPITAL';

        const MAINLAND_COUNTRY_CENTERS: Record<string, [number, number]> = {
          US: [39.5, -98.5],
          CA: [54.5, -106.0],
          FR: [46.6, 2.4],
          NO: [61.2, 8.8],
          RU: [61.5, 94.0],
          GB: [53.5, -1.8],
          ES: [40.2, -3.7],
          PT: [39.6, -8.1],
          NL: [52.2, 5.5],
          DK: [56.0, 9.5],
          MY: [4.1, 102.2],
          ID: [-2.2, 114.0],
          CL: [-35.5, -71.2]
        };

        const cLat =
          isWholeCountryFeature && MAINLAND_COUNTRY_CENTERS[countryObj.id]
            ? MAINLAND_COUNTRY_CENTERS[countryObj.id][0]
            : primaryRingInfo
            ? primaryRingInfo.cLat
            : sumLat / ptCount;
        const cLng =
          isWholeCountryFeature && MAINLAND_COUNTRY_CENTERS[countryObj.id]
            ? MAINLAND_COUNTRY_CENTERS[countryObj.id][1]
            : primaryRingInfo
            ? primaryRingInfo.cLng
            : sumLng / ptCount;

        // Check if this feature is on the country's mainland (not an overseas island thousands of km away)
        if (
          countriesToLoad.length === 1 &&
          Math.abs(cLat - refMainLat) <= 22 &&
          Math.abs(cLng - refMainLng) <= 35
        ) {
          if (fMinLat < mainMinLat) mainMinLat = fMinLat;
          if (fMaxLat > mainMaxLat) mainMaxLat = fMaxLat;
          if (fMinLng < mainMinLng) mainMinLng = fMinLng;
          if (fMaxLng > mainMaxLng) mainMaxLng = fMaxLng;
        }

        parsedList.push({
          id: `qf-${idx}`,
          featureName,
          shortLabel,
          areaCode,
          parentGroup,
          localName,
          countryCode: countryObj.id,
          rings,
          holes,
          spanArea: totalSpanArea,
          spanDiag: primarySpanDiag,
          centroidLat: cLat,
          centroidLng: cLng,
          bbox: [fMinLng, fMinLat, fMaxLng, fMaxLat]
        });

        const isCountryFlagQuiz = quizOption.levelKey === 'COUNTRY_FLAG';
        const isSubdivisionFlagQuiz = quizOption.category === 'flags' && !isCountryFlagQuiz;
        const isCountryCapitalQuiz = quizOption.levelKey === 'COUNTRY_CAPITAL';
        const customSubFlagUrl = isSubdivisionFlagQuiz
          ? getSubdivisionFlagImageUrl(shortLabel || featureName, countryObj.id)
          : undefined;
        const featureBestArea = primaryRingInfo ? primaryRingInfo.spanArea : 0;

        // Register unique quiz target (and update centroid if this polygon is larger than a previously seen island/exclave of the same code!)
        if (!targetMap.has(featureName)) {
          const promptLabel = isCountryCapitalQuiz
            ? `Capital: ${countryObj.capital} (Click Country)`
            : featureName;

          targetBestSpanAreaMap.set(featureName, featureBestArea);
          targetMap.set(featureName, {
            name: featureName,
            promptLabel,
            code: areaCode || undefined,
            parentGroup: parentGroup || undefined,
            localName: localName || undefined,
            flagPrompt: quizOption.category === 'flags' || isCountryFlagQuiz,
            isCountryFlag: isCountryFlagQuiz,
            lat: cLat,
            lng: cLng,
            countryCode: countryObj.id,
            countryName: countryObj.name
          });
        } else if (featureBestArea > (targetBestSpanAreaMap.get(featureName) || 0)) {
          targetBestSpanAreaMap.set(featureName, featureBestArea);
          const existingTarget = targetMap.get(featureName)!;
          existingTarget.lat = cLat;
          existingTarget.lng = cLng;
        }

        // Place Study Mode labels:
        if (!placedStudyLabelsByFeature.has(featureName)) {
          placedStudyLabelsByFeature.set(featureName, []);
        }
        const placedForFeature = placedStudyLabelsByFeature.get(featureName)!;
        const areaPillBorderCss = isAreaCodeQuiz
          ? `#${(areaCodeGradientHexMap.get(featureName) ?? 0x38bdf8).toString(16).padStart(6, '0')}`
          : undefined;

        const tryPlaceStudySprite = (lat: number, lng: number, minSeparationDeg: number) => {
          const tooClose = placedForFeature.some(
            ([pLat, pLng]) => Math.hypot(lat - pLat, lng - pLng) < minSeparationDeg
          );
          if (tooClose) return;
          placedForFeature.push([lat, lng]);
          const sp =
            isCountryFlagQuiz || quizOption.category === 'flags'
              ? createFlagSprite(countryObj.id, shortLabel || featureName, customSubFlagUrl)
              : createTextSprite(
                  shortLabel || featureName,
                  localName || undefined,
                  areaPillBorderCss
                );
          sp.position.copy(latLngToVector3(lat, lng, GLOBE_RADIUS + 0.28));
          studyGrp.add(sp);
        };

        if (placedForFeature.length === 0) {
          tryPlaceStudySprite(cLat, cLng, 0.1);
        } else if (isAreaCodeQuiz && (!primaryRingInfo || primaryRingInfo.spanDiag >= 0.85)) {
          tryPlaceStudySprite(cLat, cLng, 4.2);
        }

        if (isAreaCodeQuiz && ringInfos.length > 1) {
          for (let rIdx = 0; rIdx < ringInfos.length; rIdx++) {
            const ri = ringInfos[rIdx];
            if (ri.spanDiag >= 1.6) {
              tryPlaceStudySprite(ri.cLat, ri.cLng, 4.2);
            }
          }
        } else if ((isCountryFlagQuiz || quizOption.category === 'flags') && ringInfos.length > 1) {
          for (let rIdx = 0; rIdx < ringInfos.length; rIdx++) {
            const ri = ringInfos[rIdx];
            if (ri.spanDiag >= 1.35) {
              tryPlaceStudySprite(ri.cLat, ri.cLng, 7.5);
            }
          }
        }
      });

      // Automatic Enclave Cutout Synthesis:
      // For any smaller enclave polygon strictly inside a larger region (e.g. Osh(city) inside Osh, Biškek inside Chüy, ACT inside NSW, Wien inside Niederösterreich, Bruxelles inside Vlaanderen),
      // ensure the surrounding polygon has a cutout hole for the enclave so its fill never paints over or intercepts clicks inside the enclave!
      for (let i = 0; i < parsedList.length; i++) {
        const smallPf = parsedList[i];
        const sArea = smallPf.spanArea ?? 0;
        const [sMinLng, sMinLat, sMaxLng, sMaxLat] = smallPf.bbox;
        for (let j = 0; j < parsedList.length; j++) {
          if (i === j) continue;
          const bigPf = parsedList[j];
          if (smallPf.featureName === bigPf.featureName) continue;
          const bArea = bigPf.spanArea ?? 0;
          if (sArea >= bArea * 0.45) continue;
          const [bMinLng, bMinLat, bMaxLng, bMaxLat] = bigPf.bbox;
          if (
            sMinLng < bMinLng - 0.02 ||
            sMaxLng > bMaxLng + 0.02 ||
            sMinLat < bMinLat - 0.02 ||
            sMaxLat > bMaxLat + 0.02
          ) {
            continue;
          }
          if (!bigPf.holes) {
            bigPf.holes = bigPf.rings.map(() => []);
          }
          for (let sIdx = 0; sIdx < smallPf.rings.length; sIdx++) {
            const sRing = smallPf.rings[sIdx];
            if (!sRing || sRing.length < 4) continue;
            // Compute ring centroid & bounding box to verify sRing is genuinely enclosed by bRing (not merely a neighbor sharing border vertices)
            let srMinX = 180,
              srMaxX = -180,
              srMinY = 90,
              srMaxY = -90,
              srSumX = 0,
              srSumY = 0;
            for (let k = 0; k < sRing.length; k++) {
              const rx = sRing[k][0];
              const ry = sRing[k][1];
              if (rx < srMinX) srMinX = rx;
              if (rx > srMaxX) srMaxX = rx;
              if (ry < srMinY) srMinY = ry;
              if (ry > srMaxY) srMaxY = ry;
              srSumX += rx;
              srSumY += ry;
            }
            const ringCenterPt: [number, number] = [
              srSumX / sRing.length,
              srSumY / sRing.length
            ];
            for (let bIdx = 0; bIdx < bigPf.rings.length; bIdx++) {
              const bRing = bigPf.rings[bIdx];
              if (!isPointInPolygon(ringCenterPt, bRing)) continue;
              let insideCount = 0;
              const step = Math.max(1, Math.floor(sRing.length / 16));
              let sampleCount = 0;
              for (let k = 0; k < sRing.length; k += step) {
                sampleCount++;
                if (isPointInPolygon([sRing[k][0], sRing[k][1]], bRing)) {
                  insideCount++;
                }
              }
              if (sampleCount === 0 || insideCount / sampleCount < 0.85) continue;
              const bHoles = bigPf.holes[bIdx] || (bigPf.holes[bIdx] = []);
              const alreadyInHole = bHoles.some((hr) => isPointInPolygon(ringCenterPt, hr));
              if (!alreadyInHole) {
                bHoles.push(sRing);
              }
            }
          }
        }
      }

      // Sort parsedList largest-area first so smaller enclaves are added to the Three.js scene AFTER larger regions
      const renderSortedList = [...parsedList].sort(
        (a, b) => (b.spanArea ?? 0) - (a.spanArea ?? 0)
      );

      renderSortedList.forEach((pf) => {
        const { featureName, rings, holes, centroidLat: cLat, centroidLng: cLng } = pf;
        const fDiag = pf.spanDiag ?? 2.0;
        // Place both polygon fill meshes and border lines at the EXACT same 3D spherical radius (GLOBE_RADIUS + 0.08)
        // and use WebGL renderOrder (2..6 for fills, 22..26 for lines) + depthWrite: false so there is ZERO 3D parallax shift at any zoom angle!
        const meshRenderOrder = fDiag < 0.38 ? 6 : fDiag < 0.95 ? 4 : 2;
        const lineRenderOrder = fDiag < 0.38 ? 26 : fDiag < 0.95 ? 24 : 22;

        const keyLower = featureName.toLowerCase();
        if (!featureVisualsMapRef.current.has(keyLower)) {
          featureVisualsMapRef.current.set(keyLower, {
            meshes: [],
            lines: [],
            rings: [],
            holes: [],
            spanDiag: fDiag
          });
        }
        const visEntry = featureVisualsMapRef.current.get(keyLower)!;
        if (!visEntry.rings) visEntry.rings = [];
        if (!visEntry.holes) visEntry.holes = [];
        if (visEntry.spanDiag === undefined || fDiag < visEntry.spanDiag) {
          visEntry.spanDiag = fDiag;
        }

        const paletteHex = isAreaCodeQuiz
          ? (areaCodeGradientHexMap.get(featureName) ?? 0x38bdf8)
          : 0x38bdf8;
        if (isAreaCodeQuiz) {
          (visEntry as any).areaCodeHex = paletteHex;
        }
        // Apply each area code's distinct color in BOTH Study Mode AND Quiz Mode so merged zones (Level 1/2 or multi-province codes) are always clear!
        const activeBorderHex = isAreaCodeQuiz ? paletteHex : 0x38bdf8;
        const activeFillHex = isAreaCodeQuiz ? paletteHex : 0x0f172a;
        const activeFillOpacity = isAreaCodeQuiz ? 0.30 : 0.28;

        const decimateRingHelper = (rawRing: number[][], minDistSq: number): number[][] => {
          const out: number[][] = [];
          for (let i = 0; i < rawRing.length; i++) {
            const pt = rawRing[i];
            if (i === 0 || i === rawRing.length - 1) {
              out.push(pt);
              continue;
            }
            const prev = out[out.length - 1];
            const dx1 = pt[0] - prev[0];
            const dy1 = pt[1] - prev[1];
            if (dx1 * dx1 + dy1 * dy1 >= minDistSq) {
              out.push(pt);
            }
          }
          return out;
        };

        // Keep fine vertex resolution even on large municipal maps (like bra_adm2 with Vanini) so rendered borders match hit rings 1:1
        const minDistSq = isLargeFeatureSet ? 0.000009 : 0.000004;
        const featureLocalCenter = latLngToVector3(cLat, cLng, GLOBE_RADIUS);

        // Find sibling polygons that share the exact same featureName (e.g., Level 1 / Level 2 merged area codes or multi-province area codes)
        // so we can suppress shared interior border edges and show a clean outer boundary per area code!
        const siblingFeatures = isAreaCodeQuiz
          ? renderSortedList.filter(
              (other) => other !== pf && other.featureName === featureName
            )
          : [];

        rings.forEach((ring, rIdx) => {
          const decimatedRing = decimateRingHelper(ring, minDistSq);
          const rawRingHoles = holes?.[rIdx] || [];
          const decimatedHoles = rawRingHoles
            .map((hr) => decimateRingHelper(hr, minDistSq * 0.5))
            .filter((hr) => hr.length >= 3);

          let rMinX = 180,
            rMaxX = -180,
            rMinY = 90,
            rMaxY = -90;
          for (let ri = 0; ri < decimatedRing.length; ri++) {
            const rx = decimatedRing[ri][0];
            const ry = decimatedRing[ri][1];
            if (rx < rMinX) rMinX = rx;
            if (rx > rMaxX) rMaxX = rx;
            if (ry < rMinY) rMinY = ry;
            if (ry > rMaxY) rMaxY = ry;
          }
          const ringLocalCenter =
            decimatedRing.length >= 3
              ? latLngToVector3((rMinY + rMaxY) * 0.5, (rMinX + rMaxX) * 0.5, GLOBE_RADIUS)
              : featureLocalCenter;

          if (decimatedRing.length >= 3) {
            visEntry.rings!.push(decimatedRing);
            visEntry.holes!.push(decimatedHoles);
            visEntry.localCenter = featureLocalCenter;
          }

          const lineMat = new THREE.LineBasicMaterial({
            color: activeBorderHex,
            transparent: true,
            opacity: isDailyGlobeMode ? 0.65 : 0.96,
            depthWrite: false
          });

          if (siblingFeatures.length > 0 && decimatedRing.length >= 3) {
            // Suppress interior border segments that touch a sibling polygon of the same area code
            const segPositions: number[] = [];
            const isSharedWithSibling = (mx: number, my: number): boolean => {
              for (const sib of siblingFeatures) {
                const [sMinX, sMinY, sMaxX, sMaxY] = sib.bbox;
                if (
                  mx < sMinX - 0.025 ||
                  mx > sMaxX + 0.025 ||
                  my < sMinY - 0.025 ||
                  my > sMaxY + 0.025
                ) {
                  continue;
                }
                for (const sRing of sib.rings) {
                  for (let si = 0; si < sRing.length - 1; si++) {
                    const ax = sRing[si][0],
                      ay = sRing[si][1];
                    const bx = sRing[si + 1][0],
                      by = sRing[si + 1][1];
                    const abx = bx - ax,
                      aby = by - ay;
                    const lenSq = abx * abx + aby * aby;
                    const t =
                      lenSq > 1e-10
                        ? Math.max(0, Math.min(1, ((mx - ax) * abx + (my - ay) * aby) / lenSq))
                        : 0;
                    const px = ax + t * abx,
                      py = ay + t * aby;
                    if ((mx - px) * (mx - px) + (my - py) * (my - py) < 0.00022) {
                      return true;
                    }
                  }
                }
              }
              return false;
            };

            for (let ri = 0; ri < decimatedRing.length - 1; ri++) {
              const p0 = decimatedRing[ri];
              const p1 = decimatedRing[ri + 1];
              const mx = (p0[0] + p1[0]) * 0.5;
              const my = (p0[1] + p1[1]) * 0.5;
              if (isSharedWithSibling(mx, my)) continue;
              const v0 = latLngToVector3(p0[1], p0[0], GLOBE_RADIUS + 0.08);
              const v1 = latLngToVector3(p1[1], p1[0], GLOBE_RADIUS + 0.08);
              segPositions.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z);
            }
            if (segPositions.length > 0) {
              const lineGeo = new THREE.BufferGeometry();
              lineGeo.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(segPositions, 3)
              );
              const lineObj = new THREE.LineSegments(lineGeo, lineMat);
              lineObj.renderOrder = lineRenderOrder;
              lineObj.userData = { localCenter: ringLocalCenter };
              overlayGrp.add(lineObj);
              visEntry.lines.push(lineObj as unknown as THREE.Line);
            }
          } else {
            const linePts = buildSphericalRingPoints(
              decimatedRing,
              GLOBE_RADIUS + 0.08,
              0.8,
              true
            );
            const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
            const lineObj = new THREE.Line(lineGeo, lineMat);
            lineObj.renderOrder = lineRenderOrder;
            lineObj.userData = { localCenter: ringLocalCenter };
            overlayGrp.add(lineObj);
            visEntry.lines.push(lineObj);
          }

          // Also draw interior hole boundary lines so cutout borders remain razor-sharp
          decimatedHoles.forEach((hRing) => {
            const hPts = buildSphericalRingPoints(
              hRing,
              GLOBE_RADIUS + 0.08,
              0.8,
              true
            );
            const hGeo = new THREE.BufferGeometry().setFromPoints(hPts);
            const hObj = new THREE.Line(hGeo, lineMat);
            hObj.renderOrder = lineRenderOrder;
            hObj.userData = { localCenter: ringLocalCenter };
            overlayGrp.add(hObj);
            visEntry.lines.push(hObj);
          });

          // Curved Spherical Subdivided Polygon Fill with Enclave Cutout Holes!
          const ringSpanDeg = Math.hypot(rMaxX - rMinX, rMaxY - rMinY);
          const rSpanLng = rMaxX - rMinX;
          if (decimatedRing.length >= 3 && rSpanLng < 165 && ringSpanDeg < 135 && !isLargeFeatureSet) {
            const subStep = isMediumFeatureSet
              ? 2.2
              : ringSpanDeg > 12
              ? 1.35
              : 1.65;
            const sGeo = createSphericalPolygonGeometry(
              decimatedRing,
              GLOBE_RADIUS + 0.08,
              subStep,
              decimatedHoles
            );
            if (sGeo) {
              const fillMat = new THREE.MeshBasicMaterial({
                color: activeFillHex,
                transparent: true,
                opacity: activeFillOpacity,
                side: THREE.DoubleSide,
                depthWrite: false
              });
              const meshObj = new THREE.Mesh(sGeo, fillMat);
              meshObj.renderOrder = meshRenderOrder;
              meshObj.userData = { localCenter: ringLocalCenter };
              overlayGrp.add(meshObj);
              visEntry.meshes.push(meshObj);
            }
          }
        });
      });

      parsedQuizFeaturesRef.current = parsedList;
      studyGrp.visible = initialMode === 'study';

      // If Daily Subdivisions or Daily Area Codes pool is active, pick those 5 exact targets across the 5 distinct countries!
      let finalTargets: GlobeQuizTargetItem[] = [];
      if (dailySubdivisionsPool && dailySubdivisionsPool.length > 0) {
        dailySubdivisionsPool.forEach((dp) => {
          const match = Array.from(targetMap.values()).find(
            (t) =>
              t.countryCode?.toUpperCase() === dp.countryCode.toUpperCase() &&
              (t.name.toLowerCase().includes(dp.name.toLowerCase()) ||
                dp.name.toLowerCase().includes(t.name.toLowerCase()))
          );
          if (match) {
            finalTargets.push(match);
          } else {
            const anyInCountry = Array.from(targetMap.values()).find(
              (t) => t.countryCode?.toUpperCase() === dp.countryCode.toUpperCase()
            );
            if (anyInCountry) finalTargets.push(anyInCountry);
          }
        });
      } else if (dailyAreaCodesPool && dailyAreaCodesPool.length > 0) {
        dailyAreaCodesPool.forEach((dp) => {
          const cleanCode = dp.code.replace(/^0+/, '');
          const match = Array.from(targetMap.values()).find(
            (t) =>
              t.countryCode?.toUpperCase() === dp.countryCode.toUpperCase() &&
              (t.code === dp.code || t.code?.replace(/^0+/, '') === cleanCode)
          );
          if (match) {
            finalTargets.push(match);
          } else {
            const anyInCountry = Array.from(targetMap.values()).find(
              (t) => t.countryCode?.toUpperCase() === dp.countryCode.toUpperCase()
            );
            if (anyInCountry) finalTargets.push(anyInCountry);
          }
        });
      } else {
        finalTargets = fisherYatesShuffle(Array.from(targetMap.values()));
      }

      // Apply Question Count Limit (Custom #) if selected!
      const limitFromGroups = selectedGroups
        .find((g) => g.startsWith('limit:'))
        ?.slice(6)
        .trim();
      const effectiveLimit =
        activeQuizConfig.questionLimit ||
        (limitFromGroups ? Number(limitFromGroups) : 0);
      if (effectiveLimit > 0 && initialMode === 'quiz' && finalTargets.length > effectiveLimit) {
        finalTargets = finalTargets.slice(0, effectiveLimit);
      }

      // Always start quizzes fresh from 0 (clear any legacy mid-quiz localStorage state)
      try {
        localStorage.removeItem(`atlas_midquiz_v1_${quizOption.id}`);
      } catch {
        // Ignore storage error
      }
      setQueue(finalTargets);
      setTotalInitialCount(finalTargets.length);

      // Frame 100% of loaded quiz polygons (using mainland bounds for single-country quizzes so Guam/Alaska never pull the camera to 0°!)
      const useMainlandBounds =
        countriesToLoad.length === 1 &&
        mainMinLat <= mainMaxLat &&
        globalMaxLng - globalMinLng > 65;

      const frameMinLat = useMainlandBounds ? mainMinLat : globalMinLat;
      const frameMaxLat = useMainlandBounds ? mainMaxLat : globalMaxLat;
      const frameMinLng = useMainlandBounds ? mainMinLng : globalMinLng;
      const frameMaxLng = useMainlandBounds ? mainMaxLng : globalMaxLng;

      if (isDailyGlobeMode || (multiCountries && multiCountries.length > 10)) {
        quizDefaultViewRef.current = { lat: 20, lng: 10, z: 245 };
        flyToLatLng(20, 10, 245);
      } else if (frameMinLat <= frameMaxLat && frameMaxLng - frameMinLng <= 120) {
        const aspect =
          (mountRef.current?.clientWidth || window.innerWidth) /
          Math.max(1, mountRef.current?.clientHeight || window.innerHeight);
        const latSpan = frameMaxLat - frameMinLat;
        const lngSpan = (frameMaxLng - frameMinLng) / Math.min(1, aspect * 1.15);
        const maxSpan = Math.max(latSpan * 1.28, lngSpan * 0.95);
        const idealZ =
          maxSpan > 95
            ? 245
            : GLOBE_RADIUS + Math.max(6.5, Math.min(158, maxSpan * 2.68));
        const midLat = (frameMinLat + frameMaxLat) / 2;
        const midLng = (frameMinLng + frameMaxLng) / 2;
        quizDefaultViewRef.current = { lat: midLat, lng: midLng, z: idealZ };
        flyToLatLng(midLat, midLng, idealZ);
      } else {
        quizDefaultViewRef.current = { lat: refMainLat, lng: refMainLng, z: 155 };
        flyToLatLng(refMainLat, refMainLng, 155);
      }
    };

    buildGlobeQuiz();
  }, [activeQuizConfig, cityTier]);

  // Toggle Study Mode labels visibility and Area Code distinct colors when switching between Quiz and Study mode
  useEffect(() => {
    if (studyLabelsGroupRef.current) {
      studyLabelsGroupRef.current.visible = mode === 'study';
    }
    featureVisualsMapRef.current.forEach((vis: any, featureKey: string) => {
      if (mode === 'study') {
        if (vis.areaCodeHex !== undefined && !vis.status) {
          setQuizFeatureColor(featureKey, vis.areaCodeHex, 0.32, vis.areaCodeHex, 0.98);
        }
      } else {
        const normKey = featureKey.toLowerCase().trim();
        if (solvedSetRef.current.has(normKey) && difficultyModeRef.current === 'easy') {
          if (solvedRecycledOrangeSetRef.current.has(normKey)) {
            setQuizFeatureColor(featureKey, 0xf59e0b, 0.82, 0xfbbf24, 1.0);
          } else if (solvedWithMistakeSetRef.current.has(normKey)) {
            setQuizFeatureColor(featureKey, 0xdc2626, 0.85, 0xf43f5e, 1.0);
          } else {
            setQuizFeatureColor(featureKey, 0x10b981, 0.78, 0x34d399, 1.0);
          }
        } else if (vis.areaCodeHex !== undefined && !vis.status) {
          setQuizFeatureColor(featureKey, vis.areaCodeHex, 0.30, vis.areaCodeHex, 0.96);
        }
      }
    });
  }, [mode]);

  // When advancing to a recycled question (endlessRetry), ensure it is marked as a mistake-retry item
  useEffect(() => {
    const activeItem = queue[currentIndex];
    if (!activeItem || isQuizDone) return;
    const normName = activeItem.name.toLowerCase().trim();
    if (
      (totalInitialCount > 0 && currentIndex >= totalInitialCount) ||
      isPracticeMissedRunRef.current ||
      missedItemsMapRef.current.has(activeItem.name)
    ) {
      solvedWithMistakeSetRef.current.add(normName);
    }
  }, [currentIndex, queue, totalInitialCount, isQuizDone]);

  // Save quiz completion in IndexedDB and load Personal Leaderboard for this quiz
  const recordCompletionInDB = async (
    finalScore: number,
    totalCount: number,
    elapsedSec: number,
    missedList: GlobeQuizTargetItem[]
  ) => {
    const cfg = activeQuizConfigRef.current || activeQuizConfig;
    if (!cfg) return;
    const { country, quizOption, selectedGroups } = cfg;
    try {
      const clampedScore = totalCount > 0 ? Math.max(0, Math.min(finalScore, totalCount)) : finalScore;
      const accuracyPct =
        totalCount > 0 ? Math.max(0, Math.min(100, Math.round((clampedScore / totalCount) * 100))) : 100;
      const stats = await db.userStats.get('current');
      const settings = await db.settings.get('current');
      const playerName = settings?.playerName || 'Alex';

      // Determine whether this was a partial/practice run (e.g. Level 1 Area Code depth, custom region subset, or random question limit)
      const isPartial =
        Boolean(cfg.isPartialRun) ||
        Boolean(cfg.areaCodeDepth && cfg.areaCodeDepth !== 'all') ||
        Boolean(cfg.questionLimit && cfg.questionLimit < (quizOption.targetCount || 9999)) ||
        selectedGroups.some(
          (g) =>
            g === 'partial:true' ||
            g.startsWith('depth:') ||
            g.startsWith('limit:') ||
            g.startsWith('prefix:') ||
            g.startsWith('digits:')
        );

      const baseQuizKey = quizOption.id || `${country.id}-adm1`;
      const depthTag = selectedGroups.find((g) => g.startsWith('depth:'))?.slice(6);
      const quizKey = isPartial
        ? `${baseQuizKey}${depthTag ? `-lvl${depthTag}` : '-practice'}`
        : baseQuizKey;
      const quizTitle = `${country.name} — ${quizOption.title}`;
      const today = new Date().toISOString().split('T')[0];

      // If this is one of the 3 Daily Trio Challenges, lock it for the rest of today (UTC)!
      if (baseQuizKey.startsWith('daily-')) {
        try {
          const storageKey = `atlas_daily_completed_${today}`;
          const prevDaily = JSON.parse(localStorage.getItem(storageKey) || '{}');
          prevDaily[baseQuizKey] = {
            score: clampedScore,
            maxScore: totalCount,
            accuracy: accuracyPct,
            points: totalCityPoints,
            timeSpentSec: elapsedSec,
            completedAt: Date.now()
          };
          if (baseQuizKey.includes('subdivisions')) prevDaily['subdivisions'] = true;
          if (baseQuizKey.includes('areacodes')) prevDaily['areacodes'] = true;
          if (baseQuizKey.includes('cities')) prevDaily['cities'] = true;
          localStorage.setItem(storageKey, JSON.stringify(prevDaily));
        } catch {
          // Ignore storage error
        }
      }

      // Only record and show Personal Leaderboard for main full quizzes (not custom subsets, practice levels, language quizzes, or "Practice Missed Only" runs)
      const isMultiCountryOrDaily = Boolean(
        (cfg.multiCountries && cfg.multiCountries.length > 1) ||
          (cfg.languageSamplesPool && cfg.languageSamplesPool.length > 0) ||
          quizOption.category === 'languages' ||
          baseQuizKey.startsWith('lang-') ||
          baseQuizKey.startsWith('daily-') ||
          baseQuizKey.startsWith('combined-') ||
          baseQuizKey.startsWith('world-') ||
          ['WORLD', 'CUSTOM'].includes(country.id) ||
          country.id.startsWith('CONT_')
      );
      const isMainFullQuiz = !isPartial && !isPracticeMissedRunRef.current;

      await db.quizAttempts.add({
        quizId: quizKey,
        quizTitle,
        category: quizOption.category || 'Subdivisions',
        score: clampedScore,
        maxScore: totalCount,
        accuracy: accuracyPct,
        timeSpentSec: elapsedSec,
        timestamp: Date.now(),
        playerName,
        isPartialRun: !isMainFullQuiz,
        countryCode: isMultiCountryOrDaily ? 'MULTI' : country.id.toUpperCase(),
        continent: country.continent
      });

      if (isMainFullQuiz) {
        const history = await db.quizAttempts
          .where('quizId')
          .equals(baseQuizKey)
          .filter((a) => !a.isPartialRun)
          .toArray();
        history.sort((a, b) => b.accuracy - a.accuracy || a.timeSpentSec - b.timeSpentSec);
        setPreviousAttempts(history.slice(0, 5));
      } else {
        setPreviousAttempts([]);
      }

      if (stats) {
        const newStreak =
          stats.lastActiveDate === today ? Math.max(1, stats.streakDays || 1) : (stats.streakDays || 0) + 1;

        const cCode = country.id.toUpperCase();
        // Clear any saved mid-quiz session now that the quiz is completed
        try {
          localStorage.removeItem(`atlas_midquiz_v1_${quizOption.id}`);
        } catch {
          // Ignore storage error
        }

        // Strictly update official Country & Continent Mastery % ONLY if this was a single-country FULL quiz run of Level 1 Subdivisions (adm1) or Full Area Codes (or Cities/Extras) — never adm2/adm3, language, or multi-country!
        const isLowerSubdivisionLevel =
          quizOption.category === 'adm2' || quizOption.category === 'adm3';
        const skipMasteryUpdate = isPartial || isLowerSubdivisionLevel || isMultiCountryOrDaily;

        const allAttemptsForCountry = skipMasteryUpdate
          ? []
          : await db.quizAttempts.where('countryCode').equals(cCode).toArray();
        const recomputedCountryPct = skipMasteryUpdate
          ? stats.countryMastery[cCode] || 0
          : computeOfficialCountryMasteryPct(country, allAttemptsForCountry);

        const updatedCountryMastery = skipMasteryUpdate
          ? { ...stats.countryMastery }
          : {
              ...stats.countryMastery,
              [cCode]: recomputedCountryPct
            };
        const prevCont = stats.continentMastery[country.continent] || 0;
        const updatedContinentMastery = skipMasteryUpdate
          ? { ...stats.continentMastery }
          : {
              ...stats.continentMastery,
              [country.continent]: Math.max(prevCont, recomputedCountryPct)
            };

        const masteredSet = new Set<string>(stats.subdivisionsMastered || []);
        if (!skipMasteryUpdate) {
          solvedSetRef.current.forEach((s) => {
            if (!solvedWithMistakeSetRef.current.has(s)) {
              masteredSet.add(`${cCode}:${s}`);
            }
          });
        }

        const existingQueue = [...(stats.missedQueue || [])];
        missedList.forEach((m) => {
          const itemCountryCode = (m.countryCode || cCode).toUpperCase();
          const itemCountryName = m.countryName || country.name;
          const itemId = `${itemCountryCode}:${m.name}`;
          const existingIdx = existingQueue.findIndex((x) => x.id === itemId);
          if (existingIdx >= 0) {
            existingQueue[existingIdx].missedCount += 1;
            existingQueue[existingIdx].lastMissedAt = Date.now();
          } else {
            existingQueue.unshift({
              id: itemId,
              countryCode: itemCountryCode,
              countryName: itemCountryName,
              targetName: m.name,
              quizTitle,
              quizOptionId: quizOption.id,
              geojsonFile: quizOption.geojsonFile,
              missedCount: 1,
              lastMissedAt: Date.now()
            });
          }
        });

        const personalBests = { ...(stats.personalBests || {}) };
        if (accuracyPct === 100) {
          const prevPB = personalBests[quizKey];
          if (!prevPB || elapsedSec < prevPB.bestTimeSec) {
            personalBests[quizKey] = {
              quizId: quizKey,
              quizTitle,
              bestTimeSec: elapsedSec,
              accuracy: 100,
              playerName,
              date: today
            };
            setPersonalBestSec(elapsedSec);
          }
        }

        const dailyHistory = { ...(stats.dailyHistory || {}) };
        if (baseQuizKey.startsWith('daily-')) {
          const entry = dailyHistory[today] || { date: today, totalScore: 0, playerName };
          if (baseQuizKey.includes('cities')) entry.citiesScore = totalCityPoints || finalScore;
          if (baseQuizKey.includes('areacodes')) entry.areacodesScore = finalScore;
          if (baseQuizKey.includes('subdivisions')) entry.subdivisionsScore = finalScore;
          dailyHistory[today] = entry;
        }

        const isCityAttempt =
          quizOption.category === 'cities' ||
          quizOption.levelKey === 'CITY_PIN' ||
          quizOption.id.includes('-cities');
        const questionsIncrement = isCityAttempt
          ? Math.max(1, Math.round(totalCount / 5000))
          : totalCount;
        const correctIncrement = isCityAttempt
          ? Math.min(questionsIncrement, firstTryScoreRef.current)
          : clampedScore;

        await db.userStats.update('current', {
          totalQuizzesPlayed: (stats.totalQuizzesPlayed || 0) + 1,
          totalQuestionsAnswered: (stats.totalQuestionsAnswered || 0) + questionsIncrement,
          correctAnswers: (stats.correctAnswers || 0) + correctIncrement,
          streakDays: newStreak,
          lastActiveDate: today,
          totalTimeSpentSec: (stats.totalTimeSpentSec || 0) + elapsedSec,
          countryMastery: updatedCountryMastery,
          continentMastery: updatedContinentMastery,
          subdivisionsMastered: Array.from(masteredSet),
          missedQueue: existingQueue.slice(0, 60),
          personalBests,
          dailyHistory
        });
      }
    } catch (e) {
      console.error('Failed to save stats:', e);
    }
  };

  // Draw a bold, high-contrast hollow neon-emerald target locator ring on the 3D Globe
  // Uses true 3D triangle-strip ribbon geometry so it has thick, unmistakable visibility over dense cyan borders while staying 100% hollow inside!
  const renderRegionalLanguageCircleOnGlobe = (
    centerLat: number,
    centerLng: number,
    radiusKm: number
  ) => {
    const grp = cityGuessGroupRef.current;
    if (!grp) return;
    disposeGroupChildren(grp);

    const r = GLOBE_RADIUS + 0.26;
    const degRadius = Math.max(1.15, Math.min(8.5, radiusKm / 111));
    const cosLat = Math.max(0.25, Math.cos((centerLat * Math.PI) / 180));
    const segments = 96;

    const addSphericalRibbonRing = (
      innerDeg: number,
      outerDeg: number,
      hexColor: number,
      opacity: number,
      orderOffset: number
    ) => {
      const positions: number[] = [];
      for (let i = 0; i < segments; i++) {
        const a0 = (i / segments) * Math.PI * 2;
        const a1 = ((i + 1) / segments) * Math.PI * 2;

        const p0In = latLngToVector3(
          centerLat + innerDeg * Math.sin(a0),
          centerLng + (innerDeg * Math.cos(a0)) / cosLat,
          r
        );
        const p0Out = latLngToVector3(
          centerLat + outerDeg * Math.sin(a0),
          centerLng + (outerDeg * Math.cos(a0)) / cosLat,
          r
        );
        const p1In = latLngToVector3(
          centerLat + innerDeg * Math.sin(a1),
          centerLng + (innerDeg * Math.cos(a1)) / cosLat,
          r
        );
        const p1Out = latLngToVector3(
          centerLat + outerDeg * Math.sin(a1),
          centerLng + (outerDeg * Math.cos(a1)) / cosLat,
          r
        );

        positions.push(
          p0In.x, p0In.y, p0In.z,
          p0Out.x, p0Out.y, p0Out.z,
          p1Out.x, p1Out.y, p1Out.z,
          p0In.x, p0In.y, p0In.z,
          p1Out.x, p1Out.y, p1Out.z,
          p1In.x, p1In.y, p1In.z
        );
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const mat = new THREE.MeshBasicMaterial({
        color: hexColor,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = 990 + orderOffset;
      grp.add(mesh);
    };

    const bandThickness = Math.max(0.085, degRadius * 0.055);
    const haloPad = bandThickness * 0.45;

    // 1. Outer Ring: Dark contrast halo + Bright Neon Lime-Emerald ribbon (0x4ade80)
    addSphericalRibbonRing(
      degRadius - haloPad,
      degRadius + bandThickness + haloPad,
      0x022c22,
      0.92,
      1
    );
    addSphericalRibbonRing(
      degRadius,
      degRadius + bandThickness,
      0x4ade80,
      0.98,
      2
    );

    // 2. Inner Concentric Ring: Dark contrast halo + Bright Emerald ribbon (0x22c55e) — 100% hollow center!
    const innerRad = degRadius * 0.68;
    const innerThick = bandThickness * 0.85;
    addSphericalRibbonRing(
      innerRad - haloPad * 0.8,
      innerRad + innerThick + haloPad * 0.8,
      0x022c22,
      0.88,
      1
    );
    addSphericalRibbonRing(
      innerRad,
      innerRad + innerThick,
      0x22c55e,
      0.95,
      2
    );
  };

  // Handle tap on the 3D Globe during an active quiz
  const handleGlobeQuizTap = (lat: number, lng: number) => {
    const cfg = activeQuizConfigRef.current;
    if (!cfg || modeRef.current === 'study' || isAdvancingQuestionRef.current) return;

    const activeQ = queueRef.current;
    const idx = currentIndexRef.current;
    const currentTarget = activeQ[idx];
    if (!currentTarget) return;

    // MODE 0: WORLD LANGUAGE GUESSER ON THE 3D GLOBE (Supports Regional Languages like Punjabi, Tamil, Catalan, Welsh!)
    if (currentTarget.languageSample) {
      if (languageGuessResultRef.current) return; // Waiting for user to click Next Language
      const clickedC = findCountryAtCoordinates(lat, lng);
      if (!clickedC) return;

      const sample = currentTarget.languageSample;
      const validCodes = (
        sample.countryCodes && sample.countryCodes.length > 0
          ? sample.countryCodes
          : [sample.countryCode]
      ).map((c) => c.toUpperCase());

      let isCorrect = validCodes.includes(clickedC.id.toUpperCase());
      let clickedLocationLabel = clickedC.name;

      // If this language has a specific regional sub-area (e.g., Punjabi in Punjab, Telugu in AP/Telangana, Catalan in Catalonia/Andorra)
      if (sample.targetRegion) {
        const distToRegKm = calculateDistanceKm(
          lat,
          lng,
          sample.targetRegion.lat,
          sample.targetRegion.lng
        );
        const withinRegion = distToRegKm <= sample.targetRegion.radiusKm * 1.35;
        // Also allow small co-official states like Andorra for Catalan or Sri Lanka/Singapore for Tamil
        const isSmallValidCountry =
          clickedC.id.toUpperCase() !== sample.countryCode.toUpperCase() &&
          validCodes.includes(clickedC.id.toUpperCase());

        isCorrect = withinRegion || isSmallValidCountry;
        renderRegionalLanguageCircleOnGlobe(
          sample.targetRegion.lat,
          sample.targetRegion.lng,
          sample.targetRegion.radiusKm
        );
        if (isCorrect && withinRegion) {
          clickedLocationLabel = `${sample.targetRegion.name} (${clickedC.name})`;
        } else if (!withinRegion && clickedC.id.toUpperCase() === sample.countryCode.toUpperCase()) {
          clickedLocationLabel = `${clickedC.name} (outside ${sample.targetRegion.name})`;
        }
      }

      // Regional ADM1 Language Map: for multilingual countries where a language is spoken in specific regions
      // (e.g. French in Quebec/Wallonia/Romandy, Dutch in Flanders, German in German-speaking CH / South Tyrol,
      // Catalan/Basque/Galician in Spain, Welsh/Scottish Gaelic in UK, regional Indian & Chinese languages),
      // highlight ONLY the specific sub-region polygons on the 3D Globe instead of the entire country!
      const REGIONAL_LANG_ADM1: Record<string, Record<string, { file: string; names: string[] }>> = {
        french: {
          CA: { file: '/maps/subdivisions/canada_adm1.geojson', names: ['Québec', 'Quebec', 'New Brunswick', 'Nouveau-Brunswick'] },
          BE: { file: '/maps/subdivisions/belgium_adm1.geojson', names: ['Wallonie', 'Wallonia', 'Bruxelles', 'Brussels'] },
          CH: { file: '/maps/subdivisions/che_adm1.geojson', names: ['Genève', 'Vaud', 'Neuchâtel', 'Jura', 'Fribourg', 'Valais'] }
        },
        dutch: {
          BE: { file: '/maps/subdivisions/belgium_adm1.geojson', names: ['Vlaanderen', 'Flanders', 'Bruxelles', 'Brussels'] }
        },
        german: {
          CH: {
            file: '/maps/subdivisions/che_adm1.geojson',
            names: [
              'Zürich', 'Bern', 'Luzern', 'Uri', 'Schwyz', 'Obwalden', 'Nidwalden',
              'Glarus', 'Zug', 'Solothurn', 'Basel-Stadt', 'Basel-Landschaft',
              'Schaffhausen', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden',
              'Sankt Gallen', 'Graubünden', 'Aargau', 'Thurgau'
            ]
          },
          IT: { file: '/maps/subdivisions/ita_adm1.geojson', names: ['Trentino-Alto Adige'] },
          BE: { file: '/maps/subdivisions/belgium_adm2.geojson', names: ['Liège', 'Luik'] }
        },
        italian: {
          CH: { file: '/maps/subdivisions/che_adm1.geojson', names: ['Ticino'] }
        },
        catalan: {
          ES: {
            file: '/maps/subdivisions/spain_adm1.geojson',
            names: ['Cataluña', 'Catalonia', 'Catalunya', 'Comunidad Valenciana', 'Valencian Community', 'Islas Baleares', 'Balearic Islands']
          }
        },
        basque: {
          ES: { file: '/maps/subdivisions/spain_adm1.geojson', names: ['País Vasco', 'Basque Country', 'Navarra', 'Navarre'] }
        },
        galician: {
          ES: { file: '/maps/subdivisions/spain_adm1.geojson', names: ['Galicia'] }
        },
        welsh: {
          GB: { file: '/maps/subdivisions/gbr_adm1.geojson', names: ['Wales'] }
        },
        'scottish gaelic': {
          GB: { file: '/maps/subdivisions/gbr_adm1.geojson', names: ['Scotland'] }
        },
        breton: {
          FR: { file: '/maps/subdivisions/france_adm1.geojson', names: ['Bretagne', 'Brittany'] }
        },
        punjabi: {
          IN: { file: '/maps/subdivisions/ind_adm1.geojson', names: ['Punjab'] },
          PK: { file: '/maps/subdivisions/pak_adm1.geojson', names: ['Punjab'] }
        },
        tamil: {
          IN: { file: '/maps/subdivisions/ind_adm1.geojson', names: ['Tamil Nadu'] }
        },
        telugu: {
          IN: { file: '/maps/subdivisions/ind_adm1.geojson', names: ['Andhra Pradesh', 'Telangana'] }
        },
        malayalam: {
          IN: { file: '/maps/subdivisions/ind_adm1.geojson', names: ['Kerala'] }
        },
        kannada: {
          IN: { file: '/maps/subdivisions/ind_adm1.geojson', names: ['Karnataka'] }
        },
        marathi: {
          IN: { file: '/maps/subdivisions/ind_adm1.geojson', names: ['Maharashtra'] }
        },
        gujarati: {
          IN: { file: '/maps/subdivisions/ind_adm1.geojson', names: ['Gujarat'] }
        },
        bengali: {
          IN: { file: '/maps/subdivisions/ind_adm1.geojson', names: ['West Bengal', 'Tripura'] }
        },
        odia: {
          IN: { file: '/maps/subdivisions/ind_adm1.geojson', names: ['Odisha', 'Orissa'] }
        },
        assamese: {
          IN: { file: '/maps/subdivisions/ind_adm1.geojson', names: ['Assam'] }
        },
        hindi: {
          IN: {
            file: '/maps/subdivisions/ind_adm1.geojson',
            names: [
              'Uttar Pradesh', 'Madhya Pradesh', 'Bihar', 'Rajasthan',
              'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Jharkhand',
              'Chhattisgarh', 'NCT of Delhi', 'Delhi'
            ]
          }
        },
        cantonese: {
          CN: { file: '/maps/subdivisions/chn_adm1.geojson', names: ['Guangdong', 'Hong Kong', 'Macau'] }
        },
        tibetan: {
          CN: { file: '/maps/subdivisions/chn_adm1.geojson', names: ['Xizang', 'Tibet', 'Qinghai'] }
        },
        uyghur: {
          CN: { file: '/maps/subdivisions/chn_adm1.geojson', names: ['Xinjiang'] }
        }
      };

      const langKey = sample.language.toLowerCase().trim();
      const regionalMapForLang = REGIONAL_LANG_ADM1[langKey] || {};
      const useRedLangHighlight =
        !isCorrect ||
        currentAttemptedWrongRef.current ||
        missedItemsMapRef.current.has(currentTarget.name);
      const langFillHex = useRedLangHighlight ? 0xdc2626 : 0x10b981;
      const langLineHex = useRedLangHighlight ? 0xf43f5e : 0x34d399;

      // Highlight full countries for nationwide speakers, and specific ADM1 regions for regional speakers!
      validCodes.forEach((code) => {
        const regSpec = regionalMapForLang[code];
        if (regSpec) {
          geojsonCache
            .fetchGeoJSON(regSpec.file)
            .then((admGeo) => {
              const grp = cityGuessGroupRef.current;
              if (!grp || !admGeo?.features) return;
              const targetNamesLower = regSpec.names.map((n) => n.toLowerCase());
              admGeo.features.forEach((af: any) => {
                const ap = af.properties || {};
                const aName = String(ap.NAME_2 || ap.NAME_1 || ap.name || ap.region || '').toLowerCase();
                if (!targetNamesLower.some((tn) => aName.includes(tn) || tn.includes(aName))) return;
                const ag = af.geometry;
                if (!ag) return;
                const drawAdmRing = (ring: number[][]) => {
                  if (!ring || ring.length < 3) return;
                  const pts = buildSphericalRingPoints(ring, GLOBE_RADIUS + 0.22, 0.8, true);
                  const lGeo = new THREE.BufferGeometry().setFromPoints(pts);
                  const lMat = new THREE.LineBasicMaterial({ color: langLineHex, transparent: true, opacity: 1.0 });
                  grp.add(new THREE.Line(lGeo, lMat));
                  const fGeo = createSphericalPolygonGeometry(ring, GLOBE_RADIUS + 0.19, 1.4);
                  if (fGeo) {
                    const fMat = new THREE.MeshBasicMaterial({
                      color: langFillHex,
                      transparent: true,
                      opacity: 0.72,
                      side: THREE.DoubleSide,
                      depthWrite: false
                    });
                    grp.add(new THREE.Mesh(fGeo, fMat));
                  }
                };
                if (ag.type === 'Polygon' && ag.coordinates?.[0]) drawAdmRing(ag.coordinates[0]);
                else if (ag.type === 'MultiPolygon') {
                  (ag.coordinates || []).forEach((poly: number[][][]) => {
                    if (poly?.[0]) drawAdmRing(poly[0]);
                  });
                }
              });
            })
            .catch(() => {
              setQuizFeatureColor(code, langFillHex, 0.72, langLineHex, 1.0);
            });
        } else {
          setQuizFeatureColor(code, langFillHex, 0.72, langLineHex, 1.0);
        }
      });

      if (isCorrect) {
        sounds.playSuccess();
        const maxPossible = totalInitialCountRef.current || activeQ.length;
        const wasFirstTry =
          !currentAttemptedWrongRef.current &&
          !missedItemsMapRef.current.has(currentTarget.name) &&
          !scoredTargetIndicesRef.current.has(idx);
        if (wasFirstTry) {
          scoredTargetIndicesRef.current.add(idx);
          const nextScore = Math.min(maxPossible, firstTryScoreRef.current + 1);
          firstTryScoreRef.current = nextScore;
          setFirstTryScore(nextScore);
        }
      } else {
        sounds.playError();
        if (!validCodes.includes(clickedC.id.toUpperCase())) {
          setQuizFeatureColor(clickedC.id, 0xdc2626, 0.72, 0xf43f5e, 1.0);
        }
        setMissedItemsMap((prev) => {
          const next = new Map(prev);
          next.set(currentTarget.name, currentTarget);
          return next;
        });
        if (sample.targetRegion) {
          flyToLatLng(sample.targetRegion.lat, sample.targetRegion.lng, 148);
        } else {
          const primaryC = COUNTRIES_DATABASE[sample.countryCode];
          if (primaryC) {
            flyToLatLng(primaryC.lat, primaryC.lng, 175);
          }
        }
      }

      setIsLangAnswerMinimized(false);
      setLanguageGuessResult({
        isCorrect,
        clickedCountryName: clickedLocationLabel,
        sample
      });
      return;
    }

    const isCityMode =
      cfg.quizOption.category === 'cities' ||
      cfg.quizOption.levelKey === 'CITY_PIN' ||
      cfg.quizOption.id.includes('-cities');

    // MODE 1: MapTap.gg Style City Pinpoint Guess on the 3D Globe
    if (isCityMode) {
      if (cityGuessResultRef.current) return;
      const trueLat = currentTarget.lat ?? cfg.country.lat;
      const trueLng = currentTarget.lng ?? cfg.country.lng;
      const distKm = calculateDistanceKm(lat, lng, trueLat, trueLng);
      const pts = calculateGeoScore(distKm, quizMaxExtentKmRef.current);

      const isGood = pts >= 2500;
      const hadMistakeOrHint =
        !isGood ||
        currentAttemptedWrongRef.current ||
        missedItemsMapRef.current.has(currentTarget.name);
      renderCityGuessOnGlobe(lat, lng, trueLat, trueLng, hadMistakeOrHint);
      if (isGood) {
        sounds.playSuccess();
        const maxPossible = totalInitialCountRef.current || activeQ.length;
        const wasFirstTry =
          !currentAttemptedWrongRef.current &&
          !missedItemsMapRef.current.has(currentTarget.name) &&
          !scoredTargetIndicesRef.current.has(idx);
        if (wasFirstTry) {
          scoredTargetIndicesRef.current.add(idx);
          const nextScore = Math.min(maxPossible, firstTryScoreRef.current + 1);
          firstTryScoreRef.current = nextScore;
          setFirstTryScore(nextScore);
        }
      } else {
        sounds.playError();
        setMissedItemsMap((prev) => {
          const next = new Map(prev);
          next.set(currentTarget.name, currentTarget);
          return next;
        });
      }
      const nextCityPts = totalCityPointsRef.current + pts;
      totalCityPointsRef.current = nextCityPts;
      setTotalCityPoints(nextCityPts);
      setCityGuessResult({
        cityName: currentTarget.name,
        distanceKm: Math.round(distKm),
        points: pts,
        guessLat: lat,
        guessLng: lng,
        trueLat,
        trueLng
      });
      return;
    }

    // MODE 2: Polygon Subdivision / Area Code / Meta Tap on the 3D Globe
    // Check ALL overlapping features at (lat, lng) so overlapping zones (like Mongolia area codes 1 and 2) always accept the prompted answer!
    const allClickedFeatures = findAllQuizFeaturesAtCoordinates(lat, lng);
    if (allClickedFeatures.length === 0) return;

    const targetNameLower = currentTarget.name.toLowerCase().trim();
    const targetCodeLower = (currentTarget.code || '').toLowerCase().trim();

    const matchingFeature = allClickedFeatures.find(
      (pf) =>
        pf.featureName.toLowerCase().trim() === targetNameLower ||
        (targetCodeLower.length > 0 &&
          (pf.areaCode || '').toLowerCase().trim() === targetCodeLower)
    );
    const clickedFeature = matchingFeature || allClickedFeatures[0];

    const guessedName = clickedFeature.featureName;
    const isMatch = Boolean(matchingFeature);

    if (isMatch) {
      isAdvancingQuestionRef.current = true;
      stopHintBlink();
      if (cityGuessGroupRef.current) {
        disposeGroupChildren(cityGuessGroupRef.current);
      }
      // Cancel any pending wrong-click reset timeout on this feature so it never overwrites the solved color!
      const pendingTid = wrongFlashTimeoutsRef.current.get(targetNameLower);
      if (pendingTid !== undefined) {
        window.clearTimeout(pendingTid);
        wrongFlashTimeoutsRef.current.delete(targetNameLower);
      }

      sounds.playSuccess();
      setWrongClickLabel(null);

      // Never count a recycled question (already in missedItemsMapRef or idx >= totalInitialCount), a hinted question, or an already-scored index as a first-try point!
      const maxPossible = totalInitialCountRef.current || activeQ.length;
      const isRecycledTurn =
        (totalInitialCountRef.current > 0 && idx >= totalInitialCountRef.current) ||
        isPracticeMissedRunRef.current;
      const wasFirstTry =
        !isRecycledTurn &&
        !currentAttemptedWrongRef.current &&
        !missedItemsMapRef.current.has(currentTarget.name) &&
        !scoredTargetIndicesRef.current.has(idx) &&
        !solvedWithMistakeSetRef.current.has(targetNameLower);
      const nextScore = wasFirstTry
        ? Math.min(maxPossible, firstTryScoreRef.current + 1)
        : firstTryScoreRef.current;
      if (wasFirstTry) {
        solvedSetRef.current.add(targetNameLower);
        scoredTargetIndicesRef.current.add(idx);
        firstTryScoreRef.current = nextScore;
        setFirstTryScore(nextScore);
        setFeedback('correct');
        setQuizFeatureColor(currentTarget.name, 0x10b981, 0.78, 0x34d399, 1.0);
        if (difficultyModeRef.current === 'hard') {
          setTimeout(() => {
            setQuizFeatureColor(currentTarget.name, 0x0f172a, 0.25, 0x38bdf8, 0.95);
          }, 650);
        }
      } else if (endlessRetryRef.current || isPracticeMissedRunRef.current) {
        if (currentAttemptedWrongRef.current) {
          // Recycle Missed is ON and user made a mistake/hint on THIS turn:
          // Flash RED briefly (650ms) and then automatically fade back to uncolored so it doesn't give away the answer when its recycled turn arrives!
          solvedWithMistakeSetRef.current.add(targetNameLower);
          setFeedback('correct-after-mistake');
          setQuizFeatureColor(currentTarget.name, 0xdc2626, 0.85, 0xf43f5e, 1.0);
          const fadeTid = window.setTimeout(() => {
            wrongFlashTimeoutsRef.current.delete(targetNameLower);
            setQuizFeatureColor(currentTarget.name, 0x0f172a, 0.25, 0x38bdf8, 0.95);
          }, 650);
          wrongFlashTimeoutsRef.current.set(targetNameLower, fadeTid);
        } else {
          // Solved on the Recycled Turn without a mistake on this turn -> color ORANGE (0xf59e0b) and keep it ORANGE permanently!
          solvedSetRef.current.add(targetNameLower);
          solvedWithMistakeSetRef.current.add(targetNameLower);
          solvedRecycledOrangeSetRef.current.add(targetNameLower);
          setFeedback('correct-recycled');
          setQuizFeatureColor(currentTarget.name, 0xf59e0b, 0.82, 0xfbbf24, 1.0);
          if (difficultyModeRef.current === 'hard') {
            setTimeout(() => {
              setQuizFeatureColor(currentTarget.name, 0x0f172a, 0.25, 0x38bdf8, 0.95);
            }, 650);
          }
        }
      } else {
        // Recycle Missed is OFF and answered right AFTER an earlier wrong guess or hint -> color vivid RED and keep it RED permanently!
        solvedSetRef.current.add(targetNameLower);
        solvedWithMistakeSetRef.current.add(targetNameLower);
        setFeedback('correct-after-mistake');
        setQuizFeatureColor(currentTarget.name, 0xdc2626, 0.85, 0xf43f5e, 1.0);
        if (difficultyModeRef.current === 'hard') {
          setTimeout(() => {
            setQuizFeatureColor(currentTarget.name, 0x0f172a, 0.25, 0x38bdf8, 0.95);
          }, 650);
        }
      }

      const latestQueue = queueRef.current;
      const isFinishingNow = idx + 1 >= latestQueue.length;
      if (isFinishingNow) {
        recordCompletionInDB(
          nextScore,
          totalInitialCountRef.current || latestQueue.length,
          timerSecondsRef.current,
          Array.from(missedItemsMapRef.current.values())
        );
      }

      setTimeout(() => {
        isAdvancingQuestionRef.current = false;
        setFeedback(null);
        currentAttemptedWrongRef.current = false;
        setCurrentAttemptedWrong(false);
        const qNow = queueRef.current;
        if (idx + 1 < qNow.length) {
          setCurrentIndex(idx + 1);
        } else {
          setIsQuizDone(true);
          sounds.playFanfare();
          confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
        }
      }, 550);
    } else {
      sounds.playError();
      setFeedback('incorrect');
      setWrongClickLabel(clickedFeature.shortLabel || clickedFeature.featureName);

      if (!currentAttemptedWrongRef.current) {
        currentAttemptedWrongRef.current = true;
        setCurrentAttemptedWrong(true);
        solvedWithMistakeSetRef.current.add(targetNameLower);
        missedItemsMapRef.current.set(currentTarget.name, currentTarget);
        setMissedItemsMap((prev) => {
          const next = new Map(prev);
          next.set(currentTarget.name, currentTarget);
          return next;
        });
        if (endlessRetryRef.current) {
          setQueue((prev) => [...prev, currentTarget]);
        }
      }

      const guessedKeyLower = guessedName.toLowerCase().trim();
      const prevTid = wrongFlashTimeoutsRef.current.get(guessedKeyLower);
      if (prevTid !== undefined) {
        window.clearTimeout(prevTid);
      }
      setQuizFeatureColor(guessedName, 0xdc2626, 0.85, 0xf43f5e, 1.0);
      const tid = window.setTimeout(() => {
        wrongFlashTimeoutsRef.current.delete(guessedKeyLower);
        if (solvedSetRef.current.has(guessedKeyLower)) {
          if (difficultyModeRef.current === 'hard') {
            setQuizFeatureColor(guessedName, 0x0f172a, 0.25, 0x38bdf8, 0.95);
          } else if (solvedRecycledOrangeSetRef.current.has(guessedKeyLower)) {
            setQuizFeatureColor(guessedName, 0xf59e0b, 0.82, 0xfbbf24, 1.0);
          } else if (solvedWithMistakeSetRef.current.has(guessedKeyLower)) {
            setQuizFeatureColor(guessedName, 0xdc2626, 0.85, 0xf43f5e, 1.0);
          } else {
            setQuizFeatureColor(guessedName, 0x10b981, 0.78, 0x34d399, 1.0);
          }
        } else {
          const visEntry = featureVisualsMapRef.current.get(guessedKeyLower) as any;
          if (visEntry?.areaCodeHex !== undefined) {
            setQuizFeatureColor(
              guessedName,
              visEntry.areaCodeHex,
              0.30,
              visEntry.areaCodeHex,
              0.96
            );
          } else {
            setQuizFeatureColor(guessedName, 0x0f172a, 0.25, 0x38bdf8, 0.95);
          }
        }
      }, 750);
      wrongFlashTimeoutsRef.current.set(guessedKeyLower, tid);

      setTimeout(() => {
        setFeedback(null);
        setWrongClickLabel(null);
      }, 1500);
    }
  };

  // Advance to next city after viewing MapTap distance & points
  const handleNextCityRound = () => {
    sounds.playTap();
    if (cityGuessGroupRef.current) {
      disposeGroupChildren(cityGuessGroupRef.current);
    }
    currentAttemptedWrongRef.current = false;
    setCurrentAttemptedWrong(false);
    setCityGuessResult(null);
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsQuizDone(true);
      sounds.playFanfare();
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      const maxCityPts = Math.max(5000, (totalInitialCountRef.current || queue.length) * 5000);
      recordCompletionInDB(
        totalCityPointsRef.current,
        maxCityPts,
        timerSecondsRef.current,
        Array.from(missedItemsMapRef.current.values())
      );
    }
  };

  // Advance to next language in World Language Guesser
  const handleNextLanguageRound = () => {
    sounds.playTap();
    if (cityGuessGroupRef.current) {
      disposeGroupChildren(cityGuessGroupRef.current);
    }
    // Reset highlighted country borders
    featureVisualsMapRef.current.forEach((_, key) => {
      setQuizFeatureColor(key, 0x0f172a, 0.0, 0x334155, 0.75);
    });
    currentAttemptedWrongRef.current = false;
    setCurrentAttemptedWrong(false);
    setIsLangAnswerMinimized(false);
    setLanguageGuessResult(null);
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsQuizDone(true);
      sounds.playFanfare();
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      recordCompletionInDB(
        firstTryScoreRef.current,
        totalInitialCountRef.current || queue.length,
        timerSecondsRef.current,
        Array.from(missedItemsMapRef.current.values())
      );
    }
  };

  // Reveal Hint on the 3D Globe
  const handleRevealHint = () => {
    const activeTarget = queue[currentIndex];
    if (!activeTarget) return;
    sounds.playHint();
    const normTarget = activeTarget.name.toLowerCase().trim();
    solvedWithMistakeSetRef.current.add(normTarget);

    if (!currentAttemptedWrongRef.current) {
      currentAttemptedWrongRef.current = true;
      setCurrentAttemptedWrong(true);
      missedItemsMapRef.current.set(activeTarget.name, activeTarget);
      setMissedItemsMap((prev) => {
        const next = new Map(prev);
        next.set(activeTarget.name, activeTarget);
        return next;
      });
      if (endlessRetry) {
        setQueue((prev) => [...prev, activeTarget]);
      }
    }

    if (activeTarget.languageSample) {
      const sample = activeTarget.languageSample;
      if (sample.targetRegion) {
        flyToLatLng(sample.targetRegion.lat, sample.targetRegion.lng, 148);
        renderRegionalLanguageCircleOnGlobe(
          sample.targetRegion.lat,
          sample.targetRegion.lng,
          sample.targetRegion.radiusKm
        );
      } else {
        const primaryC = COUNTRIES_DATABASE[sample.countryCode];
        if (primaryC) {
          flyToLatLng(primaryC.lat, primaryC.lng, 165);
          startPolygonBlink(primaryC.id, 0xdc2626, 0xf43f5e);
          renderRegionalLanguageCircleOnGlobe(primaryC.lat, primaryC.lng, 90);
        }
      }
      return;
    }

    if (activeTarget.lat !== undefined && activeTarget.lng !== undefined) {
      const hintZoomZ = Math.min(targetCameraZ.current, 142);
      flyToLatLng(activeTarget.lat, activeTarget.lng, hintZoomZ);
      renderRegionalLanguageCircleOnGlobe(
        activeTarget.lat,
        activeTarget.lng,
        isCitiesQuiz ? 160 : 75
      );
    }
    if (!isCitiesQuiz) {
      startPolygonBlink(activeTarget.name, 0xdc2626, 0xf43f5e);
    }
  };

  const handleSkipTarget = () => {
    const activeTarget = queue[currentIndex];
    if (!activeTarget) return;
    sounds.playTap();
    stopHintBlink();
    if (cityGuessGroupRef.current) {
      disposeGroupChildren(cityGuessGroupRef.current);
    }
    const normTarget = activeTarget.name.toLowerCase().trim();
    solvedWithMistakeSetRef.current.add(normTarget);
    if (!isCitiesQuiz && !activeTarget.languageSample) {
      if (endlessRetry || isPracticeMissedRunRef.current) {
        setQuizFeatureColor(activeTarget.name, 0xdc2626, 0.85, 0xf43f5e, 1.0);
        const fadeTid = window.setTimeout(() => {
          wrongFlashTimeoutsRef.current.delete(normTarget);
          setQuizFeatureColor(activeTarget.name, 0x0f172a, 0.25, 0x38bdf8, 0.95);
        }, 650);
        wrongFlashTimeoutsRef.current.set(normTarget, fadeTid);
      } else {
        solvedSetRef.current.add(normTarget);
        setQuizFeatureColor(activeTarget.name, 0xdc2626, 0.85, 0xf43f5e, 1.0);
      }
    }
    if (endlessRetry && !currentAttemptedWrongRef.current) {
      setQueue((prev) => [...prev, activeTarget]);
    }
    missedItemsMapRef.current.set(activeTarget.name, activeTarget);
    setMissedItemsMap((prev) => {
      const next = new Map(prev);
      next.set(activeTarget.name, activeTarget);
      return next;
    });
    currentAttemptedWrongRef.current = false;
    setCurrentAttemptedWrong(false);
    setCityGuessResult(null);
    setLanguageGuessResult(null);
    setWrongClickLabel(null);
    if (currentIndex + 1 < queue.length || (endlessRetry && !currentAttemptedWrongRef.current)) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsQuizDone(true);
      const updatedMissed = new Map(missedItemsMapRef.current);
      updatedMissed.set(activeTarget.name, activeTarget);
      if (isCitiesQuiz) {
        const maxCityPts = Math.max(5000, (totalInitialCount || queue.length) * 5000);
        recordCompletionInDB(
          totalCityPointsRef.current,
          maxCityPts,
          timerSecondsRef.current,
          Array.from(updatedMissed.values())
        );
      } else {
        recordCompletionInDB(
          firstTryScoreRef.current,
          totalInitialCount || queue.length,
          timerSecondsRef.current,
          Array.from(updatedMissed.values())
        );
      }
    }
  };

  const handleReplayAll = () => {
    sounds.playTap();
    stopHintBlink();
    wrongFlashTimeoutsRef.current.forEach((tid) => window.clearTimeout(tid));
    wrongFlashTimeoutsRef.current.clear();
    if (cityGuessGroupRef.current) {
      disposeGroupChildren(cityGuessGroupRef.current);
    }
    if (activeQuizConfig?.quizOption?.id) {
      try {
        localStorage.removeItem(`atlas_midquiz_v1_${activeQuizConfig.quizOption.id}`);
      } catch {
        // Ignore storage error
      }
    }
    solvedSetRef.current.clear();
    solvedWithMistakeSetRef.current.clear();
    solvedRecycledOrangeSetRef.current.clear();
    featureVisualsMapRef.current.forEach((_, key) => {
      setQuizFeatureColor(key, 0x0f172a, 0.25, 0x38bdf8, 0.95);
    });
    setQueue((prev) => fisherYatesShuffle(prev.slice(0, totalInitialCount || prev.length)));
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setFirstTryScore(0);
    firstTryScoreRef.current = 0;
    isAdvancingQuestionRef.current = false;
    scoredTargetIndicesRef.current.clear();
    setMissedItemsMap(new Map());
    missedItemsMapRef.current = new Map();
    setCurrentAttemptedWrong(false);
    currentAttemptedWrongRef.current = false;
    setIsQuizDone(false);
    setTimerSeconds(0);
    timerSecondsRef.current = 0;
    setCityGuessResult(null);
    setLanguageGuessResult(null);
    setWrongClickLabel(null);
    setTotalCityPoints(0);
    totalCityPointsRef.current = 0;
    setReviewMissedIdx(null);
    setIsAutoReviewingMissed(false);
    isPracticeMissedRunRef.current = false;
  };

  const handlePracticeMissedOnly = () => {
    sounds.playTap();
    stopHintBlink();
    wrongFlashTimeoutsRef.current.forEach((tid) => window.clearTimeout(tid));
    wrongFlashTimeoutsRef.current.clear();
    const missedList = Array.from(missedItemsMap.values());
    if (missedList.length === 0) return;
    isPracticeMissedRunRef.current = true;
    setReviewMissedIdx(null);
    setIsAutoReviewingMissed(false);
    if (cityGuessGroupRef.current) {
      disposeGroupChildren(cityGuessGroupRef.current);
    }
    setPreviousAttempts([]);
    solvedSetRef.current.clear();
    solvedWithMistakeSetRef.current.clear();
    solvedRecycledOrangeSetRef.current.clear();
    missedList.forEach((m) => {
      solvedWithMistakeSetRef.current.add(m.name.toLowerCase().trim());
    });
    isAdvancingQuestionRef.current = false;
    scoredTargetIndicesRef.current.clear();
    featureVisualsMapRef.current.forEach((_, key) => {
      setQuizFeatureColor(key, 0x0f172a, 0.25, 0x38bdf8, 0.95);
    });
    const shuffled = fisherYatesShuffle(missedList);
    setQueue(shuffled);
    setTotalInitialCount(shuffled.length);
    totalInitialCountRef.current = shuffled.length;
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setFirstTryScore(0);
    firstTryScoreRef.current = 0;
    setMissedItemsMap(new Map());
    missedItemsMapRef.current = new Map();
    setCurrentAttemptedWrong(false);
    currentAttemptedWrongRef.current = false;
    setIsQuizDone(false);
    setTimerSeconds(0);
    timerSecondsRef.current = 0;
    setCityGuessResult(null);
    setLanguageGuessResult(null);
    setWrongClickLabel(null);
    setTotalCityPoints(0);
    totalCityPointsRef.current = 0;
  };

  // Post-Quiz Mistake Review Flyover Effect
  useEffect(() => {
    if (!isQuizDone || reviewMissedIdx === null) {
      stopHintBlink();
      if (isQuizDone && reviewMissedIdx === null && cityGuessGroupRef.current) {
        disposeGroupChildren(cityGuessGroupRef.current);
      }
      return;
    }
    const missedList = Array.from(missedItemsMap.values());
    const item = missedList[reviewMissedIdx];
    if (!item) return;

    sounds.playHint();
    stopHintBlink();
    if (cityGuessGroupRef.current) {
      disposeGroupChildren(cityGuessGroupRef.current);
    }

    // Dim all features first so the missed target stands out in blinking Red inside the dark-green locator ring
    featureVisualsMapRef.current.forEach((_, key) => {
      setQuizFeatureColor(key, 0x0f172a, 0.22, 0x334155, 0.85);
    });

    if (item.languageSample) {
      const sample = item.languageSample;
      if (sample.targetRegion) {
        flyToLatLng(sample.targetRegion.lat, sample.targetRegion.lng, 145);
        renderRegionalLanguageCircleOnGlobe(
          sample.targetRegion.lat,
          sample.targetRegion.lng,
          sample.targetRegion.radiusKm
        );
      } else {
        const primaryC = COUNTRIES_DATABASE[sample.countryCode];
        if (primaryC) {
          flyToLatLng(primaryC.lat, primaryC.lng, 160);
          startPolygonBlink(primaryC.id, 0xdc2626, 0xf43f5e);
          renderRegionalLanguageCircleOnGlobe(primaryC.lat, primaryC.lng, 85);
        }
      }
      return;
    }

    if (!isCitiesQuiz) {
      startPolygonBlink(item.name, 0xdc2626, 0xf43f5e);
    }

    if (item.lat !== undefined && item.lng !== undefined) {
      const zoomZ = Math.min(targetCameraZ.current, isCitiesQuiz ? 136 : 142);
      flyToLatLng(item.lat, item.lng, zoomZ);
      renderRegionalLanguageCircleOnGlobe(
        item.lat,
        item.lng,
        isCitiesQuiz ? 95 : 70
      );
      if (cityGuessGroupRef.current) {
        const lbl = createTextSprite(
          item.promptLabel || item.name,
          item.localName,
          '#f43f5e'
        );
        lbl.center.set(0.5, -0.22);
        lbl.position.copy(latLngToVector3(item.lat, item.lng, GLOBE_RADIUS + 0.34));
        cityGuessGroupRef.current.add(lbl);
      }
    }
  }, [reviewMissedIdx, isQuizDone]);

  // Auto-advance timer for Mistake Review Flyover
  useEffect(() => {
    if (!isQuizDone || reviewMissedIdx === null || !isAutoReviewingMissed) return;
    const missedList = Array.from(missedItemsMap.values());
    if (missedList.length <= 1) return;
    const timer = setTimeout(() => {
      setReviewMissedIdx((prev) => {
        if (prev === null) return null;
        if (prev + 1 < missedList.length) return prev + 1;
        setIsAutoReviewingMissed(false);
        return 0;
      });
    }, 2400);
    return () => clearTimeout(timer);
  }, [isQuizDone, reviewMissedIdx, isAutoReviewingMissed, missedItemsMap]);

  // Search Input on Home Globe
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const lower = q.toLowerCase();
    const matches = allCountriesRef.current.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.capital.toLowerCase().includes(lower) ||
        c.id.toLowerCase() === lower
    );
    setSearchResults(matches.slice(0, 7));
  };

  const handleSelectSearchResult = (c: CountryInfo) => {
    sounds.playTap();
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    flyToLatLng(c.lat, c.lng, 150);
    onSelectCountry(c);
  };

  const handleZoomIn = () => {
    sounds.playTap();
    const alt = Math.max(0.38, targetCameraZ.current - GLOBE_RADIUS);
    targetCameraZ.current = Math.max(100.38, targetCameraZ.current - alt * 0.38);
  };

  const handleZoomOut = () => {
    sounds.playTap();
    const alt = Math.max(0.8, targetCameraZ.current - GLOBE_RADIUS);
    targetCameraZ.current = Math.min(580, targetCameraZ.current + alt * 0.55);
  };

  // Reset View: if a quiz is active, reset to show 100% of all loaded quiz GeoJSONs; on home screen, reset to Greenwich (0° Lat, 0° Lng)
  const handleReset = () => {
    sounds.playTap();
    if (activeQuizConfigRef.current && quizDefaultViewRef.current) {
      flyToLatLng(
        quizDefaultViewRef.current.lat,
        quizDefaultViewRef.current.lng,
        quizDefaultViewRef.current.z
      );
      return;
    }
    targetRotationX.current = 0.22;
    targetRotationY.current = -Math.PI / 2;
    targetCameraZ.current = getHomeDefaultCameraZ();
  };

  const activeTarget = queue[currentIndex];
  const maxCityPoints = Math.max(5000, (totalInitialCount || queue.length) * 5000);
  const clampedFirstTryScore =
    totalInitialCount > 0 ? Math.min(firstTryScore, totalInitialCount) : firstTryScore;
  const accuracyPct = isCitiesQuiz
    ? Math.max(0, Math.min(100, Math.round((totalCityPoints / maxCityPoints) * 100)))
    : totalInitialCount > 0
    ? Math.max(0, Math.min(100, Math.round((clampedFirstTryScore / totalInitialCount) * 100)))
    : 100;
  const isDailyQuiz = Boolean(activeQuizConfig?.quizOption.id.startsWith('daily-'));

  // Sync 3D Globe colors dynamically when switching between Dark Mode and Light Mode
  useEffect(() => {
    const isLight = appTheme === 'light';
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(isLight ? 0xe2e8f0 : 0x121214);
    }
    if (oceanMeshRef.current) {
      const mat = oceanMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.color.setHex(isLight ? 0xdbeafe : 0x091322);
      mat.needsUpdate = true;
    }
    if (graticuleMatRef.current) {
      graticuleMatRef.current.color.setHex(isLight ? 0x93c5fd : 0x27272a);
      graticuleMatRef.current.needsUpdate = true;
    }
    if (countryBorderMatRef.current) {
      countryBorderMatRef.current.color.setHex(isLight ? 0x334155 : 0x52525b);
      countryBorderMatRef.current.opacity = isLight ? 0.92 : 0.85;
      countryBorderMatRef.current.needsUpdate = true;
    }
    if (lakeBorderMatRef.current) {
      lakeBorderMatRef.current.color.setHex(isLight ? 0x334155 : 0x52525b);
      lakeBorderMatRef.current.opacity = isLight ? 0.92 : 0.85;
      lakeBorderMatRef.current.needsUpdate = true;
    }
    if (adm1DottedMatRef.current) {
      adm1DottedMatRef.current.color.setHex(isLight ? 0x0284c7 : 0x38bdf8);
      adm1DottedMatRef.current.opacity = isLight ? 0.55 : 0.42;
      adm1DottedMatRef.current.needsUpdate = true;
    }
  }, [appTheme]);

  // Render or clear the 3D Globe Mastery Heatmap when showMasteryHeatmap changes (Platinum 100%, Gold 80%+, Silver 50%+, Bronze 20%+)
  useEffect(() => {
    const hmGrp = heatmapGroupRef.current;
    if (!hmGrp) return;
    while (hmGrp.children.length > 0) hmGrp.remove(hmGrp.children[0]);
    if (!showMasteryHeatmap || activeQuizConfig) return;

    let cancelled = false;
    db.quizAttempts.toArray().then((attempts) => {
      if (cancelled || !heatmapGroupRef.current) return;
      const bestPctByCountry = new Map<string, number>();

      Object.values(COUNTRIES_DATABASE).forEach((c) => {
        if (c.isTerritory) return;
        const pct = computeOfficialCountryMasteryPct(c, attempts);
        if (pct > 0) {
          bestPctByCountry.set(c.id.toUpperCase(), pct);
        }
      });

        geoFeaturesRef.current.forEach((f: any) => {
          const props = f.properties || {};
          let iso2 = String(props.ISO_A2 || props.iso_a2 || '').toUpperCase();
          if (!iso2 || iso2 === '-99') {
            const iso3 = String(props.ISO_A3 || props.iso_a3 || '').toUpperCase();
            const rawName = String(props.NAME || props.name || '').toLowerCase();
            const match = Object.values(COUNTRIES_DATABASE).find(
              (entry) =>
                (iso3 && iso3 !== '-99' && entry.iso3?.toUpperCase() === iso3) ||
                (rawName && entry.name.toLowerCase() === rawName)
            );
            if (match) iso2 = match.id.toUpperCase();
          }
          if (!iso2 || iso2 === '-99') return;

          const pct = bestPctByCountry.get(iso2) || 0;
          if (pct < 20) return;

          // 4 Medal Tiers: Platinum (100%), Gold (80%+), Silver (50%+), Bronze (20%+)
          const fillHex =
            pct >= 100
              ? 0x38bdf8 // Platinum (Icy Cyan-Platinum)
              : pct >= 80
              ? 0xfbbf24 // Gold
              : pct >= 50
              ? 0x94a3b8 // Silver
              : 0xd97706; // Bronze

          const geom = f.geometry;
          if (!geom) return;
          const addRingMesh = (ring: number[][]) => {
            if (!ring || ring.length < 3) return;
            const sGeo = createSphericalPolygonGeometry(ring, GLOBE_RADIUS + 0.12, 1.6);
            if (sGeo) {
              const mat = new THREE.MeshBasicMaterial({
                color: fillHex,
                transparent: true,
                opacity: 0.62,
                side: THREE.DoubleSide,
                depthWrite: false
              });
              hmGrp.add(new THREE.Mesh(sGeo, mat));
            }
            const borderPts = buildSphericalRingPoints(ring, GLOBE_RADIUS + 0.16, 0.9, true);
            if (borderPts.length >= 2) {
              const lineGeo = new THREE.BufferGeometry().setFromPoints(borderPts);
              const lineMat = new THREE.LineBasicMaterial({
                color: fillHex,
                transparent: true,
                opacity: 0.95
              });
              hmGrp.add(new THREE.Line(lineGeo, lineMat));
            }
          };
          if (geom.type === 'Polygon' && geom.coordinates?.[0]) {
            addRingMesh(geom.coordinates[0]);
          } else if (geom.type === 'MultiPolygon') {
            (geom.coordinates || []).forEach((p: number[][][]) => {
              if (p?.[0]) addRingMesh(p[0]);
            });
          }
        });
      }
    );

    return () => {
      cancelled = true;
    };
  }, [showMasteryHeatmap, activeQuizConfig]);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* Three.js 3D Globe Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0 touch-none" />

      {/* ================================================================= */}
      {/* MODE A: HOME SCREEN GLOBE EXPLORATION HUD (When no quiz is active) */}
      {/* ================================================================= */}
      {!activeQuizConfig && (
        <>
          {/* Top Search Bar */}
          <div className="absolute top-3 left-3 right-16 sm:right-auto sm:left-4 sm:w-80 z-20 pointer-events-auto">
            <div className="relative">
              <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-3.5 py-2.5 shadow-xl">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search 197 world countries..."
                  className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {isSearching && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-800 z-30">
                  {searchResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectSearchResult(c)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <CountryFlag countryCode={c.id} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-sky-400 transition-colors">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-slate-400">Capital: {c.capital}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{c.continent}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mastery Heatmap Toggle Button & 4-Tier Medal Legend on Home Globe */}
          <div className="absolute bottom-4 left-3 z-20 pointer-events-auto flex flex-col gap-1.5">
            {showMasteryHeatmap && (
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-xl backdrop-blur-md flex items-center gap-3 text-[10px] font-bold">
                <span className="flex items-center gap-1 text-sky-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                  Platinum 100%
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  Gold 80%+
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                  Silver 50%+
                </span>
                <span className="flex items-center gap-1 text-amber-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                  Bronze 20%+
                </span>
              </div>
            )}
            <button
              onClick={() => {
                sounds.playTap();
                setShowMasteryHeatmap((v) => !v);
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-xl backdrop-blur-md transition-all self-start ${
                showMasteryHeatmap
                  ? 'bg-sky-950/90 border-sky-500/60 text-sky-300'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white'
              }`}
              title="Color countries on the 3D Globe by your quiz completion %"
            >
              <Award className={`w-3.5 h-3.5 ${showMasteryHeatmap ? 'text-sky-400' : 'text-amber-400'}`} />
              <span>Mastery Heatmap: {showMasteryHeatmap ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Hovered Country Capsule Indicator */}
          {hoveredName && !selectedCountry && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in">
              <div className="px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/50 text-white text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{hoveredName}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================================================================= */}
      {/* MODE B: COMPACT SINGLE-ROW ACTIVE 3D GLOBE QUIZ HUD               */}
      {/* ================================================================= */}
      {activeQuizConfig && (
        <div className="absolute top-2.5 inset-x-2.5 z-20 flex flex-col gap-2 pointer-events-none">
          {/* Single Non-Scrolling Top Bar: [← Exit] [⏱ Timer] [🏅 1/N] [👁 Hint] [⏭ Skip] */}
          <div className="flex items-center justify-between gap-1.5 pointer-events-auto max-w-xl">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sounds.playTap();
                  if (!isDailyQuiz && onOpenQuizSettings) {
                    onOpenQuizSettings();
                  } else {
                    onExitQuiz?.();
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-800 flex items-center gap-1 text-xs font-semibold transition-all active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
                <span>Back</span>
              </button>

              {mode === 'quiz' && (
                <button
                  onClick={() => setTimerActive((a) => !a)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900/95 border border-slate-800 shadow-lg flex items-center gap-1.5 text-xs font-mono tabular-nums text-slate-200 shrink-0"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{formatTime(timerSeconds)}</span>
                </button>
              )}

              {mode === 'quiz' && (
                <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/95 border border-slate-800 shadow-lg flex items-center gap-1 text-xs font-mono tabular-nums shrink-0">
                  <span className="font-bold text-white">{currentIndex + 1}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-400">{queue.length}</span>
                </div>
              )}
            </div>

            {mode === 'quiz' && !isQuizDone && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRevealHint}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900/95 hover:bg-slate-800 text-amber-300 border border-slate-800 shadow-lg transition-all flex items-center gap-1 text-xs font-semibold shrink-0"
                  title="Reveal Hint on Globe"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hint</span>
                </button>
                <button
                  onClick={handleSkipTarget}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900/95 hover:bg-slate-800 text-slate-300 border border-slate-800 shadow-lg transition-all flex items-center gap-1 text-xs font-semibold shrink-0"
                  title="Skip Question"
                >
                  <SkipForward className="w-3.5 h-3.5 text-slate-400" />
                  <span>Skip</span>
                </button>
              </div>
            )}
          </div>

          {/* Active Quiz Prompt Banner (Zero Spoiler Leaks — True 2D Square Minimize for Language Sample & Unblocked from Right Zoom Buttons!) */}
          {mode === 'quiz' && activeTarget && !isQuizDone && (
            activeTarget.languageSample && isLangPromptMinimized ? (
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsLangPromptMinimized(false);
                }}
                className="pointer-events-auto self-start w-16 h-16 rounded-2xl bg-slate-900/95 hover:bg-slate-800 border border-sky-500/50 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                title="Expand Sample Text"
              >
                <Languages className="w-5 h-5 text-sky-400" />
                <span className="text-[10px] font-bold text-slate-200 leading-none">Text</span>
              </button>
            ) : (
              <div className="pointer-events-auto mr-12 sm:mr-14 bg-slate-900/95 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md flex items-center justify-between gap-3 max-w-xl">
                <div className="flex items-center gap-3 w-full">
                  {activeTarget.flagPrompt && activeTarget.isCountryFlag && (
                    <CountryFlag
                      countryCode={activeTarget.countryCode || activeQuizConfig.country.id}
                      size="xl"
                      className="shadow-lg border border-slate-700 shrink-0"
                    />
                  )}
                  {activeTarget.flagPrompt && !activeTarget.isCountryFlag && (
                    <SubdivisionFlag
                      name={activeTarget.name}
                      countryCode={activeTarget.countryCode || activeQuizConfig.country.id}
                      size="lg"
                      className="shadow-lg border border-slate-700 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    {!activeTarget.languageSample && (
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {activeQuizConfig.quizOption.title.replace(/\s*\((?:EASY|NORMAL|HARD)\)\s*/gi, '')}
                      </p>
                    )}
                    {activeTarget.languageSample ? (
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-semibold text-slate-400">
                            Sample Text
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setIsLangPromptMinimized(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-sky-400 transition-colors shrink-0"
                          >
                            Minimize
                          </button>
                        </div>
                        <p className="text-sm sm:text-base font-serif text-slate-100 leading-relaxed bg-slate-950/90 p-3 rounded-lg border border-slate-800">
                          “{activeTarget.languageSample.sampleText}”
                        </p>
                      </div>
                    ) : activeTarget.flagPrompt ? (
                      <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                        Tap the matching region on the globe
                      </p>
                    ) : (
                      <div>
                        {quizLangMode === 'native' && activeTarget.localName ? (
                          <p className="text-xl sm:text-2xl font-bold text-amber-300 tracking-wide leading-tight">
                            {activeTarget.localName.split('|')[0]}
                          </p>
                        ) : (
                          <p className="text-lg sm:text-xl font-bold text-white tracking-wide leading-tight">
                            {activeTarget.promptLabel || activeTarget.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {feedback === 'correct' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Correct</span>
                  </div>
                )}
                {feedback === 'correct-recycled' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-950/90 text-amber-400 border border-amber-500/50 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Recycled ✓</span>
                  </div>
                )}
                {feedback === 'correct-after-mistake' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs bg-rose-950/90 text-rose-400 border border-rose-500/40 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Found (0 pts)</span>
                  </div>
                )}
              </div>
            )
          )}

          {/* Centered On-Screen Red Wrong Click Badge (Only shows the clicked region name in red!) */}
          {feedback === 'incorrect' && (
            <div className="self-center mt-1 px-3.5 py-1.5 rounded-lg bg-rose-950/95 border border-rose-500/80 text-rose-300 font-bold text-xs shadow-xl pointer-events-none animate-in fade-in duration-150">
              {wrongClickLabel || 'Try Again'}
            </div>
          )}

          {/* Study Mode Banner: All Answers Projected Directly on the 3D Globe */}
          {mode === 'study' && (
            <div className="pointer-events-auto bg-slate-900/95 border border-indigo-500/50 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex flex-col gap-2 max-w-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">
                      Study Mode — All {queue.length} {isCitiesQuiz ? 'City Dots & Names' : 'Labels'} Projected on 3D Globe
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {isCitiesQuiz
                        ? 'Each city has an exact surface dot colored by Tier (T1–T5) with its name label above.'
                        : 'Zoom in closely on the 3D Globe to read every code and region boundary.'}
                    </p>
                  </div>
                </div>
                {!isDailyQuiz && (
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setMode('quiz');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shrink-0"
                  >
                    Start Quiz
                  </button>
                )}
              </div>
              {isCitiesQuiz && (
                <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-slate-800/80 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    T1 World Cities
                  </span>
                  <span className="flex items-center gap-1 text-sky-300">
                    <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
                    T2 Major
                  </span>
                  <span className="flex items-center gap-1 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    T3 Regional
                  </span>
                  <span className="flex items-center gap-1 text-violet-300">
                    <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                    T4 Provincial
                  </span>
                  <span className="flex items-center gap-1 text-rose-300">
                    <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                    T5 Local
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* World Language Guesser Scrollable Clue & Answer Card on the 3D Globe (Supports Minimizing to Explore the Globe!) */}
      {activeQuizConfig && languageGuessResult && !isQuizDone && (
        <div className="absolute bottom-3 inset-x-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[540px] z-30 pointer-events-auto animate-in slide-in-from-bottom duration-150">
          {isLangAnswerMinimized ? (
            <div className="bg-[#0b1120]/95 border border-slate-700/90 rounded-2xl px-3.5 py-2.5 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsLangAnswerMinimized(false);
                }}
                className="flex items-center gap-2 min-w-0 text-left hover:opacity-90"
              >
                <CountryFlag countryCode={languageGuessResult.sample.countryCode} size="sm" />
                <span className="text-xs sm:text-sm font-bold text-white truncate">
                  {languageGuessResult.sample.language}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-semibold text-sky-400 shrink-0">
                  Show Answer Clue
                </span>
              </button>
              <button
                onClick={handleNextLanguageRound}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shrink-0"
              >
                Next →
              </button>
            </div>
          ) : (
            <div className="bg-[#0b1120]/95 border border-slate-700/90 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl max-h-[44vh] flex flex-col gap-3">
              {/* Sticky Top Header with Minimize (Explore Globe) + Next Button Always Visible */}
              <div className="flex items-start justify-between gap-2 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CountryFlag countryCode={languageGuessResult.sample.countryCode} size="sm" />
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {languageGuessResult.sample.language}
                    </h3>
                    <span className="text-xs text-slate-400">
                      (
                      {languageGuessResult.sample.targetRegion
                        ? `${languageGuessResult.sample.targetRegion.name}, ${languageGuessResult.sample.countryName}`
                        : languageGuessResult.sample.countryName}
                      )
                    </span>
                  </div>
                  <p
                    className={`text-xs font-bold mt-0.5 ${
                      languageGuessResult.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {languageGuessResult.isCorrect
                      ? `✓ Correct! Spoken in ${languageGuessResult.clickedCountryName}`
                      : `✗ You clicked ${languageGuessResult.clickedCountryName} — target highlighted in green`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setIsLangAnswerMinimized(true);
                    }}
                    className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 font-bold text-xs transition-colors"
                    title="Minimize card to explore the 3D Globe"
                  >
                    Minimize
                  </button>
                  <button
                    onClick={handleNextLanguageRound}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Scrollable Clue Body */}
              <div className="overflow-y-auto pr-1 space-y-2.5">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {languageGuessResult.sample.howToIdentify}
                </p>

                {/* Unique Letter Clue Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {languageGuessResult.sample.distinctiveChars.map((ch, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-400 font-bold text-xs sm:text-sm shadow-inner"
                    >
                      {ch}
                    </span>
                  ))}
                </div>

                {/* Highlighted Sample Text Box + Translation */}
                <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    {renderHighlightedLanguageText(
                      languageGuessResult.sample.sampleText,
                      languageGuessResult.sample.distinctiveChars
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    "{languageGuessResult.sample.translation}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MapTap.gg City Pinpoint Distance & Score Result Bar on the 3D Globe */}
      {activeQuizConfig && isCitiesQuiz && cityGuessResult && !isQuizDone && (
        <div className="absolute bottom-4 inset-x-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[460px] z-30 pointer-events-auto animate-in slide-in-from-bottom duration-150">
          <div className="bg-slate-900/95 border border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300">
                  {cityGuessResult.cityName} ·{' '}
                  <span className="text-sky-400 font-mono">{cityGuessResult.distanceKm} km</span> off
                </p>
                <p className="text-base font-black text-amber-400 font-mono">
                  +{cityGuessResult.points.toLocaleString()} pts{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    (Total: {totalCityPoints.toLocaleString()})
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={handleNextCityRound}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shrink-0"
            >
              Next City →
            </button>
          </div>
        </div>
      )}

      {/* Zoom +, Zoom -, Reset Controls (Moved down during active quiz so they never overlap top HUD bar) */}
      <div
        className={`absolute right-2.5 z-20 flex flex-col gap-1.5 pointer-events-auto ${
          activeQuizConfig ? 'top-14' : 'top-3'
        }`}
      >
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 backdrop-blur-md shadow-lg flex items-center justify-center transition-all active:scale-95"
          title="Zoom In on 3D Globe"
        >
          <Plus className="w-4 h-4 text-sky-400" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 backdrop-blur-md shadow-lg flex items-center justify-center transition-all active:scale-95"
          title="Zoom Out on 3D Globe"
        >
          <Minus className="w-4 h-4 text-sky-400" />
        </button>
        <button
          onClick={handleReset}
          className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 backdrop-blur-md shadow-lg flex items-center justify-center transition-all active:scale-95"
          title={
            activeQuizConfig
              ? 'Reset View to Show All Loaded Quiz GeoJSONs'
              : 'Reset to Greenwich Meridian (0° Lat, 0° Lng)'
          }
        >
          <RotateCcw className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Post-Quiz Interactive Mistake Review Flyover Bar on the 3D Globe */}
      {activeQuizConfig && isQuizDone && reviewMissedIdx !== null && (() => {
        const missedList = Array.from(missedItemsMap.values());
        const item = missedList[reviewMissedIdx];
        if (!item) return null;
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg bg-slate-900/95 border border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                Mistake Review Flyover · {reviewMissedIdx + 1} / {missedList.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsAutoReviewingMissed(false);
                  setReviewMissedIdx(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Back to Score
              </button>
            </div>

            <div className="text-center py-1">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {item.promptLabel || item.name}
              </h3>
              {(item.localName || item.secondary || item.languageSample?.countryName) && (
                <p className="text-xs font-semibold text-amber-300 mt-0.5">
                  {item.localName || item.secondary || item.languageSample?.countryName}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAutoReviewingMissed(false);
                  setReviewMissedIdx((prev) =>
                    prev !== null ? (prev - 1 + missedList.length) % missedList.length : 0
                  );
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-colors"
              >
                ← Prev
              </button>

              {missedList.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setIsAutoReviewingMissed((a) => !a);
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors ${
                    isAutoReviewingMissed
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {isAutoReviewingMissed ? '⏸ Pause Auto-Flyover' : '▶ Auto-Flyover'}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsAutoReviewingMissed(false);
                  setReviewMissedIdx((prev) =>
                    prev !== null ? (prev + 1) % missedList.length : 0
                  );
                }}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        );
      })()}

      {/* Post-Quiz Completion Modal on the 3D Globe (with Personal Leaderboard!) */}
      {activeQuizConfig && isQuizDone && reviewMissedIdx === null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Award className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] text-sky-400 font-mono uppercase tracking-widest font-bold">
                PhoenixAtlas Challenge Completed
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {activeQuizConfig.country.name} — {activeQuizConfig.quizOption.title}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-[10px] text-slate-400 uppercase">
                  {isCitiesQuiz ? 'Points Scored' : 'Score'}
                </p>
                {isCitiesQuiz ? (
                  <p className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-0.5 leading-tight">
                    {totalCityPoints.toLocaleString()}
                    <span className="text-slate-400 text-xs font-bold block sm:inline">
                      {' '}/ {maxCityPoints.toLocaleString()}
                    </span>
                  </p>
                ) : (
                  <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                    {clampedFirstTryScore}/{totalInitialCount}
                  </p>
                )}
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-[10px] text-slate-400 uppercase">Accuracy</p>
                <p className="text-lg font-black text-sky-400 font-mono mt-0.5">
                  {accuracyPct}%
                </p>
                {isCitiesQuiz && (
                  <p className="text-[10px] text-amber-400 font-mono font-bold">
                    5,000 max / city
                  </p>
                )}
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-[10px] text-slate-400 uppercase">Time</p>
                <p className="text-lg font-black text-amber-400 font-mono mt-0.5">
                  {formatTime(timerSeconds)}
                </p>
              </div>
            </div>

            {/* Personal Leaderboard of Previous Attempts (Shows Player Name, Date, Chrono Time & Score!) */}
            {previousAttempts.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Personal Leaderboard (Top Attempts)
                  </span>
                  {personalBestSec !== null && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      Best 100%: {formatTime(personalBestSec)}
                    </span>
                  )}
                </div>
                <div className="divide-y divide-slate-800/80">
                  {previousAttempts.map((att, idx) => (
                    <div
                      key={att.id || idx}
                      className="py-1.5 flex items-center justify-between gap-2 text-xs font-mono"
                    >
                      <span className="text-slate-200 truncate">
                        #{idx + 1} · <span className="text-sky-400 font-bold">{att.playerName || 'Alex'}</span> ·{' '}
                        {new Date(att.timestamp).toLocaleDateString()} ·{' '}
                        <span className="text-amber-400">{formatTime(att.timeSpentSec)}</span>
                      </span>
                      <span className="text-emerald-400 font-bold shrink-0">
                        {att.score.toLocaleString()}/{att.maxScore.toLocaleString()} ({att.accuracy}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-1">
              {missedItemsMap.size > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoReviewingMissed(true);
                      setReviewMissedIdx(0);
                    }}
                    className="w-full py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Review Missed Locations on Globe ({missedItemsMap.size})</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePracticeMissedOnly}
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Practice Missed Only ({missedItemsMap.size})</span>
                  </button>
                </>
              )}
              <button
                onClick={handleReplayAll}
                className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Full Quiz</span>
              </button>
              {onOpenQuizSettings && !isDailyQuiz && (
                <button
                  onClick={() => {
                    sounds.playTap();
                    onOpenQuizSettings();
                  }}
                  className="w-full py-2.5 rounded-2xl bg-indigo-950/90 hover:bg-indigo-900/90 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition-all"
                >
                  Quiz Settings
                </button>
              )}
              <button
                onClick={onExitQuiz}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                Return to Globe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

