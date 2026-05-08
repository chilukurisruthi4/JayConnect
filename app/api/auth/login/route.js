import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { eNumber, password, major, action } = data;

    console.log('Login API called:', { eNumber, action, major });

    if (!eNumber || !password) {
      return NextResponse.json({ success: false, error: 'e-Number and Password are required' }, { status: 400 });
    }

    // Find user by eNumber
    console.log('Looking for user with eNumber:', eNumber);
    let user = await prisma.user.findFirst({
      where: { eNumber }
    });
    console.log('User found:', user ? 'YES' : 'NO');

    // LOGIN
    if (action === 'login') {
      if (!user) {
        return NextResponse.json({ success: false, error: 'Invalid e-Number. Please register first.' }, { status: 404 });
      }
      if (user.password !== password) {
        return NextResponse.json({ success: false, error: 'Incorrect password.' }, { status: 401 });
      }
      return NextResponse.json({ success: true, user });
    } 
    
    // RESET PASSWORD
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

    // REGISTER
    if (user) {
      return NextResponse.json({ success: false, error: 'e-Number already registered. Please login.' }, { status: 400 });
    }

    console.log('Creating new user...');
    // Create new user
    user = await prisma.user.create({
      data: {
        eNumber,
        password,
        email: `${eNumber}@elmhurst.edu`,
        adUsername: eNumber,
        displayName: `Student ${eNumber.substring(0,4)}`,
        major: major || 'Undecided Major',
      }
    });
    console.log('User created successfully:', user.id);

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('=== AUTH ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('==================');
    return NextResponse.json({ success: false, error: 'Internal Server Authentication Error' }, { status: 500 });
  }
}
