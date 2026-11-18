'use client';

import React, { useState } from 'react';
import { MatchRecord } from '@/lib/db';
import { Heart, Search, MessageCircle, GraduationCap, Sparkles, Send, X, ArrowLeft } from 'lucide-react';

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

    // Friendly simulated reply
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [profileId]: [
          ...(prev[profileId] || []),
          {
            sender: 'them' as const,
            text: `Hey! So excited we both swiped right on Coy :) Love your profile!`,
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
    <div className="w-full h-full flex flex-col px-5 py-3">
      {/* View Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#15121d] tracking-tight flex items-center gap-2">
            <span>Mutual Matches</span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#ffe4ef] border-1.5 border-[#15121d] text-[#15121d] shadow-[1px_1px_0_#15121d]">
              {matches.length}
            </span>
          </h2>
          <p className="text-xs text-[#6d6979] font-medium">
            Double-blind crushes unlocked on Coy
          </p>
        </div>

        {matches.length > 0 && (
          <div className="text-[11px] font-bold text-[#6d6979] flex items-center gap-1 bg-[#f6f4fa] px-2.5 py-1 rounded-full border border-[#15121d]">
            <Sparkles className="w-3 h-3 text-[#ff3d81]" />
            <span>Confidential</span>
          </div>
        )}
      </div>

      {/* Search Bar (if matches > 1) */}
      {matches.length > 1 && (
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-[#6d6979] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, college, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f6f4fa] border-2 border-[#15121d] text-xs font-medium text-[#15121d] placeholder:text-[#6d6979] focus:outline-none focus:bg-white transition-colors"
          />
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-6 h-6 border-3 border-[#ff3d81] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-[#6d6979] font-bold">Loading your mutual matches...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && matches.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-18 h-18 rounded-full bg-[#ffe4ef] border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-[#ff3d81]" />
          </div>

          <h3 className="text-lg font-extrabold text-[#15121d] mb-1.5">
            No Mutual Matches Yet
          </h3>

          <p className="text-xs text-[#6d6979] font-medium max-w-xs mb-6 leading-relaxed">
            Head to Discover and swipe right on people you like. Coy only reveals a match when you <strong className="text-[#15121d]">both</strong> like each other.
          </p>

          <button
            onClick={onGoToDiscover}
            className="px-6 py-3 rounded-full bg-[#ff3d81] hover:bg-[#ff5a94] text-white font-extrabold text-xs border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            Start Swiping in Discover
          </button>
        </div>
      )}

      {/* Matches Grid */}
      {!isLoading && matches.length > 0 && (
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 pb-20">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#6d6979] font-bold">
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
                  className="p-3.5 rounded-2xl bg-white hover:bg-[#f6f4fa] border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer flex items-center gap-3.5 group"
                >
                  {/* Photo avatar */}
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-[#15121d] bg-[#f6f4fa]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.profile.photo}
                      alt={m.profile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#0e8f48] border-2 border-white" />
                  </div>

                  {/* Profile info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h4 className="text-sm font-extrabold text-[#15121d] truncate">
                        {m.profile.name}, {m.profile.age}
                      </h4>
                      <span className="text-[10px] font-bold text-[#6d6979] shrink-0">
                        {formatMatchTime(m.matchedAt)}
                      </span>
                    </div>

                    {m.profile.college && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#6d6979] truncate mb-1">
                        <GraduationCap className="w-3.5 h-3.5 text-[#ff3d81] shrink-0" />
                        <span className="truncate">{m.profile.college}</span>
                      </div>
                    )}

                    {lastMsg ? (
                      <p className="text-[11px] font-bold text-[#ff3d81] truncate">
                        {lastMsg.sender === 'me' ? 'You: ' : ''}{lastMsg.text}
                      </p>
                    ) : (
                      <p className="text-[11px] font-medium text-[#6d6979] truncate italic">
                        Mutual crush! Tap to start conversation...
                      </p>
                    )}
                  </div>

                  {/* Message Action */}
                  <div className="p-2.5 rounded-xl bg-[#ffe4ef] group-hover:bg-[#ff3d81] group-hover:text-white text-[#15121d] border-1.5 border-[#15121d] shadow-[1.5px_1.5px_0_#15121d] transition-all">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#15121d]/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[390px] h-[520px] rounded-[30px] bg-white border-[2.5px] border-[#15121d] shadow-[8px_8px_0_#15121d] flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b-2 border-[#15121d] bg-[#f6f4fa] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="p-1 rounded-full text-[#6d6979] hover:text-[#15121d] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#15121d] bg-white shadow-[1.5px_1.5px_0_#15121d]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedMatch.profile.photo}
                    alt={selectedMatch.profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#15121d]">
                    {selectedMatch.profile.name}
                  </h4>
                  <div className="text-[10px] font-bold text-[#0e8f48] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#0e8f48]" />
                    <span>Mutual Match</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMatch(null)}
                className="w-8 h-8 rounded-full bg-white border-2 border-[#15121d] flex items-center justify-center text-[#15121d] shadow-[1.5px_1.5px_0_#15121d]"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf9fc]">
              {/* Mutual Match Banner */}
              <div className="p-3 rounded-2xl bg-[#e7e0ff] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] text-center mb-2">
                <p className="text-[11px] font-extrabold text-[#15121d]">
                  🎉 You both liked each other on Coy!
                </p>
                <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                  {selectedMatch.profile.interests.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#15121d] text-[#15121d]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages list */}
              {!(messages[selectedMatch.profileId]?.length) ? (
                <div className="text-center py-6 text-xs text-[#6d6979] space-y-2">
                  <p className="font-semibold">No messages yet. Send an icebreaker!</p>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        setInputMessage(`Hey ${selectedMatch.profile.name}! Saw you're into ${selectedMatch.profile.interests[0] || 'good vibes'} :)`);
                      }}
                      className="text-[11px] font-bold px-3 py-2 rounded-xl bg-white hover:bg-[#ffe4ef] text-[#15121d] text-left border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] transition-all"
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
                      className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs font-semibold ${
                        msg.sender === 'me'
                          ? 'bg-[#ff3d81] text-white border-2 border-[#15121d] rounded-br-none shadow-[2px_2px_0_#15121d]'
                          : 'bg-white text-[#15121d] border-2 border-[#15121d] rounded-bl-none shadow-[2px_2px_0_#15121d]'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-bold text-[#6d6979] mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t-2 border-[#15121d] bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder={`Message ${selectedMatch.profile.name}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(selectedMatch.profileId);
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#f6f4fa] border-2 border-[#15121d] text-xs font-medium text-[#15121d] placeholder:text-[#6d6979] focus:outline-none focus:bg-white"
              />
              <button
                onClick={() => handleSendMessage(selectedMatch.profileId)}
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl bg-[#ff3d81] text-white border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] disabled:opacity-40 active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
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
