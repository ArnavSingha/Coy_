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

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isFront = false,
  likeOpacity,
  nopeOpacity,
}) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-[540px] sm:h-[580px] rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/10 select-none">
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
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-coral-500 to-[#e07a5f] mx-auto flex items-center justify-center text-3xl font-bold text-white mb-3">
              {profile.name.charAt(0)}
            </div>
            <p className="text-zinc-400 text-sm">Portrait representation</p>
          </div>
        </div>
      )}

      {/* Dynamic Gradients for depth and legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* LIKE Stamp overlay (visible during right drag) */}
      {isFront && likeOpacity && (
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-8 z-30 pointer-events-none transform -rotate-12 border-4 border-emerald-400 text-emerald-400 font-black text-2xl sm:text-3xl px-4 py-1.5 rounded-xl tracking-wider uppercase bg-black/40 backdrop-blur-sm shadow-lg shadow-emerald-500/20"
        >
          LIKE
        </motion.div>
      )}

      {/* NOPE Stamp overlay (visible during left drag) */}
      {isFront && nopeOpacity && (
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 right-8 z-30 pointer-events-none transform rotate-12 border-4 border-rose-500 text-rose-500 font-black text-2xl sm:text-3xl px-4 py-1.5 rounded-xl tracking-wider uppercase bg-black/40 backdrop-blur-sm shadow-lg shadow-rose-500/20"
        >
          NOPE
        </motion.div>
      )}

      {/* Top subtle badge: Double-Blind Coy discovery */}
      <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-medium text-zinc-300">
          <Sparkles className="w-3 h-3 text-[#f25f4c]" />
          <span>Anonymous Discover</span>
        </div>
        {profile.distanceMiles && (
          <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-coral-400" />
            <span>{profile.distanceMiles} mi</span>
          </div>
        )}
      </div>

      {/* Bottom Profile Details Container */}
      <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 flex flex-col justify-end text-left pointer-events-auto">
        {/* Name and Age */}
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
            {profile.name}, <span className="font-light text-zinc-300">{profile.age}</span>
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullBio(!showFullBio);
            }}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white transition-all transform hover:scale-105 active:scale-95"
            title="Toggle details"
          >
            {showFullBio ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* College / Major / Location info */}
        <div className="flex flex-col gap-1 mb-3 text-xs sm:text-sm text-zinc-300">
          {profile.college && (
            <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
              <GraduationCap className="w-4 h-4 text-[#f25f4c] shrink-0" />
              <span className="truncate">
                {profile.college} {profile.graduationYear ? `'${String(profile.graduationYear).slice(-2)}` : ''}
              </span>
            </div>
          )}
          {profile.major && (
            <div className="text-[12px] text-zinc-400 pl-5.5 truncate">
              {profile.major}
            </div>
          )}
          {profile.city && !profile.college && (
            <div className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-coral-400 shrink-0" />
              <span>{profile.city}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        <p className={`text-xs sm:text-sm text-zinc-200/90 leading-relaxed transition-all duration-300 ${
          showFullBio ? 'line-clamp-none max-h-40 overflow-y-auto pr-1' : 'line-clamp-2'
        }`}>
          {profile.bio}
        </p>

        {/* Interests Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile.interests.slice(0, showFullBio ? profile.interests.length : 4).map((interest) => (
            <span
              key={interest}
              className="text-[11px] font-medium px-2.5 py-0.8 rounded-full bg-white/15 backdrop-blur-md text-zinc-200 border border-white/10"
            >
              {interest}
            </span>
          ))}
          {!showFullBio && profile.interests.length > 4 && (
            <span className="text-[11px] font-medium px-2 py-0.8 rounded-full bg-white/10 text-zinc-400">
              +{profile.interests.length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
