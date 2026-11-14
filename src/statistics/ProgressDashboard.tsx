import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Award,
  Flame,
  Clock,
  Target,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Trophy,
  Play,
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  Trash2,
  Share2,
  Check,
  Shield,
  Zap
} from 'lucide-react';
import { db, UserStats, QuizAttempt } from '../database/db';
import { COUNTRIES_DATABASE, CountryInfo } from '../data/countriesData';
import { getCountrySubdivisions, SubdivisionQuizOption } from '../data/countrySubdivisionCatalog';
import { getCitiesByScopeAndTier } from '../data/citiesDatabase';
import { QuizDefinition } from '../quiz-engine/quizTypes';
import { CountryFlag } from '../components/CountryFlag';
import { sounds } from '../utils/soundEngine';

interface ProgressDashboardProps {
  onStartSubdivisionQuiz?: (country: CountryInfo, option: SubdivisionQuizOption) => void;
  onStartQuiz?: (quiz: QuizDefinition) => void;
}

type ProgressTab = 'countries' | 'records' | 'revision';
type StatusFilter = 'all' | 'mastered' | 'in-progress' | 'unstarted';
type ProgressCategoryFilter = 'all' | 'subdivisions' | 'areacodes' | 'cities' | 'others';
type MasteryScopeMode = 'core' | 'hardcore';

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  onStartSubdivisionQuiz,
  onStartQuiz
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProgressTab>('countries');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [continentFilter, setContinentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<ProgressCategoryFilter>('all');
  const [masteryScope, setMasteryScope] = useState<MasteryScopeMode>('core');
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [copiedDailyShare, setCopiedDailyShare] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const playerName = useMemo(() => {
    try {
      return localStorage.getItem('atlas_License_name') || 'GeoExplorer';
    } catch {
      return 'GeoExplorer';
    }
  }, []);

  const loadStats = async () => {
    const s = await db.userStats.get('current');
    const attempts = await db.quizAttempts.orderBy('timestamp').reverse().toArray();
    setAllAttempts(attempts);

    if (s) {
      if (attempts.length === 0) {
        setStats({
          ...s,
          totalQuizzesPlayed: 0,
          totalQuestionsAnswered: 0,
          correctAnswers: 0,
          streakDays: 0,
          countryMastery: {},
          continentMastery: {}
        });
      } else {
        setStats(s);
      }
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSubTab, continentFilter, statusFilter, categoryFilter, masteryScope]);

  const allCountries = useMemo(
    () =>
      Object.values(COUNTRIES_DATABASE)
        .filter((c) => !c.isTerritory)
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  // Build Core Quizzes (Level 1 Subdivisions + Primary Area Codes + Cities + Extra/Flags)
  // AND Hardcore Quizzes (Level 2 / Level 3 District & Municipality levels) for a country
  const getCountryQuizzesByScope = (
    country: CountryInfo
  ): { coreQuizzes: SubdivisionQuizOption[]; hardcoreQuizzes: SubdivisionQuizOption[] } => {
    const rawOptions = getCountrySubdivisions(country);
    const coreQuizzes: SubdivisionQuizOption[] = [];
    const hardcoreQuizzes: SubdivisionQuizOption[] = [];

    for (const opt of rawOptions) {
      if (opt.category === 'adm1' || opt.category === 'adm2' || opt.category === 'adm3') {
        const levels = opt.availableLevels && opt.availableLevels.length > 0 ? opt.availableLevels : [opt];
        if (levels.length > 0) {
          coreQuizzes.push(levels[0]);
          for (let i = 1; i < levels.length; i++) {
            hardcoreQuizzes.push(levels[i]);
          }
        }
      } else {
        coreQuizzes.push(opt);
      }
    }

    const cities = getCitiesByScopeAndTier({ type: 'country', value: country.id }, 'hard');
    if (cities.length >= 1) {
      coreQuizzes.push({
        id: `${country.id.toLowerCase()}-cities`,
        title: 'Cities',
        description: `Pinpoint ${cities.length} cities & towns in ${country.name}`,
        category: 'cities',
        geojsonFile:
          country.subdivisionFile ||
          `/maps/subdivisions/${(country.iso3 || 'bel').toLowerCase()}_adm1.geojson`,
        levelKey: 'CITY_PIN',
        targetCount: cities.length,
        badge: 'Cities',
        color: 'amber'
      });
    }

    return { coreQuizzes, hardcoreQuizzes };
  };

  const matchesCategoryFilter = (
    qOpt: SubdivisionQuizOption,
    catFilter: ProgressCategoryFilter
  ): boolean => {
    if (catFilter === 'all') return true;
    if (catFilter === 'subdivisions') {
      return qOpt.category === 'adm1' || qOpt.category === 'adm2' || qOpt.category === 'adm3';
    }
    if (catFilter === 'areacodes') return qOpt.category === 'areacodes';
    if (catFilter === 'cities') return qOpt.category === 'cities';
    if (catFilter === 'others') return qOpt.category === 'extra' || qOpt.category === 'flags';
    return true;
  };

  // Find the best official attempt matching a country's quiz option (supports both Core & Hardcore Level 2/3 quizzes)
  const findBestAttemptForCountryQuiz = (
    country: CountryInfo,
    qOpt: SubdivisionQuizOption,
    attempts: QuizAttempt[]
  ): QuizAttempt | undefined => {
    const cCode = country.id.toUpperCase();
    const isHardcoreSubQuiz = qOpt.category === 'adm2' || qOpt.category === 'adm3';

    const countryAttempts = attempts.filter((a) => {
      if (a.isPartialRun) return false;
      const qIdLower = (a.quizId || '').toLowerCase();
      if (
        qIdLower.includes('-practice') ||
        qIdLower.startsWith('daily-') ||
        qIdLower.startsWith('world-') ||
        qIdLower.startsWith('cont-') ||
        qIdLower.startsWith('custom-')
      ) {
        return false;
      }
      if (!isHardcoreSubQuiz && (a.category === 'adm2' || a.category === 'adm3')) {
        return false;
      }
      return a.countryCode?.toUpperCase() === cCode;
    });
    if (countryAttempts.length === 0) return undefined;

    const candidateIds = new Set<string>([qOpt.id.toLowerCase()]);
    const candidateTitles = new Set<string>([
      qOpt.title.toLowerCase(),
      `${country.name} — ${qOpt.title}`.toLowerCase()
    ]);

    const matching = countryAttempts.filter((att) => {
      const aId = (att.quizId || '').toLowerCase();
      const aTitle = (att.quizTitle || '').toLowerCase();

      if (qOpt.category === 'areacodes' && qOpt.targetCount > 15 && att.maxScore <= 10) {
        return false;
      }

      if (candidateIds.has(aId) || candidateTitles.has(aTitle)) return true;

      if (isHardcoreSubQuiz) {
        return (
          aId === qOpt.id.toLowerCase() ||
          aTitle.includes(qOpt.title.toLowerCase()) ||
          (att.category === qOpt.category && Math.abs(att.maxScore - qOpt.targetCount) <= 5)
        );
      }

      if (qOpt.category === 'adm1') {
        if (aId.includes('adm2') || aId.includes('adm3') || aTitle.includes('level 2:') || aTitle.includes('level 3:')) {
          return false;
        }
        if (
          aId.startsWith(`${cCode.toLowerCase()}-adm1`) ||
          aId.startsWith(`${cCode.toLowerCase()}-subdivisions`) ||
          aId.includes('provinces') ||
          aId.includes('subdivision') ||
          aTitle.includes('subdivision') ||
          aTitle.includes('level 1:')
        ) {
          return true;
        }
      }
      if (qOpt.category === 'areacodes') {
        if (
          aId.includes('areacode') ||
          aTitle.includes('area code') ||
          att.category?.toLowerCase().includes('area')
        ) {
          return true;
        }
      }
      if (qOpt.category === 'cities') {
        if (
          aId.includes('cities') ||
          aTitle.includes('cities') ||
          att.category?.toLowerCase().includes('cit')
        ) {
          return true;
        }
      }
      return false;
    });

    if (matching.length === 0) return undefined;
    const normalized = matching.map((att) => {
      const trueAcc =
        att.maxScore > 0
          ? Math.min(100, Math.round((att.score / att.maxScore) * 100))
          : Math.min(100, att.accuracy);
      return { ...att, accuracy: trueAcc };
    });
    return normalized.reduce((best, cur) => {
      if (cur.accuracy > best.accuracy) return cur;
      if (cur.accuracy === best.accuracy && cur.timeSpentSec < best.timeSpentSec) return cur;
      return best;
    }, normalized[0]);
  };

  // Compute Country Mastery Details (supports Core Mastery vs Hardcore + Districts mode!)
  const countryMasteryDetails = useMemo(() => {
    const map: Record<
      string,
      {
        pct: number;
        avgPlayedAccuracy: number;
        doneCount: number;
        totalCount: number;
        coreQuizzes: SubdivisionQuizOption[];
        hardcoreQuizzes: SubdivisionQuizOption[];
        bestByQuizId: Record<string, QuizAttempt | undefined>;
      }
    > = {};

    for (const c of allCountries) {
      const { coreQuizzes: rawCore, hardcoreQuizzes: rawHardcore } = getCountryQuizzesByScope(c);
      const coreQuizzes = rawCore.filter((q) => matchesCategoryFilter(q, categoryFilter));
      const hardcoreQuizzes = rawHardcore.filter((q) => matchesCategoryFilter(q, categoryFilter));

      const countedQuizzes =
        masteryScope === 'hardcore' ? [...coreQuizzes, ...hardcoreQuizzes] : coreQuizzes;
      const allCountryQuizzes = [...coreQuizzes, ...hardcoreQuizzes];

      const bestByQuizId: Record<string, QuizAttempt | undefined> = {};
      for (const q of allCountryQuizzes) {
        bestByQuizId[q.id] = findBestAttemptForCountryQuiz(c, q, allAttempts);
      }

      const totalCount = countedQuizzes.length;
      let matchedDone = 0;
      let sumAccuracyAcrossAllSlots = 0;
      let sumAccuracyPlayedOnly = 0;

      for (const q of countedQuizzes) {
        const bestAtt = bestByQuizId[q.id];
        if (bestAtt) {
          matchedDone++;
          const acc = Math.max(0, Math.min(100, bestAtt.accuracy));
          sumAccuracyAcrossAllSlots += acc;
          sumAccuracyPlayedOnly += acc;
        }
      }

      const rawPct = totalCount > 0 ? Math.round(sumAccuracyAcrossAllSlots / totalCount) : 0;
      const pct = matchedDone > 0 ? Math.max(0, Math.min(100, rawPct)) : 0;
      const avgPlayedAccuracy =
        matchedDone > 0 ? Math.round(sumAccuracyPlayedOnly / matchedDone) : 0;

      map[c.id] = {
        pct,
        avgPlayedAccuracy,
        doneCount: matchedDone,
        totalCount,
        coreQuizzes,
        hardcoreQuizzes,
        bestByQuizId
      };
    }
    return map;
  }, [allAttempts, allCountries, categoryFilter, masteryScope]);

  const countriesWithActiveCategory = useMemo(() => {
    return allCountries.filter((c) => (countryMasteryDetails[c.id]?.totalCount || 0) > 0);
  }, [allCountries, countryMasteryDetails]);

  const { overallMastery, masteredCountriesCount, inProgressCountriesCount, continentStats } =
    useMemo(() => {
      const continents = [
        'Africa',
        'Asia',
        'Europe',
        'North America',
        'Oceania',
        'South America'
      ];
      let sumPct = 0;
      let mastered = 0;
      let inProg = 0;

      countriesWithActiveCategory.forEach((c) => {
        const p = countryMasteryDetails[c.id]?.pct || 0;
        sumPct += p;
        if (p >= 100) mastered++;
        else if (p > 0) inProg++;
      });

      const contBreakdown = continents.map((cont) => {
        const list = countriesWithActiveCategory.filter((c) => c.continent === cont);
        const total = list.length;
        const done = list.filter((c) => (countryMasteryDetails[c.id]?.pct || 0) >= 100).length;
        const started = list.filter((c) => (countryMasteryDetails[c.id]?.pct || 0) > 0).length;
        const avg =
          total > 0
            ? Math.round(
                list.reduce((acc, c) => acc + (countryMasteryDetails[c.id]?.pct || 0), 0) / total
              )
            : 0;
        return { name: cont, avg, done, started, total };
      });

      return {
        overallMastery:
          countriesWithActiveCategory.length > 0
            ? Math.round(sumPct / countriesWithActiveCategory.length)
            : 0,
        masteredCountriesCount: mastered,
        inProgressCountriesCount: inProg,
        continentStats: contBreakdown
      };
    }, [countriesWithActiveCategory, countryMasteryDetails]);

  const allPersonalBests = useMemo(() => {
    const map = new Map<
      string,
      {
        quizId: string;
        quizTitle: string;
        playerName: string;
        accuracy: number;
        bestTimeSec: number;
        score: number;
        maxScore: number;
        date: string;
        isPartialRun?: boolean;
      }
    >();
    for (const att of allAttempts) {
      const key = att.quizId || att.quizTitle;
      if (!key) continue;
      const trueAcc =
        att.maxScore > 0
          ? Math.min(100, Math.round((att.score / att.maxScore) * 100))
          : Math.min(100, att.accuracy);
      const existing = map.get(key);
      if (
        !existing ||
        trueAcc > existing.accuracy ||
        (trueAcc === existing.accuracy && att.timeSpentSec < existing.bestTimeSec)
      ) {
        map.set(key, {
          quizId: key,
          quizTitle: att.quizTitle,
          playerName: att.playerName || playerName,
          accuracy: trueAcc,
          bestTimeSec: att.timeSpentSec,
          score: att.score,
          maxScore: att.maxScore,
          date: new Date(att.timestamp).toLocaleDateString(),
          isPartialRun: att.isPartialRun
        });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => b.accuracy - a.accuracy || a.bestTimeSec - b.bestTimeSec
    );
  }, [allAttempts, playerName]);

  if (!stats) return null;

  const totalQFromAttempts = allAttempts.reduce((sum, a) => sum + (a.maxScore || 0), 0);
  const totalCorrectFromAttempts = allAttempts.reduce(
    (sum, a) => sum + Math.min(a.score || 0, a.maxScore || a.score || 0),
    0
  );
  const accuracy = Math.max(
    0,
    Math.min(
      100,
      totalQFromAttempts > 0
        ? Math.round((totalCorrectFromAttempts / totalQFromAttempts) * 100)
        : stats.totalQuestionsAnswered > 0
        ? Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100)
        : 0
    )
  );

  const formatSec = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const missedQueue = stats.missedQueue || [];

  const filteredCountries = countriesWithActiveCategory
    .filter((c) => {
      if (continentFilter !== 'All' && c.continent !== continentFilter) return false;
      const pct = countryMasteryDetails[c.id]?.pct || 0;
      if (statusFilter === 'mastered' && pct < 100) return false;
      if (statusFilter === 'in-progress' && (pct === 0 || pct >= 100)) return false;
      if (statusFilter === 'unstarted' && pct > 0) return false;
      if (countrySearch.trim()) {
        const q = countrySearch.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.capital.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const pa = countryMasteryDetails[a.id]?.pct || 0;
      const pb = countryMasteryDetails[b.id]?.pct || 0;
      if (pb !== pa) return pb - pa;
      return a.name.localeCompare(b.name);
    });

  const handlePracticeMissedItem = (countryCode?: string, quizOptionId?: string) => {
    sounds.playTap();
    const targetCountryId = countryCode || (missedQueue[0]?.countryCode ?? 'BE');
    const country = COUNTRIES_DATABASE[targetCountryId] || COUNTRIES_DATABASE['BE'];

    if (country && onStartSubdivisionQuiz) {
      const { coreQuizzes, hardcoreQuizzes } = getCountryQuizzesByScope(country);
      const options = [...coreQuizzes, ...hardcoreQuizzes];
      const matchedOpt =
        options.find((o: SubdivisionQuizOption) => o.id === quizOptionId) || options[0];
      if (matchedOpt) {
        onStartSubdivisionQuiz(country, matchedOpt);
        return;
      }
    }

    if (onStartQuiz && missedQueue.length > 0) {
      const revisionQuestions = missedQueue.slice(0, 15).map((m, idx) => ({
        id: `rev-q-${idx}`,
        type: 'typing' as const,
        prompt: `Identify "${m.targetName}" (${m.quizTitle} - ${m.countryName})`,
        correctAnswer: m.targetName,
        countryCode: m.countryCode
      }));
      onStartQuiz({
        id: `smart-revision-${Date.now()}`,
        title: 'Revision: Most Missed Targets',
        description: 'Targeted practice on your missed locations.',
        category: 'Subdivisions',
        difficulty: 'Medium',
        questionCount: revisionQuestions.length,
        timeLimitSec: 25,
        questions: revisionQuestions
      });
    }
  };

  const handleClearMissedQueue = async () => {
    sounds.playTap();
    await db.userStats.update('current', { missedQueue: [] });
    await loadStats();
  };

  const handleExportProgress = async () => {
    sounds.playTap();
    const currentStats = await db.userStats.get('current');
    const attempts = await db.quizAttempts.toArray();
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      userStats: currentStats,
      quizAttempts: attempts
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phoenixatlas-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage('Progress backup downloaded.');
    setTimeout(() => setBackupMessage(null), 3500);
  };

  const handleImportProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed.userStats) {
        await db.userStats.put({ ...parsed.userStats, id: 'current' });
      }
      if (Array.isArray(parsed.quizAttempts)) {
        await db.quizAttempts.clear();
        await db.quizAttempts.bulkAdd(
          parsed.quizAttempts.map(({ id: _unused, ...rest }: any) => rest)
        );
      }
      sounds.playSuccess();
      setBackupMessage('Progress restored successfully.');
      await loadStats();
    } catch {
      sounds.playError();
      setBackupMessage('Invalid backup JSON file.');
    }
    setTimeout(() => setBackupMessage(null), 4000);
  };

  // Last 7 days calendar strip
  const last7Days = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (6 - idx));
    const dateKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
      d.getUTCDate()
    ).padStart(2, '0')}`;
    const record = stats.dailyHistory?.[dateKey];
    return {
      dateKey,
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getUTCDate(),
      record
    };
  });

  // Shareable Daily Trio Scorecard (Wordle / GeoGuessr style)
  const handleShareDailyScorecard = () => {
    sounds.playTap();
    const todayIso = new Date().toISOString().slice(0, 10);
    const todayRec = stats.dailyHistory?.[todayIso];
    const subStr =
      todayRec?.subdivisionsScore !== undefined
        ? `${todayRec.subdivisionsScore}%`
        : 'Not played yet';
    const acStr =
      todayRec?.areacodesScore !== undefined ? `${todayRec.areacodesScore}%` : 'Not played yet';
    const citStr =
      todayRec?.citiesScore !== undefined ? `${todayRec.citiesScore}%` : 'Not played yet';

    const text = [
      `🌐 PhoenixAtlas Daily Trio (${todayIso})`,
      `🏛️ Subdivisions: ${subStr}`,
      `📞 Area Codes: ${acStr}`,
      `📍 Cities: ${citStr}`,
      `🔥 Streak: ${stats.streakDays}d · Core Mastery: ${overallMastery}%`
    ].join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedDailyShare(true);
    setTimeout(() => setCopiedDailyShare(false), 2500);
  };

  const getTierInfo = (pct: number) => {
    if (pct >= 100) {
      return {
        label: 'Platinum',
        barColor: 'bg-cyan-400',
        textColor: 'text-cyan-300',
        badgeClass: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50'
      };
    }
    if (pct >= 80) {
      return {
        label: 'Gold',
        barColor: 'bg-amber-400',
        textColor: 'text-amber-300',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/50'
      };
    }
    if (pct >= 50) {
      return {
        label: 'Silver',
        barColor: 'bg-slate-300',
        textColor: 'text-slate-200',
        badgeClass: 'bg-slate-400/20 text-slate-200 border-slate-400/50'
      };
    }
    if (pct >= 20) {
      return {
        label: 'Bronze',
        barColor: 'bg-orange-500',
        textColor: 'text-orange-400',
        badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/50'
      };
    }
    if (pct > 0) {
      return {
        label: 'Started',
        barColor: 'bg-sky-500',
        textColor: 'text-sky-400',
        badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40'
      };
    }
    return {
      label: 'Unstarted',
      barColor: 'bg-slate-800',
      textColor: 'text-slate-500',
      badgeClass: 'bg-slate-900 text-slate-500 border-slate-800'
    };
  };

  const renderQuizChecklistItem = (
    c: CountryInfo,
    qOpt: SubdivisionQuizOption,
    bestAtt: QuizAttempt | undefined,
    isHardcoreBadge = false
  ) => {
    const qAcc = bestAtt ? bestAtt.accuracy : 0;
    const isPerfect100 = Boolean(bestAtt && qAcc >= 100);
    const qTier = getTierInfo(qAcc);

    return (
      <div
        key={qOpt.id}
        className="py-2.5 flex items-center justify-between gap-2 text-xs"
      >
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isPerfect100 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : bestAtt ? (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tabular-nums border ${qTier.badgeClass} shrink-0`}
              >
                {qAcc}%
              </span>
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border border-slate-700 inline-block shrink-0" />
            )}
            <span className="font-semibold text-slate-200 truncate">{qOpt.title}</span>
            <span className="text-[10px] font-mono text-slate-500 shrink-0">
              ({qOpt.targetCount} Q)
            </span>
            {isHardcoreBadge && (
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-[9px] font-mono text-indigo-300 uppercase">
                Level 2+ Districts
              </span>
            )}
          </div>
          {bestAtt && (
            <div className="pl-5 mt-1 space-y-1">
              <div className="w-full max-w-[220px] h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${qTier.barColor}`}
                  style={{ width: `${qAcc}%` }}
                />
              </div>
              <p
                className={`text-[10px] font-mono tabular-nums ${
                  isPerfect100 ? 'text-emerald-400' : 'text-sky-300'
                }`}
              >
                Best: {bestAtt.score}/{bestAtt.maxScore} ({qAcc}%) ·{' '}
                {formatSec(bestAtt.timeSpentSec)} ·{' '}
                {new Date(bestAtt.timestamp).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {onStartSubdivisionQuiz && (
          <button
            onClick={() => onStartSubdivisionQuiz(c, qOpt)}
            className="px-3 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/40 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{bestAtt ? 'Replay' : 'Play'}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Compact Header with Key Summary Strip + 3 Focused Sub-Tabs */}
      <div className="px-4 pt-3 pb-2.5 border-b border-slate-800/90 bg-slate-900/95 shrink-0 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Mastery &amp; Progress
              </h1>
              <span className="hidden sm:inline-flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                <span className="text-cyan-300">● 100% Plat</span>
                <span className="text-amber-300">● 80% Gold</span>
                <span className="text-slate-300">● 50% Silv</span>
                <span className="text-orange-400">● 20% Brnz</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {masteredCountriesCount} / {countriesWithActiveCategory.length} countries at 100% Platinum ·{' '}
              {inProgressCountriesCount} in progress
            </p>
          </div>

          {/* Compact 4-Metric Pill Bar */}
          <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono tabular-nums">
            <div className="flex items-center gap-1 text-cyan-300" title="Overall World Mastery">
              <Trophy className="w-3.5 h-3.5" />
              <span className="font-bold">{overallMastery}%</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-sky-400" title="Overall Question Accuracy">
              <Target className="w-3.5 h-3.5" />
              <span className="font-bold">{accuracy}%</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-slate-200" title="Total Quizzes Completed">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">{allAttempts.length}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-amber-400" title="Active Streak">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-bold">{stats.streakDays}d</span>
            </div>
          </div>
        </div>

        {/* 3 Sub-Tabs Switcher */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playTap();
                setActiveSubTab('countries');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeSubTab === 'countries'
                  ? 'bg-sky-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Country Mastery ({countriesWithActiveCategory.length})
            </button>
            <button
              onClick={() => {
                sounds.playTap();
                setActiveSubTab('records');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeSubTab === 'records'
                  ? 'bg-sky-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Leaderboard &amp; Daily ({allPersonalBests.length})
            </button>
            <button
              onClick={() => {
                sounds.playTap();
                setActiveSubTab('revision');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeSubTab === 'revision'
                  ? 'bg-sky-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>Missed &amp; Backup</span>
              {missedQueue.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                  {missedQueue.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3.5 sm:p-5 max-w-5xl mx-auto w-full pb-28 space-y-3.5"
      >
        {/* ========================================================= */}
        {/* SUB-TAB 1: COUNTRY MASTERY CHECKLIST                      */}
        {/* ========================================================= */}
        {activeSubTab === 'countries' && (
          <>
            {/* Single Unified Control Bar: Core vs Hardcore Mastery Toggle + Category Pills */}
            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {/* Left: Core Mastery vs Hardcore (+ Districts) Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0 self-start">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setMasteryScope('core');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    masteryScope === 'core'
                      ? 'bg-sky-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Calculates country % using Level 1 States/Provinces, Area Codes & Cities"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Core Mastery</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setMasteryScope('hardcore');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    masteryScope === 'hardcore'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Includes Level 2 & 3 Counties, Districts & Municipalities in country %"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Hardcore (+ Districts)</span>
                </button>
              </div>

              {/* Right: Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'subdivisions', label: 'Subdivisions' },
                    { id: 'areacodes', label: 'Area Codes' },
                    { id: 'cities', label: 'Cities' },
                    { id: 'others', label: 'Others' }
                  ] as Array<{ id: ProgressCategoryFilter; label: string }>
                ).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sounds.playTap();
                      setCategoryFilter(cat.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      categoryFilter === cat.id
                        ? 'bg-sky-500 text-slate-950 border-sky-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Continent Progress Strip (Clickable to filter by continent) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {continentStats.map((cont) => {
                const isSel = continentFilter === cont.name;
                const tier = getTierInfo(cont.avg);
                return (
                  <button
                    key={cont.name}
                    onClick={() => {
                      sounds.playTap();
                      setContinentFilter(isSel ? 'All' : cont.name);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSel
                        ? 'bg-sky-950/60 border-sky-500/70'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate">{cont.name}</span>
                      <span className={`font-mono font-bold tabular-nums ${tier.textColor}`}>
                        {cont.avg}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden my-1.5">
                      <div
                        className={`h-full rounded-full transition-all ${tier.barColor}`}
                        style={{ width: `${cont.avg}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {cont.done}/{cont.total} 100% · {cont.started} started
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Search + Status Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search country or capital..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'mastered', label: '100% Platinum' },
                    { id: 'in-progress', label: 'In Progress' },
                    { id: 'unstarted', label: '0% Not Started' }
                  ] as Array<{ id: StatusFilter; label: string }>
                ).map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      sounds.playTap();
                      setStatusFilter(st.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-colors ${
                      statusFilter === st.id
                        ? 'bg-slate-200 text-slate-950 border-slate-200 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Expandable Country List */}
            <div className="space-y-2">
              {filteredCountries.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                  No countries match this filter.
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const detail = countryMasteryDetails[c.id] || {
                    pct: 0,
                    avgPlayedAccuracy: 0,
                    doneCount: 0,
                    totalCount: 1,
                    coreQuizzes: [],
                    hardcoreQuizzes: [],
                    bestByQuizId: {}
                  };
                  const isExpanded = expandedCountryId === c.id;
                  const tier = getTierInfo(detail.pct);

                  return (
                    <div
                      key={c.id}
                      className="rounded-xl bg-slate-900 border border-slate-800/90 overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => {
                          sounds.playTap();
                          setExpandedCountryId(isExpanded ? null : c.id);
                        }}
                        className="w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <CountryFlag countryCode={c.id} size="sm" className="shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-white truncate">
                                {c.name}
                              </span>
                              {detail.pct >= 20 && (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${tier.badgeClass}`}
                                >
                                  {tier.label}
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                {detail.doneCount}/{detail.totalCount}{' '}
                                {masteryScope === 'core' ? 'core' : 'total'} quizzes
                              </span>
                              {detail.doneCount > 0 && (
                                <span className="text-[10px] font-mono text-sky-400 shrink-0">
                                  · Avg: {detail.avgPlayedAccuracy}%
                                </span>
                              )}
                            </div>
                            <div className="w-full max-w-xs h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1.5">
                              <div
                                className={`h-full rounded-full transition-all ${tier.barColor}`}
                                style={{ width: `${detail.pct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span
                            className={`text-xs font-mono font-bold tabular-nums ${tier.textColor}`}
                          >
                            {detail.pct}%
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Country Quiz Checklist (Core Quizzes + Optional Hardcore District Quizzes) */}
                      {isExpanded && (
                        <div className="px-3.5 pb-3 pt-1 border-t border-slate-800/80 bg-slate-950/60 divide-y divide-slate-800/60">
                          {detail.coreQuizzes.map((qOpt) =>
                            renderQuizChecklistItem(c, qOpt, detail.bestByQuizId[qOpt.id], false)
                          )}

                          {detail.hardcoreQuizzes.length > 0 && (
                            <div className="pt-2">
                              <div className="flex items-center justify-between py-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                                  {masteryScope === 'hardcore'
                                    ? 'Hardcore District Levels (Counted in %)'
                                    : 'Hardcore District Levels (Bonus — Not Required for Core 100%)'}
                                </span>
                              </div>
                              <div className="divide-y divide-slate-800/50">
                                {detail.hardcoreQuizzes.map((qOpt) =>
                                  renderQuizChecklistItem(
                                    c,
                                    qOpt,
                                    detail.bestByQuizId[qOpt.id],
                                    true
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* SUB-TAB 2: PERSONAL LEADERBOARD, DAILY CALENDAR & LOG     */}
        {/* ========================================================= */}
        {activeSubTab === 'records' && (
          <div className="space-y-4">
            {/* 7-Day Daily Challenge Strip + 1-Tap Share Daily Trio Scorecard */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Daily Trio Activity (Last 7 Days)</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Share your daily 3-challenge scorecard with friends in one tap.
                  </p>
                </div>

                <button
                  onClick={handleShareDailyScorecard}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  {copiedDailyShare ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied Daily Scorecard!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Daily Scorecard</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {last7Days.map((day) => {
                  const hasAny =
                    day.record &&
                    (day.record.citiesScore !== undefined ||
                      day.record.areacodesScore !== undefined ||
                      day.record.subdivisionsScore !== undefined);
                  return (
                    <div
                      key={day.dateKey}
                      className={`p-2 rounded-xl border text-center flex flex-col items-center ${
                        hasAny
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {day.dayLabel}
                      </span>
                      <span className="text-xs font-bold text-white my-0.5 tabular-nums">
                        {day.dayNum}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold ${
                          hasAny ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      >
                        {hasAny ? '✓' : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personal Leaderboard Records */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Personal Leaderboard (Best Record Per Quiz)</span>
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  {allPersonalBests.length} quizzes
                </span>
              </div>

              {allPersonalBests.length === 0 ? (
                <p className="text-xs text-slate-400">
                  Complete any full quiz on the 3D Globe to record your personal best time and accuracy.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {allPersonalBests.map((pb, idx) => (
                    <div
                      key={pb.quizId}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-amber-400">
                            #{idx + 1}
                          </span>
                          <p className="text-xs font-bold text-white truncate">{pb.quizTitle}</p>
                        </div>
                        <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                          <span className="text-sky-300 font-bold">{pb.playerName}</span> ·{' '}
                          {pb.date} · Chrono:{' '}
                          <span className="text-amber-300 font-bold">
                            {formatSec(pb.bestTimeSec)}
                          </span>
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 shrink-0 tabular-nums">
                        {pb.score}/{pb.maxScore} ({pb.accuracy}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Quiz Attempts Log */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Recent Quiz History</span>
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  {allAttempts.length} total attempts
                </span>
              </div>

              {allAttempts.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No quizzes completed yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto pr-1">
                  {allAttempts.slice(0, 30).map((att, idx) => {
                    const trueAcc =
                      att.maxScore > 0
                        ? Math.min(100, Math.round((att.score / att.maxScore) * 100))
                        : Math.min(100, att.accuracy);
                    return (
                      <div
                        key={att.id || idx}
                        className="py-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{att.quizTitle}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            <span className="text-sky-300 font-semibold">
                              {att.playerName || playerName}
                            </span>{' '}
                            · {new Date(att.timestamp).toLocaleDateString()} · Chrono:{' '}
                            <span className="text-amber-300">{formatSec(att.timeSpentSec)}</span>
                          </p>
                        </div>
                        <div className="text-right font-mono tabular-nums shrink-0">
                          <span
                            className={`font-bold ${
                              trueAcc >= 90
                                ? 'text-emerald-400'
                                : trueAcc >= 60
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {att.score}/{att.maxScore} ({trueAcc}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB-TAB 3: MISSED QUESTIONS REVISION & JSON BACKUP        */}
        {/* ========================================================= */}
        {activeSubTab === 'revision' && (
          <div className="space-y-4">
            {/* Missed Targets Queue */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Missed Locations Queue ({missedQueue.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Subdivisions, area codes, and cities you missed or used a hint on.
                  </p>
                </div>

                {missedQueue.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handlePracticeMissedItem(
                          missedQueue[0].countryCode,
                          missedQueue[0].quizOptionId
                        )
                      }
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Practice Top Missed</span>
                    </button>
                    <button
                      onClick={handleClearMissedQueue}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                      title="Clear Missed Queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {missedQueue.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>No missed questions pending review.</span>
                  <span className="text-emerald-400 font-mono font-bold">All Clear</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {missedQueue.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => handlePracticeMissedItem(item.countryCode, item.quizOptionId)}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CountryFlag countryCode={item.countryCode} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.targetName}</p>
                          <p className="text-[10px] text-slate-400 truncate">{item.quizTitle}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-400 shrink-0 tabular-nums">
                        {item.missedCount}x
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Offline Progress Backup (Export / Import JSON) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div>
                <h2 className="text-sm font-bold text-white">Progress Backup (Export / Import)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Save your completed quizzes, personal best times, and mastery records to a JSON file or restore from a backup.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleExportProgress}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Progress (.json)</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Import Progress (.json)</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleImportProgress}
                  className="hidden"
                />
              </div>

              {backupMessage && (
                <p className="text-xs font-semibold text-emerald-400">{backupMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
