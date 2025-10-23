import { NextResponse } from 'next/server';
import connectDB from '@/models/database';
import { Notification } from '@/models';
import { authenticateToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    const user = authenticateToken(request);
    
    const notifications = await Notification.find({ 
      userId: user.userId 
    }).sort({ timestamp: -1 }).limit(50);
    
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
