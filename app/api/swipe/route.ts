import { NextRequest, NextResponse } from 'next/server';
import { recordSwipe } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, action } = body;

    if (!profileId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing profileId or action' },
        { status: 400 }
      );
    }

    if (action !== 'like' && action !== 'pass') {
      return NextResponse.json(
        { success: false, error: 'Action must be "like" or "pass"' },
        { status: 400 }
      );
    }

    const result = recordSwipe(profileId, action);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to record swipe' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
      profileId,
      isMatch: result.isMatch,
      match: result.match || null
    });
  } catch (error) {
    console.error('Error recording swipe:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
