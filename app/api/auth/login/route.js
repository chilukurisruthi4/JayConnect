import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { eNumber, password, major, action } = data;

    if (!eNumber || !password) {
      return NextResponse.json({ success: false, error: 'e-Number and Password are required' }, { status: 400 });
    }

    // Since we added eNumber later, we use findFirst because it might not be explicitly populated yet on old users
    let user = await prisma.user.findFirst({
      where: { eNumber }
    });

    if (action === 'login') {
      if (!user) {
        return NextResponse.json({ success: false, error: 'Invalid e-Number. Please register first.' }, { status: 404 });
      }
      if (user.password !== password) {
        return NextResponse.json({ success: false, error: 'Incorrect password.' }, { status: 401 });
      }
      return NextResponse.json({ success: true, user });
    } 
    
    // Reset Password
    if (action === 'reset') {
      if (!user) {
        return NextResponse.json({ success: false, error: 'No account found matching this e-Number.' }, { status: 404 });
      }
      user = await prisma.user.update({
        where: { id: user.id },
        data: { password }
      });
      return NextResponse.json({ success: true, user });
    }

    // Register
    if (user) {
      return NextResponse.json({ success: false, error: 'e-Number already registered. Please login.' }, { status: 400 });
    }

    // Create a new securely mapped user
    user = await prisma.user.create({
      data: {
        eNumber,
        password,
        email: `${eNumber}@elmhurst.edu`, // Mock generation mapped to e-Number
        adUsername: eNumber,
        displayName: `Student ${eNumber.substring(0,4)}`,
        major: major || 'Undecided Major',
      }
    });

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Authentication Error' }, { status: 500 });
  }
}
