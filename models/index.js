const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Check if models are already compiled
let User, Message, Notification;

if (mongoose.models.User) {
  User = mongoose.models.User;
} else {
  const userSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now }
  }, { timestamps: true });
  
  User = mongoose.model('User', userSchema);
}

if (mongoose.models.Message) {
  Message = mongoose.models.Message;
} else {
  const messageSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
  }, { timestamps: true });
  
  Message = mongoose.model('Message', messageSchema);
}

if (mongoose.models.Notification) {
  Notification = mongoose.models.Notification;
} else {
  const notificationSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    userId: { type: String, required: true },
    type: { type: String, enum: ['message', 'mention', 'system'], required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now }
  }, { timestamps: true });
  
  Notification = mongoose.model('Notification', notificationSchema);
}

module.exports = {
  User,
  Message,
  Notification
};
