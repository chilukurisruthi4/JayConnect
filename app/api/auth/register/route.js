import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { eNumber, email, password, displayName, major } = body;

    console.log('Register attempt:', { eNumber, email, displayName, major });

    // Validate required fields
    if (!eNumber || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'E-Number, email, and password are required'
      }, { status: 400 });
    }

    // Normalize eNumber to uppercase for consistency
    const normalizedENumber = eNumber.toUpperCase();

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { eNumber: normalizedENumber },
          { email: email.toLowerCase() }
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
        eNumber: normalizedENumber,
        email: email.toLowerCase(),
        password,
        displayName,
        major
      }
    });

    console.log('User created successfully:', user.id);

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
    console.error('Registration error full details:', error.message, error.code);
    
    // Return a more specific error message
    let errorMessage = 'Failed to create account';
    if (error.code === 'P2002') {
      errorMessage = 'An account with this E-Number or email already exists';
    } else if (error.message?.includes('connect') || error.message?.includes('ECONNREFUSED')) {
      errorMessage = 'Database connection error. Please try again shortly.';
    }

    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: 500 });
  }
}
