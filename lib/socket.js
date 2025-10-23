const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('../models/database');
const { User, Message, Notification } = require('../models');

const connectedUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      next();
    });
  });

  io.on('connection', async (socket) => {
    console.log(`User ${socket.username} connected`);
    
    // Store user connection
    connectedUsers.set(socket.userId, socket);
    
    // Update user online status
    await User.findByIdAndUpdate(socket.userId, { isOnline: true });
    
    // Join user to their personal room
    socket.join(`user_${socket.userId}`);
    
    // Notify others that user is online
    socket.broadcast.emit('user_online', {
      userId: socket.userId,
      username: socket.username
    });
    
    // Handle private messages
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content, messageType = 'text' } = data;
        
        // Save message to database
        const message = new Message({
          senderId: socket.userId,
          receiverId,
          content,
          messageType
        });
        
        await message.save();
        
        // Send message to receiver if online
        const receiverSocket = connectedUsers.get(receiverId);
        if (receiverSocket) {
          receiverSocket.emit('receive_message', {
            id: message._id,
            senderId: socket.userId,
            senderUsername: socket.username,
            content: message.content,
            messageType: message.messageType,
            timestamp: message.timestamp
          });
          
          // Create notification
          const notification = new Notification({
            userId: receiverId,
            type: 'message',
            title: `New message from ${socket.username}`,
            content: message.content,
            data: { senderId: socket.userId, messageId: message._id }
          });
          
          await notification.save();
          
          receiverSocket.emit('new_notification', {
            id: notification._id,
            type: notification.type,
            title: notification.title,
            content: notification.content,
            timestamp: notification.timestamp
          });
        } else {
          // Create notification for offline user
          const notification = new Notification({
            userId: receiverId,
            type: 'message',
            title: `New message from ${socket.username}`,
            content: message.content,
            data: { senderId: socket.userId, messageId: message._id }
          });
          
          await notification.save();
        }
        
        // Send confirmation to sender
        socket.emit('message_sent', {
          id: message._id,
          timestamp: message.timestamp
        });
        
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`user_${data.receiverId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: true
      });
    });
    
    socket.on('typing_stop', (data) => {
      socket.to(`user_${data.receiverId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: false
      });
    });
    
    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User ${socket.username} disconnected`);
      
      // Remove user from connected users
      connectedUsers.delete(socket.userId);
      
      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, { 
        isOnline: false,
        lastSeen: new Date()
      });
      
      // Notify others that user is offline
      socket.broadcast.emit('user_offline', {
        userId: socket.userId,
        username: socket.username
      });
    });
  });

  return io;
};

module.exports = { initializeSocket, connectedUsers };
