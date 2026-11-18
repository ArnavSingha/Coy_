'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MatchRecord } from '@/lib/db';
import { CURRENT_LOGGED_IN_USER } from '@/data/seed-profiles';
import { Heart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchModalProps {
  match: MatchRecord | null;
  onClose: () => void;
  onViewMatches: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  match,
  onClose,
  onViewMatches,
}) => {
  useEffect(() => {
    if (match) {
      // Fire celebratory confetti bursts
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#f25f4c', '#e07a5f', '#ffffff'],
      });
      fire(0.2, {
        spread: 60,
        colors: ['#e76f51', '#f4a261', '#2a9d8f'],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#f25f4c', '#ffd166', '#ef476f'],
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [match]);

  if (!match) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1c1f2e] via-[#141622] to-[#0c0d14] border border-white/15 p-6 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-60 bg-[#f25f4c]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Coy Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold text-[#f25f4c] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mutual Match Unlocked</span>
          </div>

          {/* Header Title */}
          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-[#f25f4c] tracking-tight mb-2">
            It&apos;s a Match!
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed">
            You and <span className="font-semibold text-white">{match.profile.name}</span> both liked each other on Coy.
          </p>

          {/* Double Avatars with Heart Badge */}
          <div className="relative flex items-center justify-center py-4 mb-6">
            {/* User Avatar */}
            <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-xl -mr-4 bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CURRENT_LOGGED_IN_USER.photo}
                alt={CURRENT_LOGGED_IN_USER.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Glowing Intersecting Heart */}
            <div className="relative z-20 w-11 h-11 rounded-full bg-gradient-to-tr from-[#e07a5f] to-[#f25f4c] border-2 border-white flex items-center justify-center shadow-lg shadow-[#f25f4c]/50 animate-bounce">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>

            {/* Matched Profile Avatar */}
            <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-xl -ml-4 bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={match.profile.photo}
                alt={match.profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Core Coy Value Statement */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 text-left mb-6">
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <strong className="text-zinc-200">Coy Privacy Guarantee:</strong> Neither of you knew the other liked you until both of you swiped right. Zero awkwardness, 100% mutual.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onViewMatches}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#e07a5f] to-[#f25f4c] text-white font-semibold text-sm shadow-xl shadow-[#f25f4c]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Say Hello in Matches</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 font-medium text-xs transition-all"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
