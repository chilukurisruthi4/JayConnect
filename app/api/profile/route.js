import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        displayName: true,
        eNumber: true,
        email: true,
        bio: true,
        major: true,
        avatarUrl: true,
        _count: { select: { posts: true, connections: true, connectedBy: true } }
      }
    });

    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { userId, displayName, bio, major, avatarUrl } = await request.json();
    if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(major !== undefined && { major }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      }
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}
