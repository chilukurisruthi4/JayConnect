import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

// GET: fetch all unread notifications for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });

    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId, read: false },
      include: {
        sender: { select: { id: true, displayName: true, eNumber: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error('Notification fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// POST: create a notification
export async function POST(request) {
  try {
    const { recipientId, senderId, type, message, postId } = await request.json();
    if (!recipientId || !senderId || !type || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    // Don't notify yourself
    if (recipientId === senderId) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const notification = await prisma.notification.create({
      data: { recipientId, senderId, type, message, postId: postId || null }
    });

    return NextResponse.json({ success: true, notification }, { status: 201 });
  } catch (error) {
    console.error('Notification create error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create notification' }, { status: 500 });
  }
}

// PATCH: mark a notification as read
export async function PATCH(request) {
  try {
    const { notificationId, userId } = await request.json();
    await prisma.notification.updateMany({
      where: { id: notificationId, recipientId: userId },
      data: { read: true }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to mark as read' }, { status: 500 });
  }
}
