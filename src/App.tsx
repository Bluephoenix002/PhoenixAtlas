import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Compass,
  BookOpen,
  BarChart3,
  Settings
} from 'lucide-react';
import { WorldGlobeView, ActiveGlobeQuizConfig } from './maps/WorldGlobeView';
import { RegionSelectorModal } from './maps/RegionSelectorModal';
import { CountryBottomSheet } from './maps/CountryBottomSheet';
import { QuizCatalog } from './quiz-engine/QuizCatalog';
import { QuizPlayer } from './quiz-engine/QuizPlayer';
import { LanguageHub } from './language-learning/LanguageHub';
import { ProgressDashboard } from './statistics/ProgressDashboard';
import { SettingsView, UIThemeId } from './settings/SettingsView';
import { SplashScreen } from './components/SplashScreen';
import { PWAInstallButton } from './pwa/PWAInstallButton';
import { CountryInfo } from './data/countriesData';
import { QuizDefinition } from './quiz-engine/quizTypes';
import { db, initDatabaseDefaults, UserStats } from './database/db';
import { sounds } from './utils/soundEngine';
import { SubdivisionQuizOption } from './data/countrySubdivisionCatalog';

type NavTab = 'map' | 'quizzes' | 'languages' | 'progress' | 'settings';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('map');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [globeSensitivity, setGlobeSensitivity] = useState<number>(1.0);
  const [playerName, setPlayerName] = useState<string>('Alex');
  const [uiTheme, setUiTheme] = useState<UIThemeId>('slate');
  const [appTheme, setAppTheme] = useState<'dark' | 'light'>('dark');
  const [uiAccentColor, setUiAccentColor] = useState<string>('#0ea5e9');

  // Active Quiz State (for any text deck)
  const [activeQuiz, setActiveQuiz] = useState<QuizDefinition | null>(null);

  // Active 3D Globe Projected Quiz Config (Subdivisions, Area Codes, Cities, Metas, World/Continents/Custom)
  const [activeGlobeQuizConfig, setActiveGlobeQuizConfig] =
    useState<ActiveGlobeQuizConfig | null>(null);

  // Pre-quiz region/prefix selection modal state (for Country, World, Continent, and Custom quizzes)
  const [regionSelectorCountry, setRegionSelectorCountry] = useState<CountryInfo | null>(null);
  const [regionSelectorOption, setRegionSelectorOption] =
    useState<SubdivisionQuizOption | null>(null);
  const [pendingGlobeQuizBaseConfig, setPendingGlobeQuizBaseConfig] =
    useState<Partial<ActiveGlobeQuizConfig> | null>(null);
  const [preQuizTab, setPreQuizTab] = useState<NavTab>('map');

  // User Stats
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const refreshStats = async () => {
    const stats = await db.userStats.get('current');
    if (stats) setUserStats(stats);
  };

  // Initialize DB on boot
  useEffect(() => {
    initDatabaseDefaults().then(async () => {
      await refreshStats();
      const settings = await db.settings.get('current');
      if (settings) {
        setGlobeSensitivity(settings.globeSensitivity ?? 1.0);
        setPlayerName(settings.playerName || 'Alex');
        if (settings.uiTheme) setUiTheme(settings.uiTheme);
        if (settings.theme === 'light' || settings.theme === 'dark') {
          setAppTheme(settings.theme);
        }
        if (settings.uiAccentColor) {
          setUiAccentColor(settings.uiAccentColor);
        }
        sounds.setEnabled(settings.soundEnabled);
        sounds.setHapticsEnabled(settings.hapticsEnabled ?? true);
      }
    });
  }, []);

  // Sync light/dark theme class on root (clean standard dark or light UI)
  useEffect(() => {
    const root = document.documentElement;
    if (appTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    root.style.removeProperty('--color-slate-950');
    root.style.removeProperty('--color-slate-900');
    root.style.removeProperty('--color-slate-800');
    root.style.removeProperty('--color-slate-700');
    root.style.removeProperty('--color-sky-500');
    root.style.removeProperty('--color-sky-600');
    root.style.removeProperty('--color-sky-400');
    root.style.removeProperty('--color-sky-300');
  }, [appTheme]);

  // Open pre-quiz setup & custom region selector modal before starting any country quiz
  const handleStartSubdivisionQuiz = (
    country: CountryInfo,
    option: SubdivisionQuizOption,
    baseConfig?: Partial<ActiveGlobeQuizConfig>
  ) => {
    sounds.playTap();
    setPreQuizTab(activeTab);
    setSelectedCountry(null);
    setPendingGlobeQuizBaseConfig(baseConfig || null);
    setRegionSelectorCountry(country);
    setRegionSelectorOption(option);
  };

  // Launch combined / world / continent / custom / daily quiz directly onto the 3D Globe
  const handleStartGlobeQuiz = (config: ActiveGlobeQuizConfig) => {
    sounds.playTap();
    setPreQuizTab(activeTab);
    setSelectedCountry(null);
    setActiveGlobeQuizConfig(config);
    setActiveTab('map');
  };

  const handleNavClick = (tab: NavTab) => {
    sounds.playTap();
    if (regionSelectorCountry) {
      setRegionSelectorCountry(null);
      setRegionSelectorOption(null);
      setPendingGlobeQuizBaseConfig(null);
    }
    if (tab === 'map' && (activeGlobeQuizConfig || activeQuiz)) {
      setActiveGlobeQuizConfig(null);
      setActiveQuiz(null);
      setSelectedCountry(null);
      setActiveTab('map');
      refreshStats();
      return;
    }
    setActiveTab(tab);
    if (selectedCountry) setSelectedCountry(null);
    requestAnimationFrame(() => {
      document.querySelectorAll('main .overflow-y-auto').forEach((el) => {
        el.scrollTo({ top: 0, behavior: 'auto' });
      });
    });
  };

  // Pause 3D WebGL render loop only when not on the 3D Globe tab or when splash/region modal is open
  const isGlobePaused =
    showSplash ||
    activeTab !== 'map' ||
    !!activeQuiz ||
    !!regionSelectorCountry;

  return (
    <div
      data-ui-theme={uiTheme}
      data-theme-mode={appTheme}
      className="w-full h-[100dvh] overflow-hidden flex flex-col bg-slate-950 text-slate-100"
    >
      {/* Dark Top Framing Bar (Prevents mobile OS status popups from overlapping top buttons) */}
      <div className="w-full h-2 bg-slate-950 border-b border-slate-900 shrink-0 z-50" />

      {/* Startup Splash Screen */}
      {showSplash && (
        <SplashScreen
          onFinished={() => {
            setShowSplash(false);
            import('./utils/offlineSync').then((m) => m.startBackgroundOfflineSync());
          }}
        />
      )}

      {/* Main View Area (Full Height — No Top Header Clutter) */}
      <main className="flex-1 relative overflow-hidden">
        {/* Visible In-App PWA Install Button (Top-Right when not in active quiz) */}
        {!activeQuiz && !activeGlobeQuizConfig && (
          <div className="fixed top-3 right-3 z-[130]">
            <PWAInstallButton />
          </div>
        )}

        {/* FULL-SCREEN OVERLAY: ACTIVE TEXT QUIZ PLAYER */}
        {activeQuiz && (
          <div className="absolute inset-0 z-50">
            <QuizPlayer
              quiz={activeQuiz}
              onExit={() => setActiveQuiz(null)}
              onComplete={refreshStats}
            />
          </div>
        )}

        {/* PRE-QUIZ SETUP & REGION / PREFIX SELECTOR MODAL */}
        {regionSelectorCountry && regionSelectorOption && (
          <RegionSelectorModal
            country={regionSelectorCountry}
            quizOption={regionSelectorOption}
            onClose={() => {
              setRegionSelectorCountry(null);
              setRegionSelectorOption(null);
              setPendingGlobeQuizBaseConfig(null);
            }}
            onStart={(
              selectedGroups,
              mode,
              quizLangMode,
              quizDifficulty,
              endlessRetry,
              chosenOption,
              isPartialRun
            ) => {
              setActiveGlobeQuizConfig({
                ...(pendingGlobeQuizBaseConfig || {}),
                country: regionSelectorCountry,
                quizOption: chosenOption || regionSelectorOption,
                selectedGroups,
                initialMode: mode,
                quizLangMode,
                quizDifficulty,
                endlessRetry,
                isPartialRun
              });
              setRegionSelectorCountry(null);
              setRegionSelectorOption(null);
              setPendingGlobeQuizBaseConfig(null);
              setActiveTab('map');
            }}
          />
        )}

        {/* TAB 1: 3D EARTH GLOBE & 3D PROJECTED QUIZ ENGINE (KEPT MOUNTED FOR INSTANT TRANSITIONS) */}
        <div
          className={`w-full h-full relative ${
            activeTab === 'map' ? 'block' : 'hidden'
          }`}
        >
          <WorldGlobeView
            selectedCountry={selectedCountry}
            onSelectCountry={(c) => setSelectedCountry(c)}
            isPaused={isGlobePaused}
            sensitivity={globeSensitivity}
            appTheme={appTheme}
            activeQuizConfig={activeGlobeQuizConfig}
            onExitQuiz={() => {
              setActiveGlobeQuizConfig(null);
              refreshStats();
            }}
            onOpenQuizSettings={() => {
              if (!activeGlobeQuizConfig) return;
              const cfg = activeGlobeQuizConfig;
              setActiveGlobeQuizConfig(null);
              refreshStats();
              if (preQuizTab && preQuizTab !== 'map') {
                setActiveTab(preQuizTab);
              }
              setPendingGlobeQuizBaseConfig({
                multiCountries: cfg.multiCountries,
                customCitiesPool: cfg.customCitiesPool,
                languageSamplesPool: cfg.languageSamplesPool,
                areaCodeDepth: cfg.areaCodeDepth,
                areaCodeDepthByCountry: cfg.areaCodeDepthByCountry,
                questionLimit: cfg.questionLimit,
                countrySubdivisionOverrides: cfg.countrySubdivisionOverrides
              });
              setRegionSelectorCountry(cfg.country);
              setRegionSelectorOption(cfg.quizOption);
            }}
          />

          {/* Country Information Bottom Sheet (Only when no active quiz is running) */}
          {selectedCountry && !activeGlobeQuizConfig && (
            <CountryBottomSheet
              country={selectedCountry}
              onClose={() => setSelectedCountry(null)}
              onStartSubdivisionQuiz={handleStartSubdivisionQuiz}
              masteryPercentage={userStats?.countryMastery[selectedCountry.id] ?? 0}
            />
          )}
        </div>

        {/* TAB 2: UNIVERSAL QUIZ EXPLORER (5 TOPICS x 4 SCOPES) */}
        {activeTab === 'quizzes' && (
          <QuizCatalog
            onStartQuiz={(quiz) => setActiveQuiz(quiz)}
            onStartSubdivisionQuiz={handleStartSubdivisionQuiz}
            onStartGlobeQuiz={handleStartGlobeQuiz}
          />
        )}

        {/* TAB 3: ALPHABETS, SCRIPTS & WORLD LANGUAGE IDENTIFICATION */}
        {activeTab === 'languages' && (
          <LanguageHub onStartGlobeQuiz={handleStartGlobeQuiz} />
        )}

        {/* TAB 4: PROGRESS, DEEP STATISTICS & REVISION HUB */}
        {activeTab === 'progress' && (
          <ProgressDashboard
            onStartSubdivisionQuiz={handleStartSubdivisionQuiz}
            onStartQuiz={(quiz) => setActiveQuiz(quiz)}
          />
        )}

        {/* TAB 5: SETTINGS & PROFILE */}
        {activeTab === 'settings' && (
          <SettingsView
            uiTheme={uiTheme}
            onUiThemeChange={(nextTheme) => setUiTheme(nextTheme)}
            appTheme={appTheme}
            onToggleAppTheme={(nextMode) => setAppTheme(nextMode)}
            uiAccentColor={uiAccentColor}
            onUiAccentColorChange={(hex) => setUiAccentColor(hex)}
            globeSensitivity={globeSensitivity}
            onGlobeSensitivityChange={(val) => setGlobeSensitivity(val)}
            playerName={playerName}
            onPlayerNameChange={(name) => setPlayerName(name)}
          />
        )}
      </main>

      {/* 5-Menu Mobile Bottom Navigation Bar (Center Globe Uniformly Contained & Slowly Fading Colors) */}
      <nav
        aria-label="Main Navigation"
        className="h-16 px-2 sm:px-4 border-t border-slate-800 bg-slate-900 flex items-center justify-around shrink-0 z-[120] relative select-none max-w-xl mx-auto w-full md:max-w-2xl pb-[max(0.25rem,env(safe-area-inset-bottom))]"
      >
        {/* 1. Quizzes */}
        <button
          onClick={() => handleNavClick('quizzes')}
          className={`flex-1 flex flex-col items-center justify-center min-w-[50px] py-1 transition-all ${
            activeTab === 'quizzes' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">Quizzes</span>
        </button>

        {/* 2. Alphabets */}
        <button
          onClick={() => handleNavClick('languages')}
          className={`flex-1 flex flex-col items-center justify-center min-w-[50px] py-1 transition-all ${
            activeTab === 'languages'
              ? 'text-sky-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">Alphabets</span>
        </button>

        {/* 3. Center Globe (Uniformly Contained Inside Nav — Never Half-Cut, Slowly Fading Colors) */}
        <button
          onClick={() => handleNavClick('map')}
          className="flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer min-w-[64px] relative"
        >
          <div
            className={`w-10 h-9 rounded-xl flex items-center justify-center border globe-nav-badge transition-transform ${
              activeTab === 'map' ? 'scale-105' : 'opacity-90 group-hover:opacity-100'
            }`}
          >
            <Globe2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight globe-nav-label">
            Globe
          </span>
        </button>

        {/* 4. Progress */}
        <button
          onClick={() => handleNavClick('progress')}
          className={`flex-1 flex flex-col items-center justify-center min-w-[50px] py-1 transition-all ${
            activeTab === 'progress'
              ? 'text-sky-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">Progress</span>
        </button>

        {/* 5. Settings */}
        <button
          onClick={() => handleNavClick('settings')}
          className={`flex-1 flex flex-col items-center justify-center min-w-[50px] py-1 transition-all ${
            activeTab === 'settings'
              ? 'text-sky-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">Settings</span>
        </button>
      </nav>
    </div>
  );
}
