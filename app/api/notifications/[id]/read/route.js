import { NextResponse } from 'next/server';
import connectDB from '@/models/database';
import { Notification } from '@/models';
import { authenticateToken } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const user = authenticateToken(request);
    const { id } = params;
    
    await Notification.findByIdAndUpdate(id, { isRead: true });
    
    return NextResponse.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
