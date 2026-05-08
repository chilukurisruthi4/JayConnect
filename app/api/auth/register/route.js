import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const { eNumber, email, password, displayName, major } = await request.json();

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { eNumber: eNumber },
          { email: email }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: 'An account with this E-Number or email already exists' 
      }, { status: 400 });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        eNumber,
        email,
        password, // In production, you should hash this!
        displayName,
        major
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        eNumber: user.eNumber,
        email: user.email,
        displayName: user.displayName,
        major: user.major
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create account' 
    }, { status: 500 });
  }
}
