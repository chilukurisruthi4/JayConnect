import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let whereClause = {};
    if (userId) {
      whereClause.userId = userId;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        user: {
          select: { displayName: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ success: false, error: 'Database fetch failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, description, githubUrl, liveUrl, userId } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description are required' }, { status: 400 });
    }

    let strictId = userId;
    if (!strictId) {
      const user = await prisma.user.findFirst({ where: { email: 'chilukurisruthi4@gmail.com' } });
      if (user) strictId = user.id;
      else return NextResponse.json({ success: false, error: 'Parent model mapping null' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        userId: strictId
      },
      include: {
        user: { select: { displayName: true, avatarUrl: true } }
      }
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}
