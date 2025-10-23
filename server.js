const { createServer } = require('http');
const { initializeSocket } = require('./lib/socket');
const connectDB = require('./models/database');
require('dotenv').config();

// Create HTTP server
const server = createServer();

// Initialize Socket.IO
const io = initializeSocket(server);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
