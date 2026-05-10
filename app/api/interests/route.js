import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/interests?userId=...
// Returns all INTEREST-type notifications sent BY this user (posts they've expressed interest in)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    const interests = await prisma.notification.findMany({
      where: {
        senderId: userId,
        type: 'INTEREST'
      },
      select: {
        postId: true,
        createdAt: true
      }
    });

    return NextResponse.json({ success: true, interests });
  } catch (error) {
    console.error('Interests fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch interests' }, { status: 500 });
  }
}
