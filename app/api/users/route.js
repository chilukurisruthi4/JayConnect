import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        bio: true,
        avatarUrl: true
      },
      orderBy: { displayName: 'asc' }
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users from the database' }, { status: 500 });
  }
}
