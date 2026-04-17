import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { email, action } = data;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email parameter required' }, { status: 400 });
    }

    // "Login" mocks authenticating the email. "Register" mocks creating the user context.
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      if (action === 'login') {
        return NextResponse.json({ success: false, error: 'No account found matching this email. Please register.' }, { status: 404 });
      } else {
        const username = email.split('@')[0];
        const fullName = username.split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ') || 'New User';
        
        user = await prisma.user.create({
          data: {
            email,
            adUsername: username,
            displayName: fullName,
          }
        });
      }
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Authentication Error' }, { status: 500 });
  }
}
