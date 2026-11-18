'use client';

import React from 'react';
import { Heart, RotateCcw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'discover' | 'matches';
  setActiveTab: (tab: 'home' | 'discover' | 'matches') => void;
  matchesCount: number;
  onReset: () => void;
  isResetting?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  matchesCount,
  onReset,
  isResetting = false,
}) => {
  return (
    <header className="w-full max-w-[480px] mx-auto px-5 py-3.5 flex items-center justify-between border-b-2 border-[#15121d] bg-white sticky top-0 z-30">
      {/* Brand logo & wordmark */}
      <div 
        onClick={() => setActiveTab('discover')}
        className="flex items-center gap-2 cursor-pointer select-none group"
      >
        <span className="coy-wordmark">
          coy
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#e7e0ff] border-2 border-[#15121d] text-[#15121d] shadow-[1.5px_1.5px_0_#15121d]">
          Discover
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Reset Demo Data */}
        <button
          onClick={onReset}
          disabled={isResetting}
          title="Reset Seed Profiles (Demo)"
          className="w-9 h-9 rounded-full bg-[#f6f4fa] hover:bg-[#ece9f2] active:bg-[#e7e0ff] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center text-[#15121d]"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin text-[#ff3d81]' : ''}`} />
        </button>

        {/* Matches quick pill */}
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all ${
            activeTab === 'matches'
              ? 'bg-[#ff3d81] text-white'
              : 'bg-[#ffe4ef] hover:bg-[#ffd0e2] text-[#15121d]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${matchesCount > 0 ? 'fill-current' : ''}`} />
          <span>Matches</span>
          {matchesCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black border border-[#15121d] ${
              activeTab === 'matches' ? 'bg-white text-[#15121d]' : 'bg-[#ff3d81] text-white'
            }`}>
              {matchesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
