import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  SkipForward,
  Award,
  RotateCcw,
  BookOpen,
  Target,
  Clock,
  Filter,
  MapPin,
  RefreshCw,
  Shield,
  Zap
} from 'lucide-react';
import { CountryInfo } from '../data/countriesData';
import { SubdivisionQuizOption } from '../data/countrySubdivisionCatalog';
import { SubdivisionFlag } from '../components/SubdivisionFlag';
import { sounds } from '../utils/soundEngine';
import { geojsonCache, fisherYatesShuffle } from '../utils/geojsonCache';
import { getCitiesByScopeAndTier, CityPoint } from '../data/citiesDatabase';
import { db } from '../database/db';
import { computeOfficialCountryMasteryPct } from './WorldGlobeView';

export interface TargetItem {
  name: string;
  code?: string;
  secondary?: string;
  localName?: string;
  parentGroup?: string;
  flagPrompt?: boolean;
  lat?: number;
  lng?: number;
}

interface SubdivisionMapViewProps {
  country: CountryInfo;
  quizOption?: SubdivisionQuizOption;
  targetItem?: TargetItem;
  allTargetItems?: TargetItem[];
  initialMode?: 'quiz' | 'study';
  selectedGroups?: string[];
  onSelectSubdivision?: (name: string, isCorrect: boolean) => void;
  onSkip?: () => void;
  feedback?: 'correct' | 'incorrect' | null;
  quizScore?: { current: number; total: number };
  isCompleted?: boolean;
  onPlayAgain?: (missedOnlyItems?: TargetItem[]) => void;
  onBack: () => void;
}

export const SubdivisionMapView: React.FC<SubdivisionMapViewProps> = ({
  country,
  quizOption,
  initialMode = 'quiz',
  selectedGroups = ['all'],
  onBack
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);
  const citiesLayerRef = useRef<L.LayerGroup | null>(null);

  const isCitiesQuiz = quizOption?.levelKey === 'CITY_PIN' || quizOption?.id?.includes('-cities');

  // Modes: Quiz mode vs Study/Explore mode
  const [mode, setMode] = useState<'quiz' | 'study'>(initialMode);

  // Standardized Quiz Controls
  const [difficultyMode, setDifficultyMode] = useState<'easy' | 'hard'>('easy');
  const [cityTier, setCityTier] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [endlessRetry, setEndlessRetry] = useState<boolean>(false);

  const [inspectedFeature, setInspectedFeature] = useState<{
    name: string;
    parentGroup?: string;
    secondary?: string;
    code?: string;
  } | null>(null);

  // State / Province / Digit Filter
  const [availableGroups, setAvailableGroups] = useState<{ name: string; count: number }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [digitFilter, setDigitFilter] = useState<string>('');
  const [rawGeoData, setRawGeoData] = useState<any | null>(null);

  // Self-Contained Standardized Quiz Queue State
  const [queue, setQueue] = useState<TargetItem[]>([]);
  const [totalInitialCount, setTotalInitialCount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [firstTryScore, setFirstTryScore] = useState<number>(0);
  const [missedItemsMap, setMissedItemsMap] = useState<Map<string, TargetItem>>(new Map());
  const [currentAttemptedWrong, setCurrentAttemptedWrong] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isQuizDone, setIsQuizDone] = useState<boolean>(false);
  const [personalBestSec, setPersonalBestSec] = useState<number | null>(null);

  // Refs for closure-safe access inside Leaflet event handlers
  const queueRef = useRef<TargetItem[]>([]);
  const currentIndexRef = useRef<number>(0);
  const modeRef = useRef<'quiz' | 'study'>(mode);
  const difficultyModeRef = useRef<'easy' | 'hard'>(difficultyMode);
  const endlessRetryRef = useRef<boolean>(endlessRetry);
  const currentAttemptedWrongRef = useRef<boolean>(false);
  const solvedSetRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
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

  // Live Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (!timerActive || isQuizDone || mode === 'study') return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, isQuizDone, mode]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const activeTarget = queue[currentIndex];
  const geojsonUrl =
    quizOption?.geojsonFile || country.subdivisionFile || '/maps/subdivisions/bel_adm1.geojson';

  // Load Personal Best from DB
  useEffect(() => {
    const quizKey = quizOption?.id || `${country.id}-adm1`;
    db.userStats.get('current').then((st) => {
      if (st?.personalBests && st.personalBests[quizKey]) {
        setPersonalBestSec(st.personalBests[quizKey].bestTimeSec);
      }
    });
  }, [country.id, quizOption?.id]);

  // Clean standalone "NA" or "N/A" prefix without ever stripping "Na" from names like "Namur" or "Navarra"
  const cleanName = (val: string) => {
    if (!val) return '';
    return String(val).replace(/^(?:N\/A|n\.a\.|NA)(?:\s*[-:]+\s*|\s+|$)/i, '').trim();
  };

  // Extract feature identity without spoiler leaks
  const extractFeatureInfo = (p: any) => {
    let featureName = '';
    let areaCode = '';
    let parentGroup = '';

    const isExtra =
      quizOption?.category === 'extra' ||
      quizOption?.id?.includes('taxi') ||
      quizOption?.id?.includes('plate') ||
      quizOption?.id?.includes('pole') ||
      quizOption?.id?.includes('bins');

    if (isExtra && !isCitiesQuiz) {
      const raw = String(p.AreaCode || p.code || p.ref || p.name || '');
      areaCode = raw;
      if (quizOption?.id?.includes('taxi') && country.id === 'EC') {
        featureName = `Taxi Letter "${raw}"`;
      } else if (quizOption?.id?.includes('taxi') && country.id === 'PA') {
        featureName = `Taxi Zone ${raw}`;
      } else if (quizOption?.id?.includes('taxi')) {
        featureName = `Taxi Code ${raw}`;
      } else if (quizOption?.id?.includes('plate') || quizOption?.id?.includes('auto')) {
        featureName = `Plate Code ${raw}`;
      } else if (quizOption?.id?.includes('pole')) {
        featureName = `Utility Pole ${raw}`;
      } else if (quizOption?.id?.includes('bins')) {
        featureName = `Bin Code ${raw}`;
      } else {
        featureName = cleanName(raw);
      }
      parentGroup = p.STATE || p.NAME_1 || '';
    } else if (quizOption?.category === 'areacodes' || p.AreaCode !== undefined) {
      const raw = String(p.AreaCode);
      areaCode = raw.startsWith('0') ? raw : raw.length <= 2 ? '0' + raw : raw;
      featureName = `Area Code ${areaCode}`;
      parentGroup = p.STATE || '';
    } else if (p.NAME_4) {
      featureName = cleanName(p.NAME_4);
      parentGroup = p.NAME_2 || p.NAME_1 || '';
    } else if (p.NAME_3) {
      featureName = cleanName(p.NAME_3);
      parentGroup = p.NAME_2 || p.NAME_1 || '';
    } else if (p.NAME_2) {
      featureName = cleanName(p.NAME_2);
      parentGroup = p.NAME_1 || '';
    } else if (p.province && p.name) {
      featureName = cleanName(p.name);
      parentGroup = p.province;
    } else {
      featureName = cleanName(p.NAME_1 || p.name || p.name_en || 'Region');
    }

    const rawLocal =
      p.NL_NAME_1 ||
      p.NL_NAME_2 ||
      p.NL_NAME_3 ||
      p.name_local ||
      p.name_native ||
      p.name_ja ||
      p.name_ko ||
      p.name_zh ||
      p.name_ar ||
      p.name_ru ||
      p.name_el ||
      '';
    const trimmedLocal = String(rawLocal || '').trim();
    const localName =
      trimmedLocal && !/^(?:N\/A|n\.a\.|NA)$/i.test(trimmedLocal) ? trimmedLocal : '';

    return { featureName, areaCode, parentGroup, localName };
  };

  // Initialize Leaflet Map with preferCanvas: true for 60 FPS mobile performance
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [country.lat, country.lng],
      zoom: 6,
      minZoom: 2.5,
      maxZoom: 13,
      preferCanvas: true,
      zoomControl: false,
      attributionControl: false
    });

    // 100% offline canvas base (no external tile servers)
    L.control.zoom({ position: 'topright' }).addTo(map);
    mapRef.current = map;

    geojsonCache
      .fetchGeoJSON(geojsonUrl)
      .then((data) => {
        setRawGeoData(data);
        buildQuizAndLayers(map, data, selectedGroups, '');
      })
      .catch((err) => {
        console.error('Failed to load subdivisions GeoJSON:', err);
        if (isCitiesQuiz) {
          buildQuizAndLayers(map, { type: 'FeatureCollection', features: [] }, selectedGroups, '');
        }
      });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [country, geojsonUrl]);

  // Rebuild when cityTier changes in a Cities Quiz
  useEffect(() => {
    if (isCitiesQuiz && mapRef.current && rawGeoData) {
      buildQuizAndLayers(mapRef.current, rawGeoData, selectedGroups, digitFilter);
    }
  }, [cityTier]);

  // Record quiz completion in IndexedDB (Mastery, Subdivisions Mastered, Smart Revision Queue, Personal Best)
  const recordCompletionInDB = async (
    finalScore: number,
    totalCount: number,
    elapsedSec: number,
    missedList: TargetItem[]
  ) => {
    try {
      const clampedScore = totalCount > 0 ? Math.max(0, Math.min(finalScore, totalCount)) : finalScore;
      const accuracyPct =
        totalCount > 0 ? Math.max(0, Math.min(100, Math.round((clampedScore / totalCount) * 100))) : 100;
      const stats = await db.userStats.get('current');
      const settings = await db.settings.get('current');
      const playerName = settings?.playerName || 'Alex';
      const quizKey = quizOption?.id || `${country.id}-adm1`;
      const quizTitle = quizOption?.title || `${country.name} Map Quiz`;

      await db.quizAttempts.add({
        quizId: quizKey,
        quizTitle,
        category: quizOption?.category || 'Subdivisions',
        score: clampedScore,
        maxScore: totalCount,
        accuracy: accuracyPct,
        timeSpentSec: elapsedSec,
        timestamp: Date.now(),
        countryCode: country.id,
        continent: country.continent
      });

      if (stats) {
        const cCode = country.id.toUpperCase();
        const allCountryAttempts = await db.quizAttempts.where('countryCode').equals(cCode).toArray();
        const recomputedPct = computeOfficialCountryMasteryPct(country, allCountryAttempts);
        const updatedCountryMastery = {
          ...stats.countryMastery,
          [country.id]: recomputedPct
        };

        // Update continent mastery average
        const prevCont = stats.continentMastery[country.continent] || 0;
        const updatedContinentMastery = {
          ...stats.continentMastery,
          [country.continent]: Math.max(prevCont, recomputedPct)
        };

        // Update mastered subdivisions list
        const masteredSet = new Set<string>(stats.subdivisionsMastered || []);
        solvedSetRef.current.forEach((s) => masteredSet.add(`${country.id}:${s}`));

        // Update Smart Revision Queue with missed items
        const existingQueue = [...(stats.missedQueue || [])];
        missedList.forEach((m) => {
          const itemId = `${country.id}:${m.name}`;
          const existingIdx = existingQueue.findIndex((x) => x.id === itemId);
          if (existingIdx >= 0) {
            existingQueue[existingIdx].missedCount += 1;
            existingQueue[existingIdx].lastMissedAt = Date.now();
          } else {
            existingQueue.unshift({
              id: itemId,
              countryCode: country.id,
              countryName: country.name,
              targetName: m.name,
              quizTitle,
              quizOptionId: quizOption?.id,
              geojsonFile: quizOption?.geojsonFile,
              missedCount: 1,
              lastMissedAt: Date.now()
            });
          }
        });

        // Update Personal Best if 100% accuracy
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
              date: new Date().toISOString().split('T')[0]
            };
            setPersonalBestSec(elapsedSec);
          }
        }

        await db.userStats.update('current', {
          totalQuizzesPlayed: (stats.totalQuizzesPlayed || 0) + 1,
          totalQuestionsAnswered: (stats.totalQuestionsAnswered || 0) + totalCount,
          correctAnswers: (stats.correctAnswers || 0) + finalScore,
          totalTimeSpentSec: (stats.totalTimeSpentSec || 0) + elapsedSec,
          countryMastery: updatedCountryMastery,
          continentMastery: updatedContinentMastery,
          subdivisionsMastered: Array.from(masteredSet),
          missedQueue: existingQueue.slice(0, 60),
          personalBests
        });
      }
    } catch (e) {
      console.error('Failed to save stats:', e);
    }
  };

  // Handle user guess (both Polygon tap and City Pin tap)
  const handleFeatureGuess = (
    guessedName: string,
    layerOrMarker: any,
    isCityMarker: boolean = false
  ) => {
    const activeQ = queueRef.current;
    const idx = currentIndexRef.current;
    const currentTarget = activeQ[idx];
    if (!currentTarget) return;

    const isMatch = guessedName.toLowerCase().trim() === currentTarget.name.toLowerCase().trim();

    if (isMatch) {
      sounds.playSuccess();
      setFeedback('correct');
      solvedSetRef.current.add(currentTarget.name);

      const wasFirstTry = !currentAttemptedWrongRef.current;
      if (wasFirstTry) {
        setFirstTryScore((s) => s + 1);
      }

      // Style feedback based on Easy vs Hard mode
      if (isCityMarker && layerOrMarker.setStyle) {
        layerOrMarker.setStyle({
          fillColor: '#10b981',
          color: '#ffffff',
          radius: 9,
          fillOpacity: 0.95
        });
        if (difficultyModeRef.current === 'hard') {
          setTimeout(() => {
            layerOrMarker.setStyle({
              fillColor: '#0ea5e9',
              color: '#38bdf8',
              radius: 6.5,
              fillOpacity: 0.85
            });
          }, 700);
        }
      } else if (layerOrMarker.setStyle) {
        layerOrMarker.setStyle({
          fillColor: '#10b981',
          fillOpacity: 0.65,
          color: '#34d399',
          weight: 2.5
        });
        if (difficultyModeRef.current === 'hard') {
          setTimeout(() => {
            layerOrMarker.setStyle({
              fillColor: '#0f172a',
              fillOpacity: 0.45,
              color: '#38bdf8',
              weight: 1.5
            });
          }, 700);
        }
      }

      setTimeout(() => {
        setFeedback(null);
        setCurrentAttemptedWrong(false);
        const latestQueue = queueRef.current;
        if (idx + 1 < latestQueue.length) {
          setCurrentIndex(idx + 1);
        } else {
          setIsQuizDone(true);
          sounds.playFanfare();
          confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
          const finalFirstTry = wasFirstTry ? firstTryScore + 1 : firstTryScore;
          recordCompletionInDB(
            finalFirstTry,
            totalInitialCount || latestQueue.length,
            timerSeconds,
            Array.from(missedItemsMap.values())
          );
        }
      }, 650);
    } else {
      sounds.playError();
      setFeedback('incorrect');

      // Record missed item on first wrong click for this prompt
      if (!currentAttemptedWrongRef.current) {
        setCurrentAttemptedWrong(true);
        setMissedItemsMap((prev) => {
          const next = new Map(prev);
          next.set(currentTarget.name, currentTarget);
          return next;
        });

        // If Endless Retry ("Practice until 100%") is enabled, recirculate to the back of the queue!
        if (endlessRetryRef.current) {
          setQueue((prev) => [...prev, currentTarget]);
        }
      }

      // Flash red briefly on clicked polygon/pin
      if (layerOrMarker.setStyle) {
        const origFill = isCityMarker ? '#0ea5e9' : '#0f172a';
        const origBorder = '#38bdf8';
        layerOrMarker.setStyle({
          fillColor: '#f43f5e',
          fillOpacity: 0.7,
          color: '#fb7185'
        });
        setTimeout(() => {
          if (!solvedSetRef.current.has(guessedName) || difficultyModeRef.current === 'hard') {
            layerOrMarker.setStyle({
              fillColor: origFill,
              fillOpacity: isCityMarker ? 0.85 : 0.45,
              color: origBorder
            });
          }
        }, 650);
      }

      setTimeout(() => {
        setFeedback(null);
      }, 650);
    }
  };

  // Build map layers and randomized target queue
  const buildQuizAndLayers = (
    map: L.Map,
    data: any,
    filterGroups: string[] | string,
    prefixDigit: string,
    customOverrideTargets?: TargetItem[]
  ) => {
    if (geoLayerRef.current) {
      map.removeLayer(geoLayerRef.current);
      geoLayerRef.current = null;
    }
    if (citiesLayerRef.current) {
      map.removeLayer(citiesLayerRef.current);
      citiesLayerRef.current = null;
    }

    solvedSetRef.current.clear();

    // CASE 1: CITIES PINPOINT QUIZ
    if (isCitiesQuiz) {
      // Render country outline for geographic context
      if (data.features && data.features.length > 0) {
        const contextLayer = L.geoJSON(data, {
          style: {
            fillColor: '#0f172a',
            fillOpacity: 0.55,
            color: '#334155',
            weight: 1.2
          },
          interactive: false
        }).addTo(map);
        geoLayerRef.current = contextLayer;
        const b = contextLayer.getBounds();
        if (b.isValid()) map.fitBounds(b, { padding: [30, 30] });
      }

      const citiesList: CityPoint[] = getCitiesByScopeAndTier(
        { type: 'country', value: country.id },
        cityTier
      );

      const cityGroup = L.layerGroup().addTo(map);
      citiesLayerRef.current = cityGroup;

      citiesList.forEach((city) => {
        const marker = L.circleMarker([city.lat, city.lng], {
          radius: 7,
          fillColor: '#0ea5e9',
          color: '#38bdf8',
          weight: 2,
          fillOpacity: 0.85
        });

        (marker as any).featureName = city.name;

        marker.on('click', () => {
          if (modeRef.current === 'study') {
            sounds.playTap();
            setInspectedFeature({
              name: city.name,
              parentGroup: `Tier ${city.tier} City · ${city.countryName}`
            });
            return;
          }
          handleFeatureGuess(city.name, marker, true);
        });

        marker.addTo(cityGroup);
      });

      const rawTargets: TargetItem[] =
        customOverrideTargets ||
        citiesList.map((c) => ({
          name: c.name,
          localName: c.nativeName,
          lat: c.lat,
          lng: c.lng
        }));

      const shuffled = fisherYatesShuffle(rawTargets);
      setQueue(shuffled);
      setTotalInitialCount(shuffled.length);
      setCurrentIndex(0);
      setFirstTryScore(0);
      setMissedItemsMap(new Map());
      setCurrentAttemptedWrong(false);
      setIsQuizDone(false);
      setTimerSeconds(0);
      return;
    }

    // CASE 2: SUBDIVISIONS / AREA CODES / FLAGS / METAS QUIZ
    let features = data.features || [];
    const isAreaCode =
      quizOption?.category === 'areacodes' ||
      features.some((f: any) => f.properties?.AreaCode !== undefined);

    // Extract available groups
    const groupCountMap = new Map<string, number>();
    features.forEach((f: any) => {
      const p = f.properties || {};
      if (isAreaCode && p.AreaCode !== undefined) {
        const raw = String(p.AreaCode);
        let prefix = '';
        if (raw.length >= 3) {
          prefix = `${raw[0]}xx`;
        } else if (raw.length === 2) {
          prefix = `${raw[0]}x`;
        } else if (raw.length === 1) {
          prefix = `0${raw}x`;
        }
        if (prefix) groupCountMap.set(prefix, (groupCountMap.get(prefix) || 0) + 1);
      } else {
        const { parentGroup } = extractFeatureInfo(p);
        if (parentGroup) {
          groupCountMap.set(parentGroup, (groupCountMap.get(parentGroup) || 0) + 1);
        }
      }
    });

    setAvailableGroups(
      Array.from(groupCountMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name))
    );

    if (quizOption?.filterType === '2digit') {
      features = features.filter((f: any) => {
        const code = String(f.properties?.AreaCode || '');
        return code.length === 1 || code.length === 2;
      });
    } else if (quizOption?.filterType === '3digit') {
      features = features.filter((f: any) => {
        const code = String(f.properties?.AreaCode || '');
        return code.length >= 2 && !['2', '3', '4', '9'].includes(code);
      });
    }

    const activeFilters = Array.isArray(filterGroups) ? filterGroups : [filterGroups];
    if (activeFilters.length > 0 && !activeFilters.includes('all')) {
      features = features.filter((f: any) => {
        const { parentGroup, areaCode } = extractFeatureInfo(f.properties || {});
        if (isAreaCode && areaCode) {
          const rawCode = areaCode.replace(/^0+/, '') || areaCode;
          return activeFilters.some((g) => {
            const cleanG = g.trim().replace(/^0+/, '');
            return (
              g.startsWith(`${rawCode[0]}xx`) ||
              g.startsWith(`${rawCode[0]}x`) ||
              rawCode.startsWith(cleanG) ||
              areaCode.startsWith(g.trim())
            );
          });
        }
        return activeFilters.some((g) => g.toLowerCase() === (parentGroup || '').toLowerCase());
      });
    }

    if (prefixDigit.trim()) {
      const cleanD = prefixDigit.trim().replace(/^0+/, '');
      features = features.filter((f: any) => {
        const { areaCode, featureName } = extractFeatureInfo(f.properties || {});
        const rawCode = (areaCode || '').replace(/^0+/, '');
        return (
          rawCode.startsWith(cleanD) ||
          (areaCode && areaCode.startsWith(prefixDigit.trim())) ||
          featureName.toLowerCase().includes(prefixDigit.trim().toLowerCase())
        );
      });
    }

    if (features.length === 0 && data.features && data.features.length > 0) {
      features = data.features;
    }

    // Build target items
    const targetMap = new Map<string, TargetItem>();
    features.forEach((f: any) => {
      const { featureName, areaCode, parentGroup, localName } = extractFeatureInfo(
        f.properties || {}
      );
      if (featureName && !targetMap.has(featureName)) {
        targetMap.set(featureName, {
          name: featureName,
          code: areaCode || undefined,
          parentGroup: parentGroup || undefined,
          localName: localName || undefined,
          flagPrompt: quizOption?.category === 'flags'
        });
      }
    });

    const items = customOverrideTargets || Array.from(targetMap.values());
    const shuffled = fisherYatesShuffle(items);

    setQueue(shuffled);
    setTotalInitialCount(shuffled.length);
    setCurrentIndex(0);
    setFirstTryScore(0);
    setMissedItemsMap(new Map());
    setCurrentAttemptedWrong(false);
    setIsQuizDone(false);
    setTimerSeconds(0);

    // Sort features by bounding box area descending (largest first, smallest enclaves last) so enclaves always render on top!
    const computeFeatArea = (f: any): number => {
      const g = f?.geometry;
      if (!g || !g.coordinates) return 0;
      let minX = 180,
        maxX = -180,
        minY = 90,
        maxY = -90;
      const scanRing = (r: number[][]) => {
        if (!Array.isArray(r)) return;
        for (let i = 0; i < r.length; i++) {
          const pt = r[i];
          if (!pt) continue;
          const x = pt[0],
            y = pt[1];
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      };
      if (g.type === 'Polygon') scanRing(g.coordinates[0]);
      else if (g.type === 'MultiPolygon')
        g.coordinates.forEach((p: number[][][]) => scanRing(p?.[0]));
      return minX <= maxX ? (maxX - minX) * (maxY - minY) : 0;
    };

    const sortedFeatures = [...features].sort((a, b) => computeFeatArea(b) - computeFeatArea(a));

    const filteredGeoJson = {
      type: 'FeatureCollection',
      features: sortedFeatures
    };

    const layer = L.geoJSON(filteredGeoJson as any, {
      style: () => ({
        fillColor: '#0f172a',
        fillOpacity: 0.45,
        color: '#38bdf8',
        weight: 1.6
      }),
      onEachFeature: (feature, fLayer) => {
        const p = feature.properties || {};
        const { featureName, areaCode, parentGroup, localName } = extractFeatureInfo(p);
        (fLayer as any).featureName = featureName;

        fLayer.on('mouseover', () => {
          if (!solvedSetRef.current.has(featureName) || difficultyModeRef.current === 'hard') {
            (fLayer as L.Path).setStyle({
              fillColor: '#0284c7',
              fillOpacity: 0.4,
              color: '#7dd3fc',
              weight: 2.4
            });
          }
        });

        fLayer.on('mouseout', () => {
          if (!solvedSetRef.current.has(featureName) || difficultyModeRef.current === 'hard') {
            (fLayer as L.Path).setStyle({
              fillColor: '#0f172a',
              fillOpacity: 0.45,
              color: '#38bdf8',
              weight: 1.6
            });
          }
        });

        fLayer.on('click', () => {
          if (modeRef.current === 'study') {
            sounds.playTap();
            setInspectedFeature({
              name: featureName,
              parentGroup,
              secondary: localName || undefined,
              code: areaCode
            });
            return;
          }
          handleFeatureGuess(featureName, fLayer, false);
        });
      }
    }).addTo(map);

    geoLayerRef.current = layer;
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  };

  // Reveal Hint Handler (Shows answer in Gold AND marks current prompt as missed for scoring integrity)
  const handleRevealHint = () => {
    if (!activeTarget) return;
    sounds.playTap();

    // Mark as missed for scoring integrity
    if (!currentAttemptedWrong) {
      setCurrentAttemptedWrong(true);
      setMissedItemsMap((prev) => {
        const next = new Map(prev);
        next.set(activeTarget.name, activeTarget);
        return next;
      });
      if (endlessRetry) {
        setQueue((prev) => [...prev, activeTarget]);
      }
    }

    if (isCitiesQuiz && citiesLayerRef.current) {
      citiesLayerRef.current.eachLayer((m: any) => {
        if (m.featureName?.toLowerCase() === activeTarget.name.toLowerCase()) {
          m.setStyle({
            fillColor: '#f59e0b',
            color: '#fef08a',
            radius: 11,
            fillOpacity: 1
          });
          if (mapRef.current && m.getLatLng) {
            mapRef.current.panTo(m.getLatLng(), { animate: true });
          }
        }
      });
      return;
    }

    if (geoLayerRef.current) {
      geoLayerRef.current.eachLayer((l: any) => {
        if (l.featureName?.toLowerCase() === activeTarget.name.toLowerCase()) {
          l.setStyle({
            fillColor: '#f59e0b',
            fillOpacity: 0.85,
            color: '#fef08a',
            weight: 3
          });
          if (mapRef.current && l.getBounds) {
            mapRef.current.fitBounds(l.getBounds(), { maxZoom: 8, padding: [50, 50] });
          }
        }
      });
    }
  };

  const handleSkipTarget = () => {
    if (!activeTarget) return;
    sounds.playTap();
    setMissedItemsMap((prev) => {
      const next = new Map(prev);
      next.set(activeTarget.name, activeTarget);
      return next;
    });
    setCurrentAttemptedWrong(false);
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsQuizDone(true);
    }
  };

  const handleReplayAll = () => {
    sounds.playTap();
    if (mapRef.current && rawGeoData) {
      buildQuizAndLayers(mapRef.current, rawGeoData, selectedGroup, digitFilter);
    }
  };

  const handlePracticeMissedOnly = () => {
    sounds.playTap();
    const missedList = Array.from(missedItemsMap.values());
    if (missedList.length === 0 || !mapRef.current || !rawGeoData) return;
    buildQuizAndLayers(mapRef.current, rawGeoData, selectedGroup, digitFilter, missedList);
  };

  const accuracyPct =
    totalInitialCount > 0
      ? Math.max(0, Math.min(100, Math.round((Math.min(firstTryScore, totalInitialCount) / totalInitialCount) * 100)))
      : 100;

  return (
    <div className="relative w-full h-full bg-[#060913] select-none overflow-hidden flex flex-col">
      {/* Map Canvas */}
      <div ref={containerRef} className="w-full h-full z-10" />

      {/* Top Overlay Navigation & Standardized Quiz Controls */}
      <div className="absolute top-3 inset-x-3 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Back + Mode Switcher + Easy/Hard + Endless Retry */}
          <div className="flex items-center gap-1.5 pointer-events-auto flex-wrap">
            <button
              onClick={onBack}
              className="px-3 py-2 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xl backdrop-blur-md flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span>Globe</span>
            </button>

            {/* Quiz vs Study Mode */}
            <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-1 flex items-center shadow-xl backdrop-blur-md text-xs">
              <button
                onClick={() => {
                  sounds.playTap();
                  setMode('quiz');
                }}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  mode === 'quiz' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Quiz</span>
              </button>
              <button
                onClick={() => {
                  sounds.playTap();
                  setMode('study');
                }}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  mode === 'study' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Study</span>
              </button>
            </div>

            {/* Easy vs Hard Mode Toggle */}
            <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-1 flex items-center shadow-xl backdrop-blur-md text-xs">
              <button
                onClick={() => {
                  sounds.playTap();
                  setDifficultyMode('easy');
                }}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  difficultyMode === 'easy'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Easy Mode: Solved regions stay colored green"
              >
                <Shield className="w-3 h-3" />
                <span>Easy</span>
              </button>
              <button
                onClick={() => {
                  sounds.playTap();
                  setDifficultyMode('hard');
                }}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  difficultyMode === 'hard'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Hard Mode: Solved regions flash green and fade back to neutral"
              >
                <Zap className="w-3 h-3" />
                <span>Hard</span>
              </button>
            </div>

            {/* Endless Retry Toggle ("Practice until 100%") */}
            <button
              onClick={() => {
                sounds.playTap();
                setEndlessRetry((v) => !v);
              }}
              className={`px-2.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 shadow-xl backdrop-blur-md transition-all ${
                endlessRetry
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                  : 'bg-slate-900/95 border-slate-700/80 text-slate-400 hover:text-white'
              }`}
              title="Recirculate missed questions to the back of the queue until 100% mastered"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${endlessRetry ? 'text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Until 100%</span>
            </button>

            {/* City Difficulty Tier Selector (Only for Cities Quiz) */}
            {isCitiesQuiz && (
              <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-1 flex items-center shadow-xl backdrop-blur-md text-xs">
                {(['easy', 'medium', 'hard'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      sounds.playTap();
                      setCityTier(t);
                    }}
                    className={`px-2 py-1 rounded-xl font-bold capitalize transition-all ${
                      cityTier === t
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t === 'easy' ? 'T1 Easy' : t === 'medium' ? 'T2 Med' : 'T3 Hard'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Live Timer, Score, Reveal Hint & Skip */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {mode === 'quiz' && (
              <button
                onClick={() => setTimerActive((a) => !a)}
                className="px-2.5 py-2 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-xl backdrop-blur-md flex items-center gap-1.5 text-xs font-mono text-slate-200"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formatTime(timerSeconds)}</span>
              </button>
            )}

            {mode === 'quiz' && (
              <div className="px-3 py-2 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-xl backdrop-blur-md flex items-center gap-1.5 text-xs font-mono">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-white">{currentIndex + 1}</span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-300">{queue.length}</span>
              </div>
            )}

            {mode === 'quiz' && !isQuizDone && (
              <>
                <button
                  onClick={handleRevealHint}
                  className="px-2.5 py-2 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-amber-300 border border-slate-700/80 shadow-xl backdrop-blur-md transition-all flex items-center gap-1 text-xs font-bold"
                  title="Reveal Hint (marks question as missed)"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Hint</span>
                </button>
                <button
                  onClick={handleSkipTarget}
                  className="px-2.5 py-2 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-slate-300 border border-slate-700/80 shadow-xl backdrop-blur-md transition-all flex items-center gap-1 text-xs font-bold"
                  title="Skip Question"
                >
                  <SkipForward className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Skip</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Area Code Digit Prefix Quick Filter Bar (Available in ALL Area Code Quizzes) */}
        {(quizOption?.category === 'areacodes' || quizOption?.id?.includes('areacode')) && (
          <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 shadow-lg max-w-md">
            <Filter className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-bold text-slate-300 whitespace-nowrap">
              Prefix Filter:
            </span>
            <input
              type="text"
              value={digitFilter}
              onChange={(e) => {
                const val = e.target.value;
                setDigitFilter(val);
                if (mapRef.current && rawGeoData) {
                  buildQuizAndLayers(mapRef.current, rawGeoData, selectedGroup, val);
                }
              }}
              placeholder="Type starting digits (e.g. 2, 01, 415)..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500"
            />
            {digitFilter && (
              <button
                onClick={() => {
                  setDigitFilter('');
                  if (mapRef.current && rawGeoData) {
                    buildQuizAndLayers(mapRef.current, rawGeoData, selectedGroup, '');
                  }
                }}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
              >
                All
              </button>
            )}
          </div>
        )}

        {/* Current Quiz Target Prompt Card (Strictly NO Spoiler Parent Region Leaks!) */}
        {mode === 'quiz' && activeTarget && !isQuizDone && (
          <div className="pointer-events-auto bg-slate-900/95 border border-sky-500/50 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 max-w-xl">
            <div className="flex items-center gap-3">
              {activeTarget.flagPrompt && (
                <SubdivisionFlag
                  name={activeTarget.name}
                  countryCode={country.id}
                  size="lg"
                  className="shadow-lg border border-slate-700"
                />
              )}
              <div>
                <p className="text-[10px] text-sky-400 uppercase tracking-widest font-bold">
                  {quizOption?.title || `${country.name} Challenge`}
                </p>
                {activeTarget.flagPrompt ? (
                  <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                    Tap the territory matching this flag
                  </p>
                ) : (
                  <div>
                    {activeTarget.localName && (
                      <p className="text-lg sm:text-xl font-black text-amber-300 tracking-wide leading-tight">
                        {activeTarget.localName.split('|')[0]}
                      </p>
                    )}
                    <p
                      className={`${
                        activeTarget.localName
                          ? 'text-xs sm:text-sm font-semibold text-sky-300'
                          : 'text-base sm:text-lg font-black text-white'
                      } tracking-wide leading-tight`}
                    >
                      {activeTarget.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {feedback && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider ${
                  feedback === 'correct'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {feedback === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Try Again</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Study Mode Inspected Card */}
        {mode === 'study' && (
          <div className="pointer-events-auto bg-slate-900/95 border border-indigo-500/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">
                  {inspectedFeature?.parentGroup || 'Study & Explore Mode — Tap any region'}
                </p>
                <p className="text-base font-black text-white">
                  {inspectedFeature ? inspectedFeature.name : 'Tap any polygon or pin on the map'}
                </p>
                {inspectedFeature?.secondary && (
                  <p className="text-xs text-amber-300 font-semibold">{inspectedFeature.secondary}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playTap();
                setMode('quiz');
              }}
              className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shrink-0"
            >
              Start Quiz
            </button>
          </div>
        )}
      </div>

      {/* Post-Quiz Summary Modal with Replay All & Practice Missed Only */}
      {isQuizDone && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] text-sky-400 font-mono uppercase tracking-widest font-bold">
                Challenge Completed
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {quizOption?.title || `${country.name} Map Quiz`}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Completed in {formatTime(timerSeconds)} · {difficultyMode.toUpperCase()} Mode
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <p className="text-[10px] text-slate-400 font-medium">First-Try Score</p>
                <p className="text-lg font-black text-white font-mono mt-0.5">
                  {firstTryScore}/{totalInitialCount}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <p className="text-[10px] text-slate-400 font-medium">Accuracy</p>
                <p className="text-lg font-black font-mono mt-0.5 text-emerald-400">
                  {accuracyPct}%
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <p className="text-[10px] text-slate-400 font-medium">Personal Best</p>
                <p className="text-lg font-black font-mono mt-0.5 text-amber-400">
                  {personalBestSec !== null ? formatTime(personalBestSec) : formatTime(timerSeconds)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              {missedItemsMap.size > 0 && (
                <button
                  onClick={handlePracticeMissedOnly}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Target className="w-4 h-4" />
                  <span>Practice Missed Only ({missedItemsMap.size} Weak Areas)</span>
                </button>
              )}

              <div className="flex items-center gap-2.5">
                <button
                  onClick={onBack}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition-colors border border-slate-700"
                >
                  Return to Globe
                </button>
                <button
                  onClick={handleReplayAll}
                  className="flex-1 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/25"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
