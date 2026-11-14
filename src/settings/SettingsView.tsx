import React, { useState, useEffect } from 'react';
import {
  Settings,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Database,
  CheckCircle2,
  User,
  Vibrate,
  Sliders,
  Info,
  Palette,
  Sun,
  Moon,
  WifiOff,
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { db } from '../database/db';
import { sounds } from '../utils/soundEngine';
import {
  useOfflineSyncStatus,
  startBackgroundOfflineSync,
  checkAndApplyAppUpdate
} from '../utils/offlineSync';

export type UIThemeId = 'slate' | 'tactical' | 'emerald' | 'crimson' | 'amethyst' | 'neon';

export const QUICK_ACCENT_SWATCHES = [
  { hex: '#0284c7', label: 'Seterra Blue' },
  { hex: '#16a34a', label: 'Seterra Green' },
  { hex: '#0ea5e9', label: 'Sky Blue' },
  { hex: '#10b981', label: 'Emerald' },
  { hex: '#f59e0b', label: 'Amber' },
  { hex: '#e11d48', label: 'Crimson' },
  { hex: '#7c3aed', label: 'Indigo' }
];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface SettingsViewProps {
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  uiTheme?: UIThemeId;
  onUiThemeChange?: (uiTheme: UIThemeId) => void;
  uiAccentColor?: string;
  onUiAccentColorChange?: (hex: string) => void;
  appTheme?: 'dark' | 'light';
  onToggleAppTheme?: (mode: 'dark' | 'light') => void;
  globeSensitivity?: number;
  onGlobeSensitivityChange?: (val: number) => void;
  playerName?: string;
  onPlayerNameChange?: (name: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  appTheme: externalAppTheme = 'dark',
  onToggleAppTheme,
  globeSensitivity = 1.0,
  onGlobeSensitivityChange,
  playerName: externalPlayerName,
  onPlayerNameChange
}) => {
  const [playerName, setPlayerName] = useState(externalPlayerName || 'Alex');
  const [appTheme, setAppTheme] = useState<'dark' | 'light'>(externalAppTheme);
  const [soundOn, setSoundOn] = useState(true);
  const [hapticsOn, setHapticsOn] = useState(true);
  const [sensitivity, setSensitivity] = useState(globeSensitivity);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [deferredInstallPrompt, setDeferredInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  const offlineState = useOfflineSyncStatus();

  useEffect(() => {
    startBackgroundOfflineSync();
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    db.settings.get('current').then((s) => {
      if (s) {
        setPlayerName(s.playerName || 'Alex');
        if (s.theme === 'light' || s.theme === 'dark') setAppTheme(s.theme);
        setSoundOn(s.soundEnabled);
        setHapticsOn(s.hapticsEnabled ?? true);
        setSensitivity(s.globeSensitivity ?? 1.0);
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  const handleModeSelect = async (nextMode: 'dark' | 'light') => {
    sounds.playTap();
    setAppTheme(nextMode);
    onToggleAppTheme?.(nextMode);
    await db.settings.update('current', { theme: nextMode });
  };

  const handlePlayerNameSave = async (val: string) => {
    setPlayerName(val);
    onPlayerNameChange?.(val);
    await db.settings.update('current', { playerName: val });
  };

  const handleToggleSound = async () => {
    const next = !soundOn;
    setSoundOn(next);
    sounds.setEnabled(next);
    if (next) sounds.playTap();
    await db.settings.update('current', { soundEnabled: next });
  };

  const handleToggleHaptics = async () => {
    const next = !hapticsOn;
    setHapticsOn(next);
    sounds.setHapticsEnabled(next);
    sounds.playTap();
    await db.settings.update('current', { hapticsEnabled: next });
  };

  const handleSensitivityChange = async (val: number) => {
    setSensitivity(val);
    onGlobeSensitivityChange?.(val);
    await db.settings.update('current', { globeSensitivity: val });
  };

  // Full Database Backup as JSON
  const handleExportFullBackup = async () => {
    sounds.playTap();
    const attempts = await db.quizAttempts.toArray();
    const flashcards = await db.flashcards.toArray();
    const decks = await db.decks.toArray();
    const customQuizzes = await db.customQuizzes.toArray();
    const stats = await db.userStats.get('current');
    const userSettings = await db.settings.get('current');

    const backupData = {
      app: 'PhoenixAtlas',
      version: '2.2.0',
      exportedAt: new Date().toISOString(),
      attempts,
      flashcards,
      decks,
      customQuizzes,
      stats,
      settings: userSettings
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phoenixatlas_progress_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatus('Progress backup exported as JSON!');
    setTimeout(() => setBackupStatus(null), 3000);
  };

  // Restore Database from JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.app === 'PhoenixAtlas' || data.app === 'ATLAS' || data.userStats || data.attempts) {
          if (data.attempts) await db.quizAttempts.bulkPut(data.attempts);
          if (data.quizAttempts) await db.quizAttempts.bulkPut(data.quizAttempts);
          if (data.decks) await db.decks.bulkPut(data.decks);
          if (data.flashcards) await db.flashcards.bulkPut(data.flashcards);
          if (data.customQuizzes) await db.customQuizzes.bulkPut(data.customQuizzes);
          if (data.stats) await db.userStats.put({ ...data.stats, id: 'current' });
          if (data.userStats) await db.userStats.put({ ...data.userStats, id: 'current' });
          sounds.playSuccess();
          setBackupStatus('Progress & mastery restored successfully!');
          setTimeout(() => setBackupStatus(null), 3000);
        }
      } catch (err) {
        console.error('Failed to restore backup:', err);
      }
    };
    reader.readAsText(file);
  };

  const syncPct =
    offlineState.totalCount > 0
      ? Math.min(100, Math.round((offlineState.cachedCount / offlineState.totalCount) * 100))
      : 100;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Top Header */}
      <div className="px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <span>Settings</span>
          </h1>
          <p className="text-xs text-slate-400">
            Configure Light/Dark appearance, 3D Globe controls, audio, offline downloads, and progress backup.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full pb-24 space-y-5">
        {/* Clean Light / Dark Mode Toggle */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-sky-400" />
                <span>Appearance Mode</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Switch between standard Dark Mode and clean Light Mode across the menus and 3D Earth Globe.
              </p>
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => handleModeSelect('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  appTheme === 'light'
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeSelect('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  appTheme === 'dark'
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Player Profile */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-sky-400" />
            <span>Player Profile</span>
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-white">Player Display Name</p>
              <p className="text-[11px] text-slate-400">
                Displayed on your personal best times and daily challenge scorecards
              </p>
            </div>
            <input
              type="text"
              value={playerName}
              onChange={(e) => handlePlayerNameSave(e.target.value)}
              placeholder="Alex"
              maxLength={24}
              className="w-full sm:w-56 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* 3D Globe Controls */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>3D Globe Controls</span>
          </h2>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">3D Globe Rotation Sensitivity</p>
                <p className="text-[11px] text-slate-400">
                  Adjust touch &amp; drag rotation speed on the 3D Earth Globe (auto-scales when zoomed in)
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-sky-400">
                {sensitivity.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.0"
              step="0.1"
              value={sensitivity}
              onChange={(e) => handleSensitivityChange(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Audio & Haptics */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Audio &amp; Haptics</span>
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-slate-800 gap-2">
            <div>
              <p className="text-xs font-semibold text-white">Sound Effects (WebAudio Synthesizer)</p>
              <p className="text-[11px] text-slate-400">
                Subtle marimba &amp; woodblock audio feedback for globe taps, right/wrong answers, and flyovers (works on iOS &amp; Android, 0 KB download)
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {soundOn && (
                <button
                  type="button"
                  onClick={() => sounds.playSuccess()}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  title="Preview right-answer chime"
                >
                  Test
                </button>
              )}
              <button
                type="button"
                onClick={handleToggleSound}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  soundOn
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundOn ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-white">Phone Vibration (Haptics)</p>
              <p className="text-[11px] text-slate-400">
                Subtle mobile haptic vibration on Android (note: iOS Safari blocks web vibration at OS level)
              </p>
            </div>
            <button
              onClick={handleToggleHaptics}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                hapticsOn
                  ? 'bg-sky-600/20 text-sky-300 border-sky-500/40'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              <Vibrate className="w-4 h-4" />
              <span>{hapticsOn ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Offline Downloads & App Updates (Second-last card, right above Progress Backup) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Offline Downloads</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                All 503 offline data files (501 TopoJSON maps for Countries, Subdivisions, Area Codes &amp; Postcodes + 5,820 World Cities + 34 Scripts &amp; 95 Languages) are saved locally (~27.7 MB compressed / 117.1 MB unpacked) for 100% Airplane Mode play.
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${
                syncPct >= 100
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  : 'bg-sky-500/15 text-sky-300 border-sky-500/40'
              }`}
            >
              {syncPct >= 100
                ? '✓ 100% Offline Ready'
                : `Downloading (${syncPct}%)`}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">
                Complete Offline Package: {offlineState.cachedCount} / {offlineState.totalCount} files saved
              </span>
              <span className="text-sky-400 font-bold">{syncPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  syncPct >= 100 ? 'bg-emerald-400' : 'bg-sky-500'
                }`}
                style={{ width: `${syncPct}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {syncPct < 100 && (
              <button
                onClick={() => {
                  sounds.playTap();
                  startBackgroundOfflineSync(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>Download All Offline Maps Now</span>
              </button>
            )}

            <button
              onClick={async () => {
                sounds.playTap();
                const msg = await checkAndApplyAppUpdate();
                setUpdateMessage(msg);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Check &amp; Apply Latest App Update</span>
            </button>

            {!isStandalone && (
              <button
                onClick={async () => {
                  sounds.playTap();
                  if (deferredInstallPrompt) {
                    await deferredInstallPrompt.prompt();
                    setDeferredInstallPrompt(null);
                  } else {
                    setUpdateMessage(
                      '📱 Op iPhone/iPad (Safari): tik onderaan op Deel (vierkantje met pijl omhoog) → "Zet op beginscherm". Op Android (Chrome): tik rechtsboven op ⋮ → "App installeren" of "Toevoegen aan startscherm".'
                    );
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install PhoenixAtlas on Phone</span>
              </button>
            )}

            <button
              onClick={async () => {
                sounds.playTap();
                const shareUrl = window.location.origin;
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title: 'PhoenixAtlas — 3D Geography & Offline Quiz App',
                      text: 'Speel PhoenixAtlas (3D wereldbol, landen, steden, vlaggen, netnummers & schriften — 100% offline speelbaar):',
                      url: shareUrl
                    });
                  } else {
                    await navigator.clipboard.writeText(shareUrl);
                    setUpdateMessage(`✓ Publieke app-link gekopieerd (${shareUrl}) — 100% anoniem, zonder e-mailadres.`);
                  }
                } catch {
                  await navigator.clipboard.writeText(shareUrl).catch(() => {});
                  setUpdateMessage(`✓ Publieke app-link: ${shareUrl}`);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/25 hover:bg-indigo-600/35 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>🔗 Share Public App Link</span>
            </button>
          </div>

          {updateMessage && (
            <p className="text-xs font-semibold text-sky-400 leading-relaxed">{updateMessage}</p>
          )}
        </div>

        {/* Progress Backup (Save & Transfer Your Scores Between Devices) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Progress Backup (Save &amp; Transfer Your Mastery)</span>
          </h2>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">What is Progress Backup? </span>
              Because PhoenixAtlas runs 100% offline without requiring an account login, your country mastery percentages, personal best times, and revision queue are saved locally on your phone or browser. Exporting a JSON backup lets you save a copy of your progress or move your stats to another device anytime.
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleExportFullBackup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Export My Progress (.json)</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Import Progress (.json)</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>

          {backupStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{backupStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
