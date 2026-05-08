export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const majorsParam = searchParams.get('majors') || searchParams.get('major');

    let posts;
    if (type === 'project') {
      posts = await prisma.project.findMany({
        include: {
          user: {
            select: { displayName: true, avatarUrl: true, major: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      // Filter by major if provided
      if (majorsParam) {
        posts = posts.filter(p => p.user?.major === majorsParam);
      }
    } else {
      const userId = searchParams.get('userId');
      
      // Build where clause for filtering by author's major
      const whereClause = {};
      if (majorsParam) {
        whereClause.author = { major: majorsParam };
      }
      
      posts = await prisma.post.findMany({
        where: whereClause,
        include: {
          author: {
            select: { displayName: true, avatarUrl: true, adUsername: true, bio: true, major: true }
          },
          ...(userId ? { likes: { where: { userId } } } : {}),
          _count: {
            select: { comments: true, likes: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      if (userId) {
        posts = posts.map(p => ({ ...p, isLiked: p.likes && p.likes.length > 0 }));
      }
    }

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Database fetch error:', error);
    return NextResponse.json({ success: false, error: 'Database fetch failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { content, title, userId } = data;

    if (!content || !userId) {
      return NextResponse.json({ success: false, error: 'Content and userId are required' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: title || 'New Post',
        content,
        authorId: userId
      },
      include: {
        author: { select: { displayName: true, avatarUrl: true } }
      }
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, error: 'Failed to create post against schema models' }, { status: 500 });
  }
}
