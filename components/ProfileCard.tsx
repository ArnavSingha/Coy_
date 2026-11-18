'use client';

import React, { useState } from 'react';
import { ClientProfile } from '@/lib/db';
import { MapPin, GraduationCap, Info, ChevronDown, Sparkles } from 'lucide-react';
import { MotionValue, motion } from 'framer-motion';

interface ProfileCardProps {
  profile: ClientProfile;
  isFront?: boolean;
  likeOpacity?: MotionValue<number>;
  nopeOpacity?: MotionValue<number>;
}

// Coy signature pastel colors for interest pills
const PASTEL_COLORS = [
  'bg-[#e7e0ff]', // lilac
  'bg-[#cbf4e0]', // mint
  'bg-[#ffe1cf]', // peach
  'bg-[#ffe4ef]', // pink soft
  'bg-[#ffe45c]', // yellow
  'bg-[#d7ecff]', // sky
];

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isFront = false,
  likeOpacity,
  nopeOpacity,
}) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-[530px] sm:h-[570px] rounded-[28px] overflow-hidden bg-white border-[2.5px] border-[#15121d] shadow-[6px_6px_0_#15121d] select-none flex flex-col justify-end">
      {/* Background Image / Portrait */}
      {!imageError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.photo}
          alt={profile.name}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[#f6f4fa] flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-24 h-24 rounded-full bg-[#ff3d81] border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] mx-auto flex items-center justify-center text-3xl font-extrabold text-white mb-3">
              {profile.name.charAt(0)}
            </div>
            <p className="text-[#6d6979] text-xs font-semibold">Portrait representation</p>
          </div>
        </div>
      )}

      {/* Gradients for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#15121d] via-[#15121d]/45 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none" />

      {/* LIKE Stamp overlay (visible during right drag) */}
      {isFront && likeOpacity && (
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-8 z-30 pointer-events-none transform -rotate-12 border-[3.5px] border-[#0e8f48] text-[#0e8f48] bg-[#cbf4e0] font-black text-2xl sm:text-3xl px-4 py-1 rounded-2xl tracking-wider uppercase shadow-[3px_3px_0_#15121d]"
        >
          LIKE
        </motion.div>
      )}

      {/* NOPE Stamp overlay (visible during left drag) */}
      {isFront && nopeOpacity && (
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 right-8 z-30 pointer-events-none transform rotate-12 border-[3.5px] border-[#d92d3a] text-[#d92d3a] bg-[#ffe4ef] font-black text-2xl sm:text-3xl px-4 py-1 rounded-2xl tracking-wider uppercase shadow-[3px_3px_0_#15121d]"
        >
          NOPE
        </motion.div>
      )}

      {/* Top Coy Badges */}
      <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] text-[11px] font-bold text-[#15121d]">
          <Sparkles className="w-3.5 h-3.5 text-[#ff3d81]" />
          <span>Double-Blind</span>
        </div>
        {profile.distanceMiles && (
          <div className="px-2.5 py-1 rounded-full bg-[#e7e0ff]/95 backdrop-blur-sm border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] text-[11px] font-bold text-[#15121d] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#ff3d81]" />
            <span>{profile.distanceMiles} mi</span>
          </div>
        )}
      </div>

      {/* Bottom Profile Details Container */}
      <div className="relative p-5 sm:p-6 z-20 flex flex-col justify-end text-left pointer-events-auto">
        {/* Name and Age */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_3px_rgba(21,18,29,0.9)]">
            {profile.name}, <span className="font-semibold text-zinc-200">{profile.age}</span>
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullBio(!showFullBio);
            }}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-[#15121d] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
            title="Toggle details"
          >
            {showFullBio ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* College / Major info */}
        <div className="flex flex-col gap-0.5 mb-2.5 text-xs sm:text-sm text-zinc-100">
          {profile.college && (
            <div className="flex items-center gap-1.5 font-bold drop-shadow-[0_1px_2px_rgba(21,18,29,0.8)]">
              <GraduationCap className="w-4 h-4 text-[#ffe45c] shrink-0" />
              <span className="truncate">
                {profile.college} {profile.graduationYear ? `'${String(profile.graduationYear).slice(-2)}` : ''}
              </span>
            </div>
          )}
          {profile.major && (
            <div className="text-[12px] font-medium text-zinc-200 pl-5.5 truncate drop-shadow-[0_1px_2px_rgba(21,18,29,0.8)]">
              {profile.major}
            </div>
          )}
          {profile.city && !profile.college && (
            <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#ff3d81] shrink-0" />
              <span>{profile.city}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        <p className={`text-xs sm:text-[13px] text-zinc-100 font-medium leading-relaxed drop-shadow-[0_1px_2px_rgba(21,18,29,0.9)] transition-all duration-300 ${
          showFullBio ? 'line-clamp-none max-h-40 overflow-y-auto pr-1' : 'line-clamp-2'
        }`}>
          {profile.bio}
        </p>

        {/* Interests Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile.interests.slice(0, showFullBio ? profile.interests.length : 4).map((interest, idx) => {
            const colorClass = PASTEL_COLORS[idx % PASTEL_COLORS.length];
            return (
              <span
                key={interest}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${colorClass} text-[#15121d] border-1.5 border-[#15121d] shadow-[1.5px_1.5px_0_#15121d]`}
              >
                {interest}
              </span>
            );
          })}
          {!showFullBio && profile.interests.length > 4 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#15121d] border-1.5 border-[#15121d] shadow-[1.5px_1.5px_0_#15121d]">
              +{profile.interests.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
