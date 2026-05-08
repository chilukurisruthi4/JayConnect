import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { action, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    if (action === 'like') {
      await prisma.like.create({
        data: {
          postId: id,
          userId: userId
        }
      });
    } else if (action === 'unlike') {
      await prisma.like.deleteMany({
        where: {
          postId: id,
          userId: userId
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update like' }, { status: 500 });
  }
}
