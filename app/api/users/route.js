import { NextResponse } from 'next/server';
import connectDB from '@/models/database';
import { User } from '@/models';
import { authenticateToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    const user = authenticateToken(request);
    
    const users = await User.find(
      { _id: { $ne: user.userId } },
      { password: 0 }
    ).sort({ isOnline: -1, username: 1 });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
