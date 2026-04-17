import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

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
        follower: { select: { id: true, displayName: true } },
        following: { select: { id: true, displayName: true } }
      }
    });

    return NextResponse.json({ success: true, connections });
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

    const connection = await prisma.connection.upsert({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      },
      update: {},
      create: {
        followerId,
        followingId
      }
    });

    return NextResponse.json({ success: true, connection }, { status: 201 });
  } catch (error) {
    console.error('Error updating connection:', error);
    return NextResponse.json({ success: false, error: 'Network update failed' }, { status: 500 });
  }
}
