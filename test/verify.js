const { getFeedProfiles, recordSwipe, getMatches, resetDatabase, getStats } = require('../dist/lib/db.js');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log('🧪 Starting Coy Discover Verification Tests...\n');

  // Test 1: Reset database
  const resetRes = resetDatabase();
  assert(resetRes.success === true, 'Reset database succeeds');
  assert(resetRes.totalProfiles >= 30, `Database contains >= 30 seeded profiles (found: ${resetRes.totalProfiles})`);

  // Test 2: Feed profiles
  const feed = getFeedProfiles();
  assert(feed.length >= 30, `Feed returns all unswiped profiles (count: ${feed.length})`);

  // Test 3: Privacy check - Never reveal who has liked user
  const leakedFlag = feed.some(p => p.hasLikedUser !== undefined);
  assert(!leakedFlag, 'Privacy Guarantee: hasLikedUser is NEVER exposed in feed');

  // Test 4: Profile schema completeness
  const sample = feed[0];
  assert(sample.id && sample.name && sample.age && sample.photo && sample.bio && sample.interests,
    'Profile has required fields: id, name, age, photo, bio, interests');
  assert(Array.isArray(sample.interests) && sample.interests.length > 0, 'Interests is a populated array');

  // Test 5: Swiping like on profile that liked user -> creates mutual match!
  // Profile 1 (Maya Lin) was seeded with hasLikedUser: true
  const matchSwipe = recordSwipe('profile-1', 'like');
  assert(matchSwipe.success === true, 'Swipe recorded successfully');
  assert(matchSwipe.isMatch === true, 'Mutual match triggered when both like each other');
  assert(matchSwipe.match && matchSwipe.match.profile.id === 'profile-1', 'Match object returned with profile');

  // Test 6: Swiped profile never appears in feed again
  const feedAfterSwipe = getFeedProfiles();
  assert(feedAfterSwipe.length === feed.length - 1, 'Feed count decremented by 1');
  assert(!feedAfterSwipe.some(p => p.id === 'profile-1'), 'Swiped profile never appears in feed again');

  // Test 7: Matches endpoint returns mutual match
  const matches = getMatches();
  assert(matches.length === 1, `Matches list has 1 mutual match (count: ${matches.length})`);
  assert(matches[0].profile.name === 'Maya Lin', 'Mutual match matches profile-1');

  // Test 8: Swiping like on profile that has NOT liked user -> no match!
  // Profile 2 (Liam Chen) was seeded with hasLikedUser: false
  const nonMatchSwipe = recordSwipe('profile-2', 'like');
  assert(nonMatchSwipe.success === true, 'Swipe recorded successfully');
  assert(nonMatchSwipe.isMatch === false, 'No match created if like is one-way (Coy double-blind rule)');

  // Test 9: Swiping pass on profile 4
  const passSwipe = recordSwipe('profile-4', 'pass');
  assert(passSwipe.success === true, 'Pass swipe recorded successfully');
  assert(passSwipe.isMatch === false, 'Pass never creates match');

  // Test 10: Matches endpoint still only contains mutual match
  const matchesAfterAll = getMatches();
  assert(matchesAfterAll.length === 1, 'Only mutual matches revealed (one-way likes remain secret)');

  // Test 11: Stats check
  const stats = getStats();
  assert(stats.swiped === 3, 'Stats accurately track 3 swipes');
  assert(stats.likesCount === 2, 'Stats accurately track 2 likes');
  assert(stats.passesCount === 1, 'Stats accurately track 1 pass');
  assert(stats.matchesCount === 1, 'Stats accurately track 1 match');

  // Test 12: Clean reset
  resetDatabase();
  const feedClean = getFeedProfiles();
  const matchesClean = getMatches();
  assert(feedClean.length >= 30, 'Reset restored all profiles to feed');
  assert(matchesClean.length === 0, 'Reset cleared matches');

  console.log('\n🎉 ALL 12 VERIFICATION SUITES PASSED WITH 100% SUCCESS!\n');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
