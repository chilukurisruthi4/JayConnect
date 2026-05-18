import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [totalUsers, totalPosts, totalLikes, totalComments, users] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.like.count(),
      prisma.comment.count(),
      prisma.user.groupBy({
        by: ['major'],
        _count: true
      })
    ]);

    const usersByMajor = users.reduce((acc, u) => {
      if (u.major) acc[u.major] = u._count;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalPosts,
        totalLikes,
        totalComments,
        usersByMajor
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load analytics' }, { status: 500 });
  }
}
