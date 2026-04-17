import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Assumes lib/prisma.js exports prisma correctly

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let posts;
    if (type === 'project') {
      posts = await prisma.project.findMany({
        include: {
          user: {
            select: { displayName: true, avatarUrl: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      posts = await prisma.post.findMany({
        include: {
          author: {
            select: { displayName: true, avatarUrl: true }
          },
          _count: {
            select: { comments: true, likes: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
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
    const { content, title } = data;

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    let user = await prisma.user.findFirst({ where: { email: 'chilukurisruthi4@gmail.com' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          adUsername: 'schilukuri',
          displayName: 'Sruthi Chilukuri',
          email: 'chilukurisruthi4@gmail.com',
          bio: 'Building the future of JayConnect!'
        }
      });
    }

    const post = await prisma.post.create({
      data: {
        title: title || 'New Post',
        content,
        authorId: user.id
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
