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
      const count = 180;
      const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ff3d81', '#ffe45c', '#15121d'] });
      fire(0.2, { spread: 60, colors: ['#e7e0ff', '#cbf4e0', '#ff3d81'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#ff3d81', '#ffe4ef', '#0e8f48'] });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [match]);

  if (!match) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15121d]/75 backdrop-blur-sm animate-fade-in">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-[390px] rounded-[32px] bg-white border-[2.5px] border-[#15121d] p-6 text-center shadow-[8px_8px_0_#15121d] relative overflow-hidden"
        >
          {/* Pastel Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe4ef] border-2 border-[#15121d] shadow-[1.5px_1.5px_0_#15121d] text-[11px] font-black text-[#15121d] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#ff3d81]" />
            <span>Mutual Match Unlocked</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-black text-[#15121d] tracking-tight mb-2">
            It&apos;s a Match!
          </h2>

          <p className="text-xs sm:text-sm text-[#6d6979] font-medium mb-6 leading-relaxed">
            You and <span className="font-extrabold text-[#15121d]">{match.profile.name}</span> both liked each other on Coy.
          </p>

          {/* Double Avatars with Intersecting Heart */}
          <div className="relative flex items-center justify-center py-4 mb-6">
            {/* User Avatar */}
            <div className="relative z-10 w-22 h-22 rounded-full overflow-hidden border-3 border-[#15121d] shadow-[3px_3px_0_#15121d] -mr-4 bg-[#f6f4fa]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CURRENT_LOGGED_IN_USER.photo}
                alt={CURRENT_LOGGED_IN_USER.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Glowing Intersecting Heart Badge */}
            <div className="relative z-20 w-11 h-11 rounded-full bg-[#ff3d81] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] flex items-center justify-center animate-bounce">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>

            {/* Matched Profile Avatar */}
            <div className="relative z-10 w-22 h-22 rounded-full overflow-hidden border-3 border-[#15121d] shadow-[3px_3px_0_#15121d] -ml-4 bg-[#f6f4fa]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={match.profile.photo}
                alt={match.profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Coy Privacy Guarantee */}
          <div className="p-3.5 rounded-2xl bg-[#f6f4fa] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] text-left mb-6">
            <p className="text-[11px] text-[#6d6979] font-medium leading-relaxed">
              <strong className="text-[#15121d]">Coy Privacy Guarantee:</strong> Neither of you knew the other had a crush until you both liked each other. Zero awkwardness, 100% mutual.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onViewMatches}
              className="w-full py-3.5 rounded-full bg-[#ff3d81] hover:bg-[#ff5a94] text-white font-extrabold text-sm border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Say Hello in Matches</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-[#f6f4fa] hover:bg-[#ece9f2] text-[#15121d] font-bold text-xs border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
