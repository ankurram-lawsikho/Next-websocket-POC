import { NextResponse } from 'next/server';
import connectDB from '@/models/database';
import { Message, Notification, User } from '@/models';
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

export async function POST(request, { params }) {
  try {
    await connectDB();
    
    const user = authenticateToken(request);
    const { userId } = params;
    const { content, messageType = 'text' } = await request.json();
    
    // Validate input
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }
    
    // Check if receiver exists
    const receiver = await User.findById(userId);
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }
    
    // Create message
    const message = new Message({
      senderId: user.userId,
      receiverId: userId,
      content: content.trim(),
      messageType
    });
    
    await message.save();
    
    // Create notification for receiver
    const notification = new Notification({
      userId: userId,
      type: 'message',
      title: `New message from ${user.username}`,
      content: content.trim(),
      data: { senderId: user.userId, messageId: message._id }
    });
    
    await notification.save();
    
    // Return the created message
    return NextResponse.json({
      message: 'Message sent successfully',
      data: {
        id: message._id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        messageType: message.messageType,
        timestamp: message.timestamp,
        isRead: message.isRead
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Send message error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
