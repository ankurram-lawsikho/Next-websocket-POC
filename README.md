# Next.js Messaging App with WebSockets and MongoDB

A real-time messaging and notification application built with Next.js, Express, Socket.IO, and MongoDB. Features instant messaging, real-time notifications, and a modern responsive UI.

## ✨ Features

- 🔐 **User Authentication** - Register and login with JWT tokens
- 💬 **Real-time Messaging** - Instant chat with WebSocket connections
- 🔔 **Notifications** - Real-time notifications for new messages
- 👥 **User Management** - Online/offline status tracking
- 📱 **Responsive Design** - Modern UI with custom CSS
- ⚡ **Real-time Typing Indicators** - See when someone is typing
- 🎨 **Modern UI** - Clean and intuitive interface
- ⚡ **Instant Message Display** - Messages appear immediately when sent
- 🔄 **Message History** - Persistent message storage in MongoDB

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Custom CSS
- **Backend**: Express.js, Socket.IO
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT for secure sessions
- **Styling**: Custom CSS (Tailwind-inspired utilities)
- **Real-time**: Socket.IO for WebSocket connections

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-websockets-POC
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/messaging-app
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
   PORT=3001
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open `http://localhost:3000` in your browser
   - Register a new account or login
   - Start messaging!

## Running the Application

### Development Mode

Run both the Express server and Next.js client concurrently:

```bash
npm run dev
```

This will start:
- Express server on `http://localhost:3001`
- Next.js client on `http://localhost:3000`

### Production Mode

1. Build the Next.js application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
├── app/                           # Next.js app directory
│   ├── api/                      # API routes (Next.js)
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/route.js    # Login endpoint
│   │   │   └── register/route.js # Registration endpoint
│   │   ├── users/route.js        # Users API
│   │   ├── messages/[userId]/route.js # Messages API
│   │   └── notifications/        # Notifications API
│   ├── globals.css               # Custom CSS styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/                    # React components
│   ├── ChatInterface.tsx         # Main chat interface
│   ├── ChatWindow.tsx            # Chat window component
│   ├── LoginForm.tsx             # Authentication form
│   ├── NotificationPanel.tsx     # Notifications panel
│   └── UserList.tsx              # User list component
├── contexts/                      # React contexts
│   ├── AuthContext.tsx           # Authentication context
│   └── SocketContext.tsx         # WebSocket context
├── lib/                          # Utility libraries
│   ├── auth.js                   # Authentication utilities
│   └── socket.js                 # Socket.IO handler
├── models/                       # Database models
│   ├── database.js               # MongoDB connection
│   └── index.js                  # Shared model exports
├── server.js                     # Socket.IO server
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (requires authentication)

### Messages
- `GET /api/messages/:userId` - Get messages with a specific user

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## 🔄 Architecture Overview

### Frontend (Next.js)
- **App Router**: Uses Next.js 14 app directory structure
- **API Routes**: RESTful endpoints in `app/api/`
- **Components**: React components with TypeScript
- **Contexts**: Authentication and Socket.IO state management
- **Custom CSS**: Tailwind-inspired utility classes

### Backend (Express + Socket.IO)
- **Socket.IO Server**: Handles real-time WebSocket connections
- **Authentication**: JWT-based token verification
- **Database**: MongoDB with Mongoose ODM
- **Models**: Shared model system to prevent compilation errors

### Real-time Communication
- **WebSocket Events**: Bidirectional real-time communication
- **Instant Messaging**: Messages appear immediately when sent
- **Typing Indicators**: Real-time typing status
- **Online Status**: Live user presence tracking

## WebSocket Events

### Client to Server
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server to Client
- `receive_message` - Receive a new message
- `new_notification` - Receive a new notification
- `user_online` - User came online
- `user_offline` - User went offline
- `user_typing` - User typing indicator

## 🎯 How to Use

### Getting Started
1. **Register/Login**: Create an account or login with existing credentials
2. **Select User**: Choose a user from the sidebar to start chatting
3. **Send Messages**: Type and send messages in real-time
4. **View Notifications**: Click the bell icon to see notifications
5. **Typing Indicators**: See when someone is typing
6. **Online Status**: See who's online in real-time

### Key Features Explained

#### 💬 Instant Messaging
- Messages appear immediately when you send them
- No waiting for server confirmation
- Messages are synced with the server in the background
- Message history is preserved in the database

#### 🔔 Notifications
- Real-time notifications for new messages
- Different notification types (message, mention, system)
- Mark notifications as read
- Notification history panel

#### 👥 User Management
- See all registered users in the sidebar
- Online/offline status indicators
- Real-time status updates
- User presence tracking

#### ⚡ Real-time Features
- Instant message delivery
- Live typing indicators
- Online/offline status updates
- Real-time notifications

## Features in Detail

### Real-time Messaging
- Instant message delivery using Socket.IO
- Message history persistence in MongoDB
- Typing indicators for better UX
- Message timestamps

### Notifications
- Real-time notification delivery
- Different notification types (message, mention, system)
- Mark as read functionality
- Notification history

### User Management
- User registration and authentication
- Online/offline status tracking
- User profile management
- Secure JWT-based authentication

### Modern UI
- Responsive design with Tailwind CSS
- Clean and intuitive interface
- Real-time status indicators
- Smooth animations and transitions

## Development

### Adding New Features
1. Create new components in the `components/` directory
2. Add new API endpoints in `server.js`
3. Update WebSocket events as needed
4. Add new context providers if required

### Database Schema
- **Users**: username, email, password, avatar, isOnline, lastSeen
- **Messages**: senderId, receiverId, content, messageType, isRead, timestamp
- **Notifications**: userId, type, title, content, isRead, data, timestamp

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your environment variables
   - Verify MongoDB is accessible on the specified port

2. **WebSocket Connection Issues**
   - Verify the NEXT_PUBLIC_SOCKET_URL is correct
   - Check if the Express server is running on the correct port
   - Ensure both servers are running (Next.js and Socket.IO)

3. **Authentication Issues**
   - Ensure JWT_SECRET is set in environment variables
   - Check if tokens are being stored in localStorage
   - Verify API routes are working correctly

4. **Message Not Appearing**
   - Check browser console for errors
   - Verify Socket.IO connection is established
   - Check if messages are being sent to the server

5. **Styling Issues**
   - Ensure globals.css is imported in layout.tsx
   - Check if custom CSS classes are working
   - Verify no Tailwind CSS conflicts

### Development Tips

- **Check Console**: Always check browser console for errors
- **Network Tab**: Monitor API calls in browser dev tools
- **Server Logs**: Check terminal for server-side errors
- **Database**: Verify MongoDB connection and data

## 🚀 Development Workflow

### Available Scripts

```bash
# Development (runs both servers)
npm run dev

# Socket.IO server only
npm run socket-server

# Next.js client only
npm run client

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

### Development Process

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit components, API routes, or server code
3. **Test Features**: Register users, send messages, test real-time features
4. **Debug Issues**: Check console logs and server output
5. **Deploy**: Build and deploy to production

### Key Development Files

- **Frontend**: `app/`, `components/`, `contexts/`
- **Backend**: `server.js`, `lib/socket.js`, `models/`
- **API Routes**: `app/api/`
- **Styling**: `app/globals.css`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support or questions:
- Open an issue in the repository
- Check the troubleshooting section above
- Review the console logs for errors

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Socket.IO for real-time communication
- MongoDB for database functionality
- React team for the component system
