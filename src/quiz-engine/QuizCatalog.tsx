import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Compass,
  Search,
  Play,
  Sparkles,
  Globe,
  CheckCircle2,
  Flag,
  Building2,
  Flame,
  Layers,
  Phone,
  MapPin,
  ArrowLeft,
  FolderKanban,
  ChevronRight,
  Lock
} from 'lucide-react';
import { QuizDefinition } from './quizTypes';
import { COUNTRIES_DATABASE, CountryInfo } from '../data/countriesData';
import { getCountrySubdivisions, SubdivisionQuizOption } from '../data/countrySubdivisionCatalog';
import {
  getCitiesByScopeAndTier,
  getDailyChallenges,
  getTodayUTCString
} from '../data/citiesDatabase';
import { ActiveGlobeQuizConfig } from '../maps/WorldGlobeView';
import { AreaCodeDepthLevel } from '../maps/RegionSelectorModal';
import { sounds } from '../utils/soundEngine';
import { CountryFlag } from '../components/CountryFlag';
import { db } from '../database/db';

interface QuizCatalogProps {
  onStartQuiz?: (quiz: QuizDefinition) => void;
  onStartSubdivisionQuiz?: (
    country: CountryInfo,
    option: SubdivisionQuizOption,
    baseConfig?: Partial<ActiveGlobeQuizConfig>
  ) => void;
  onStartGlobeQuiz?: (config: ActiveGlobeQuizConfig) => void;
  customQuizzes?: QuizDefinition[];
}

type MainTopicTab = 'subdivisions' | 'areacodes' | 'cities' | 'others' | 'daily';
type SubScopeTab = 'all' | 'world' | 'continents' | 'custom';

const CONTINENTS_LIST = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America'
] as const;

// Official GeoGuessr Street View Coverage Countries
const OFFICIAL_GEOGUESSR_COUNTRIES = [
  'US', 'CA', 'MX', 'GT', 'CR', 'PA', 'DO', 'PR',
  'BR', 'AR', 'CL', 'CO', 'PE', 'EC', 'UY', 'BO',
  'GB', 'IE', 'FR', 'DE', 'ES', 'PT', 'AD', 'IT', 'SM', 'MC',
  'BE', 'NL', 'LU', 'CH', 'AT', 'LI', 'PL', 'CZ', 'SK', 'HU',
  'RO', 'BG', 'GR', 'TR', 'HR', 'SI', 'RS', 'ME', 'MK', 'AL', 'BA',
  'SE', 'NO', 'FI', 'DK', 'IS', 'EE', 'LV', 'LT', 'UA', 'RU', 'MT',
  'JP', 'KR', 'TW', 'MN', 'HK', 'MO', 'TH', 'MY', 'ID', 'PH', 'SG',
  'VN', 'KH', 'LA', 'IN', 'BD', 'LK', 'BT', 'NP', 'PK', 'KZ', 'KG',
  'IL', 'JO', 'AE', 'QA', 'OM', 'LB',
  'ZA', 'KE', 'NG', 'SN', 'GH', 'UG', 'RW', 'BW', 'SZ', 'LS', 'TN', 'MG', 'EG',
  'AU', 'NZ'
];

const PREMADE_CUSTOM_GROUPS: Array<{ id: string; label: string; desc: string; codes: string[] }> = [
  {
    id: 'usa-canada',
    label: 'USA & Canada',
    desc: 'United States (50 States / 290 Area Codes) & Canada (13 Provinces / Territories)',
    codes: ['US', 'CA']
  },
  {
    id: 'benelux',
    label: 'Benelux',
    desc: 'Belgium, Netherlands & Luxembourg',
    codes: ['BE', 'NL', 'LU']
  },
  {
    id: 'dach',
    label: 'DACH Region',
    desc: 'Germany, Austria & Switzerland',
    codes: ['DE', 'AT', 'CH']
  },
  {
    id: 'uk-ireland',
    label: 'British Isles (UK & Ireland)',
    desc: 'United Kingdom & Republic of Ireland',
    codes: ['GB', 'IE']
  },
  {
    id: 'iberia',
    label: 'Iberian Peninsula',
    desc: 'Spain, Portugal & Andorra',
    codes: ['ES', 'PT', 'AD']
  },
  {
    id: 'nordics',
    label: 'Nordic Countries',
    desc: 'Sweden, Norway, Finland, Denmark & Iceland',
    codes: ['SE', 'NO', 'FI', 'DK', 'IS']
  },
  {
    id: 'baltics',
    label: 'Baltic States',
    desc: 'Estonia, Latvia & Lithuania',
    codes: ['EE', 'LV', 'LT']
  },
  {
    id: 'visegrad',
    label: 'Visegrád Group (Central Europe)',
    desc: 'Poland, Czech Republic, Slovakia & Hungary',
    codes: ['PL', 'CZ', 'SK', 'HU']
  },
  {
    id: 'balkans',
    label: 'Balkan Peninsula',
    desc: 'Croatia, Serbia, Bosnia, Montenegro, N. Macedonia, Albania, Slovenia, Bulgaria, Romania & Greece',
    codes: ['HR', 'RS', 'BA', 'ME', 'MK', 'AL', 'SI', 'BG', 'RO', 'GR']
  },
  {
    id: 'east-asia',
    label: 'East Asia',
    desc: 'Japan, South Korea, Taiwan, China & Mongolia',
    codes: ['JP', 'KR', 'TW', 'CN', 'MN']
  },
  {
    id: 'se-asia',
    label: 'Southeast Asia',
    desc: 'Thailand, Malaysia, Indonesia, Philippines, Vietnam, Cambodia, Singapore & Laos',
    codes: ['TH', 'MY', 'ID', 'PH', 'VN', 'KH', 'SG', 'LA']
  },
  {
    id: 'south-asia',
    label: 'South Asia',
    desc: 'India, Bangladesh, Sri Lanka, Nepal, Bhutan & Pakistan',
    codes: ['IN', 'BD', 'LK', 'NP', 'BT', 'PK']
  },
  {
    id: 'central-asia',
    label: 'Central Asia',
    desc: 'Kazakhstan, Kyrgyzstan, Uzbekistan, Tajikistan & Turkmenistan',
    codes: ['KZ', 'KG', 'UZ', 'TJ', 'TM']
  },
  {
    id: 'middle-east-gcc',
    label: 'Middle East & Arabian Peninsula',
    desc: 'UAE, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain, Jordan, Israel & Turkey',
    codes: ['AE', 'SA', 'QA', 'OM', 'KW', 'BH', 'JO', 'IL', 'TR']
  },
  {
    id: 'north-africa',
    label: 'North Africa (Maghreb & Egypt)',
    desc: 'Morocco, Algeria, Tunisia, Libya & Egypt',
    codes: ['MA', 'DZ', 'TN', 'LY', 'EG']
  },
  {
    id: 'africa-geo',
    label: 'Sub-Saharan Africa GeoGuessr',
    desc: 'South Africa, Kenya, Nigeria, Senegal, Ghana, Uganda, Rwanda, Botswana, Eswatini, Lesotho & Madagascar',
    codes: ['ZA', 'KE', 'NG', 'SN', 'GH', 'UG', 'RW', 'BW', 'SZ', 'LS', 'MG']
  },
  {
    id: 'south-america',
    label: 'South America',
    desc: 'Brazil, Argentina, Chile, Colombia, Peru, Ecuador, Uruguay, Bolivia & Paraguay',
    codes: ['BR', 'AR', 'CL', 'CO', 'PE', 'EC', 'UY', 'BO', 'PY']
  },
  {
    id: 'central-america-mx',
    label: 'Mexico & Central America',
    desc: 'Mexico, Guatemala, Costa Rica, Panama, El Salvador, Honduras, Nicaragua & Belize',
    codes: ['MX', 'GT', 'CR', 'PA', 'SV', 'HN', 'NI', 'BZ']
  },
  {
    id: 'oceania-anz',
    label: 'Australia & New Zealand',
    desc: 'Australia & New Zealand',
    codes: ['AU', 'NZ']
  },
  {
    id: 'geoguessr-all',
    label: 'Official GeoGuessr Countries',
    desc: 'All 95+ countries with official Street View coverage',
    codes: OFFICIAL_GEOGUESSR_COUNTRIES
  }
];

export const QuizCatalog: React.FC<QuizCatalogProps> = ({
  onStartSubdivisionQuiz,
  onStartGlobeQuiz
}) => {
  const [selectedTopic, setSelectedTopic] = useState<MainTopicTab | null>(null);
  const [activeSubScope, setActiveSubScope] = useState<SubScopeTab>('all');

  // Search inside 'All'
  const [countrySearch, setCountrySearch] = useState('');

  // Continent selected inside 'Continents' sub-tab
  const [selectedContinent, setSelectedContinent] = useState<string>('Europe');

  // Difficulty Tier for Cities
  const [citiesTier] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Question Count Limit for World / Continent / Custom quizzes (0 = All)
  const [catalogQuestionLimit] = useState<number>(0);

  // Area Code Depth Level for World / Continent / Custom quizzes ('all' = Full Detail, '1' = x/0x, '2' = xx/0xx, '3' = xxx/0xxx)
  const [catalogAreaCodeDepth] = useState<AreaCodeDepthLevel>('all');
  const [countryAreaCodeDepthOverrides, setCountryAreaCodeDepthOverrides] = useState<Record<string, AreaCodeDepthLevel>>({
    IT: '2'
  });

  // Per-Country Subdivision Level Overrides in Custom Quiz Builder
  // Logical defaults: BE -> Provinces (adm2), LU -> Cantons (adm2)
  const [countrySubdivisionLevelIdx, setCountrySubdivisionLevelIdx] = useState<Record<string, number>>({
    BE: 1,
    LU: 1
  });

  // Custom Multi-Country Selector State (starts empty so Benelux is not preselected)
  const [customSelectedIds, setCustomSelectedIds] = useState<Set<string>>(new Set());
  const [customSearch, setCustomSearch] = useState('');
  const [showPremadeGroups, setShowPremadeGroups] = useState(false);

  // Scroll container ref to automatically scroll to top when switching tabs/continents
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedTopic, activeSubScope, selectedContinent]);

  // Daily Trio Once-Per-Day Completion Lock State
  const todayStr = getTodayUTCString();
  const [dailyCompletedStatus, setDailyCompletedStatus] = useState<{
    subdivisions: boolean;
    areacodes: boolean;
    cities: boolean;
    scores: { subdivisions?: string; areacodes?: string; cities?: string };
  }>({
    subdivisions: false,
    areacodes: false,
    cities: false,
    scores: {}
  });

  useEffect(() => {
    const checkDailyCompletion = async () => {
      let localMap: Record<string, boolean> = {};
      try {
        const raw = localStorage.getItem(`atlas_daily_completed_${todayStr}`);
        if (raw) localMap = JSON.parse(raw);
      } catch {
        // ignore
      }

      const stats = await db.userStats.get('current');
      const todayRec = stats?.dailyHistory?.[todayStr];

      setDailyCompletedStatus({
        subdivisions: Boolean(localMap['subdivisions'] || (todayRec && todayRec.subdivisionsScore !== undefined)),
        areacodes: Boolean(localMap['areacodes'] || (todayRec && todayRec.areacodesScore !== undefined)),
        cities: Boolean(localMap['cities'] || (todayRec && todayRec.citiesScore !== undefined)),
        scores: {
          subdivisions:
            todayRec?.subdivisionsScore !== undefined ? `${todayRec.subdivisionsScore}/5` : undefined,
          areacodes:
            todayRec?.areacodesScore !== undefined ? `${todayRec.areacodesScore}/5` : undefined,
          cities:
            todayRec?.citiesScore !== undefined ? `${todayRec.citiesScore} pts` : undefined
        }
      });
    };
    checkDailyCompletion();
  }, [todayStr, selectedTopic]);

  // 197 official sovereign countries
  const allCountriesList = useMemo(() => {
    return Object.values(COUNTRIES_DATABASE)
      .filter((c) => !c.isTerritory)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // All 250 countries, territories & disputed areas
  const allCountriesAndTerritoriesList = useMemo(() => {
    return Object.values(COUNTRIES_DATABASE).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const dailySet = useMemo(() => getDailyChallenges(todayStr), [todayStr]);

  // Filter quizzes of a country according to topic
  const getTopicQuizzesForCountry = (
    country: CountryInfo,
    topic: MainTopicTab | null = selectedTopic
  ): SubdivisionQuizOption[] => {
    if (!topic) return [];
    const allOpts = getCountrySubdivisions(country);
    if (topic === 'subdivisions') {
      return allOpts.filter(
        (q) => q.category === 'adm1' || q.category === 'adm2' || q.category === 'adm3'
      );
    }
    if (topic === 'areacodes') {
      return allOpts.filter((q) => q.category === 'areacodes');
    }
    if (topic === 'cities') {
      const countryCities = getCitiesByScopeAndTier({ type: 'country', value: country.id }, 'hard');
      return [
        {
          id: `${country.id.toLowerCase()}-cities`,
          title: 'Cities',
          description: `Pinpoint ${countryCities.length} cities & towns in ${country.name} on the 3D Globe`,
          category: 'cities',
          geojsonFile:
            country.subdivisionFile ||
            `/maps/subdivisions/${(country.iso3 || country.id).toLowerCase()}_adm1.geojson`,
          levelKey: 'CITY_PIN',
          targetCount: Math.max(1, countryCities.length),
          badge: 'Cities',
          color: 'amber'
        }
      ];
    }
    if (topic === 'others') {
      return allOpts.filter((q) => q.category === 'extra' || q.category === 'flags');
    }
    return [];
  };

  const eligibleCountriesForTopic = useMemo(() => {
    if (!selectedTopic || selectedTopic === 'daily') return allCountriesList;
    if (selectedTopic === 'cities') {
      const codesWithCities = new Set(
        getCitiesByScopeAndTier({ type: 'world' }, 'hard').map((ct) =>
          ct.countryCode.toUpperCase()
        )
      );
      return allCountriesAndTerritoriesList.filter(
        (c) => !c.isTerritory || codesWithCities.has(c.id.toUpperCase())
      );
    }
    return allCountriesList.filter((c) => getTopicQuizzesForCountry(c, selectedTopic).length > 0);
  }, [allCountriesList, allCountriesAndTerritoriesList, selectedTopic]);

  const filteredCountriesInAll = useMemo(() => {
    return eligibleCountriesForTopic.filter((c) => {
      if (!countrySearch.trim()) return true;
      const q = countrySearch.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q)
      );
    });
  }, [eligibleCountriesForTopic, countrySearch]);

  const toggleCustomCountry = (code: string) => {
    sounds.playTap();
    setCustomSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const applyCustomPreset = (codes: string[]) => {
    sounds.playTap();
    const eligibleSet = new Set(eligibleCountriesForTopic.map((c) => c.id));
    const valid = codes.filter((id) => eligibleSet.has(id));
    if (valid.length > 0) {
      setCustomSelectedIds(new Set(valid));
    } else {
      const anyValid = codes.filter((id) => COUNTRIES_DATABASE[id]);
      if (anyValid.length > 0) setCustomSelectedIds(new Set(anyValid));
    }
    setShowPremadeGroups(false);
  };

  // Open Quiz Setup Modal first for Whole-World, Continent, or Custom Multi-Country 3D Globe Quizzes
  const handleLaunchCombinedGlobeQuiz = (
    scopeTitle: string,
    targetCountries: CountryInfo[],
    modeType:
      | 'countries'
      | 'flags'
      | 'capitals'
      | 'subdivisions'
      | 'areacodes'
      | 'cities'
      | 'others',
    isCustomScope = false
  ) => {
    sounds.playTap();
    if (targetCountries.length === 0) return;

    const primary = targetCountries[0];
    const scopeCountry: CountryInfo = {
      ...primary,
      id: isCustomScope ? 'CUSTOM' : activeSubScope === 'continents' ? `CONT_${selectedContinent}` : 'WORLD',
      name: scopeTitle
    };

    const openSetupOrLaunch = (quizOpt: SubdivisionQuizOption, baseCfg: Partial<ActiveGlobeQuizConfig>) => {
      if (onStartSubdivisionQuiz) {
        onStartSubdivisionQuiz(scopeCountry, quizOpt, baseCfg);
      } else if (onStartGlobeQuiz) {
        onStartGlobeQuiz({
          country: primary,
          quizOption: quizOpt,
          selectedGroups: ['all'],
          initialMode: 'quiz',
          ...baseCfg
        });
      }
    };

    if (modeType === 'countries') {
      const exactCount = targetCountries.length > 200 ? 244 : targetCountries.length;
      openSetupOrLaunch(
        {
          id: `world-countries-${exactCount}`,
          title: scopeTitle,
          description: `Click countries directly on the 3D Globe`,
          category: 'adm1',
          geojsonFile: '/maps/world/countries.geojson',
          levelKey: 'COUNTRY',
          targetCount: exactCount,
          badge: 'World',
          color: 'sky',
          ...(targetCountries.length <= 200
            ? { multiCountries: targetCountries.map((c) => c.id) }
            : {})
        } as any,
        {
          multiCountries: targetCountries
        }
      );
      return;
    }

    if (modeType === 'flags') {
      const exactCount = targetCountries.length > 200 ? 244 : targetCountries.length;
      openSetupOrLaunch(
        {
          id: `world-flags-${exactCount}`,
          title: scopeTitle,
          description: `Identify country flags by clicking each country on the 3D Globe`,
          category: 'flags',
          geojsonFile: '/maps/world/countries.geojson',
          levelKey: 'COUNTRY_FLAG',
          targetCount: exactCount,
          badge: 'Flags',
          color: 'amber',
          ...(targetCountries.length <= 200
            ? { multiCountries: targetCountries.map((c) => c.id) }
            : {})
        } as any,
        {
          multiCountries: targetCountries
        }
      );
      return;
    }

    if (modeType === 'capitals') {
      const exactCount = targetCountries.length > 200 ? 244 : targetCountries.length;
      openSetupOrLaunch(
        {
          id: `world-capitals-${exactCount}`,
          title: scopeTitle,
          description: `Match national capitals by clicking their country on the 3D Globe`,
          category: 'adm1',
          geojsonFile: '/maps/world/countries.geojson',
          levelKey: 'COUNTRY_CAPITAL',
          targetCount: exactCount,
          badge: 'Capitals',
          color: 'emerald',
          ...(targetCountries.length <= 200
            ? { multiCountries: targetCountries.map((c) => c.id) }
            : {})
        } as any,
        {
          multiCountries: targetCountries
        }
      );
      return;
    }

    if (modeType === 'cities') {
      const allowedSet = new Set(targetCountries.map((c) => c.id.toUpperCase()));
      const allWorldCities = getCitiesByScopeAndTier({ type: 'world' }, 'hard').filter((city) =>
        allowedSet.has(city.countryCode.toUpperCase())
      );
      openSetupOrLaunch(
        {
          id: `combined-cities-${targetCountries.length}`,
          title: scopeTitle,
          description: `Pinpoint cities across ${targetCountries.length} countries on the 3D Globe`,
          category: 'cities',
          geojsonFile: primary.subdivisionFile || '/maps/world/countries.geojson',
          levelKey: 'CITY_PIN',
          targetCount: allWorldCities.length,
          badge: 'Cities',
          color: 'amber',
          customCitiesPool: allWorldCities,
          multiCountries: targetCountries.map((c) => c.id)
        } as any,
        {
          multiCountries: targetCountries,
          customCitiesPool: allWorldCities
        }
      );
      return;
    }

    if (modeType === 'areacodes') {
      const multiFiles: { file: string; countryCode: string; countryName: string }[] = [];
      const totalEstimatedZones = targetCountries.reduce((acc, c) => {
        const acOpt = getCountrySubdivisions(c).find((q) => q.category === 'areacodes');
        if (acOpt?.geojsonFile) {
          multiFiles.push({
            file: acOpt.geojsonFile,
            countryCode: c.id,
            countryName: c.name
          });
        }
        return acc + (acOpt?.targetCount || 15);
      }, 0);
      openSetupOrLaunch(
        {
          id: `combined-areacodes-${targetCountries.length}`,
          title: scopeTitle,
          description: `Telephone area code zones across ${targetCountries.length} countries on the 3D Globe`,
          category: 'areacodes',
          geojsonFile: multiFiles[0]?.file || '/maps/areacodes/belgium_areacodes.geojson',
          levelKey: 'AreaCode',
          targetCount: totalEstimatedZones,
          badge: 'Area Code',
          color: 'emerald',
          multiFiles
        } as any,
        {
          multiCountries: targetCountries,
          areaCodeDepthByCountry: isCustomScope ? countryAreaCodeDepthOverrides : undefined
        }
      );
      return;
    }

    if (modeType === 'others') {
      const extraMultiFiles: { file: string; countryCode: string; countryName: string }[] = [];
      let totalExtraCount = 0;
      targetCountries.forEach((c) => {
        const exOpt = getCountrySubdivisions(c).find((q) => q.category === 'extra');
        if (exOpt?.geojsonFile) {
          extraMultiFiles.push({
            file: exOpt.geojsonFile,
            countryCode: c.id,
            countryName: c.name
          });
          totalExtraCount += exOpt.targetCount || 12;
        }
      });
      openSetupOrLaunch(
        {
          id: `combined-extra-${targetCountries.length}`,
          title: scopeTitle,
          description: `Regional meta & postal zones across ${targetCountries.length} countries on the 3D Globe`,
          category: 'extra',
          geojsonFile: extraMultiFiles[0]?.file || '/maps/postcodes/germany_postcodes1.geojson',
          levelKey: 'EXTRA',
          targetCount: totalExtraCount || targetCountries.length * 12,
          badge: 'Meta',
          color: 'indigo',
          multiFiles: extraMultiFiles.length > 0 ? extraMultiFiles : undefined
        } as any,
        {
          multiCountries: targetCountries
        }
      );
      return;
    }

    // Build per-country subdivision overrides when in Custom mode or Benelux, plus Level 1 & Level 2 lists for World/Continent Subdivisions
    const subOverrides: Record<string, string> = {};
    const customMultiFiles: { file: string; countryCode: string; countryName: string }[] = [];
    const adm2MultiFiles: { file: string; countryCode: string; countryName: string }[] = [];
    let primaryChosenOpt: SubdivisionQuizOption | undefined;
    let totalSubCount = 0;
    let totalAdm2Count = 0;
    for (const c of targetCountries) {
      const subCard = getCountrySubdivisions(c).find((q) => q.category === 'adm1' || q.category === 'adm2');
      const levels = subCard?.availableLevels || (subCard ? [subCard] : []);
      if (levels.length > 0) {
        const defaultIdx =
          (c.id === 'BE' || c.id === 'LU') && levels.length > 1
            ? 1
            : 0;
        const chosenIdx =
          countrySubdivisionLevelIdx[c.id] !== undefined
            ? Math.min(countrySubdivisionLevelIdx[c.id], levels.length - 1)
            : defaultIdx;
        const chosenOpt = levels[chosenIdx];
        if (chosenOpt) {
          subOverrides[c.id] = chosenOpt.geojsonFile;
          customMultiFiles.push({
            file: chosenOpt.geojsonFile,
            countryCode: c.id,
            countryName: c.name
          });
          totalSubCount += chosenOpt.targetCount || 10;
          if (c.id === primary.id) primaryChosenOpt = chosenOpt;
        }
        const adm2Opt = levels.length > 1 ? levels[levels.length - 1] : levels[0];
        if (adm2Opt) {
          adm2MultiFiles.push({
            file: adm2Opt.geojsonFile,
            countryCode: c.id,
            countryName: c.name
          });
          totalAdm2Count += adm2Opt.targetCount || 25;
        }
      } else {
        const fallbackFile =
          c.subdivisionFile || `/maps/subdivisions/${(c.iso3 || 'bel').toLowerCase()}_adm1.geojson`;
        subOverrides[c.id] = fallbackFile;
        customMultiFiles.push({
          file: fallbackFile,
          countryCode: c.id,
          countryName: c.name
        });
      }
    }

    const useUnifiedWorldAdm1 = targetCountries.length > 8 && !isCustomScope;
    const baseLevel1Option: SubdivisionQuizOption = {
      id: `combined-adm1-${targetCountries.length}`,
      title: `Level 1: States, Provinces & Regions`,
      description: `First-level administrative subdivisions across ${targetCountries.length} countries on the 3D Globe`,
      category: 'adm1',
      geojsonFile: useUnifiedWorldAdm1
        ? '/maps/world/world_adm1_quiz.geojson'
        : primaryChosenOpt?.geojsonFile ||
          primary.subdivisionFile ||
          `/maps/subdivisions/${(primary.iso3 || 'bel').toLowerCase()}_adm1.geojson`,
      levelKey: primaryChosenOpt?.levelKey || 'NAME_1',
      targetCount: totalSubCount || targetCountries.length * 10,
      badge: 'Level 1',
      color: 'sky',
      ...(isCustomScope
        ? {
            customCountriesList: targetCountries,
            countrySubdivisionOverrides: subOverrides,
            multiFiles: customMultiFiles
          }
        : !useUnifiedWorldAdm1
        ? {
            multiFiles: customMultiFiles,
            countrySubdivisionOverrides: subOverrides
          }
        : {})
    } as any;

    const baseLevel2Option: SubdivisionQuizOption = {
      id: `combined-adm2-${targetCountries.length}`,
      title: `Level 2: Counties, Districts & Municipalities`,
      description: `Second-level districts, counties & municipalities across ${targetCountries.length} countries on the 3D Globe`,
      category: 'adm2',
      geojsonFile: adm2MultiFiles[0]?.file || baseLevel1Option.geojsonFile,
      levelKey: 'NAME_2',
      targetCount: totalAdm2Count || totalSubCount * 4,
      badge: 'Level 2',
      color: 'indigo',
      multiFiles: adm2MultiFiles
    } as any;

    openSetupOrLaunch(
      {
        ...baseLevel1Option,
        title: scopeTitle,
        availableLevels: !isCustomScope ? [baseLevel1Option, baseLevel2Option] : undefined
      } as any,
      {
        multiCountries: targetCountries,
        countrySubdivisionOverrides: subOverrides
      }
    );
  };

  // Launch Daily Trio Challenge directly on the 3D Globe (Only Playable Once Per Day!)
  const handleStartDailyGlobe = (type: 'cities' | 'areacodes' | 'subdivisions') => {
    if (dailyCompletedStatus[type]) {
      sounds.playError();
      return;
    }
    sounds.playFanfare();
    if (!onStartGlobeQuiz) return;

    if (type === 'cities') {
      const dailyCities = dailySet.cities;
      const primary =
        COUNTRIES_DATABASE[dailyCities[0]?.countryCode || 'BE'] || COUNTRIES_DATABASE['BE'];
      onStartGlobeQuiz({
        country: primary,
        quizOption: {
          id: `daily-cities-${todayStr}`,
          title: `Daily Cities (${todayStr})`,
          description: `5 daily world cities (1 from each Tier 1–5) synchronized for ${todayStr}`,
          category: 'cities',
          geojsonFile: '/maps/world/countries.geojson',
          levelKey: 'CITY_PIN',
          targetCount: dailyCities.length,
          badge: 'Daily',
          color: 'amber'
        },
        selectedGroups: ['all'],
        initialMode: 'quiz',
        multiCountries: allCountriesList,
        customCitiesPool: dailyCities
      });
      return;
    }

    if (type === 'areacodes') {
      const dailyAC = dailySet.areaCodes;
      const featuredCountries = dailyAC
        .map((item) => COUNTRIES_DATABASE[item.countryCode])
        .filter((c): c is CountryInfo => Boolean(c));
      const primary = featuredCountries[0] || COUNTRIES_DATABASE['BE'];

      onStartGlobeQuiz({
        country: primary,
        quizOption: {
          id: `daily-areacodes-${todayStr}`,
          title: `Daily Area Codes — 5 Countries (${todayStr})`,
          description: `5 daily telephone area codes across 5 distinct countries for ${todayStr}`,
          category: 'areacodes',
          geojsonFile: '/maps/subdivisions/belgium_areacodes.geojson',
          levelKey: 'AreaCode',
          targetCount: dailyAC.length,
          badge: 'Daily',
          color: 'emerald'
        },
        selectedGroups: ['all'],
        initialMode: 'quiz',
        multiCountries: featuredCountries,
        dailyAreaCodesPool: dailyAC
      });
      return;
    }

    const dailySubs = dailySet.subdivisions;
    const featuredCountries = dailySubs
      .map((item) => COUNTRIES_DATABASE[item.countryCode])
      .filter((c): c is CountryInfo => Boolean(c));
    const primary = featuredCountries[0] || COUNTRIES_DATABASE['FR'];

    onStartGlobeQuiz({
      country: primary,
      quizOption: {
        id: `daily-subdivisions-${todayStr}`,
        title: `Daily Subdivisions — 5 Countries (${todayStr})`,
        description: `5 daily administrative subdivisions across 5 distinct countries for ${todayStr}`,
        category: 'adm1',
        geojsonFile: '/maps/world/world_adm1_quiz.geojson',
        levelKey: 'NAME_1',
        targetCount: dailySubs.length,
        badge: 'Daily',
        color: 'sky'
      },
      selectedGroups: ['all'],
      initialMode: 'quiz',
      multiCountries: featuredCountries,
      dailySubdivisionsPool: dailySubs
    });
  };

  // Helper to render a Country Quiz Card (used identically across All, Continents, etc.)
  const renderCountryCard = (country: CountryInfo) => {
    const topicQuizzes = getTopicQuizzesForCountry(country);
    const getOptionLevelCount = (qOpt: SubdivisionQuizOption): number => {
      if (qOpt.availableLevels && qOpt.availableLevels.length > 0) {
        return qOpt.availableLevels.length;
      }
      const match = qOpt.title.match(/\((\d+)\s*Levels?\)/i);
      if (match) return Math.max(1, parseInt(match[1], 10));
      return 1;
    };
    const totalQuizLevelsCount = topicQuizzes.reduce(
      (sum, qOpt) => sum + getOptionLevelCount(qOpt),
      0
    );

    return (
      <div
        key={country.id}
        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <CountryFlag countryCode={country.id} size="md" />
            <div className="min-w-0">
              <h3 className="text-sm font-black text-white truncate">{country.name}</h3>
              <p className="text-[11px] text-slate-400">
                {country.continent} · {totalQuizLevelsCount}{' '}
                {totalQuizLevelsCount === 1 ? 'Quiz' : 'Quizzes'}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-sky-400 font-bold">{country.id}</span>
        </div>

        <div className="space-y-1.5">
          {topicQuizzes.map((qOpt) => {
            const levelCount = getOptionLevelCount(qOpt);
            return (
              <button
                key={qOpt.id}
                onClick={() => {
                  sounds.playTap();
                  if (onStartSubdivisionQuiz) {
                    onStartSubdivisionQuiz(country, qOpt);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-sky-600/20 border border-slate-700/70 hover:border-sky-500/50 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  {qOpt.category === 'areacodes' ? (
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : qOpt.category === 'cities' ? (
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : qOpt.category === 'flags' ? (
                    <Flag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    {qOpt.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {levelCount > 1 && (
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-[9px] font-mono text-sky-300">
                      {levelCount} Levels
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-sky-400">
                    {qOpt.targetCount} Q
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ============================================================================
  // LANDING SCREEN: 4 SQUARE CARDS (2x2 GRID) + 1 LONG DAILY TRIO RECTANGLE
  // ============================================================================
  if (selectedTopic === null) {
    const squareTopics: Array<{
      id: MainTopicTab;
      title: string;
      subtitle: string;
      badge: string;
      icon: React.FC<{ className?: string }>;
      borderClass: string;
      iconBgClass: string;
      textAccentClass: string;
    }> = [
      {
        id: 'subdivisions',
        title: 'Subdivisions',
        subtitle: 'Countries of the World, States, Provinces, Cantons & Municipalities across 197 Countries',
        badge: '1. Subdivisions',
        icon: Layers,
        borderClass: 'border-slate-800 hover:border-sky-500',
        iconBgClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
        textAccentClass: 'text-sky-400'
      },
      {
        id: 'areacodes',
        title: 'Area Codes',
        subtitle: 'Telephone Area Code Prefixes (1, 2 & 3 Geographical Levels) for 76 Countries',
        badge: '2. Area Codes',
        icon: Phone,
        borderClass: 'border-slate-800 hover:border-emerald-500',
        iconBgClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        textAccentClass: 'text-emerald-400'
      },
      {
        id: 'cities',
        title: 'Cities',
        subtitle: 'Capitals of the World & 5-Tier Global/Regional GeoGuessr Cities with 5,000-Pt Pinpoint Scoring',
        badge: '3. Cities & Capitals',
        icon: Building2,
        borderClass: 'border-slate-800 hover:border-amber-500',
        iconBgClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        textAccentClass: 'text-amber-400'
      },
      {
        id: 'others',
        title: 'Others',
        subtitle: 'Country Flags, Postal Codes, License Plates, Bin Numbers & Regional GeoGuessr Metas',
        badge: '4. Others & Metas',
        icon: Sparkles,
        borderClass: 'border-slate-800 hover:border-indigo-500',
        iconBgClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        textAccentClass: 'text-indigo-400'
      }
    ];

    return (
      <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 select-none p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-5 pb-20">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                PhoenixAtlas 3D Globe Quiz Hub
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Choose a Quiz Category
              </h1>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Subdivisions · Area Codes · Cities · Others
            </span>
          </div>

          {/* 4 Square Category Cards (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
            {squareTopics.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    sounds.playTap();
                    setSelectedTopic(card.id);
                    setActiveSubScope('all');
                  }}
                  className={`aspect-square sm:aspect-[4/3] p-4 sm:p-6 rounded-2xl bg-slate-900 border ${card.borderClass} flex flex-col justify-between text-left transition-all group active:scale-[0.99]`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl border flex items-center justify-center ${card.iconBgClass} group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase ${card.textAccentClass}`}>
                      {card.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                        {card.title}
                      </h2>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {card.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 1 Long Rectangular Daily Trio Banner Below the 4 Squares (Playable Once Per UTC Day!) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    Daily Synchronized Challenge · {todayStr} (1 Attempt / Day)
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    Daily Trio — 3 Randomized 5-Question Globe Challenges
                  </h2>
                  <p className="text-xs text-slate-400">
                    Each daily challenge can only be played once per day. Daily Cities selects 5 world cities (1 from each Tier 1–5) across 5 countries.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playTap();
                    const subScore = dailyCompletedStatus.scores.subdivisions || 'Not played';
                    const acScore = dailyCompletedStatus.scores.areacodes || 'Not played';
                    const citScore = dailyCompletedStatus.scores.cities || 'Not played';
                    const shareText = [
                      `🌐 PhoenixAtlas Daily Trio (${todayStr})`,
                      `🏛️ Subdivisions: ${subScore}`,
                      `📞 Area Codes: ${acScore}`,
                      `📍 Cities: ${citScore}`
                    ].join('\n');
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(shareText).catch(() => {});
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
                  title="Copy your Daily Trio Scorecard to share with friends"
                >
                  Copy Daily Scorecard
                </button>
                <button
                  onClick={() => {
                    sounds.playTap();
                    setSelectedTopic('daily');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                >
                  Open Full Daily View →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Daily #1: Subdivisions */}
              <button
                disabled={dailyCompletedStatus.subdivisions}
                onClick={() => handleStartDailyGlobe('subdivisions')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  dailyCompletedStatus.subdivisions
                    ? 'bg-slate-950/50 border-emerald-500/40 opacity-80 cursor-not-allowed'
                    : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-sky-500/50'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                    Daily #1 · 5 Subdivisions
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {dailyCompletedStatus.subdivisions
                      ? `✓ Completed Today ${dailyCompletedStatus.scores.subdivisions ? `(${dailyCompletedStatus.scores.subdivisions})` : ''}`
                      : 'Play Daily Subdivisions (5 Q)'}
                  </p>
                </div>
                {dailyCompletedStatus.subdivisions ? (
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Play className="w-4 h-4 text-sky-400 fill-current shrink-0" />
                )}
              </button>

              {/* Daily #2: Area Codes */}
              <button
                disabled={dailyCompletedStatus.areacodes}
                onClick={() => handleStartDailyGlobe('areacodes')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  dailyCompletedStatus.areacodes
                    ? 'bg-slate-950/50 border-emerald-500/40 opacity-80 cursor-not-allowed'
                    : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                    Daily #2 · 5 Area Codes
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {dailyCompletedStatus.areacodes
                      ? `✓ Completed Today ${dailyCompletedStatus.scores.areacodes ? `(${dailyCompletedStatus.scores.areacodes})` : ''}`
                      : 'Play Daily Area Codes (5 Q)'}
                  </p>
                </div>
                {dailyCompletedStatus.areacodes ? (
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Play className="w-4 h-4 text-emerald-400 fill-current shrink-0" />
                )}
              </button>

              {/* Daily #3: Cities */}
              <button
                disabled={dailyCompletedStatus.cities}
                onClick={() => handleStartDailyGlobe('cities')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  dailyCompletedStatus.cities
                    ? 'bg-slate-950/50 border-emerald-500/40 opacity-80 cursor-not-allowed'
                    : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-amber-500/50'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    Daily #3 · 5 Cities (Tier 1 &amp; 2)
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {dailyCompletedStatus.cities
                      ? `✓ Completed Today ${dailyCompletedStatus.scores.cities ? `(${dailyCompletedStatus.scores.cities})` : ''}`
                      : 'Play Daily Cities (5 Q)'}
                  </p>
                </div>
                {dailyCompletedStatus.cities ? (
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Play className="w-4 h-4 text-amber-400 fill-current shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const topicLabels: Record<MainTopicTab, string> = {
    subdivisions: 'Subdivisions',
    areacodes: 'Area Codes',
    cities: 'Cities & Capitals',
    others: 'Others & Regional Metas',
    daily: 'Daily Trio'
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Clean Single Top Bar: Back Button + Topic Name + 4 Scope Tabs (All | World | Continents | Custom) */}
      <div className="px-3 sm:px-5 py-3 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sounds.playTap();
              setSelectedTopic(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
            <span>Categories</span>
          </button>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400 shrink-0 hidden sm:inline" />
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
              {topicLabels[selectedTopic]}
            </h1>
          </div>
        </div>

        {/* Single Row of 4 Scope Tabs: All | World | Continents | Custom */}
        {selectedTopic !== 'daily' && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'world', label: 'World' },
              { id: 'continents', label: 'Continents' },
              { id: 'custom', label: 'Custom' }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  sounds.playTap();
                  setActiveSubScope(sub.id as SubScopeTab);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeSubScope === sub.id
                    ? 'bg-sky-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area (Auto-scrolls to top on tab/continent switch) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full pb-20 space-y-4"
      >

        {/* ============================================================ */}
        {/* DAILY TRIO PAGE (LOCKED AFTER 1 PLAY PER UTC DAY)            */}
        {/* ============================================================ */}
        {selectedTopic === 'daily' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-amber-500/40 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  UTC Daily Seed: {todayStr} · 1 Attempt Per Day
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  Daily Trio — 3D Globe Challenges (5 Questions Each)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Each daily challenge asks 5 randomized questions from 5 distinct countries on the 3D Globe and locks until tomorrow (00:00 UTC) once completed.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase font-mono">
                    Daily Challenge #1 · 5 Questions
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">Daily Subdivisions</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Find 5 randomized first-level states &amp; provinces across 5 distinct countries on the 3D Globe.
                  </p>
                </div>
                <button
                  disabled={dailyCompletedStatus.subdivisions}
                  onClick={() => handleStartDailyGlobe('subdivisions')}
                  className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-lg ${
                    dailyCompletedStatus.subdivisions
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-not-allowed'
                      : 'bg-sky-600 hover:bg-sky-500 text-white'
                  }`}
                >
                  {dailyCompletedStatus.subdivisions ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        Completed Today{' '}
                        {dailyCompletedStatus.scores.subdivisions
                          ? `(${dailyCompletedStatus.scores.subdivisions})`
                          : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Daily Subdivisions (5 Q)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase font-mono">
                    Daily Challenge #2 · 5 Questions
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">Daily Area Codes</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Locate 5 randomized telephone area codes across 5 distinct countries on the 3D Globe.
                  </p>
                </div>
                <button
                  disabled={dailyCompletedStatus.areacodes}
                  onClick={() => handleStartDailyGlobe('areacodes')}
                  className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-lg ${
                    dailyCompletedStatus.areacodes
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {dailyCompletedStatus.areacodes ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        Completed Today{' '}
                        {dailyCompletedStatus.scores.areacodes
                          ? `(${dailyCompletedStatus.scores.areacodes})`
                          : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Daily Area Codes (5 Q)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase font-mono">
                    Daily Challenge #3 · 5 Questions (Tier 1 &amp; 2)
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">Daily Cities</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Pinpoint 5 randomized Tier 1 (Capital/Major) &amp; Tier 2 (Regional Hub) cities from 5 distinct countries on the 3D Globe.
                  </p>
                </div>
                <button
                  disabled={dailyCompletedStatus.cities}
                  onClick={() => handleStartDailyGlobe('cities')}
                  className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-lg ${
                    dailyCompletedStatus.cities
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {dailyCompletedStatus.cities ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        Completed Today{' '}
                        {dailyCompletedStatus.scores.cities
                          ? `(${dailyCompletedStatus.scores.cities})`
                          : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Daily Cities (5 Q)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUB-SCOPE 1: ALL (TOPIC-SPECIFIC PINNED CARDS + COUNTRIES)   */}
        {/* ============================================================ */}
        {selectedTopic !== 'daily' && activeSubScope === 'all' && (
          <div className="space-y-4">
            {/* Pinned Cards Strictly Filtered by Active Topic! */}
            {!countrySearch.trim() && selectedTopic === 'subdivisions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    handleLaunchCombinedGlobeQuiz(
                      'Countries of the World',
                      allCountriesList,
                      'countries'
                    )
                  }
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/40 hover:border-sky-400 flex items-center justify-between text-left shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                        Official Recognized (197)
                      </span>
                      <h3 className="text-sm font-black text-white">Countries of the World</h3>
                      <p className="text-[11px] text-slate-400">
                        {catalogQuestionLimit > 0
                          ? `${catalogQuestionLimit} Random of ${allCountriesList.length} Sovereign Countries`
                          : `${allCountriesList.length} Sovereign Countries`}
                      </p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-sky-400 fill-current shrink-0" />
                </button>

                <button
                  onClick={() =>
                    handleLaunchCombinedGlobeQuiz(
                      'Countries, Territories & Disputed Areas',
                      allCountriesAndTerritoriesList,
                      'countries'
                    )
                  }
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/40 hover:border-indigo-400 flex items-center justify-between text-left shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                        Extended World Quiz (244)
                      </span>
                      <h3 className="text-sm font-black text-white">Countries &amp; Territories</h3>
                      <p className="text-[11px] text-slate-400">
                        244 Countries, Territories &amp; Disputed Areas
                      </p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-indigo-400 fill-current shrink-0" />
                </button>
              </div>
            )}

            {!countrySearch.trim() && selectedTopic === 'cities' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() =>
                    handleLaunchCombinedGlobeQuiz(
                      'Capitals of the World',
                      allCountriesList,
                      'capitals'
                    )
                  }
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-between text-left shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                        Official Sovereign (197)
                      </span>
                      <h3 className="text-sm font-black text-white">Capitals of the World</h3>
                      <p className="text-[11px] text-slate-400">
                        197 Official National Capitals
                      </p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-emerald-400 fill-current shrink-0" />
                </button>

                <button
                  onClick={() =>
                    handleLaunchCombinedGlobeQuiz(
                      'Capitals of Countries & Territories',
                      allCountriesAndTerritoriesList,
                      'capitals'
                    )
                  }
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950/40 border border-teal-500/40 hover:border-teal-400 flex items-center justify-between text-left shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-teal-400 font-bold uppercase">
                        Extended World (244)
                      </span>
                      <h3 className="text-sm font-black text-white">Capitals &amp; Territories</h3>
                      <p className="text-[11px] text-slate-400">
                        244 Capitals incl. Territories &amp; Disputed
                      </p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-teal-400 fill-current shrink-0" />
                </button>

                <button
                  onClick={() =>
                    handleLaunchCombinedGlobeQuiz(
                      'Cities of the World',
                      eligibleCountriesForTopic,
                      'cities'
                    )
                  }
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/40 hover:border-amber-400 flex items-center justify-between text-left shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                        3D Pinpoint Cities
                      </span>
                      <h3 className="text-sm font-black text-white">Cities of the World</h3>
                      <p className="text-[11px] text-slate-400">
                        T1 (306) · T3 (2,605) · All 5,820 Cities
                      </p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-amber-400 fill-current shrink-0" />
                </button>
              </div>
            )}

            {!countrySearch.trim() && selectedTopic === 'others' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() =>
                    handleLaunchCombinedGlobeQuiz('Flags of the World', allCountriesList, 'flags')
                  }
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/40 hover:border-amber-400 flex items-center justify-between text-left shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Flag className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                        Official Recognized (197)
                      </span>
                      <h3 className="text-sm font-black text-white">Flags of the World</h3>
                      <p className="text-[11px] text-slate-400">
                        {catalogQuestionLimit > 0
                          ? `${catalogQuestionLimit} Random of ${allCountriesList.length} National Flags`
                          : `${allCountriesList.length} Official National Flags`}
                      </p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-amber-400 fill-current shrink-0" />
                </button>

                <button
                  onClick={() =>
                    handleLaunchCombinedGlobeQuiz(
                      'Flags of Countries & Territories',
                      allCountriesAndTerritoriesList,
                      'flags'
                    )
                  }
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-orange-950/40 border border-orange-500/40 hover:border-orange-400 flex items-center justify-between text-left shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-orange-400 font-bold uppercase">
                        Extended World (244)
                      </span>
                      <h3 className="text-sm font-black text-white">Flags &amp; Territories</h3>
                      <p className="text-[11px] text-slate-400">
                        244 Flags incl. Territories &amp; Disputed
                      </p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-orange-400 fill-current shrink-0" />
                </button>

                <button
                  onClick={() =>
                    handleLaunchCombinedGlobeQuiz(
                      'World Postal Codes & Regional Metas',
                      eligibleCountriesForTopic,
                      'others'
                    )
                  }
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/40 hover:border-indigo-400 flex items-center justify-between text-left shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                        Global Metas
                      </span>
                      <h3 className="text-sm font-black text-white">World Postal &amp; Regional Metas</h3>
                      <p className="text-[11px] text-slate-400">
                        {eligibleCountriesForTopic.length} Countries with Regional Metas
                      </p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-indigo-400 fill-current shrink-0" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder={`Search ${eligibleCountriesForTopic.length} countries in ${topicLabels[selectedTopic]}...`}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>
              <span className="text-xs font-mono text-sky-400 font-bold">
                {filteredCountriesInAll.length} Countries
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredCountriesInAll.map((country) => renderCountryCard(country))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUB-SCOPE 2: WORLD (TRUE WHOLE-WORLD 3D GLOBE QUIZZES)       */}
        {/* ============================================================ */}
        {selectedTopic !== 'daily' && activeSubScope === 'world' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {selectedTopic === 'subdivisions' && (
                <>
                  {/* Card 1: All 197 Sovereign Countries of the World + 250 Extended Option */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-7 rounded bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                          <Globe className="w-4 h-4" />
                        </div>
                         <div>
                           <h3 className="text-sm font-black text-white">Countries of the World</h3>
                           <p className="text-[11px] text-slate-400">Official 197 Sovereign Nations or Full 244 List</p>
                         </div>
                       </div>
                       <span className="text-xs font-mono text-sky-400 font-bold">WORLD</span>
                     </div>
                     <div className="space-y-1.5">
                       <button
                         onClick={() =>
                           handleLaunchCombinedGlobeQuiz(
                             'Countries of the World',
                             allCountriesList,
                             'countries'
                           )
                         }
                         className="w-full px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-sky-600/20 border border-slate-700/70 hover:border-sky-500/50 flex items-center justify-between text-left transition-all group"
                       >
                         <div className="flex items-center gap-2">
                           <Layers className="w-3.5 h-3.5 text-sky-400" />
                           <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                             Official Sovereign Countries
                           </span>
                         </div>
                         <span className="text-[10px] font-mono text-sky-400">
                           197 Q
                         </span>
                       </button>
                       <button
                         onClick={() =>
                           handleLaunchCombinedGlobeQuiz(
                             'Countries, Territories & Disputed Areas',
                             allCountriesAndTerritoriesList,
                             'countries'
                           )
                         }
                         className="w-full px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 border border-slate-700/70 hover:border-indigo-500/50 flex items-center justify-between text-left transition-all group"
                       >
                         <div className="flex items-center gap-2">
                           <Globe className="w-3.5 h-3.5 text-indigo-400" />
                           <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                             Countries, Territories &amp; Disputed
                           </span>
                         </div>
                         <span className="text-[10px] font-mono text-indigo-400">
                           244 Q
                         </span>
                       </button>
                     </div>
                   </div>

                  {/* Card 2: Whole World Level-1 Subdivisions */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-7 rounded bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white">World Level-1 Subdivisions</h3>
                          <p className="text-[11px] text-slate-400">Whole World · All First-Level States &amp; Regions</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 font-bold">ADM1</span>
                    </div>
                    <button
                      onClick={() =>
                        handleLaunchCombinedGlobeQuiz(
                          'World Level-1 Subdivisions',
                          allCountriesList,
                          'subdivisions'
                        )
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 border border-slate-700/70 hover:border-indigo-500/50 flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                          All World Level-1 Subdivisions
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-400">
                        {catalogQuestionLimit > 0 ? `${catalogQuestionLimit} Q` : '3,500+ Q'}
                      </span>
                    </button>
                  </div>
                </>
              )}

              {selectedTopic === 'areacodes' && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-7 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">Area Codes of the World</h3>
                        <p className="text-[11px] text-slate-400">
                          Whole World · All {eligibleCountriesForTopic.length} Countries
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">WORLD</span>
                  </div>
                  <button
                    onClick={() =>
                      handleLaunchCombinedGlobeQuiz(
                        'Area Codes of the World',
                        eligibleCountriesForTopic,
                        'areacodes'
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-600/20 border border-slate-700/70 hover:border-emerald-500/50 flex items-center justify-between text-left transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                        All World Telephone Area Codes
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {catalogQuestionLimit > 0
                        ? `${catalogQuestionLimit} Q`
                        : `${eligibleCountriesForTopic.length} Countries`}
                    </span>
                  </button>
                </div>
              )}

              {selectedTopic === 'cities' && (
                <>
                  {/* Card 1: Capitals of the World (197 Official Sovereign or 244 Extended) */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-7 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white">Capitals of the World</h3>
                          <p className="text-[11px] text-slate-400">
                            197 Official National Capitals or 244 Extended List
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">CAPITALS</span>
                    </div>
                    <div className="space-y-1.5">
                      <button
                        onClick={() =>
                          handleLaunchCombinedGlobeQuiz(
                            'Capitals of the World',
                            allCountriesList,
                            'capitals'
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-emerald-600/20 border border-slate-700/70 hover:border-emerald-500/50 flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                            Official Sovereign Capitals
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400">197 Q</span>
                      </button>
                      <button
                        onClick={() =>
                          handleLaunchCombinedGlobeQuiz(
                            'Capitals of Countries & Territories',
                            allCountriesAndTerritoriesList,
                            'capitals'
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-teal-600/20 border border-slate-700/70 hover:border-teal-500/50 flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-teal-400" />
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                            Capitals incl. Territories &amp; Disputed
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-teal-400">244 Q</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Cities of the World */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-7 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white">
                            Cities of the World
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            Whole World · 3D Globe Pinpoint Scoring
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-amber-400 font-bold">WORLD</span>
                    </div>
                    <button
                      onClick={() =>
                        handleLaunchCombinedGlobeQuiz(
                          'Cities of the World',
                          eligibleCountriesForTopic,
                          'cities'
                        )
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 border border-slate-700/70 hover:border-amber-500/50 flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                          Launch Cities of the World
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400">
                        306 – 5,820 Cities
                      </span>
                    </button>
                  </div>
                </>
              )}

              {selectedTopic === 'others' && (
                <>
                  {/* Card 1: Flags of the World (197 Official or 244 Extended) */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-7 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                          <Flag className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white">Flags of the World</h3>
                          <p className="text-[11px] text-slate-400">
                            197 Official National Flags or 244 Countries &amp; Territories
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-amber-400 font-bold">FLAGS</span>
                    </div>
                    <div className="space-y-1.5">
                      <button
                        onClick={() =>
                          handleLaunchCombinedGlobeQuiz(
                            'Flags of the World',
                            allCountriesList,
                            'flags'
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 border border-slate-700/70 hover:border-amber-500/50 flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <Flag className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                            Official Sovereign Country Flags
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400">
                          {catalogQuestionLimit > 0 ? `${catalogQuestionLimit} Q` : `${allCountriesList.length} Q`}
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          handleLaunchCombinedGlobeQuiz(
                            'Flags of Countries & Territories',
                            allCountriesAndTerritoriesList,
                            'flags'
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-orange-500/20 border border-slate-700/70 hover:border-orange-500/50 flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                            Flags incl. Territories &amp; Disputed
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-orange-400">244 Q</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: World Postal & Regional Metas */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-7 rounded bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white">World Postal &amp; Regional Metas</h3>
                          <p className="text-[11px] text-slate-400">
                            Whole World · All {eligibleCountriesForTopic.length} Countries
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 font-bold">WORLD</span>
                    </div>
                    <button
                      onClick={() =>
                        handleLaunchCombinedGlobeQuiz(
                          'World Postal Codes & Regional Metas',
                          eligibleCountriesForTopic,
                          'others'
                        )
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 border border-slate-700/70 hover:border-indigo-500/50 flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                          Launch All World Regional Metas
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-400">
                        {eligibleCountriesForTopic.length} Countries
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUB-SCOPE 3: CONTINENTS (ONLY SHOWS CONTINENT BAR HERE!)      */}
        {/* ============================================================ */}
        {selectedTopic !== 'daily' && activeSubScope === 'continents' && (
          <div className="space-y-4">
            {/* Continent Selector Row */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {CONTINENTS_LIST.map((cont) => {
                const countInCont = eligibleCountriesForTopic.filter(
                  (c) => c.continent === cont
                ).length;
                const isSelected = selectedContinent === cont;
                return (
                  <button
                    key={cont}
                    onClick={() => {
                      sounds.playTap();
                      setSelectedContinent(cont);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-400 shadow-lg'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{cont}</span>
                    <span className="text-[10px] font-mono opacity-80">({countInCont})</span>
                  </button>
                );
              })}
            </div>

            {/* Combined Continent Quiz Banner Card + All Country Cards in that Continent */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Full Continent Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/40 flex flex-col justify-between gap-3 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-7 rounded bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">
                        {selectedContinent}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Full Continent 3D Globe Quiz
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-sky-400 font-bold">CONTINENT</span>
                </div>

                <div className="space-y-1.5">
                  {selectedTopic === 'subdivisions' && (
                    <button
                      onClick={() =>
                        handleLaunchCombinedGlobeQuiz(
                          `Countries of ${selectedContinent}`,
                          allCountriesList.filter((c) => c.continent === selectedContinent),
                          'countries'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-sky-600/25 hover:bg-sky-600/35 border border-sky-500/50 flex items-center justify-between text-left transition-all"
                    >
                      <span className="text-xs font-bold text-white">
                        Countries of {selectedContinent}
                      </span>
                      <Play className="w-3.5 h-3.5 text-sky-400 fill-current" />
                    </button>
                  )}
                  {selectedTopic === 'cities' && (
                    <button
                      onClick={() =>
                        handleLaunchCombinedGlobeQuiz(
                          `Capitals of ${selectedContinent}`,
                          allCountriesList.filter((c) => c.continent === selectedContinent),
                          'capitals'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 flex items-center justify-between text-left transition-all"
                    >
                      <span className="text-xs font-bold text-white">
                        Capitals of {selectedContinent}
                      </span>
                      <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                    </button>
                  )}
                  {selectedTopic === 'others' && (
                    <button
                      onClick={() =>
                        handleLaunchCombinedGlobeQuiz(
                          `Flags of ${selectedContinent}`,
                          allCountriesList.filter((c) => c.continent === selectedContinent),
                          'flags'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 flex items-center justify-between text-left transition-all"
                    >
                      <span className="text-xs font-bold text-white">
                        Flags of {selectedContinent}
                      </span>
                      <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleLaunchCombinedGlobeQuiz(
                        selectedTopic === 'cities'
                          ? `Cities of ${selectedContinent}`
                          : `${topicLabels[selectedTopic]} of ${selectedContinent}`,
                        eligibleCountriesForTopic.filter((c) => c.continent === selectedContinent),
                        selectedTopic === 'subdivisions'
                          ? 'subdivisions'
                          : selectedTopic === 'areacodes'
                          ? 'areacodes'
                          : selectedTopic === 'cities'
                          ? 'cities'
                          : 'others'
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-sky-600/20 border border-slate-700 hover:border-sky-500/50 flex items-center justify-between text-left transition-all"
                  >
                    <span className="text-xs font-bold text-slate-100">
                      {selectedTopic === 'cities'
                        ? `Cities of ${selectedContinent}`
                        : `${topicLabels[selectedTopic]} of ${selectedContinent}`}
                    </span>
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                  </button>
                </div>
              </div>

              {/* Individual Countries in Selected Continent */}
              {eligibleCountriesForTopic
                .filter((c) => c.continent === selectedContinent)
                .map((country) => renderCountryCard(country))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUB-SCOPE 4: CUSTOM (MULTI-COUNTRY COMBINER + PREMADE GROUPS) */}
        {/* ============================================================ */}
        {selectedTopic !== 'daily' && activeSubScope === 'custom' && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Custom 3D Globe Combiner
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Combine Any Countries for {topicLabels[selectedTopic]}
                </h2>
              </div>

              {/* Action Buttons: Premade Groups + Select All + Clear/Reset */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    sounds.playTap();
                    setShowPremadeGroups((v) => !v);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    showPremadeGroups
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Premade Groups</span>
                </button>
                <button
                  onClick={() =>
                    applyCustomPreset(eligibleCountriesForTopic.map((c) => c.id))
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                >
                  Select All ({eligibleCountriesForTopic.length})
                </button>
                <button
                  onClick={() => {
                    sounds.playTap();
                    setCustomSelectedIds(new Set());
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-400 hover:text-white border border-slate-700"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Expandable Premade Groups Drawer */}
            {showPremadeGroups && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Select a Premade Country Group
                  </span>
                  <button
                    onClick={() => setShowPremadeGroups(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {PREMADE_CUSTOM_GROUPS.map((grp) => (
                    <button
                      key={grp.id}
                      onClick={() => applyCustomPreset(grp.codes)}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{grp.label}</span>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          {grp.codes.length} countries
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{grp.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Per-Country Level Customizer for Selected Countries (Subdivision Level or Area Code Depth) */}
            {customSelectedIds.size > 0 &&
              (selectedTopic === 'subdivisions' || selectedTopic === 'areacodes') && (
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                      {selectedTopic === 'subdivisions'
                        ? 'Selected Countries — Subdivision Level Per Country (Tap to switch Level 1 / Level 2)'
                        : 'Selected Countries — Area Code Depth Override Per Country (e.g. Italy Level 2 = 0xx)'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                    {Array.from(customSelectedIds).map((code) => {
                      const c = COUNTRIES_DATABASE[code];
                      if (!c) return null;

                      if (selectedTopic === 'subdivisions') {
                        const subCard = getCountrySubdivisions(c).find((q) => q.category === 'adm1');
                        const levels = subCard?.availableLevels || (subCard ? [subCard] : []);
                        const defaultIdx =
                          (c.id === 'BE' || c.id === 'LU' || c.id === 'US' || c.id === 'BR' || c.id === 'JP') && levels.length > 1
                            ? 1
                            : 0;
                        const activeIdx =
                          countrySubdivisionLevelIdx[c.id] !== undefined
                            ? Math.min(countrySubdivisionLevelIdx[c.id], Math.max(0, levels.length - 1))
                            : defaultIdx;
                        const activeLvl = levels[activeIdx];
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              if (levels.length <= 1) return;
                              sounds.playTap();
                              setCountrySubdivisionLevelIdx((prev) => ({
                                ...prev,
                                [c.id]: (activeIdx + 1) % levels.length
                              }));
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs flex items-center gap-2 transition-all"
                          >
                            <CountryFlag countryCode={c.id} size="sm" />
                            <span className="font-bold text-white">{c.name}:</span>
                            <span className="font-mono text-[11px] text-sky-400">
                              {activeLvl ? `${activeLvl.badge} (${activeLvl.targetCount} Q)` : 'Level 1'}
                            </span>
                          </button>
                        );
                      }

                      // Area codes depth override pill per country
                      const curDepth: AreaCodeDepthLevel =
                        countryAreaCodeDepthOverrides[c.id] !== undefined
                          ? countryAreaCodeDepthOverrides[c.id]
                          : catalogAreaCodeDepth;
                      const depthOrder: AreaCodeDepthLevel[] = ['all', '1', '2', '3'];
                      const nextDepth =
                        depthOrder[(depthOrder.indexOf(curDepth) + 1) % depthOrder.length];
                      const depthLabel =
                        curDepth === '1'
                          ? 'Lvl 1 (x/0x)'
                          : curDepth === '2'
                          ? 'Lvl 2 (xx/0xx)'
                          : curDepth === '3'
                          ? 'Lvl 3 (xxx/0xxx)'
                          : 'All Digits';
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            sounds.playTap();
                            setCountryAreaCodeDepthOverrides((prev) => ({
                              ...prev,
                              [c.id]: nextDepth
                            }));
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs flex items-center gap-2 transition-all"
                        >
                          <CountryFlag countryCode={c.id} size="sm" />
                          <span className="font-bold text-white">{c.name}:</span>
                          <span className="font-mono text-[11px] text-emerald-400">{depthLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Search Input for Custom Countries */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
                placeholder="Filter countries to add or remove..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Multi-Country Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-y-auto p-1">
              {eligibleCountriesForTopic
                .filter(
                  (c) =>
                    !customSearch.trim() ||
                    c.name.toLowerCase().includes(customSearch.toLowerCase()) ||
                    c.id.toLowerCase().includes(customSearch.toLowerCase())
                )
                .map((c) => {
                  const isSel = customSelectedIds.has(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCustomCountry(c.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                        isSel
                          ? 'bg-emerald-500/15 border-emerald-500/60 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CountryFlag countryCode={c.id} size="sm" />
                        <span className="text-xs font-bold truncate">{c.name}</span>
                      </div>
                      {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
            </div>

            {/* Launch Combined Custom Session Button */}
            <button
              disabled={customSelectedIds.size === 0}
              onClick={() => {
                const chosen = allCountriesList.filter((c) => customSelectedIds.has(c.id));
                if (chosen.length === 0) return;
                const modeMap: Record<
                  Exclude<MainTopicTab, 'daily'>,
                  'subdivisions' | 'areacodes' | 'cities' | 'others'
                > = {
                  subdivisions: 'subdivisions',
                  areacodes: 'areacodes',
                  cities: 'cities',
                  others: 'others'
                };
                handleLaunchCombinedGlobeQuiz(
                  `Custom ${topicLabels[selectedTopic]} (${chosen.length} Countries)`,
                  chosen,
                  modeMap[selectedTopic as Exclude<MainTopicTab, 'daily'>],
                  true
                );
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 disabled:opacity-40 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {customSelectedIds.size === 0
                  ? 'Select at least 1 Country to Launch'
                  : `Launch ${topicLabels[selectedTopic]} (${customSelectedIds.size} Countries) on 3D Globe`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
