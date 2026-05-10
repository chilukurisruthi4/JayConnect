import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/posts/[id]/like
// Body: { action: 'like' | 'unlike', userId: string }
export async function POST(request, { params }) {
  try {
    const { id } = await params;  // await params in Next.js 16
    // Note: postId and userId are UUIDs (strings) in the schema - do NOT parseInt
    
    const { action, userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }
    
    if (action === 'like') {
      // Use upsert to avoid duplicate like errors
      await prisma.like.upsert({
        where: {
          postId_userId: {
            postId: id,
            userId: userId
          }
        },
        update: {},
        create: {
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
