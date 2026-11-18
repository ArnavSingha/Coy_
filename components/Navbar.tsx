'use client';

import React from 'react';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';

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
    <header className="w-full max-w-md mx-auto px-4 py-3 flex items-center justify-between border-b border-white/5 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-30">
      {/* Brand logo & name */}
      <div 
        onClick={() => setActiveTab('discover')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#e07a5f] to-[#f25f4c] flex items-center justify-center shadow-lg shadow-coral-500/20 group-hover:scale-105 transition-transform duration-200">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              coy
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
              Discover
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Reset Demo Data */}
        <button
          onClick={onReset}
          disabled={isResetting}
          title="Reset Seed Profiles (Demo)"
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-full transition-colors relative group"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin text-coral-500' : 'group-hover:-rotate-45 transition-transform'}`} />
          <span className="absolute -bottom-8 right-0 text-[10px] whitespace-nowrap bg-zinc-900 border border-white/10 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-zinc-300 z-50">
            Reset Demo
          </span>
        </button>

        {/* Matches quick access */}
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeTab === 'matches'
              ? 'bg-[#f25f4c] text-white shadow-md shadow-[#f25f4c]/30'
              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${matchesCount > 0 ? 'fill-current text-[#f25f4c]' : ''} ${activeTab === 'matches' ? 'text-white fill-white' : ''}`} />
          <span>Matches</span>
          {matchesCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'matches' ? 'bg-white text-[#f25f4c]' : 'bg-[#f25f4c] text-white'
            }`}>
              {matchesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
