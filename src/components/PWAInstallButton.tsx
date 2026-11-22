import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Installa app</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-700" />
          <span>Installa su iOS</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px] p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-xl bg-white border border-slate-300 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3
                  id="ios-install-title"
                  className="text-base font-semibold text-slate-900 font-display"
                >
                  Installa su iPhone o iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  aria-label="Chiudi istruzioni"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
                <li>
                  Tocca il pulsante <strong>Condividi</strong> nella barra di Safari.
                </li>
                <li>
                  Scorri verso il basso e seleziona{' '}
                  <strong>Aggiungi alla schermata Home</strong>.
                </li>
                <li>
                  Conferma toccando <strong>Aggiungi</strong> in alto a destra.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Ho capito
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
