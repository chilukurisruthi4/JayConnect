import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const action = data.action || 'like'; // 'like' or 'unlike'
    const userId = data.userId;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID missing' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    if (action === 'like') {
      const existing = await prisma.like.findUnique({ where: { postId_userId: { postId: id, userId } } });
      if (!existing) {
        await prisma.like.create({ data: { postId: id, userId } });
      }
    } else {
      await prisma.like.deleteMany({ where: { postId: id, userId } });
    }

    const newLikesCount = await prisma.like.count({ where: { postId: id } });

    return NextResponse.json({ success: true, likes: newLikesCount });
  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json({ success: false, error: 'Failed to update like count in database' }, { status: 500 });
  }
}
