import fs from 'fs';
import path from 'path';
import { Profile, SEED_PROFILES, CURRENT_LOGGED_IN_USER } from '../data/seed-profiles';

export interface ClientProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  college?: string;
  city?: string;
  interests: string[];
  distanceMiles?: number;
  graduationYear?: number;
  major?: string;
}

export interface SwipeRecord {
  profileId: string;
  action: 'like' | 'pass';
  timestamp: string;
}

export interface MatchRecord {
  id: string;
  profileId: string;
  matchedAt: string;
  profile: ClientProfile;
}

interface DatabaseSchema {
  version: number;
  profiles: Profile[];
  swipes: Record<string, SwipeRecord>;
  matches: MatchRecord[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'coy_db.json');

// Helper to sanitize profile and strip private flags
export function sanitizeProfile(profile: Profile): ClientProfile {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hasLikedUser, ...publicFields } = profile;
  return publicFields;
}

// In-memory cache + file sync
let memoryDb: DatabaseSchema | null = null;

function ensureDataDirExists() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function initDb(): DatabaseSchema {
  ensureDataDirExists();

  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.profiles)) {
        return parsed as DatabaseSchema;
      }
    } catch (err) {
      console.error('Error reading coy_db.json, re-initializing seed data:', err);
    }
  }

  const initialData: DatabaseSchema = {
    version: 1,
    profiles: [...SEED_PROFILES],
    swipes: {},
    matches: []
  };

  saveDbToFile(initialData);
  return initialData;
}

function saveDbToFile(data: DatabaseSchema) {
  try {
    ensureDataDirExists();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

function getDb(): DatabaseSchema {
  if (!memoryDb) {
    memoryDb = initDb();
  }
  return memoryDb;
}

/**
 * Returns all profiles the user has not swiped on yet.
 * Strips private `hasLikedUser` field to preserve Coy's strict double-blind privacy.
 */
export function getFeedProfiles(): ClientProfile[] {
  const db = getDb();
  const unswiped = db.profiles.filter(p => !db.swipes[p.id]);
  return unswiped.map(sanitizeProfile);
}

/**
 * Records a swipe (like or pass) for a given profile.
 * If user likes a profile that has already liked the user, creates a mutual match!
 */
export function recordSwipe(profileId: string, action: 'like' | 'pass'): {
  success: boolean;
  isMatch: boolean;
  match?: MatchRecord;
  error?: string;
} {
  const db = getDb();
  const profile = db.profiles.find(p => p.id === profileId);

  if (!profile) {
    return { success: false, isMatch: false, error: 'Profile not found' };
  }

  const timestamp = new Date().toISOString();
  db.swipes[profileId] = {
    profileId,
    action,
    timestamp
  };

  let isMatch = false;
  let matchRecord: MatchRecord | undefined = undefined;

  // Double-blind matching rule: Only match if both users have liked each other!
  if (action === 'like' && profile.hasLikedUser) {
    isMatch = true;
    const existingMatch = db.matches.find(m => m.profileId === profileId);

    if (!existingMatch) {
      matchRecord = {
        id: `match-${profileId}-${Date.now()}`,
        profileId,
        matchedAt: timestamp,
        profile: sanitizeProfile(profile)
      };
      db.matches.unshift(matchRecord);
    } else {
      matchRecord = existingMatch;
    }
  }

  saveDbToFile(db);

  return {
    success: true,
    isMatch,
    match: matchRecord
  };
}

/**
 * Returns all mutual matches.
 * Only returns matches where both users have liked each other.
 */
export function getMatches(): MatchRecord[] {
  const db = getDb();
  return [...db.matches];
}

/**
 * Resets the database back to initial seed state.
 * Useful for demo and testing.
 */
export function resetDatabase(): { success: boolean; totalProfiles: number } {
  memoryDb = {
    version: 1,
    profiles: [...SEED_PROFILES],
    swipes: {},
    matches: []
  };
  saveDbToFile(memoryDb);
  return { success: true, totalProfiles: SEED_PROFILES.length };
}

/**
 * Helper to get user overview/stats
 */
export function getStats() {
  const db = getDb();
  const total = db.profiles.length;
  const swiped = Object.keys(db.swipes).length;
  const remaining = total - swiped;
  const matchesCount = db.matches.length;
  const likesCount = Object.values(db.swipes).filter(s => s.action === 'like').length;
  const passesCount = Object.values(db.swipes).filter(s => s.action === 'pass').length;

  return {
    total,
    swiped,
    remaining,
    matchesCount,
    likesCount,
    passesCount,
    user: CURRENT_LOGGED_IN_USER
  };
}
