import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: {
        author: {
          select: { displayName: true, adUsername: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { content, authorId } = await request.json();

    if (!content || !authorId) {
      return NextResponse.json({ success: false, error: 'Content and authorId required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId
      },
      include: {
        author: {
          select: { displayName: true, adUsername: true, avatarUrl: true }
        }
      }
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 });
  }
}
