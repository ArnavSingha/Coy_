'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ClientProfile, MatchRecord } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { TabBar } from '@/components/TabBar';
import { CardStack } from '@/components/CardStack';
import { MatchesView } from '@/components/MatchesView';
import { HomeTab } from '@/components/HomeTab';
import { MatchModal } from '@/components/MatchModal';

export default function CoyDiscoverApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'matches'>('discover');
  const [profiles, setProfiles] = useState<ClientProfile[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [latestMatch, setLatestMatch] = useState<MatchRecord | null>(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch feed profiles from /api/feed (or /feed)
  const fetchFeed = useCallback(async () => {
    setIsLoadingFeed(true);
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.success && Array.isArray(data.profiles)) {
        setProfiles(data.profiles);
      }
    } catch (err) {
      console.error('Failed to fetch feed:', err);
      showToast('Could not load profiles');
    } finally {
      setIsLoadingFeed(false);
    }
  }, []);

  // Fetch matches from /api/matches (or /matches)
  const fetchMatches = useCallback(async () => {
    setIsLoadingMatches(true);
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (data.success && Array.isArray(data.matches)) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchFeed();
    fetchMatches();
  }, [fetchFeed, fetchMatches]);

  // Handle swipe action (like or pass)
  const handleSwipe = async (profileId: string, action: 'like' | 'pass') => {
    // Optimistically remove from local card deck
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));

    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, action }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.isMatch && data.match) {
          // It's a mutual match!
          setMatches((prev) => [data.match, ...prev.filter((m) => m.profileId !== profileId)]);
          setLatestMatch(data.match);
        }
      } else {
        console.error('Swipe error:', data.error);
        showToast(data.error || 'Failed to record swipe');
      }
    } catch (err) {
      console.error('Swipe request failed:', err);
      showToast('Network error while swiping');
    }
  };

  // Reset database back to 32 seeded profiles
  const handleReset = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await Promise.all([fetchFeed(), fetchMatches()]);
        showToast('Demo reset! 32 fresh profiles loaded');
      }
    } catch (err) {
      console.error('Failed to reset demo:', err);
      showToast('Reset failed');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="w-full max-w-[480px] mx-auto min-h-screen h-[100dvh] flex flex-col bg-white border-x-2 border-[#15121d] shadow-[0_0_50px_rgba(21,18,29,0.08)] relative overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 inset-x-6 z-50 py-2.5 px-4 rounded-2xl bg-[#15121d] text-white border-2 border-[#15121d] shadow-[3px_3px_0_#ff3d81] text-xs font-bold text-center animate-fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchesCount={matches.length}
        onReset={handleReset}
        isResetting={isResetting}
      />

      {/* Main Tab Content */}
      <section className="flex-1 overflow-hidden relative pb-16 bg-[#faf9fc]">
        {activeTab === 'home' && (
          <HomeTab onGoToDiscover={() => setActiveTab('discover')} />
        )}

        {activeTab === 'discover' && (
          <CardStack
            profiles={profiles}
            onSwipe={handleSwipe}
            onMatch={(match) => setLatestMatch(match)}
            onReset={handleReset}
            onViewMatches={() => setActiveTab('matches')}
            matchesCount={matches.length}
            isLoading={isLoadingFeed}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            onGoToDiscover={() => setActiveTab('discover')}
            isLoading={isLoadingMatches}
          />
        )}
      </section>

      {/* Bottom Mobile Tab Bar */}
      <TabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchesCount={matches.length}
      />

      {/* "It's a Match!" Celebration Modal */}
      <MatchModal
        match={latestMatch}
        onClose={() => setLatestMatch(null)}
        onViewMatches={() => {
          setLatestMatch(null);
          setActiveTab('matches');
        }}
      />
    </main>
  );
}
