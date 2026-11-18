'use client';

import React, { useState } from 'react';
import { MatchRecord } from '@/lib/db';
import { Heart, Search, MessageCircle, GraduationCap, MapPin, Sparkles, Send, X, ArrowLeft } from 'lucide-react';

interface MatchesViewProps {
  matches: MatchRecord[];
  onGoToDiscover: () => void;
  isLoading?: boolean;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onGoToDiscover,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);
  const [messages, setMessages] = useState<Record<string, Array<{ sender: 'me' | 'them'; text: string; time: string }>>>({});
  const [inputMessage, setInputMessage] = useState('');

  const filteredMatches = matches.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.profile.name.toLowerCase().includes(q) ||
      m.profile.college?.toLowerCase().includes(q) ||
      m.profile.city?.toLowerCase().includes(q) ||
      m.profile.interests.some((i) => i.toLowerCase().includes(q))
    );
  });

  const handleSendMessage = (profileId: string) => {
    if (!inputMessage.trim()) return;

    const newMsg = {
      sender: 'me' as const,
      text: inputMessage.trim(),
      time: 'Just now',
    };

    setMessages((prev) => ({
      ...prev,
      [profileId]: [...(prev[profileId] || []), newMsg],
    }));

    setInputMessage('');

    // Optional simulated friendly auto-reply after 1.5s
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [profileId]: [
          ...(prev[profileId] || []),
          {
            sender: 'them' as const,
            text: `Hey! So glad we both swiped right on Coy :) Love your profile!`,
            time: 'Just now',
          },
        ],
      }));
    }, 1200);
  };

  const formatMatchTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="w-full h-full flex flex-col px-4 py-2">
      {/* View Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Mutual Matches</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f25f4c]/20 text-[#f25f4c] border border-[#f25f4c]/30">
              {matches.length}
            </span>
          </h2>
          <p className="text-xs text-zinc-400">
            Double-blind crushes unlocked on Coy
          </p>
        </div>

        {matches.length > 0 && (
          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#e07a5f]" />
            <span>100% Confidential</span>
          </div>
        )}
      </div>

      {/* Search Bar (if matches > 2) */}
      {matches.length > 2 && (
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, college, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#f25f4c]/50 transition-colors"
          />
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-6 h-6 border-2 border-[#f25f4c] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-zinc-400">Loading your mutual matches...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && matches.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-zinc-600" />
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            No Mutual Matches Yet
          </h3>

          <p className="text-xs text-zinc-400 max-w-xs mb-6 leading-relaxed">
            Head to Discover and swipe right on people you like. Coy only reveals a match when you <strong className="text-zinc-200">both</strong> like each other.
          </p>

          <button
            onClick={onGoToDiscover}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#e07a5f] to-[#f25f4c] text-white font-medium text-xs shadow-lg shadow-[#f25f4c]/20 hover:scale-105 active:scale-95 transition-all"
          >
            Start Swiping in Discover
          </button>
        </div>
      )}

      {/* Matches Grid */}
      {!isLoading && matches.length > 0 && (
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 pb-20">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-10 text-xs text-zinc-500">
              No matches found for &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredMatches.map((m) => {
              const chatThread = messages[m.profileId] || [];
              const lastMsg = chatThread[chatThread.length - 1];

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className="p-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-white/10 transition-all cursor-pointer flex items-center gap-3.5 group shadow-md"
                >
                  {/* Photo avatar */}
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.profile.photo}
                      alt={m.profile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                  </div>

                  {/* Profile info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h4 className="text-sm font-bold text-white truncate">
                        {m.profile.name}, {m.profile.age}
                      </h4>
                      <span className="text-[10px] text-zinc-500 shrink-0">
                        {formatMatchTime(m.matchedAt)}
                      </span>
                    </div>

                    {m.profile.college && (
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 truncate mb-1">
                        <GraduationCap className="w-3 h-3 text-[#f25f4c] shrink-0" />
                        <span className="truncate">{m.profile.college}</span>
                      </div>
                    )}

                    {lastMsg ? (
                      <p className="text-[11px] text-[#e07a5f] truncate">
                        {lastMsg.sender === 'me' ? 'You: ' : ''}{lastMsg.text}
                      </p>
                    ) : (
                      <p className="text-[11px] text-zinc-500 truncate italic">
                        Mutual match! Tap to start conversation...
                      </p>
                    )}
                  </div>

                  {/* Message Action */}
                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#f25f4c] group-hover:text-white text-zinc-400 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Simulated Interactive Chat Modal for Demo */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm h-[520px] rounded-3xl bg-[#141620] border border-white/10 flex flex-col shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-zinc-900/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedMatch.profile.photo}
                    alt={selectedMatch.profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {selectedMatch.profile.name}
                  </h4>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Mutual Match</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMatch(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f1118]">
              {/* Mutual Match Banner */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center mb-2">
                <p className="text-[11px] text-zinc-400">
                  🎉 You both liked each other on Coy!
                </p>
                <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                  {selectedMatch.profile.interests.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages list */}
              {!(messages[selectedMatch.profileId]?.length) ? (
                <div className="text-center py-6 text-xs text-zinc-500 space-y-2">
                  <p>No messages yet. Send an icebreaker!</p>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        setInputMessage(`Hey ${selectedMatch.profile.name}! Saw you're into ${selectedMatch.profile.interests[0] || 'cool stuff'} :)`);
                      }}
                      className="text-[11px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-left border border-white/5 transition-colors"
                    >
                      💬 &quot;Hey {selectedMatch.profile.name}! Saw you&apos;re into {selectedMatch.profile.interests[0] || 'good coffee'} :)&quot;
                    </button>
                  </div>
                </div>
              ) : (
                messages[selectedMatch.profileId].map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs ${
                        msg.sender === 'me'
                          ? 'bg-[#f25f4c] text-white rounded-br-none'
                          : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-zinc-500 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-white/10 bg-zinc-900/90 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Message ${selectedMatch.profile.name}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(selectedMatch.profileId);
                }}
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#f25f4c]/50"
              />
              <button
                onClick={() => handleSendMessage(selectedMatch.profileId)}
                disabled={!inputMessage.trim()}
                className="p-2 rounded-xl bg-[#f25f4c] text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
