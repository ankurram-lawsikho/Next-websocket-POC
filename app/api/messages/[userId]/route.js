import { NextResponse } from 'next/server';
import connectDB from '@/models/database';
import { Message } from '@/models';
import { authenticateToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const user = authenticateToken(request);
    const { userId } = params;
    
    const messages = await Message.find({
      $or: [
        { senderId: user.userId, receiverId: userId },
        { senderId: userId, receiverId: user.userId }
      ]
    }).sort({ timestamp: 1 });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
