'use client';

import React from 'react';
import { Compass, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HomeTabProps {
  onGoToDiscover: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onGoToDiscover }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      {/* Icon badge */}
      <div className="w-20 h-20 rounded-full bg-[#ffe4ef] border-2 border-[#15121d] shadow-[4px_4px_0_#15121d] flex items-center justify-center mb-6 relative">
        <HeartHandshake className="w-9 h-9 text-[#ff3d81]" />
        <div className="absolute -bottom-1 -right-1 p-1 bg-[#cbf4e0] rounded-full border-2 border-[#15121d] shadow-[1px_1px_0_#15121d]">
          <ShieldCheck className="w-4 h-4 text-[#0e8f48]" />
        </div>
      </div>

      <h1 className="text-3xl font-black tracking-tight text-[#15121d] mb-2">
        coy<span className="text-[#ff3d81]">.</span>
      </h1>

      <p className="text-sm font-semibold text-[#6d6979] max-w-xs mb-6 leading-relaxed">
        Find out if your crush likes you back. If they don&apos;t, nobody ever knows.
      </p>

      {/* Assignment notice */}
      <div className="p-4 rounded-2xl bg-[#f6f4fa] border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] max-w-xs text-left mb-8 space-y-1.5">
        <div className="text-[11px] font-black uppercase tracking-wider text-[#ff3d81]">
          Part B: Discover Tab
        </div>
        <p className="text-xs font-medium text-[#15121d] leading-normal">
          Per instructions, the Home tab is kept as a clean placeholder for Coy&apos;s existing experience. The new swipe discovery feature is built in the <strong className="text-[#ff3d81]">Discover</strong> tab.
        </p>
      </div>

      {/* Primary CTA */}
      <button
        onClick={onGoToDiscover}
        className="px-7 py-3.5 rounded-full bg-[#ff3d81] hover:bg-[#ff5a94] text-white font-extrabold text-sm border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center gap-2"
      >
        <Compass className="w-4 h-4 stroke-[2.5]" />
        <span>Open Discover Tab</span>
      </button>
    </div>
  );
};
