# Coy Discover (Part B)

> A modern, mobile-first swipe discovery experience designed as a new **Discover** tab alongside Coy's signature double-blind crush matching platform for college students.

---

## 🌟 Overview & Coy Core Ethos

[Coy](https://app.getcoy.com/) is built around an uncompromising promise: **double-blind crush matching where attraction is revealed only when it is mutual**. There is zero rejection anxiety, and one-way crushes remain completely confidential.

This project implements **Part B: Build a "Discover" tab** — a standalone web app with:
1. A placeholder **Home** tab representing Coy's existing experience.
2. A full-featured **Discover** tab delivering an authentic swipe experience (Bumble/Tinder style) calibrated for college campus life.
3. A dedicated **Matches** tab and celebratory modal unlocking mutual crushes.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Coy's palette (warm slate, charcoal, rose gold `#E07A5F`, and coral `#F25F4C`)
- **Animation & Gestures**: [Framer Motion](https://www.framer.com/motion/) for physics-based card drag gestures, velocity thresholds, rotation interpolation, and smooth exit trajectories
- **Visual Celebration**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) for multi-stage particle celebrations upon mutual matches
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data & Persistence**: Server-side JSON persistence with atomic writes (`data/coy_db.json`), persisting swipes and matches across browser reloads.

---

## ✨ Features Implemented

### 1. Profile Data (32 Seeded Campus Profiles)
- Seeded with **32 authentic, college-aged profiles** across universities (Stanford, UC Berkeley, NYU Tisch, Columbia, MIT, UCLA, Harvard, Georgia Tech, USC, etc.).
- Each profile includes:
  - `id`, `name`, `age`
  - High-resolution portrait photograph
  - Realistic college bios highlighting creative projects, campus humor, and hobbies
  - University/College, Major, and Graduation Year
  - Distance in miles
  - Array of interests pills (e.g., *Film Photography, Architecture, Bouldering, Sourdough, Modular Synths, Matcha*)
- **Pre-seeded Mutual Crushes**: Several profiles (e.g., *Maya Lin*, *Elena Rostova*, *Julian Rivera*, *Devon Morales*, *Zara Al-Mansoor*) are seeded with `hasLikedUser: true` so matches trigger naturally during evaluation.

### 2. Swipe Experience & Card Gestures
- **Single-card focus** with realistic card stack depth (the next profile is previewed slightly scaled down behind the active card).
- **Mobile Touch & Mouse Drag Gestures**:
  - Horizontal drag with real-time card rotation (`[-20°, 20°]`).
  - Dynamic **LIKE** stamp overlay (green/cyan, fades in as dragged right).
  - Dynamic **NOPE** stamp overlay (rose/red, fades in as dragged left).
  - Drag threshold (>100px or >500px/s velocity) commits the swipe; below threshold snaps back with a spring animation.
- **Desktop Action Buttons**:
  - ❌ Pass (Red accent)
  - 💚 Like (Coral/rose accent)
  - ℹ️ Info / Expand drawer button to view full bio, academic major, and complete list of interests
  - 🔄 Reset Demo button
- **Deduplication**: Swiped profiles are recorded and **never appear again**.
- **Empty State**: When all profiles have been swiped, a polished empty state displays total likes, passes, and matches, with options to view matches or reset the demo.

### 3. Mutual Matching & Coy Privacy Guarantee
- **Double-Blind Matching**: A match happens **only** when both users have liked each other.
- **Privacy Rule**: The server strictly strips `hasLikedUser` before sending profiles to the client. The frontend has zero knowledge of who liked the user until a mutual match occurs.
- **"It's a Match!" Celebration Screen**:
  - Multi-stage confetti celebration
  - Interlocking circular avatars of the logged-in user and the matched profile with a bouncing glowing heart badge
  - Informative copy reminding users of Coy's zero-awkwardness privacy guarantee
  - "Keep Swiping" or "Say Hello in Matches" action buttons.

### 4. Mutual Matches View
- Lists all unlocked mutual matches with avatars, name, age, college, and timestamp (e.g., *"Just now"*, *"5m ago"*).
- Instant search filter by name, college, or interests.
- Interactive simulated chat modal with contextual icebreakers (e.g. *"Hey Maya! Saw you're into Architecture :)"*).

---

## 📡 Backend API Endpoints

The backend routes support both `/api/*` and rewrites to root paths (`/feed`, `/swipe`, `/matches`) as specified in the requirements:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /feed` or `GET /api/feed` | `GET` | Returns unswiped profiles. Strips `hasLikedUser` to preserve confidentiality. |
| `POST /swipe` or `POST /api/swipe` | `POST` | Records a swipe (`{ profileId, action: 'like' \| 'pass' }`). Returns `{ success: true, isMatch: boolean, match?: profile }`. |
| `GET /matches` or `GET /api/matches` | `GET` | Returns list of mutual matches. |
| `POST /api/reset` or `POST /reset` | `POST` | Resets the deck and matches back to default seeded state (helpful for repeat demos). |
| `GET /api/stats` | `GET` | Returns live stats (total, swiped, remaining, likes, passes, matches). |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20 & v24)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd coy

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## 🎯 Quick Demo Walkthrough

1. Open [http://localhost:3000](http://localhost:3000). You are automatically on the **Discover** tab.
2. The first profile is **Maya Lin** (Architecture major at Stanford).
3. **Swipe right** (drag right on mobile/trackpad, or click the heart button).
4. 🎉 **Boom! "It's a Match!"** appears with celebratory confetti and overlapping avatars because Maya has pre-liked the user.
5. Click **"Say Hello in Matches"** or tap the **Matches** tab at the bottom to view the mutual matches list and test the interactive chat icebreaker.
6. Return to **Discover** and swipe left on **Liam Chen** (Pass) — no match is created.
7. Click the **Reset Demo** button (top right or empty state) at any time to instantly restore all 32 profiles and test again.

---

## 🔒 Security & Privacy Implementation Note

In accordance with Coy's core promise, `hasLikedUser` exists strictly on the server:

```typescript
// lib/db.ts
export function sanitizeProfile(profile: Profile): ClientProfile {
  const { hasLikedUser, ...publicFields } = profile;
  return publicFields; // Private flags are NEVER serialized over the network
}
```

The matching decision occurs exclusively within `recordSwipe()` upon receiving a `'like'` action.
