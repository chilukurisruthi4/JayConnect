import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: { select: { id: true, displayName: true, avatarUrl: true } },
        receiver: { select: { id: true, displayName: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ success: false, error: 'Database fetch failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { senderId, receiverId, content } = await request.json();

    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ success: false, error: 'Missing required message parameters' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId
      },
      include: {
        sender: { select: { id: true, displayName: true, avatarUrl: true } },
        receiver: { select: { id: true, displayName: true, avatarUrl: true } }
      }
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}
