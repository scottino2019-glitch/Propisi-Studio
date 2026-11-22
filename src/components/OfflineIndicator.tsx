import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#0F172A] border border-amber-400/60 px-3.5 py-2 text-xs font-medium text-amber-100 shadow-lg"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>Modalità offline — Tutte le lezioni e la tua lista sono attive.</span>
    </div>
  );
};
