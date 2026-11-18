'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ClientProfile, MatchRecord } from '@/lib/db';
import { ProfileCard } from './ProfileCard';
import { X, Heart, RotateCcw, Sparkles, UserCheck } from 'lucide-react';

interface CardStackProps {
  profiles: ClientProfile[];
  onSwipe: (profileId: string, action: 'like' | 'pass') => Promise<void>;
  onMatch: (match: MatchRecord) => void;
  onReset: () => void;
  onViewMatches: () => void;
  matchesCount: number;
  isLoading?: boolean;
}

export const CardStack: React.FC<CardStackProps> = ({
  profiles,
  onSwipe,
  onReset,
  onViewMatches,
  matchesCount,
  isLoading = false,
}) => {
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Motion values for the top card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-20, 20]);
  const likeOpacity = useTransform(x, [25, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-25, -110], [0, 1]);

  const currentProfile = profiles[0];
  const nextProfile = profiles[1];

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (!currentProfile) return;

    const threshold = 100;
    const velocityThreshold = 500;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      // Swiped right -> LIKE
      triggerSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      // Swiped left -> PASS
      triggerSwipe('pass');
    } else {
      // Snap back to center
      x.set(0);
    }
  };

  const triggerSwipe = async (action: 'like' | 'pass') => {
    if (!currentProfile || swipingId) return;

    const profileId = currentProfile.id;
    setSwipingId(profileId);
    setSwipeDirection(action === 'like' ? 'right' : 'left');

    try {
      await onSwipe(profileId, action);
    } finally {
      // Reset animation state for next card
      x.set(0);
      setSwipingId(null);
      setSwipeDirection(null);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm h-[540px] rounded-3xl bg-zinc-900/60 border border-white/5 animate-pulse flex flex-col items-center justify-center">
          <Sparkles className="w-8 h-8 text-zinc-600 animate-spin" />
          <p className="mt-4 text-xs text-zinc-500 font-medium">Finding people near you...</p>
        </div>
      </div>
    );
  }

  // Empty state when all profiles have been swiped
  if (!currentProfile) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative">
          <UserCheck className="w-10 h-10 text-[#f25f4c]" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
          You&apos;re All Caught Up!
        </h3>

        <p className="text-sm text-zinc-400 max-w-xs mb-6 leading-relaxed">
          You&apos;ve swiped through all available campus profiles in your discovery pool.
        </p>

        {/* Mutual Match Banner */}
        <div className="w-full max-w-xs p-4 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 mb-6 text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-zinc-300">Mutual Matches Found</span>
            <span className="text-sm font-bold text-[#f25f4c]">{matchesCount}</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-normal">
            Matches only unlock when both parties like each other. Coy keeps one-way crushes completely confidential.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={onViewMatches}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#e07a5f] to-[#f25f4c] text-white font-medium text-sm shadow-lg shadow-[#f25f4c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>View Mutual Matches ({matchesCount})</span>
          </button>

          <button
            onClick={onReset}
            className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium text-xs transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Deck (32 Profiles)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-between pb-2">
      {/* Card Deck Area */}
      <div className="relative w-full max-w-sm flex-1 flex items-center justify-center px-4 pt-2">
        <AnimatePresence>
          {/* Background Card (Preview of next profile in deck) */}
          {nextProfile && (
            <motion.div
              key={nextProfile.id}
              className="absolute w-[calc(100%-2rem)] max-w-sm pointer-events-none"
              initial={{ scale: 0.94, y: 14, opacity: 0.6 }}
              animate={{ scale: 0.95, y: 12, opacity: 0.75 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileCard profile={nextProfile} isFront={false} />
            </motion.div>
          )}

          {/* Active Front Card */}
          <motion.div
            key={currentProfile.id}
            className="absolute w-[calc(100%-2rem)] max-w-sm cursor-grab active:cursor-grabbing z-20"
            style={{
              x,
              rotate,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={
              swipingId === currentProfile.id
                ? {
                    x: swipeDirection === 'right' ? 600 : -600,
                    opacity: 0,
                    rotate: swipeDirection === 'right' ? 35 : -35,
                    transition: { duration: 0.35, ease: 'easeOut' },
                  }
                : {
                    scale: 1,
                    y: 0,
                    opacity: 1,
                  }
            }
          >
            <ProfileCard
              profile={currentProfile}
              isFront={true}
              likeOpacity={likeOpacity}
              nopeOpacity={nopeOpacity}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swipe Action Controls */}
      <div className="w-full max-w-sm px-8 py-3 flex items-center justify-center gap-6 z-20">
        {/* Pass Button */}
        <button
          type="button"
          onClick={() => triggerSwipe('pass')}
          disabled={!!swipingId}
          aria-label="Pass on profile"
          className="w-14 h-14 rounded-full bg-zinc-900 border-2 border-rose-500/40 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-lg shadow-rose-950/30 group"
        >
          <X className="w-7 h-7 group-hover:scale-110 transition-transform" />
        </button>

        {/* Like Button */}
        <button
          type="button"
          onClick={() => triggerSwipe('like')}
          disabled={!!swipingId}
          aria-label="Like profile"
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#e07a5f] to-[#f25f4c] text-white hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-xl shadow-[#f25f4c]/30 group"
        >
          <Heart className="w-8 h-8 fill-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};
