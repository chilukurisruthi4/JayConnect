import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: { displayName: true, eNumber: true }
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

    // Find the organizer by eNumber or id
    const organizer = await prisma.user.findFirst({
      where: { OR: [{ eNumber: organizerId }, { id: organizerId }] }
    });

    if (!organizer) {
      return NextResponse.json({ success: false, error: 'Organizer not found' }, { status: 404 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        eventDate: new Date(eventDate),
        organizerENumber: organizer.eNumber
      },
      include: {
        organizer: { select: { displayName: true, eNumber: true } }
      }
    });

    // Fan-out: notify ALL other users about this new event
    const allUsers = await prisma.user.findMany({
      where: { id: { not: organizer.id } },
      select: { id: true }
    });

    const organizerName = organizer.displayName || organizer.eNumber || 'Someone';
    const eventDateStr = new Date(eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const notifMessage = `📅 New event: "${title}" on ${eventDateStr} — posted by ${organizerName}`;

    if (allUsers.length > 0) {
      await prisma.notification.createMany({
        data: allUsers.map(u => ({
          recipientId: u.id,
          senderId: organizer.id,
          type: 'NEW_EVENT',
          message: notifMessage,
          postId: null
        }))
      });
    }

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, error: 'Failed to construct event in database' }, { status: 500 });
  }
}
