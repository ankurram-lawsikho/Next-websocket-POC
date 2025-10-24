const mongoose = require('mongoose');

// Check if models are already compiled
let User, Message, Notification, Conversation;

if (mongoose.models.User) {
  User = mongoose.models.User;
} else {
  User = require('./User');
}

if (mongoose.models.Message) {
  Message = mongoose.models.Message;
} else {
  Message = require('./Message');
}

if (mongoose.models.Notification) {
  Notification = mongoose.models.Notification;
} else {
  Notification = require('./Notification');
}

if (mongoose.models.Conversation) {
  Conversation = mongoose.models.Conversation;
} else {
  Conversation = require('./Conversation');
}

module.exports = {
  User,
  Message,
  Notification,
  Conversation
};
