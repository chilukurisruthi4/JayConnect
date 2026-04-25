import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { followerId: userId },
          { followingId: userId }
        ]
      },
      include: {
        follower: { select: { id: true, displayName: true, eNumber: true } },
        following: { select: { id: true, displayName: true, eNumber: true } }
      }
    });

    // Pending requests directed TO this user (they need to accept)
    const pendingIncoming = connections.filter(
      c => c.followingId === userId && c.status === 'PENDING'
    );

    return NextResponse.json({ success: true, connections, pendingIncoming });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch network' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { followerId, followingId, action } = await request.json();

    if (!followerId || !followingId) {
      return NextResponse.json({ success: false, error: 'Missing ID parameters' }, { status: 400 });
    }

    if (action === 'disconnect') {
      await prisma.connection.deleteMany({
        where: {
          OR: [
            { followerId, followingId },
            { followerId: followingId, followingId: followerId }
          ]
        }
      });
      return NextResponse.json({ success: true, status: 'disconnected' });
    }

    if (action === 'accept') {
      // followerId = person who sent the request, followingId = person accepting
      const updated = await prisma.connection.updateMany({
        where: { followerId, followingId: followingId, status: 'PENDING' },
        data: { status: 'ACCEPTED' }
      });
      return NextResponse.json({ success: true, status: 'ACCEPTED', updated });
    }

    // Default: create new PENDING connection request
    const connection = await prisma.connection.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      update: {},
      create: { followerId, followingId, status: 'PENDING' }
    });

    return NextResponse.json({ success: true, connection }, { status: 201 });
  } catch (error) {
    console.error('Error updating connection:', error);
    return NextResponse.json({ success: false, error: 'Network update failed' }, { status: 500 });
  }
}
