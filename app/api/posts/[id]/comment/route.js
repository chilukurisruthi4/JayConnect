import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: {
        author: {
          select: { displayName: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ success: false, error: 'Database fetch failed' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { content, authorId } = await request.json();

    if (!content || !authorId) {
      return NextResponse.json({ success: false, error: 'Missing comment string or active user properties' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post parent not found' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId,
      },
      include: {
        author: {
          select: { displayName: true, avatarUrl: true }
        }
      }
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ success: false, error: 'Internal server error mapping comment entity' }, { status: 500 });
  }
}
