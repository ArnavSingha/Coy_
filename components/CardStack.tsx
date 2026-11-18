'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ClientProfile, MatchRecord } from '@/lib/db';
import { ProfileCard } from './ProfileCard';
import { X, Heart, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

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
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const likeOpacity = useTransform(x, [25, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-25, -110], [0, 1]);

  const currentProfile = profiles[0];
  const nextProfile = profiles[1];

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (!currentProfile) return;

    const threshold = 100;
    const velocityThreshold = 500;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      triggerSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      triggerSwipe('pass');
    } else {
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
      x.set(0);
      setSwipingId(null);
      setSwipeDirection(null);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[380px] h-[520px] rounded-[28px] bg-white border-2 border-[#15121d] shadow-[5px_5px_0_#15121d] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#ff3d81] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-[#6d6979] font-bold">Finding campus profiles...</p>
        </div>
      </div>
    );
  }

  // Empty state when all profiles have been swiped
  if (!currentProfile) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-[#cbf4e0] border-2 border-[#15121d] shadow-[4px_4px_0_#15121d] flex items-center justify-center mb-5 relative">
          <CheckCircle2 className="w-10 h-10 text-[#0e8f48]" />
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#ffe45c] border-2 border-[#15121d] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#15121d]" />
          </div>
        </div>

        <h3 className="text-2xl font-extrabold text-[#15121d] tracking-tight mb-2">
          You&apos;re All Caught Up!
        </h3>

        <p className="text-sm text-[#6d6979] max-w-xs mb-6 font-medium leading-relaxed">
          You&apos;ve swiped through all available discovery profiles on campus.
        </p>

        {/* Mutual Match Banner */}
        <div className="w-full max-w-xs p-4 rounded-2xl bg-[#f6f4fa] border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] mb-6 text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#15121d]">Mutual Matches Unlocked</span>
            <span className="text-base font-black px-2 py-0.5 rounded-full bg-[#ff3d81] text-white border border-[#15121d]">
              {matchesCount}
            </span>
          </div>
          <p className="text-[11px] text-[#6d6979] font-medium leading-normal">
            Matches only unlock when both students like each other. Unmatched crushes remain 100% confidential.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={onViewMatches}
            className="w-full py-3.5 rounded-full bg-[#ff3d81] hover:bg-[#ff5a94] text-white font-extrabold text-sm border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white text-white" />
            <span>View Mutual Matches ({matchesCount})</span>
          </button>

          <button
            onClick={onReset}
            className="w-full py-3 rounded-full bg-white hover:bg-[#f6f4fa] text-[#15121d] font-bold text-xs border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
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
      <div className="relative w-full max-w-[390px] flex-1 flex items-center justify-center px-4 pt-2">
        <AnimatePresence>
          {/* Background Card Preview */}
          {nextProfile && (
            <motion.div
              key={nextProfile.id}
              className="absolute w-[calc(100%-2rem)] max-w-[370px] pointer-events-none"
              initial={{ scale: 0.94, y: 14, opacity: 0.8 }}
              animate={{ scale: 0.95, y: 12, opacity: 0.85 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileCard profile={nextProfile} isFront={false} />
            </motion.div>
          )}

          {/* Active Front Card */}
          <motion.div
            key={currentProfile.id}
            className="absolute w-[calc(100%-2rem)] max-w-[370px] cursor-grab active:cursor-grabbing z-20"
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
                    rotate: swipeDirection === 'right' ? 30 : -30,
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
      <div className="w-full max-w-[380px] px-8 py-3 flex items-center justify-center gap-7 z-20">
        {/* Pass Button */}
        <button
          type="button"
          onClick={() => triggerSwipe('pass')}
          disabled={!!swipingId}
          aria-label="Pass on profile"
          className="w-14 h-14 rounded-full bg-white hover:bg-[#ffe4ef] text-[#d92d3a] border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center group"
        >
          <X className="w-7 h-7 stroke-[2.5] group-hover:scale-110 transition-transform" />
        </button>

        {/* Like Button (Coy Signature Pink) */}
        <button
          type="button"
          onClick={() => triggerSwipe('like')}
          disabled={!!swipingId}
          aria-label="Like profile"
          className="w-16 h-16 rounded-full bg-[#ff3d81] hover:bg-[#ff5a94] text-white border-2 border-[#15121d] shadow-[4px_4px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center group"
        >
          <Heart className="w-8 h-8 fill-white text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};
