import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Hide if already running inside installed standalone app
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 border border-sky-400/40 rounded-xl shadow-lg transition-colors whitespace-nowrap cursor-pointer"
        title="Installeer PhoenixAtlas als offline app"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Installeer App</span>
      </button>

      {showInstallModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold">Installeer PhoenixAtlas App</h3>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-sky-400 mb-1">📱 iPhone &amp; iPad (Safari)</p>
                <p>
                  1. Tik onderaan in Safari op het <span className="font-semibold text-white">Deel-icoon</span> (vierkantje met pijl omhoog).<br />
                  2. Kies <span className="font-semibold text-white">Zet op beginscherm</span> (<em>Add to Home Screen</em>).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-emerald-400 mb-1">🤖 Android (Chrome / Edge)</p>
                <p>
                  1. Tik rechtsboven in de browser op het menu <span className="font-semibold text-white">⋮</span>.<br />
                  2. Tik op <span className="font-semibold text-white">App installeren</span> of <span className="font-semibold text-white">Toevoegen aan startscherm</span>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInstallModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 transition-colors"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </>
  );
};
