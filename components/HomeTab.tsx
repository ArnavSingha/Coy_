'use client';

import React from 'react';
import { Compass, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HomeTabProps {
  onGoToDiscover: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onGoToDiscover }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center mb-6 shadow-xl relative">
        <HeartHandshake className="w-8 h-8 text-[#e07a5f]" />
        <div className="absolute -bottom-1 -right-1 p-1 bg-zinc-800 rounded-full border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
        Coy Home
      </h1>

      <p className="text-sm text-zinc-400 max-w-xs mb-8 leading-relaxed">
        Placeholder tab for Coy&apos;s existing contact-based crush list. Double-blind mutual matching for campus life.
      </p>

      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 max-w-xs text-left mb-8 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Assignment Context
        </div>
        <p className="text-xs text-zinc-300 leading-normal">
          Per Part B instructions, the Home tab is kept as a clean placeholder so you can experience the new swipe-based discovery feature in the <span className="text-[#f25f4c] font-medium">Discover</span> tab.
        </p>
      </div>

      <button
        onClick={onGoToDiscover}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-[#e07a5f] to-[#f25f4c] text-white font-medium text-sm shadow-lg shadow-[#f25f4c]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
      >
        <Compass className="w-4 h-4" />
        <span>Open Discover Tab</span>
      </button>
    </div>
  );
};
