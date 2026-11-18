'use client';

import React from 'react';
import { Compass, Home, Heart } from 'lucide-react';

interface TabBarProps {
  activeTab: 'home' | 'discover' | 'matches';
  setActiveTab: (tab: 'home' | 'discover' | 'matches') => void;
  matchesCount: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  setActiveTab,
  matchesCount,
}) => {
  return (
    <nav className="w-full max-w-md mx-auto fixed bottom-0 left-0 right-0 z-30 px-6 py-2 bg-[#0f1117]/95 backdrop-blur-lg border-t border-white/10 flex items-center justify-around shadow-2xl">
      {/* Home tab (Placeholder) */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
          activeTab === 'home'
            ? 'text-white'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <div className={`p-1.5 rounded-full transition-transform ${activeTab === 'home' ? 'scale-110 bg-white/10' : ''}`}>
          <Home className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-medium tracking-wide">Home</span>
      </button>

      {/* Discover tab (Main feature) */}
      <button
        onClick={() => setActiveTab('discover')}
        className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
          activeTab === 'discover'
            ? 'text-[#f25f4c]'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <div className={`p-1.5 rounded-full transition-transform ${activeTab === 'discover' ? 'scale-110 bg-[#f25f4c]/15 text-[#f25f4c]' : ''}`}>
          <Compass className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-medium tracking-wide">Discover</span>
      </button>

      {/* Matches tab */}
      <button
        onClick={() => setActiveTab('matches')}
        className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all relative ${
          activeTab === 'matches'
            ? 'text-[#f25f4c]'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <div className={`p-1.5 rounded-full transition-transform relative ${activeTab === 'matches' ? 'scale-110 bg-[#f25f4c]/15 text-[#f25f4c]' : ''}`}>
          <Heart className={`w-5 h-5 ${activeTab === 'matches' ? 'fill-current' : ''}`} />
          {matchesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f25f4c] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {matchesCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium tracking-wide">Matches</span>
      </button>
    </nav>
  );
};
