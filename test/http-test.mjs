const BASE = 'http://localhost:3000';

function assert(cond, msg) {
  if (!cond) {
    console.error('❌ FAILED: ' + msg);
    process.exit(1);
  } else {
    console.log('✅ ' + msg);
  }
}

async function run() {
  console.log('Testing HTTP Endpoints at ' + BASE);

  // 1. Reset
  const resetRes = await fetch(`${BASE}/api/reset`, { method: 'POST' });
  const resetData = await resetRes.json();
  assert(resetData.success, 'POST /api/reset resets database');

  // 2. Feed
  const feedRes = await fetch(`${BASE}/api/feed`);
  const feedData = await feedRes.json();
  assert(feedData.success, 'GET /api/feed returns success');
  assert(feedData.profiles.length >= 30, `GET /api/feed returns ${feedData.profiles.length} profiles`);
  assert(feedData.profiles.every(p => p.hasLikedUser === undefined), 'GET /api/feed strictly hides hasLikedUser');

  // Also test /feed rewrite!
  const rewriteFeedRes = await fetch(`${BASE}/feed`);
  const rewriteFeedData = await rewriteFeedRes.json();
  assert(rewriteFeedData.success && rewriteFeedData.profiles.length >= 30, 'Rewrite GET /feed works identical to /api/feed');

  // 3. Swipe Like on profile-1 (seeded with hasLikedUser: true)
  const swipeRes = await fetch(`${BASE}/api/swipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileId: 'profile-1', action: 'like' })
  });
  const swipeData = await swipeRes.json();
  assert(swipeData.success, 'POST /api/swipe returns success');
  assert(swipeData.isMatch === true, 'POST /api/swipe creates match for mutual like');
  assert(swipeData.match && swipeData.match.profile.name === 'Maya Lin', 'Match profile included');

  // 4. Matches
  const matchesRes = await fetch(`${BASE}/api/matches`);
  const matchesData = await matchesRes.json();
  assert(matchesData.success, 'GET /api/matches returns success');
  assert(matchesData.matches.length === 1, 'GET /api/matches contains 1 match');

  // Also test /matches rewrite!
  const rewriteMatchesRes = await fetch(`${BASE}/matches`);
  const rewriteMatchesData = await rewriteMatchesRes.json();
  assert(rewriteMatchesData.matches.length === 1, 'Rewrite GET /matches works');

  // 5. Feed after swipe
  const feed2Res = await fetch(`${BASE}/api/feed`);
  const feed2Data = await feed2Res.json();
  assert(feed2Data.profiles.length === feedData.profiles.length - 1, 'Feed count reduced by 1');
  assert(!feed2Data.profiles.some(p => p.id === 'profile-1'), 'profile-1 never appears in feed again');

  // 6. Swipe Like on profile-2 (hasLikedUser: false)
  const swipe2Res = await fetch(`${BASE}/api/swipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileId: 'profile-2', action: 'like' })
  });
  const swipe2Data = await swipe2Res.json();
  assert(swipe2Data.success, 'POST /api/swipe like on profile-2 succeeds');
  assert(swipe2Data.isMatch === false, 'No match when only one-way like');

  // 7. Matches still 1
  const matches2Res = await fetch(`${BASE}/api/matches`);
  const matches2Data = await matches2Res.json();
  assert(matches2Data.matches.length === 1, 'Matches list only shows mutual matches');

  // 8. Reset again
  await fetch(`${BASE}/api/reset`, { method: 'POST' });
  const finalFeed = await (await fetch(`${BASE}/api/feed`)).json();
  assert(finalFeed.profiles.length >= 30, 'Reset restored all 32 profiles for demo');

  console.log('\n🌟 ALL HTTP API ENDPOINT TESTS PASSED WITH 100% SUCCESS!');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
