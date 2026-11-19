# Coy — Assignment (Part A & Part B)

> Built for the Coy Engineering & Product Assignment.  
> Target reference: [app.getcoy.com](https://app.getcoy.com/)

---

## 📋 Table of Contents
1. [Part A: Product Analysis & Two Core Feature Suggestions](#-part-a-product-analysis--two-core-feature-suggestions)
   - [Feature 1: Multi-Identifier "Smart Alias Linking"](#feature-1-multi-identifier-smart-alias-linking-solving-the-contact-mismatch-bottleneck)
   - [Feature 2: Verified "Circle Hints" on Anonymous Invites](#feature-2-verified-circle-hints-on-anonymous-invite-notifications-solving-the-cold-spam-bottleneck)
2. [Part B: Standalone "Discover" Tab](#-part-b-build-a-discover-tab)
   - [Overview & Coy Ethos](#overview--coy-ethos)
   - [Tech Stack](#tech-stack)
   - [Features Implemented](#features-implemented)
   - [Backend API Endpoints](#backend-api-endpoints)
   - [Double-Blind Security & Privacy Note](#security--privacy-guarantee)
   - [Local Setup & Demo Guide](#getting-started)
   - [Automated Verification Results](#automated-verification)

---

## 🔍 Part A: Product Analysis & Two Core Feature Suggestions

Having signed up and explored Coy at [app.getcoy.com](https://app.getcoy.com) across:
- **Phone OTP login**
- **Adding a crush** (permanent slot lock)
- **Email verification**
- **The invite link & anonymous notification**
- **The extra-slots screen**

Here are **two core features** designed to address Coy's fundamental growth, activation, and privacy dilemmas:

---

### Feature 1: Multi-Identifier "Smart Alias Linking" (Solving the Contact Mismatch Bottleneck)

#### What It Is
Allow users to verify and link multiple contact identifiers to their single Coy profile in a secure "My Identifiers" vault:
1. Primary Phone Number
2. Alternate / WhatsApp Number (crucial for international/out-of-state students)
3. College / Campus Email (`.edu` domain)
4. Personal Email (`@gmail.com`)
5. Instagram Handle (`@username`)

When User A enters *any* of those identifiers to add User B, Coy matches against salted cryptographic hashes (`HMAC-SHA256`) of all verified aliases linked to User B’s account.

#### Why This Feature Is Required
* **The Problem (Identity Fragmentation in College Life):**  
  In modern campus circles, students rarely communicate through a single channel. You might know your lab partner’s college email (`alex@stanford.edu`), an acquaintance’s Instagram handle (`@alex_rivera`), and an old friend’s phone number.  
  Currently, if **User A adds User B by Instagram handle or college email**, but **User B signed up using their personal phone number**, **the match will NEVER happen**, even if User B adds User A back using User A’s phone number! This causes silent false-negatives and broken matches.
* **Retention & Trust Impact:**  
  When students spend one of their few limited crush slots and nothing happens, they assume the feeling is unrequited—when in reality, the system simply failed to link two different handles belonging to the same person.
* **Privacy-Safe Implementation:**  
  All aliases are normalized and stored as one-way salted hashes. Coy never reveals to User A which identifier matched User B; it simply confirms a mutual match when both parties have targeted any valid alias belonging to the other.

---

### Feature 2: Verified "Circle Hints" on Anonymous Invite Notifications (Solving the Cold-Spam Bottleneck)

#### What It Is
When an anonymous crush notification is dispatched via WhatsApp or SMS (*"Someone who has your contact has a crush on you on Coy..."*), allow the sender to optionally attach **one coarse-grained, verified macro-context tag** from a system-curated list:
- 🎓 *"Someone from your college / university"* (verified via `.edu` email)
- 📚 *"Someone in your graduating class / cohort"* (e.g. Class of '26)
- 🎪 *"Someone you met at a campus event / fest"*
- 👥 *"Someone in your mutual contact circle"*

#### Why This Feature Is Required
* **The Problem (Spam Skepticism & Slot Paralysis):**  
  The biggest friction in Coy’s viral acquisition loop is the **conversion rate of the anonymous notification**. When a young adult receives an unsolicited text saying *"Someone has a crush on you"*, their initial reaction is often skepticism: *"Is this a scam? A bot? A stranger from high school?"*  
  Furthermore, because Coy limits crush slots (3–5 free slots before reaching the paid extra-slots screen), recipients are terrified of wasting their slots guessing blindly among their 500+ phone contacts.
* **Why the Coarse Hint Fixes It:**  
  A verified hint like *"Someone at Stanford"* or *"Someone in your Class of '26 cohort"* immediately transforms a suspicious generic ping into **an irresistible, high-stakes campus mystery**. It narrows the mental search space from "everyone I've ever met" to "people on my campus", giving the recipient the confidence to sign up, claim their free slots, and actively participate.
* **Zero Privacy Leakage:**  
  Because the tags are strictly macro-level (never micro-locations like dorm rooms, majors, or first initials), it remains statistically impossible for the recipient to dedup or dox the sender, completely safeguarding Coy's core double-blind promise.

---

## 📱 Part B: Build a "Discover" Tab

A standalone, mobile-first swipe discovery feature built directly beside Coy's existing experience, styled in Coy's signature **Bricolage Grotesque neobrutalist aesthetic**.

---

### Overview & Coy Ethos
[Coy](https://app.getcoy.com/) is built around an uncompromising promise: **double-blind crush matching where attraction is revealed only when it is mutual**. There is zero rejection anxiety, and one-way crushes remain completely confidential.

This project implements:
1. A placeholder **Home** tab representing Coy's existing contact-based experience.
2. A full-featured **Discover** tab delivering an authentic swipe experience (Bumble/Tinder style) calibrated for college campus life.
3. A dedicated **Matches** tab and celebratory modal unlocking mutual crushes.

---

### Tech Stack
- **Frontend**: [Next.js](https://nextjs.org/) 15 (App Router, React 19), Mobile-first container
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) reproducing Coy's exact tokens:
  - Backgrounds: `#ffffff` & `#f6f4fa`
  - Signature Coy Pink: `#ff3d81`
  - Borders: 2px/2.5px solid `#15121d` with 3px/5px hard drop shadows
  - Typography: Bricolage Grotesque
- **Animation & Gestures**: [Framer Motion](https://www.framer.com/motion/) for physics-based card drag gestures, velocity thresholds, rotation interpolation, and smooth exit trajectories
- **Visual Celebration**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) for multi-stage particle celebrations upon mutual matches
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data & Persistence**: Server-side JSON persistence with atomic writes (`data/coy_db.json`), persisting swipes and matches across browser reloads.

---

### Features Implemented

#### 1. Profile Data (32 Seeded Campus Profiles)
- Seeded with **32 authentic, college-aged profiles** across universities (Stanford, UC Berkeley, NYU Tisch, Columbia, MIT, UCLA, Harvard, Georgia Tech, USC, etc.).
- Each profile includes:
  - `id`, `name`, `age`
  - High-resolution portrait photograph (with fallback)
  - Realistic college bios highlighting creative projects, campus humor, and hobbies
  - University/College, Major, and Graduation Year
  - Distance in miles
  - Array of interests pills in Coy's pastel palette (*Film Photography, Architecture, Bouldering, Sourdough, Modular Synths, Matcha*)
- **Pre-seeded Mutual Crushes**: Several profiles (*Maya Lin*, *Elena Rostova*, *Julian Rivera*, *Devon Morales*, *Zara Al-Mansoor*) are seeded with `hasLikedUser: true` so matches trigger naturally during evaluation.

#### 2. Swipe Experience & Card Gestures
- **Single-card focus** with realistic card stack depth (the next profile is previewed slightly scaled down behind the active card).
- **Mobile Touch & Mouse Drag Gestures**:
  - Horizontal drag with real-time card rotation (`[-18°, 18°]`).
  - Dynamic **LIKE** stamp overlay (green/mint, fades in as dragged right).
  - Dynamic **NOPE** stamp overlay (red/pink, fades in as dragged left).
  - Drag threshold (>100px or >500px/s velocity) commits the swipe; below threshold snaps back with a spring animation.
- **Desktop Action Controls**:
  - ❌ Pass (Red accent)
  - 💚 Like (Coy hot pink `#ff3d81`)
  - ℹ️ Info / Expand drawer button to view full bio, academic major, and complete list of interests
  - 🔄 Reset Demo button
- **Deduplication**: Swiped profiles are recorded and **never appear again**.
- **Empty State**: When all profiles have been swiped, a polished empty state displays total likes, passes, and matches, with options to view matches or reset the demo.

#### 3. Mutual Matching & "It's a Match!" Celebration
- **Double-Blind Matching**: A match happens **only** when both users have liked each other.
- **Privacy Rule**: The server strictly strips `hasLikedUser` before sending profiles to the client. The frontend has zero knowledge of who liked the user until a mutual match occurs.
- **Celebration Modal**:
  - Multi-stage confetti celebration
  - Interlocking circular avatars of the logged-in user and the matched profile with a bouncing glowing heart badge
  - Informative copy reminding users of Coy's zero-awkwardness privacy guarantee
  - "Keep Swiping" or "Say Hello in Matches" action buttons.

#### 4. Mutual Matches View
- Lists all unlocked mutual matches with avatars, name, age, college, and timestamp (*"Just now"*, *"5m ago"*).
- Instant search filter by name, college, or interests.
- Interactive simulated chat modal with contextual icebreakers (e.g. *"Hey Maya! Saw you're into Architecture :)"*).

---

### Backend API Endpoints

The backend routes support both root paths and `/api/*` via Next.js rewrites:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /feed` or `GET /api/feed` | `GET` | Returns unswiped profiles. Strips `hasLikedUser` to preserve confidentiality. |
| `POST /swipe` or `POST /api/swipe` | `POST` | Records a swipe (`{ profileId, action: 'like' \| 'pass' }`). Returns `{ success: true, isMatch: boolean, match?: profile }`. |
| `GET /matches` or `GET /api/matches` | `GET` | Returns list of mutual matches. |
| `POST /api/reset` or `POST /reset` | `POST` | Resets the deck and matches back to default seeded state (helpful for repeat demos). |
| `GET /api/stats` | `GET` | Returns live stats (total, swiped, remaining, likes, passes, matches). |

---

### Security & Privacy Guarantee

In strict accordance with Coy's core promise, `hasLikedUser` is **never exposed over the network**:

```typescript
// lib/db.ts
export function sanitizeProfile(profile: Profile): ClientProfile {
  const { hasLikedUser, ...publicFields } = profile;
  return publicFields; // Private flags are NEVER serialized over the network
}
```

The matching decision occurs exclusively on the server within `recordSwipe()` upon receiving a `'like'` action.

---

### Getting Started

#### Prerequisites
- Node.js 18+
- npm or pnpm

#### Installation & Run
```bash
# Clone the repository
git clone https://github.com/ArnavSingha/Coy_.git
cd coy

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Build for Production
```bash
npm run build
npm start
```

---

### Automated Verification

All 12 backend verification suites pass with 100% success (`node test/verify.js`):
```text
✅ Reset database succeeds (32 seeded profiles)
✅ Feed returns all unswiped profiles
✅ Privacy Guarantee: hasLikedUser is NEVER exposed in feed
✅ Profile schema completeness (name, age, photo, bio, college/city, interests)
✅ Mutual match triggered when both like each other
✅ Swiped profile never appears in feed again
✅ Matches endpoint returns mutual match
✅ No match created if like is one-way (Coy double-blind rule)
✅ Pass swipe recorded successfully and never matches
✅ Only mutual matches revealed
✅ Stats track swipes, likes, passes, and matches accurately
✅ Reset restores all profiles to feed
```
