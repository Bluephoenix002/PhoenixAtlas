import React, { useEffect, useState } from 'react';
import { X, Layers, Users, MapPin, Globe, Compass, Award, Phone, Flag, Sparkles, Building2 } from 'lucide-react';
import { CountryInfo } from '../data/countriesData';
import { CountryFlag } from '../components/CountryFlag';
import { SubdivisionQuizOption, getCountrySubdivisions } from '../data/countrySubdivisionCatalog';
import { getCitiesByScopeAndTier } from '../data/citiesDatabase';
import { db, QuizAttempt } from '../database/db';
import { computeOfficialCountryMasteryPct } from './WorldGlobeView';

const LEFT_DRIVING_COUNTRIES = new Set([
  'GB', 'IE', 'CY', 'MT', 'JP', 'IN', 'ID', 'TH', 'MY', 'SG', 'BN', 'TL', 'BD', 'PK', 'LK', 'NP', 'BT', 'MV',
  'HK', 'MO', 'AU', 'NZ', 'PG', 'FJ', 'SB', 'VU', 'WS', 'TO', 'TV', 'NR', 'KI', 'ZA', 'KE', 'TZ', 'UG', 'ZW',
  'ZM', 'BW', 'NA', 'MW', 'MZ', 'LS', 'SZ', 'MU', 'SC', 'JM', 'BS', 'BB', 'TT', 'LC', 'VC', 'GD', 'AG', 'DM',
  'KN', 'GY', 'SR'
]);

interface CountryBottomSheetProps {
  country: CountryInfo;
  onClose: () => void;
  onStartSubdivisionQuiz: (country: CountryInfo, option: SubdivisionQuizOption) => void;
  masteryPercentage?: number;
}

export const CountryBottomSheet: React.FC<CountryBottomSheetProps> = ({
  country,
  onClose,
  onStartSubdivisionQuiz,
  masteryPercentage = 0
}) => {
  const [countryAttempts, setCountryAttempts] = useState<QuizAttempt[]>([]);
  const [computedMastery, setComputedMastery] = useState<number>(masteryPercentage);

  useEffect(() => {
    let cancelled = false;
    const cCode = country.id.toUpperCase();
    db.quizAttempts
      .where('countryCode')
      .equals(cCode)
      .toArray()
      .then((attempts) => {
        if (cancelled) return;
        setCountryAttempts(attempts);
        setComputedMastery(computeOfficialCountryMasteryPct(country, attempts));
      })
      .catch(() => {
        if (!cancelled) setComputedMastery(masteryPercentage);
      });
    return () => {
      cancelled = true;
    };
  }, [country, masteryPercentage]);

  const subdivisionQuizzes = getCountrySubdivisions(country);
  const countryCities = getCitiesByScopeAndTier({ type: 'country', value: country.id }, 'hard');

  const isLeftDrive = LEFT_DRIVING_COUNTRIES.has(country.id.toUpperCase());
  const rawCurrency = country.currencies?.[0] || 'USD';
  const currencyCodeMatch = rawCurrency.match(/\(([A-Z]{3})\)/);
  const currencyCode = currencyCodeMatch ? currencyCodeMatch[1] : rawCurrency.slice(0, 12);

  // Inject Country Cities Quiz option and sort strictly: 1. Subdivisions -> 2. Area Codes -> 3. Cities -> 4. Others
  const citiesQuizOption: SubdivisionQuizOption | null =
    countryCities.length >= 1
      ? {
          id: `${country.id.toLowerCase()}-cities`,
          title: 'Cities',
          description: `Pinpoint ${countryCities.length} cities & towns in ${country.name} on the 3D Globe (Easy, Normal & Hard tiers).`,
          category: 'cities',
          geojsonFile: country.subdivisionFile || `/maps/subdivisions/${country.iso3?.toLowerCase() || 'bel'}_adm1.geojson`,
          levelKey: 'CITY_PIN',
          targetCount: countryCities.length,
          badge: 'Cities',
          color: 'amber'
        }
      : null;

  const getCategoryRank = (q: SubdivisionQuizOption): number => {
    if (q.levelKey === 'CITY_PIN' || q.category === 'cities') return 3;
    if (q.category === 'areacodes') return 2;
    if (q.category === 'extra' || q.category === 'flags') return 4;
    return 1; // Subdivisions (adm1, adm2, adm3)
  };

  const allQuizzes = (citiesQuizOption ? [...subdivisionQuizzes, citiesQuizOption] : [...subdivisionQuizzes]).sort(
    (a, b) => getCategoryRank(a) - getCategoryRank(b)
  );

  const getBestAccuracyForQuiz = (qOpt: SubdivisionQuizOption): number | null => {
    const cCode = country.id.toUpperCase();
    const valid = countryAttempts.filter((a) => {
      if (a.isPartialRun) return false;
      const qIdLower = (a.quizId || '').toLowerCase();
      if (qIdLower.includes('-practice') || qIdLower.includes('-lvl1') || qIdLower.includes('-lvl2')) return false;
      return a.countryCode?.toUpperCase() === cCode;
    });
    if (valid.length === 0) return null;

    const candidateIds = new Set<string>([qOpt.id.toLowerCase()]);
    const candidateTitles = new Set<string>([
      qOpt.title.toLowerCase(),
      `${country.name} — ${qOpt.title}`.toLowerCase()
    ]);

    const matching = valid.filter((att) => {
      const aId = (att.quizId || '').toLowerCase();
      const aTitle = (att.quizTitle || '').toLowerCase();
      if (qOpt.category === 'areacodes' && qOpt.targetCount > 15 && att.maxScore <= 10) return false;
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
      if (qOpt.category === 'cities' || qOpt.levelKey === 'CITY_PIN') {
        return (
          aId.includes('-cities') ||
          aTitle.includes('cities') ||
          att.category?.toLowerCase() === 'cities'
        );
      }
      return false;
    });

    if (matching.length === 0) return null;
    return matching.reduce((max, cur) => {
      const trueAcc =
        cur.maxScore > 0
          ? Math.max(0, Math.min(100, Math.round((Math.min(cur.score, cur.maxScore) / cur.maxScore) * 100)))
          : Math.max(0, Math.min(100, cur.accuracy || 0));
      return Math.max(max, trueAcc);
    }, 0);
  };

  return (
    <div className="fixed inset-x-0 bottom-16 md:bottom-auto md:top-16 md:right-4 md:left-auto md:w-[430px] z-40 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden max-h-[80dvh] md:max-h-[85vh] flex flex-col text-slate-100 animate-in slide-in-from-bottom duration-200">
      {/* Mobile Drag Handle */}
      <div className="md:hidden pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
        <div className="w-12 h-1.5 bg-slate-600/80 rounded-full" />
      </div>

      {/* Header with National Vector Flag & Country Identity */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <CountryFlag countryCode={country.id} size="lg" className="shadow-lg border border-slate-700" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-white">{country.name}</h2>
              <span className="text-xs font-mono font-bold text-sky-400">
                · {country.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 italic">{country.nativeName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Close country overview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Intelligence Details */}
      <div className="overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Quick Stats Grid (6 Stat Cards including Driving Side & Currency) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-slate-400 text-[10px]">Capital</p>
              <p className="font-semibold text-white truncate">{country.capital}</p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-slate-400 text-[10px]">Continent</p>
              <p className="font-semibold text-white truncate">{country.continent}</p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-slate-400 text-[10px]">Population</p>
              <p className="font-semibold text-white font-mono tabular-nums">
                {(country.population / 1_000_000).toFixed(1)}M
              </p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-slate-400 text-[10px]">Area</p>
              <p className="font-semibold text-white font-mono tabular-nums truncate">
                {country.areaKm2.toLocaleString()} km²
              </p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
            <span className="text-sm shrink-0">🚗</span>
            <div className="min-w-0">
              <p className="text-slate-400 text-[10px]">Driving Side</p>
              <p className="font-semibold text-white truncate">{isLeftDrive ? 'Left' : 'Right'}</p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
            <span className="text-sm shrink-0">💵</span>
            <div className="min-w-0">
              <p className="text-slate-400 text-[10px]">Currency</p>
              <p className="font-semibold text-white font-mono truncate">{currencyCode}</p>
            </div>
          </div>
        </div>

        {/* Learning Mastery Bar */}
        {(() => {
          const clampedMastery = Math.max(0, Math.min(100, Math.round(computedMastery)));
          return (
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Country Mastery (Avg of {allQuizzes.filter((q) => q.category !== 'adm2' && q.category !== 'adm3').length} Quizzes)
                </span>
                <span className="font-mono font-bold text-sky-400">{clampedMastery}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-700/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${clampedMastery}%` }}
                />
              </div>
            </div>
          );
        })()}

        {/* Dedicated Country Subdivisions, Area Codes, Cities & GeoGuessr Metas */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {country.name} 3D Globe &amp; Regional Quizzes
            </p>
            <span className="text-[10px] text-sky-400 font-mono">
              {allQuizzes.length} available
            </span>
          </div>

          <div className="space-y-2">
            {allQuizzes.map((quizOpt) => {
              const isAreaCode = quizOpt.category === 'areacodes';
              const isFlag = quizOpt.category === 'flags';
              const isCity = quizOpt.levelKey === 'CITY_PIN';
              const isExtra = quizOpt.category === 'extra' && !isCity;
              const bestPct = getBestAccuracyForQuiz(quizOpt);

              return (
                <button
                  key={quizOpt.id}
                  onClick={() => onStartSubdivisionQuiz(country, quizOpt)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-sky-500/50 text-left transition-all group shadow-sm active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0 text-sky-400 group-hover:scale-105 transition-transform">
                      {isCity ? (
                        <Building2 className="w-4 h-4 text-amber-400" />
                      ) : isAreaCode ? (
                        <Phone className="w-4 h-4 text-emerald-400" />
                      ) : isFlag ? (
                        <Flag className="w-4 h-4 text-amber-400" />
                      ) : isExtra ? (
                        <Sparkles className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Layers className="w-4 h-4 text-sky-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                          {quizOpt.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          · {quizOpt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {quizOpt.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {bestPct !== null && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          bestPct === 100
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                        }`}
                      >
                        {bestPct}%
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-sky-400 shrink-0">
                      {quizOpt.targetCount} Q
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interesting Geographical Notes */}
        {country.facts && country.facts.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Geography Notes</p>
            <div className="space-y-1 text-xs text-slate-300">
              {country.facts.map((fact, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-800 flex items-start gap-2">
                  <span className="text-sky-400 font-bold">·</span>
                  <p className="leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
