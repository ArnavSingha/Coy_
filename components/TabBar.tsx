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
    <nav className="w-full max-w-[480px] mx-auto fixed bottom-0 left-0 right-0 z-30 px-6 py-2.5 bg-white border-t-2 border-[#15121d] flex items-center justify-around shadow-[0_-4px_10px_rgba(21,18,29,0.04)]">
      {/* Home tab (Placeholder) */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all ${
          activeTab === 'home'
            ? 'text-[#15121d] font-bold'
            : 'text-[#6d6979] hover:text-[#15121d]'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all ${
          activeTab === 'home' 
            ? 'bg-[#f6f4fa] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d]' 
            : 'border-2 border-transparent'
        }`}>
          <Home className="w-5 h-5" />
        </div>
        <span className="text-[11px] tracking-tight">Home</span>
      </button>

      {/* Discover tab (Main feature) */}
      <button
        onClick={() => setActiveTab('discover')}
        className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all ${
          activeTab === 'discover'
            ? 'text-[#15121d] font-bold'
            : 'text-[#6d6979] hover:text-[#15121d]'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all ${
          activeTab === 'discover' 
            ? 'bg-[#e7e0ff] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d]' 
            : 'border-2 border-transparent'
        }`}>
          <Compass className="w-5 h-5" />
        </div>
        <span className="text-[11px] tracking-tight">Discover</span>
      </button>

      {/* Matches tab */}
      <button
        onClick={() => setActiveTab('matches')}
        className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all relative ${
          activeTab === 'matches'
            ? 'text-[#15121d] font-bold'
            : 'text-[#6d6979] hover:text-[#15121d]'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all relative ${
          activeTab === 'matches' 
            ? 'bg-[#ffe4ef] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d]' 
            : 'border-2 border-transparent'
        }`}>
          <Heart className={`w-5 h-5 ${activeTab === 'matches' ? 'fill-[#ff3d81] text-[#ff3d81]' : ''}`} />
          {matchesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-[#ff3d81] text-white text-[9px] font-black rounded-full border border-[#15121d] shadow-[1px_1px_0_#15121d]">
              {matchesCount}
            </span>
          )}
        </div>
        <span className="text-[11px] tracking-tight">Matches</span>
      </button>
    </nav>
  );
};
