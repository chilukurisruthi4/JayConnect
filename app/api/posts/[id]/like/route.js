import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const action = data.action || 'like'; // 'like' or 'unlike'

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });

    const newLikes = action === 'like' ? post.likes + 1 : Math.max(0, post.likes - 1);

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { likes: newLikes }
    });

    return NextResponse.json({ success: true, likes: updatedPost.likes });
  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json({ success: false, error: 'Failed to update like count in database' }, { status: 500 });
  }
}
