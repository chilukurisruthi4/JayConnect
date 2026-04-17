import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request) {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: { fullName: true, role: true }
        }
      },
      orderBy: { eventDate: 'asc' }
    });
    
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events from database' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, description, location, eventDate, organizerId } = data;

    if (!title || !eventDate || !organizerId) {
      return NextResponse.json({ success: false, error: 'Missing required event parameters' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        eventDate: new Date(eventDate),
        organizerENumber: organizerId
      },
      include: {
        organizer: {
          select: { fullName: true, role: true }
        }
      }
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, error: 'Failed to construct event in database' }, { status: 500 });
  }
}
