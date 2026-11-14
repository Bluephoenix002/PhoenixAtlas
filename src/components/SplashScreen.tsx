import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinished: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1150);

    const doneTimer = setTimeout(() => {
      onFinished();
    }, 1550);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0f1d] text-slate-100 select-none transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated Glowing Ring & PhoenixAtlas Compass Emblem */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-32 h-32 rounded-full bg-sky-500/20 blur-xl animate-pulse" />
        <img
          src="/phoenix-logo.png"
          alt="PhoenixAtlas"
          className="w-28 h-28 object-contain drop-shadow-[0_0_24px_rgba(56,189,248,0.4)] select-none relative z-10"
        />
      </div>

      {/* Brand Wordmark */}
      <h1 className="text-3xl sm:text-4xl font-black tracking-[0.18em] text-white">
        Phoenix<span className="text-sky-400">Atlas</span>
      </h1>

      {/* Designer Attribution */}
      <p className="mt-2 text-xs sm:text-sm font-semibold tracking-wider text-sky-400">
        Designed &amp; Developed by BluePhoenix
      </p>

      {/* Loading Status Indicator */}
      <div className="mt-8 flex flex-col items-center gap-2.5">
        <div className="w-48 h-1 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 w-full animate-pulse" />
        </div>
        <p className="text-[11px] font-mono text-slate-400 tracking-wide">
          Initializing offline geography database...
        </p>
      </div>
    </div>
  );
};
